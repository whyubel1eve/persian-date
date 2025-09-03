import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OCR Document Recognition | Tools Platform',
  description: 'Extract structured information from documents using advanced AI technology',
};

export default function OCRLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}