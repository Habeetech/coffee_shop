export function getDescription(url) {
  if (url) {
    const file = url.split("/").pop();
  const name = file.split(".")[0];
  const words = name.replaceAll("-", " ");
  return "Picture of " + words;
  }
  return "";
}