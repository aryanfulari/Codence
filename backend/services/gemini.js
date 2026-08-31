import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI();

/**
 * Generates 3 interview questions based on a PR title and diff.
 * @param {string} prTitle - The title of the Pull Request.
 * @param {string} prDiff - The diff content of the Pull Request.
 * @returns {Promise<string[]>} A promise that resolves to an array of exactly 3 strings.
 */
export async function generateQuestions(prTitle, prDiff) {
  const defaultQuestions = [
    "What problem does this change solve?",
    "What alternatives did you consider before this approach?",
    "What should the next developer know before touching this code?"
  ];

  try {
    const prompt = `You are reviewing a GitHub PR titled '${prTitle}'. Based on this diff, generate exactly 3 interview questions to capture the developer's reasoning behind the change. Return ONLY a JSON array of 3 strings, no markdown, no commentary.\n\nDiff:\n${prDiff}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                }
            }
        }
    });

    let questions;
    try {
        questions = JSON.parse(response.text);
    } catch (parseError) {
        console.error("PARSE ERROR:", parseError.message, "RAW TEXT:", response.text);
        return defaultQuestions;
    }
    
    if (Array.isArray(questions) && questions.length === 3 && questions.every(q => typeof q === 'string')) {
      return questions;
    } else {
      console.error("VALIDATION FAILED:", questions);
      return defaultQuestions;
    }
  } catch (error) {
    console.error("API ERROR:", error);
    // Silently fallback on failure
    return defaultQuestions;
  }
}

/**
 * Summarizes a developer interview into a structured decision record.
 * @param {string[]} questions - An array of 3 interview questions.
 * @param {string[]} answers - An array of 3 answers corresponding to the questions.
 * @returns {Promise<string>} A promise that resolves to a summary string.
 */
export async function summarizeTranscript(questions, answers) {
  const fallbackSummary = questions.map((q, i) => `Q: ${q}\nA: ${answers[i] || 'No answer provided.'}`).join('\n\n');

  try {
    const qaPairs = questions.map((q, i) => `Question: ${q}\nAnswer: ${answers[i] || ''}`).join('\n\n');
    const prompt = `Summarize this developer interview into a structured decision record: what was decided, why, what alternatives were considered, and what risks were noted. Be concise. Respond in plain prose only, 3-5 complete sentences, no headers, no bullet points, no asterisks, no bold text.\n\n${qaPairs}`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt
    });

    if (response.text && typeof response.text === 'string') {
        return response.text.trim();
    }
    return fallbackSummary;
  } catch (error) {
    // Silently fallback on failure
    return fallbackSummary;
  }
}
