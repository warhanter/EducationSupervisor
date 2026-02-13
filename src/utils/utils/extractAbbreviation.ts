export const extractAbbreviation = (text: string): string => {
  const arabicToNumber: { [key: string]: number } = {
    أولى: 1,
    ثانية: 2,
    ثالثة: 3,
    رابعة: 4,
    خامسة: 5,
  };

  const classToAbbr: { [key: string]: string } = {
    "علوم تجريبية": "ع ت",
    "تقني رياضي": "ت ر",
    "رياضيات": "ر",
    "تسيير واقتصاد": "تق",
    "آداب وفلسفة": "آ ف",
    "لغات أجنبية": "لغ",
    "جدع مشترك آداب": "ج م آ",
    "جدع مشترك علوم وتكنولوجيا": "ج م ع",
    متوسط: "م",
    ابتدائي: "ا",
  };

  // Extract the class number at the end
  const classNumberMatch = text.match(/\d+$/);
  const classNumber = classNumberMatch ? classNumberMatch[0] : "";

  // Extract the year level (first word)
  const firstWord = text.split(" ")[0];
  const yearNumber = arabicToNumber[firstWord] || "";

  // Find which class type appears in the text
  let classAbbr = "";
  for (const [fullName, abbr] of Object.entries(classToAbbr)) {
    if (text.includes(fullName)) {
      classAbbr = abbr;
      break;
    }
  }

  return `${yearNumber}${classAbbr}${classNumber}`;
};