export function phoneNumber(number) {
  return /^\d{9,10}$/.test(number);
}
