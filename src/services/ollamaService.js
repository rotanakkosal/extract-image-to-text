export async function ollamaVision(base64Image) {
  const ollamaData = {
    model: "llama3.2-vision:latest",
    messages: [
      {
        role: "user",
        content: `
        Extract the handwritten text from the image and output it using Markdown formatting only. 
        If the text includes headers or section titles, use Markdown header syntax (e.g., # Header). 
        For lists or clear structure, use the appropriate Markdown. 
        Do not include any plain text version, introductions, explanations, 
        or extra words—output only the transcribed text, formatted in Markdown. 
        If there is no text in the image, respond with: No text found
`,
        images: [base64Image],
      },
    ],
  };

  const ollamaResp = await fetch("http://vision.ksga.info/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ollamaData),
  });

  const resultText = await ollamaResp.text();

  const objects = resultText
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return objects;
}

export async function ollamaSummary(text) {
  const data = {
    model: "llama3-backup:latest",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant.",
      },
      {
        role: "user",
        content: `Please summary this: ${text}`,
      },
    ],
    stream: false,
    temperature: 0.7,
  };

  const resp = await fetch("http://ollama.jalat.tours/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const resultText = await resp.text();
  try {
    const obj = JSON.parse(resultText);
    return obj.message?.content || resultText;
  } catch {
    return resultText;
  }
}
