export default function toSentence (sentence) {
    const exclude = ["a", "an", "the", "and", "but", "for", "or", "nor", "of", "with", "at", "by", "to", "from", "on"]
  return sentence.toLowerCase()
  .trim()
    .replace(/(?<=^|[\s\{\[\(\-])\w+/g, (word, index) => {
        if (index === 0) {
            return word.charAt(0).toUpperCase() + word.slice(1);
            } else if (!exclude.includes(word)) {
               return word.charAt(0).toUpperCase() + word.slice(1); 
            } else {
                return word;
            }
    })
}
