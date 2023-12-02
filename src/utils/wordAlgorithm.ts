import natural from 'natural';

export class WordChecker {
  private actualWord: string;
  private guess: string;

  constructor(actualWord: string, guess: string) {
    if (!actualWord || !guess) throw new Error('Please provide both words.');

    this.actualWord = actualWord.toLowerCase().trim();
    this.guess = guess.toLowerCase().trim();
  }

  //WORD IS NOT VALID IF IT IS A DERIVATIVE (IF DISTANCE BETWEEN WORDS IS TOO SHORT)
  isWordDerivative() {
    const distance = natural.JaroWinklerDistance(
      this.actualWord,
      this.guess,
      {}
    );

    const isDistanceTooShort = distance >= 0.89;

    return isDistanceTooShort;
  }

  //WORD IS NOT VALID IF IT IS A HOMOPHONE (SIMILAR OR EXACT SOUND)
  doesWordSoundSimilar() {
    return natural.Metaphone.compare(this.actualWord, this.guess);
  }

  isSameWord() {
    return this.actualWord === this.guess;
  }

  isWordValid() {
    const wordsToCloseNotValid = this.isWordDerivative();
    const wordSoundSameNotValid = this.doesWordSoundSimilar();

    //I know I can negate both statements and return them combined, but I find this way less confusing
    if (wordsToCloseNotValid || wordSoundSameNotValid) return false;
    else return true;
  }
}

//not valid due to short distance
// const result1 = new WordChecker("create", "creation").isWordValid();
// const result2 = new WordChecker("communication", "communicate").isWordValid();
// const result3 = new WordChecker("differentiate", "difference").isWordValid();
// //not valid due to being homophones
// const result4 = new WordChecker("knight", "night").isWordValid();
// const result5 = new WordChecker("pair", "pear").isWordValid();
// //valid words
// const result6 = new WordChecker("house", "dog").isWordValid();
// const result7 = new WordChecker("doctor", "lawyer").isWordValid();
// //same word
// const result8 = new WordChecker("hello", "hello").isSameWord();

/* EXAMPLES */

// console.log(`***** SHORT DISTANCE NOT VALID: *****`);
// console.log(`"create", "creation" :`, result1);
// console.log(`"communication", "communicate" :`, result2);
// console.log(`"differentiate", "difference" :`, result3);
// console.log(`***** HOMOPHONES NOT VALID: *****`);
// console.log(`"knight", "night" :`, result4);
// console.log(`"pair", "pear" :`, result5);
// console.log("***** VALID: ****");
// console.log(`"house", "dog" :`, result6);
// console.log(`"doctor", "lawyer" :`, result7);
// console.log("***** SAME WORD: *****");
// console.log(`"hello", "hello :`, result8);
