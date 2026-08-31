import 'dotenv/config';
import { generateQuestions, summarizeTranscript } from '../services/gemini.js';

async function runTests() {
  console.log("=== Testing generateQuestions ===");
  
  const test1Title = "feat: Add user authentication";
  const test1Diff = `
+ function login(username, password) {
+   // TODO: implement actual auth
+   return true;
+ }
  `;
  
  console.log(`\nTest 1 - PR: ${test1Title}`);
  const questions1 = await generateQuestions(test1Title, test1Diff);
  console.log("Questions:");
  questions1.forEach((q, i) => console.log(`${i + 1}. ${q}`));
  if (questions1.length === 3) {
      console.log("✅ PASS: Generated exactly 3 questions.");
  } else {
      console.log("❌ FAIL: Did not generate exactly 3 questions.");
  }

  const test2Title = "fix: Handle null pointer exception in user profile";
  const test2Diff = `
- const userName = user.profile.name;
+ const userName = user?.profile?.name || 'Anonymous';
  `;
  
  console.log(`\nTest 2 - PR: ${test2Title}`);
  const questions2 = await generateQuestions(test2Title, test2Diff);
  console.log("Questions:");
  questions2.forEach((q, i) => console.log(`${i + 1}. ${q}`));
  if (questions2.length === 3) {
      console.log("✅ PASS: Generated exactly 3 questions.");
  } else {
      console.log("❌ FAIL: Did not generate exactly 3 questions.");
  }

  console.log("\n=== Testing summarizeTranscript ===");
  const testQuestions = [
    "Why use optional chaining here?",
    "Did you consider using a default parameter?",
    "What happens if user is undefined?"
  ];
  const testAnswers = [
    "It prevents the app from crashing if the profile object is missing.",
    "A default parameter wouldn't help if the object itself is passed but nested properties are missing.",
    "The optional chaining handles undefined user as well, returning 'Anonymous'."
  ];
  
  console.log("Generating summary...");
  const summary = await summarizeTranscript(testQuestions, testAnswers);
  console.log("\nSummary output:\n" + summary);
  if (summary && summary.length > 0) {
      console.log("\n✅ PASS: Generated a summary.");
  } else {
      console.log("\n❌ FAIL: Summary is empty.");
  }
}

runTests().catch(err => {
    console.error("Test harness failed:", err);
});
