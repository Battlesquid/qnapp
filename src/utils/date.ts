export const monthDayYear = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth().toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  console.log(`${month}-${day}-${year}`)
  return `${month}-${day}-${year}`;
};
