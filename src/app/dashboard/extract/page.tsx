'use client';

import ExtractionView from '@/components/extraction/ExtractionView';
import { useStore } from '@/lib/context/StoreContext';

export default function ExtractPage() {
  const { documents } = useStore();

  return (
    <div className="space-y-6">
      <ExtractionView documents={documents} />
    </div>
  );
}
