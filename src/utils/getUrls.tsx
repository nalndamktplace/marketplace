export const getImgUrlFromStrings = (str: string): string[] => {
  // Regular expression to match img tags and extract src attribute
  const imgRegex = /<img.*?src="(.*?)".*?>/g;

  // Extracting image URLs using the regex
  const imageUrls = [];
  let match;
  while ((match = imgRegex?.exec(str)) !== null) {
    imageUrls.push(match[1]);
  }
  return imageUrls;
};

export const isNotEmpty = (param: any) =>
  param !== undefined && param !== null && param !== "";
export const isFilled = (param: any) =>
  param !== undefined && param !== null && param.length > 0;
export const isUsable = (param: any) => param !== undefined && param !== null;
export const isNull = (param: any) => param !== undefined && param === null;
export const isUndefined = (param: any) => param === undefined;
