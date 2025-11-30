export const extractAbbreviation = (text: string): string => {
  const arabicToNumber: { [key: string]: number } = {
    أولى: 1,
    ثانية: 2,
    ثالثة: 3,
    رابعة: 4,
    خامسة: 5,
  };

  const words = text.split(" ");
  const firstWord = words[0];

  // Map first word to number if it matches
  const firstAbbr =
    arabicToNumber[firstWord]?.toString() || firstWord.charAt(0);
  const lastAbbr = words[words.length - 1];

  // Get abbreviations from remaining words
  const restAbbreviations = words.slice(1, -1).map((word) => word.charAt(0));

  return (
    firstAbbr +
    (restAbbreviations.length > 0
      ? " " + restAbbreviations.join(" ") + lastAbbr
      : "")
  );
};
