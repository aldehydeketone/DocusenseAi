'use client';

import ComparisonView from '@/components/compare/ComparisonView';
import { useStore } from '@/lib/context/StoreContext';

export default function ComparePage() {
  const { documents } = useStore();

  return (
    <div className="space-y-6">
      <ComparisonView documents={documents} />
    </div>
  );
}
