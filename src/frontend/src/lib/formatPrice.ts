export function formatPrice(price: bigint): string {
  const num = Number(price);
  return `৳${num.toLocaleString("en-BD")} BDT`;
}

export function parsePrice(str: string): bigint {
  const cleaned = str.replace(/[^0-9.]/g, "");
  const num = Math.round(Number.parseFloat(cleaned) || 0);
  return BigInt(num);
}
