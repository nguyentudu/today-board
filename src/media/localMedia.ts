export const MAX_IMAGE_WIDTH = 1280;
export const MAX_IMAGE_BYTES = 900_000;
export const MAX_AUDIO_BYTES = 1_500_000;
export const VOICE_LIMIT_MS = 20_000;

export interface CompressedImage {
  dataUrl: string;
  beforeBytes: number;
  afterBytes: number;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function compressImageFile(file: File): Promise<CompressedImage> {
  return compressImageDataUrl(await blobToDataUrl(file), file.size);
}

export async function compressImageDataUrl(dataUrl: string, beforeBytes = estimateDataUrlBytes(dataUrl)): Promise<CompressedImage> {
  const image = await loadImage(dataUrl);
  const scale = Math.min(1, MAX_IMAGE_WIDTH / image.naturalWidth);
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not prepare image.");
  }

  context.fillStyle = "#fffdf8";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const compressed = canvas.toDataURL("image/jpeg", 0.82);

  return {
    dataUrl: compressed,
    beforeBytes,
    afterBytes: estimateDataUrlBytes(compressed),
  };
}

export function estimateDataUrlBytes(dataUrl: string): number {
  const base64 = dataUrl.split(",")[1] ?? "";
  return Math.floor((base64.length * 3) / 4);
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result ?? "")));
    reader.addEventListener("error", () => reject(reader.error ?? new Error("Could not read media.")));
    reader.readAsDataURL(blob);
  });
}

function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image), { once: true });
    image.addEventListener("error", () => reject(new Error("Could not load image.")), { once: true });
    image.src = dataUrl;
  });
}
