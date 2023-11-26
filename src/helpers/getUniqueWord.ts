import { CustomError } from './CustomError';
import wordsDb from '../db/wordsDb.json';

/**
 * Function that return an unique word that is not present
 * in array of words received by the function.
 * The returned word is unique, lowered case and not composed.
 * Ex. ("cell phone") is a composed word, it have two words.
 * @param wordsArray The received array of words
 * @returns A new unique word not repeated in the array of words
 */
export const getUniqueWord = (wordsArray: string[]): string => {
  const ITERATIONS_LIMIT = 1000;
  let iterationsCounter = 0;
  let actualWord;
  let newWordFound = false;

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

    actualWord = wordsDb.categories[categoryNumber].words[wordNumber];

    // Security check, we skip composed words
    if (actualWord.split(' ').length > 1) continue;

    // Security check, we only add unique words
    if (wordsArray.includes(actualWord)) continue;

    // If here, the word is unique, we can leave do while loop
    newWordFound = true;
  } while (newWordFound === false);

  return actualWord.toLowerCase();
};