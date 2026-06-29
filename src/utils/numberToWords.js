const ones = [
  '',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
  'ELEVEN',
  'TWELVE',
  'THIRTEEN',
  'FOURTEEN',
  'FIFTEEN',
  'SIXTEEN',
  'SEVENTEEN',
  'EIGHTEEN',
  'NINETEEN',
];

const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

const twoDigitToWords = (num) => {
  if (num < 20) return ones[num];
  const t = Math.floor(num / 10);
  const o = num % 10;
  return o ? `${tens[t]} ${ones[o]}` : tens[t];
};

const threeDigitToWords = (num) => {
  if (num === 0) return '';
  const h = Math.floor(num / 100);
  const rest = num % 100;
  const hundredPart = h ? `${ones[h]} HUNDRED` : '';
  const restPart = rest ? twoDigitToWords(rest) : '';
  if (hundredPart && restPart) return `${hundredPart} ${restPart}`;
  return hundredPart || restPart;
};

export const amountToWords = (amount) => {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return 'ZERO ONLY';

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const hundred = num % 1000;

  const parts = [];
  if (crore) parts.push(`${twoDigitToWords(crore)} CRORE`);
  if (lakh) parts.push(`${twoDigitToWords(lakh)} LAKH`);
  if (thousand) parts.push(`${twoDigitToWords(thousand)} THOUSAND`);
  if (hundred) parts.push(threeDigitToWords(hundred));

  return `${parts.join(' ')} ONLY`;
};
