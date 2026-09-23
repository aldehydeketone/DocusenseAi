import { NextRequest } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  try {
    const scriptPath = path.join(process.cwd(), 'ml', 'train_and_evaluate.py');
    const { stdout, stderr } = await execFileAsync('python', [scriptPath], {
      timeout: 30000,
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });

    return Response.json({
      output: stdout,
      error: stderr || null,
      status: 'success',
    });
  } catch (error: unknown) {
    console.error('[/api/train] Execution error:', error);
    const message = error instanceof Error ? error.message : 'Unknown execution error';
    return Response.json({ error: message, status: 'error' }, { status: 500 });
  }
}
