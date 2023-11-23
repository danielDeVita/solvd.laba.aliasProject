import { CustomError } from './CustomError';
import wordsDb from '../db/wordsDb.json';

/**
 * Return and array with a specified quantities of words.
 * Each word is unique, lowered case and not composed.
 * Ex. ("cell phone") is a composed word, it have two words.
 * @param wordsQuantity The words quantity
 * @returns An array of words
 */
export const wordsArrayGenerator = (wordsQuantity: number) => {
  const wordsArray: string[] = [];
  const ITERATIONS_LIMIT = 1000;
  let iterationsCounter = 0;

  do {
    // Security check for infinite loop in do while
    iterationsCounter++;
    if (iterationsCounter > ITERATIONS_LIMIT)
      throw new CustomError('Server error, cannot create array word', 500);

    // Getting random category
    const categoryNumber = Math.trunc(
      Math.random() * wordsDb.categories.length
    );

    // Getting random word
    const wordNumber = Math.trunc(
      Math.random() * wordsDb.categories[categoryNumber].words.length
    );

    const actualWord = wordsDb.categories[categoryNumber].words[wordNumber];

    // Security check, we skip composed words
    if (actualWord.split(' ').length > 1) continue;

    // Security check, we only add unique words
    if (wordsArray.includes(actualWord)) continue;

    // If here, we store the lowered case word
    wordsArray.push(actualWord.toLocaleLowerCase());
  } while (wordsArray.length < wordsQuantity);

  return wordsArray;
};
