'use client';

import InsightsView from '@/components/insights/InsightsView';
import { INITIAL_SMART_INSIGHTS } from '@/lib/db/store';

export default function InsightsPage() {
  return (
    <div className="space-y-6">
      <InsightsView insights={INITIAL_SMART_INSIGHTS} />
    </div>
  );
}
