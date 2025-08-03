import {createWorker} from "@utils/web-workers/createWorker.ts";


const runPuzzleWorker = createWorker<{ type: string }, any>(
  () => new Worker(new URL('../utils/web-workers/puzzle-worker.ts', import.meta.url), { type: 'module' })
);

export const generateSudokuInWorker = () => runPuzzleWorker({ type: 'generateSudoku' });