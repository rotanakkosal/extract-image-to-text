
export async function callOllamaVision(base64Image) {

  const ollamaData = {
    model: "llama3.2-vision:latest",
    messages: [
      {
        role: "user",
        content: "Extract all handwritten text from this image.",
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

  console.log(resultText);
  
  const objects = resultText
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);

  return objects;
}
