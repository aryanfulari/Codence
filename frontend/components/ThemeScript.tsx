// Sets data-theme on <html> synchronously, before first paint, so there's
// no flash of the wrong theme on load. Must run as a plain blocking
// <script> (not next/script, which defers) and must not use hooks — this
// executes before React hydrates.
const THEME_INIT = `
(function () {
  try {
    var stored = localStorage.getItem("codence-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

export function ThemeScript() {
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
