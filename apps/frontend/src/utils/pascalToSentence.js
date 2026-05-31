export default function pascalToSentence(str) {
  if (!str) return "";

  const spaced = str.replace(/([A-Z])/g, " $1").trim();

  return spaced.charAt(0).toUpperCase() + spaced.slice(1).toLowerCase();
}
