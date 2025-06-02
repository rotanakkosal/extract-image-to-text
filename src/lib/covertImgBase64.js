import sharp from "sharp";

// Converts a FormData file to a base64 PNG
export async function fileToBase64PNG(file) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const pngBuffer = await sharp(buffer).png().toBuffer();
  return pngBuffer.toString("base64");
}
