import { randomInt } from "node:crypto";

const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; // base62

export const CODE_LENGTH = 5;

/** Código corto aleatorio en base62 (p. ej. "k7Qx2"). randomInt es criptográficamente seguro y sin sesgo. */
export function generateCode(length: number = CODE_LENGTH): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += ALPHABET[randomInt(ALPHABET.length)];
  }
  return code;
}

/** Los códigos válidos son exactamente 5 caracteres base62. */
export function isValidCode(value: string): boolean {
  return /^[0-9A-Za-z]{5}$/.test(value);
}
