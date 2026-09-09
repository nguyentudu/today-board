const encoder = new TextEncoder();
const decoder = new TextDecoder();

export interface BoardEnvelopeIdentity {
  accountId: string;
  objectId: string;
  versionId: string;
  schemaVersion: number;
}

export interface EncryptedBoardEnvelope extends BoardEnvelopeIdentity {
  algorithm: "AES-GCM";
  nonce: string;
  ciphertext: string;
}

function bytesToBase64(value: Uint8Array): string {
  let binary = "";
  for (const byte of value) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function bytesToArrayBuffer(value: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(value.byteLength);
  copy.set(value);
  return copy.buffer;
}

export function envelopeAssociatedData(identity: BoardEnvelopeIdentity): ArrayBuffer {
  return bytesToArrayBuffer(encoder.encode(JSON.stringify([
    identity.accountId,
    identity.objectId,
    identity.versionId,
    identity.schemaVersion,
  ])));
}

export async function generateContentKey(extractable = true): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, extractable, ["encrypt", "decrypt"]);
}

export async function encryptBoardEnvelope(
  value: unknown,
  key: CryptoKey,
  identity: BoardEnvelopeIdentity,
): Promise<EncryptedBoardEnvelope> {
  const nonce = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: bytesToArrayBuffer(nonce), additionalData: envelopeAssociatedData(identity) },
    key,
    encoder.encode(JSON.stringify(value)),
  );
  return Object.freeze({
    ...identity,
    algorithm: "AES-GCM" as const,
    nonce: bytesToBase64(nonce),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  });
}

export async function decryptBoardEnvelope<T>(
  envelope: EncryptedBoardEnvelope,
  key: CryptoKey,
  expected: BoardEnvelopeIdentity,
): Promise<T> {
  if (envelope.algorithm !== "AES-GCM") throw new Error("Unsupported board envelope algorithm");
  if (
    envelope.accountId !== expected.accountId ||
    envelope.objectId !== expected.objectId ||
    envelope.versionId !== expected.versionId ||
    envelope.schemaVersion !== expected.schemaVersion
  ) {
    throw new Error("Encrypted board envelope identity mismatch");
  }
  const plaintext = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesToArrayBuffer(base64ToBytes(envelope.nonce)),
      additionalData: envelopeAssociatedData(expected),
    },
    key,
    bytesToArrayBuffer(base64ToBytes(envelope.ciphertext)),
  );
  return JSON.parse(decoder.decode(plaintext)) as T;
}

export const boardEnvelopeEncoding = { bytesToBase64, base64ToBytes, bytesToArrayBuffer };
