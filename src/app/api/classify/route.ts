import { NextRequest } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body as { text: string };

    if (!text?.trim()) {
      return Response.json({ error: 'Text is required' }, { status: 400 });
    }

    // Try running Python ML classifier
    try {
      const scriptPath = path.join(process.cwd(), 'ml', 'train_and_evaluate.py');
      const { stdout } = await execFileAsync('python', [scriptPath, '--classify', text], {
        timeout: 30000,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      });

      // Parse JSON output from Python script
      const lines = stdout.trim().split('\n');
      const jsonLine = lines.find((l) => l.startsWith('{'));
      if (jsonLine) {
        const result = JSON.parse(jsonLine);
        return Response.json({ ...result, source: 'python' });
      }
    } catch (pyError) {
      console.warn('[/api/classify] Python unavailable, using JS fallback:', pyError);
    }

    // JS Fallback: simple keyword-based classification
    const textLower = text.toLowerCase();
    const scores: Record<string, number> = {
      'Legal Contract': 0,
      'Financial Invoice': 0,
      'Research Paper': 0,
      'Technical Specification': 0,
    };

    const keywords: Record<string, string[]> = {
      'Legal Contract': ['agreement', 'contract', 'non-compete', 'severance', 'jurisdiction', 'indemnification', 'arbitration', 'governing law', 'termination', 'clause', 'breach'],
      'Financial Invoice': ['invoice', 'amount due', 'subtotal', 'payment', 'tax', 'billing', 'wire transfer', 'total', 'remit', 'accounts payable', 'net 30'],
      'Research Paper': ['abstract', 'methodology', 'evaluation', 'benchmark', 'dataset', 'precision', 'recall', 'f1', 'transformer', 'model', 'findings', 'proposed'],
      'Technical Specification': ['api', 'kubernetes', 'microservices', 'schema', 'latency', 'throughput', 'endpoint', 'deployment', 'architecture', 'specification', 'redis', 'postgresql'],
    };

    for (const [cls, kws] of Object.entries(keywords)) {
      for (const kw of kws) {
        if (textLower.includes(kw)) scores[cls] += 1;
      }
    }

    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1;
    const normalized = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, parseFloat((v / total).toFixed(4))])
    );

    const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
    const [predicted_class, confidence] = sorted[0];

    return Response.json({
      predicted_class,
      confidence,
      all_scores: normalized,
      source: 'js-fallback',
    });
  } catch (error: unknown) {
    console.error('[/api/classify] Error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: `Classification error: ${message}` }, { status: 500 });
  }
}
