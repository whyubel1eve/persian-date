import { Metadata } from 'next';
import Web3FeedsComponent from './components/Web3FeedsComponent';

export const metadata: Metadata = {
  title: 'Web3 News Feeds | Tools Platform',
  description: 'Latest Web3 and cryptocurrency news from TheBlockBeats RSS feed',
};

export default function Web3FeedsPage() {
  return (
    <div className="h-[calc(100vh-4rem)] bg-background overflow-hidden">
      <div className="container mx-auto h-full flex flex-col px-6 py-8">
        <Web3FeedsComponent />
      </div>
    </div>
  );
}