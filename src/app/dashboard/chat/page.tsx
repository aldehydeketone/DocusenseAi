'use client';

import ChatBox from '@/components/chat/ChatBox';
import { useStore } from '@/lib/context/StoreContext';

export default function ChatPage() {
  const { documents } = useStore();

  return (
    <div className="h-[calc(100vh-6rem)]">
      <ChatBox documents={documents} />
    </div>
  );
}
