import { Metadata } from 'next';
import Web3FeedsComponent from './components/Web3FeedsComponent';

export const metadata: Metadata = {
  title: 'Web3 News Feeds | Tools Platform',
  description: 'Latest Web3 and cryptocurrency news from TheBlockBeats RSS feed',
};

export default function Web3FeedsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-6">
        <Web3FeedsComponent />
      </div>
    </div>
  );
}