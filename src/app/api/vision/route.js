import { NextResponse } from "next/server";
import { extractContents } from "@/lib/extractContent";
import { fileToBase64PNG } from "@/lib/covertImgBase64";
import { ollamaVision } from "@/services/ollamaService";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const base64Image = await fileToBase64PNG(file);
    const objects = await ollamaVision(base64Image);
    const contents = extractContents(objects);

    return NextResponse.json({ text: contents }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message, details: err.stack },
      { status: 500 }
    );
  }
}
