import { CustomError } from '../../helpers/CustomError';
import { getUniqueWord } from '../../helpers/getUniqueWord';

describe('Test getUniqueWorldHelper', () => {
  it('Should retrieve 200 unique words', () => {
    const NUMBER_OF_WORDS = 200;
    const wordsArray: string[] = [];

    for (let i = 0; i < NUMBER_OF_WORDS; i++) {
      wordsArray.push(getUniqueWord(wordsArray));
    }

    expect([...new Set(wordsArray)]).toHaveLength(NUMBER_OF_WORDS);
  });

  it('Should throw error after trying to get more words than the one stored', () => {
    const NUMBER_OF_WORDS = 10000;
    const wordsArray: string[] = [];

    try {
      for (let i = 0; i < NUMBER_OF_WORDS; i++) {
        wordsArray.push(getUniqueWord(wordsArray));
      }
    } catch (error) {
      expect((error as CustomError).status).toBe(500);
      expect((error as CustomError).message).toMatch(
        'Server error, cannot create array word'
      );
    }
  });
});
