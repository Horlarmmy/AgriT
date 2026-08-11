export function isAddress(input: unknown): input is string {
  return typeof input === 'string' && /^G[A-Z0-9]{55}$/.test(input);
}

export function isHexHash(input: unknown, length = 64): input is string {
  return typeof input === 'string' && new RegExp(`^[0-9a-f]{${length}}$`).test(input);
}

export function isValidCrop(input: unknown): input is string {
  return typeof input === 'string' && input.length > 0 && input.length <= 32;
}

export function isValidRegion(input: unknown): input is string {
  return typeof input === 'string' && /^[A-Z0-9-]{2,16}$/.test(input);
}

export function isValidExpectedYield(input: unknown): input is number {
  return typeof input === 'number' && Number.isFinite(input) && input > 0 && Number.isInteger(input);
}