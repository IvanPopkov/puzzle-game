import {generateSudoku} from '@utils/puzzle-generator.ts';

self.onmessage = (e) => {
  const {type} = e.data;

  switch (type) {
    case 'generateSudoku': {
      const sudoku = generateSudoku();
      postMessage({type: 'sudoku', puzzle: sudoku});
      break;
    }


    default:
      postMessage({error: 'Unknown task type'});
  }
};