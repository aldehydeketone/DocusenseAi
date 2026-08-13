'use client';

import InsightsView from '@/components/insights/InsightsView';
import { INITIAL_SMART_INSIGHTS } from '@/lib/db/store';
import { useStore } from '@/lib/context/StoreContext';

export default function InsightsPage() {
  const { documents } = useStore();
  // Filter insights to only show those for active documents
  const activeDocIds = new Set(documents.map((d) => d.id));
  const filteredInsights = INITIAL_SMART_INSIGHTS.filter((ins) => activeDocIds.has(ins.documentId));

  return (
    <div className="space-y-6">
      <InsightsView insights={filteredInsights} documents={documents} />
    </div>
  );
}
