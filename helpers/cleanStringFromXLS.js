export const cleanStringFromXLS = (str) => {
  return str.replace(/(^["']|["']$)/g, "");
};
