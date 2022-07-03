export const getRandomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const toCamelCase = (string) => {
  return string
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");
};
