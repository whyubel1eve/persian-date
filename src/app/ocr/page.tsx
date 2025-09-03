"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Upload,
  FileText,
  Image,
  Loader2,
  Sparkles,
  X,
  RotateCcw,
} from "lucide-react";
import NextImage from "next/image";
import { Streamdown } from "streamdown";

export default function OCRPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File | undefined>(undefined);
  const [hasStartedRecognition, setHasStartedRecognition] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const OCR_PROMPT = `You will be provided with a document. Your task is to accurately extract specific information and present it in a clear, structured, and elegant table format.

Adhere strictly to the following guidelines for extraction and formatting:

**Information Fields:**

*   **Document Type**: The specific type of document (e.g., 'Resident ID Card', 'Bank Statement', 'Utility Bill', 'Employment Contract', 'Medical Report'). Be as precise as possible.
*   **Name**: The full name of the individual, exactly as it appears in the document.
*   **Address**: The complete physical address, including province/state, city, district/county, street name, building/house number, and postal code. Consolidate multi-line addresses into a single string.
*   **Issue Date**: The issue date from the document. Format as YYYY-MM-DD.
*   **Issuing Body (Optional)**: The name of the entity that issued or published the document. Include this information *only if* clearly identifiable and applicable.

**Output Format:**

Your output **must** be a Markdown table with two columns: "Field" and "Value".

Use the following table structure. If a required field ("Document Type", "Name", "Address", "Date") cannot be found in the document, use "N/A" as its value. For the optional "Issuing Body" field, leave the "Value" cell empty if the information is not present or not applicable.

\`\`\`
| Field             | Value                                                          |
| :---------------- | :------------------------------------------------------------- |
| Document Type     | [Extracted Document Type]                                      |
| Name              | [Extracted Full Name]                                          |
| Address           | [Extracted Full Address]                                       |
| Issue Date        | [Extracted Date in YYYY-MM-DD]                                 |
| Issuing Body      | [Extracted Issuing Body, if applicable, otherwise leave empty] |
\`\`\`
`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFiles(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const fileParts = files
      ? [
          {
            type: "file" as const,
            mediaType: files.type,
            url: await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(files);
            }),
          },
        ]
      : [];

    const messageText = input.trim() || OCR_PROMPT;

    // Clear previous messages when starting recognition
    setMessages([]);
    setHasStartedRecognition(true);

    // Send the new message after state updates
    Promise.resolve().then(() => {
      sendMessage({
        role: "user",
        parts: [{ type: "text", text: messageText }, ...fileParts],
      });
    });

    setInput("");
  };

  const acceptedTypes = "image/*,application/pdf";

  // Check if there are any assistant messages
  const hasResults =
    messages.filter((message) => message.role === "assistant").length > 0;

  return (
    <div className="h-[calc(100vh-4rem)] bg-background overflow-y-auto">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-6xl">
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Document Recognition
              </h1>
            </div>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Extract structured information from documents using advanced AI
              technology
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="w-full max-w-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg font-semibold text-foreground">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload & Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={`border-2 border-dashed rounded-xl transition-all duration-300 flex flex-col ${
                      !files
                        ? "min-h-[240px] border-border hover:border-primary/50"
                        : hasStartedRecognition
                        ? "min-h-[120px]"
                        : "min-h-[240px]"
                    }`}
                  >
                    {!files ? (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 space-y-6">
                        <div className="flex justify-center space-x-3 text-muted-foreground">
                          <div className="p-3 bg-muted rounded-lg">
                            <FileText className="h-6 w-6" />
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <Image className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <input
                            type="file"
                            accept={acceptedTypes}
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                            ref={fileInputRef}
                          />
                          <label
                            htmlFor="file-upload"
                            className="cursor-pointer inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Select File
                          </label>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                          Support PDF, PNG and other image formats
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 p-4 space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-md bg-primary/10">
                                {status === "submitted" ||
                                status === "streaming" ? (
                                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                                ) : (
                                  <FileText className="h-5 w-5 text-primary" />
                                )}
                              </div>
                              <div>
                                <span className="text-sm font-medium text-foreground truncate max-w-[160px] sm:max-w-xs block">
                                  {files.name}
                                </span>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {status === "submitted" ||
                                  status === "streaming"
                                    ? "Processing document..."
                                    : `${(files.size / 1024 / 1024).toFixed(
                                        2
                                      )} MB`}
                                </div>
                              </div>
                            </div>
                            {status !== "submitted" &&
                              status !== "streaming" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setFiles(undefined);
                                    setHasStartedRecognition(false);
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = "";
                                    }
                                  }}
                                  className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md p-2"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              )}
                          </div>

                          {!hasStartedRecognition && (
                            <div className="bg-background rounded-lg overflow-hidden border border-border">
                              {files.type.startsWith("image/") ? (
                                <NextImage
                                  src={URL.createObjectURL(files)}
                                  alt={files.name}
                                  width={800}
                                  height={400}
                                  className="w-full max-h-[300px] object-contain"
                                  unoptimized
                                />
                              ) : files.type === "application/pdf" ? (
                                <iframe
                                  src={URL.createObjectURL(files)}
                                  className="w-full h-[300px] border-0"
                                  title={files.name}
                                />
                              ) : (
                                <div className="text-center text-muted-foreground py-12">
                                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                  <p className="text-sm font-medium">
                                    Preview not available
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSubmit}>
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg text-base font-medium transition-colors"
                      disabled={
                        !files ||
                        status === "submitted" ||
                        status === "streaming"
                      }
                    >
                      {status === "submitted" || status === "streaming" ? (
                        <>
                          <span>Recognizing Document...</span>
                        </>
                      ) : hasResults ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          <span>Restart Recognition</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          <span>Start Recognition</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </div>

          {hasResults && (
            <div className="flex justify-center">
              <Card className="w-full max-w-2xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Recognition Results
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFiles(undefined);
                        setHasStartedRecognition(false);
                        setMessages([]);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="rounded-md h-8 px-3 text-xs"
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {messages
                      .filter((message) => message.role === "assistant")
                      .map((message) => (
                        <div key={message.id} className="space-y-4">
                          {message.parts.map((part, index) => {
                            if (part.type === "text") {
                              return (
                                <div
                                  key={`${message.id}-text-${index}`}
                                  className="bg-muted/30 p-5 rounded-lg border border-border"
                                >
                                  <Streamdown>{part.text}</Streamdown>
                                </div>
                              );
                            } else if (part.type === "file") {
                              if (part.mediaType?.startsWith("image/")) {
                                return (
                                  <NextImage
                                    key={`${message.id}-image-${index}`}
                                    src={part.url}
                                    width={500}
                                    height={500}
                                    alt={`OCR result image attachment ${
                                      index + 1
                                    }`}
                                    className="rounded-lg border border-border"
                                  />
                                );
                              }
                              if (part.mediaType === "application/pdf") {
                                return (
                                  <iframe
                                    key={`${message.id}-pdf-${index}`}
                                    src={part.url}
                                    width={500}
                                    height={600}
                                    title={`pdf-${index}`}
                                    className="rounded-lg border border-border"
                                  />
                                );
                              }
                              return (
                                <div
                                  key={`${message.id}-file-${index}`}
                                  className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg"
                                >
                                  📎 Attachment
                                </div>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
