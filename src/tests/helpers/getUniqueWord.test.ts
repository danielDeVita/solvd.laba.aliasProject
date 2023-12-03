import { getUniqueWord } from '../../helpers/getUniqueWord';
import { CustomError } from '../../helpers/CustomError';

jest.mock('../../db/wordsDb.json', () => ({
  categories: [
    { words: ['apple', 'banana', 'cherry'] },
    { words: ['dog', 'cat', 'bird'] },
  ],
}));

describe('getUniqueWord function', () => {

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
  });

  afterEach(() => {
    jest.spyOn(global.Math, 'random').mockRestore();
  })

  it('should return a unique word not present in the input array', () => {
    const wordsArray = ['banana', 'cat'];
    const uniqueWord = getUniqueWord(wordsArray);
    expect(wordsArray.includes(uniqueWord)).toBe(false);
  });

  it('should handle an empty input array', () => {
    const wordsArray: string[] = [];
    const uniqueWord = getUniqueWord(wordsArray);
    expect(typeof uniqueWord).toBe('string');
  });

  it('should return word in lowercase', () => {

    const wordsArray = ['Apple'];
    const uniqueWord = getUniqueWord(wordsArray);
    expect(uniqueWord).toBe('apple');
  });

  it('should throw an error if iterations limit is reached', () => {
    const allWords = ['apple'];
    const wordsArray = allWords.slice(); 

    expect(() => {
      getUniqueWord(wordsArray);
    }).toThrow(CustomError);
  });

  it('should throw an error if word is composed', () => {
    jest.mock('../../db/wordsDb.json', () => ({
      categories: [
        { words: ['apple and'] },
      ],
    }))
    const wordsArray = ['apple'];
    expect(() => {
      getUniqueWord(wordsArray);
    }).toThrow(CustomError);
  })
});