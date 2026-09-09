import { boardEnvelopeEncoding } from "./boardEnvelope";

const encoder = new TextEncoder();

export interface RecoveryKit {
  format: "moon-recovery-kit-v1";
  kdf: "PBKDF2-SHA-256";
  iterations: 310_000;
  salt: string;
  nonce: string;
  wrappedContentKey: string;
}

async function recoveryWrappingKey(code: string, salt: Uint8Array, usages: KeyUsage[]): Promise<CryptoKey> {
  if (code.length < 20) throw new Error("Recovery code is too short");
  const material = await crypto.subtle.importKey("raw", encoder.encode(code), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: boardEnvelopeEncoding.bytesToArrayBuffer(salt), iterations: 310_000 },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    usages,
  );
}

export function generateRecoveryCode(): string {
  return boardEnvelopeEncoding.bytesToBase64(crypto.getRandomValues(new Uint8Array(24)));
}

export async function createRecoveryKit(contentKey: CryptoKey, recoveryCode: string): Promise<RecoveryKit> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const wrappingKey = await recoveryWrappingKey(recoveryCode, salt, ["encrypt"]);
  const rawContentKey = await crypto.subtle.exportKey("raw", contentKey);
  const wrapped = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: boardEnvelopeEncoding.bytesToArrayBuffer(nonce),
      additionalData: boardEnvelopeEncoding.bytesToArrayBuffer(encoder.encode("moon-recovery-kit-v1")),
    },
    wrappingKey,
    rawContentKey,
  );
  return Object.freeze({
    format: "moon-recovery-kit-v1" as const,
    kdf: "PBKDF2-SHA-256" as const,
    iterations: 310_000 as const,
    salt: boardEnvelopeEncoding.bytesToBase64(salt),
    nonce: boardEnvelopeEncoding.bytesToBase64(nonce),
    wrappedContentKey: boardEnvelopeEncoding.bytesToBase64(new Uint8Array(wrapped)),
  });
}

export async function importRecoveryKit(kit: RecoveryKit, recoveryCode: string): Promise<CryptoKey> {
  if (kit.format !== "moon-recovery-kit-v1" || kit.iterations !== 310_000) {
    throw new Error("Unsupported recovery kit");
  }
  const wrappingKey = await recoveryWrappingKey(
    recoveryCode,
    boardEnvelopeEncoding.base64ToBytes(kit.salt),
    ["decrypt"],
  );
  const raw = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: boardEnvelopeEncoding.bytesToArrayBuffer(boardEnvelopeEncoding.base64ToBytes(kit.nonce)),
      additionalData: boardEnvelopeEncoding.bytesToArrayBuffer(encoder.encode("moon-recovery-kit-v1")),
    },
    wrappingKey,
    boardEnvelopeEncoding.bytesToArrayBuffer(boardEnvelopeEncoding.base64ToBytes(kit.wrappedContentKey)),
  );
  return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, true, ["encrypt", "decrypt"]);
}
