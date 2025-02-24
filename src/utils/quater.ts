export const getQuarter = (month: number) => {
  if (month >= 1 && month <= 3) return 1; // 1-chorak: Yanvar, Fevral, Mart
  if (month >= 4 && month <= 6) return 2; // 2-chorak: Aprel, May, Iyun
  if (month >= 7 && month <= 9) return 3; // 3-chorak: Iyul, Avgust, Sentabr
  if (month >= 10 && month <= 12) return 4; // 4-chorak: Oktyabr, Noyabr, Dekabr
  return null; // Noto‘g‘ri oy bo‘lsa, `null` qaytaradi
};
