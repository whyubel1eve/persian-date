import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { extractText } from "unpdf";

async function extractTextFromPDF(dataUrl: string): Promise<string> {
  try {
    // Remove data URL prefix to get base64 data
    const base64Data = dataUrl.split(",")[1];
    const pdfBuffer = Buffer.from(base64Data, "base64");
    const pdfUint8Array = new Uint8Array(pdfBuffer);

    const { text } = await extractText(pdfUint8Array);
    return Array.isArray(text) ? text.join("\n") : text;
  } catch (error) {
    console.error("Error extracting PDF text:", error);
    return "Cannot parse PDF file content";
  }
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Process messages to handle PDF files
  const processedMessages = await Promise.all(
    messages.map(async (message) => {
      if (message.parts) {
        const processedParts = await Promise.all(
          message.parts.map(async (part) => {
            if (part.type === "file" && part.mediaType === "application/pdf") {
              const extractedText = await extractTextFromPDF(part.url);
              return {
                type: "text" as const,
                text: `PDF Content:\n${extractedText}`,
              };
            }
            return part;
          })
        );
        return { ...message, parts: processedParts };
      }
      return message;
    })
  );

  console.log(JSON.stringify(processedMessages));

  const provider = createOpenAICompatible({
    name: "gemini",
    apiKey: process.env.PROVIDER_API_KEY || "",
    baseURL: process.env.PROVIDER_BASE_URL || "",
  });

  const result = streamText({
    model: provider("gemini-2.5-flash"),
    messages: convertToModelMessages(processedMessages),
  });

  // console.log(JSON.stringify(result.toUIMessageStreamResponse()));
  return result.toUIMessageStreamResponse();
}
