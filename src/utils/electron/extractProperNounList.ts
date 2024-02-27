import kuromoji from 'kuromoji';

const dicPath = '/dict';

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null =
  null;

const initializeTokenizer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({ dicPath })
      .build((err, _tokenizer) => {
        if (err) {
          reject(err);
        } else {
          tokenizer = _tokenizer!;
          resolve();
        }
      });
  });
};

const tokenized = (
  text: string
): kuromoji.IpadicFeatures[] => {
  if (!tokenizer) {
    throw new Error('Tokenizer is not initialized');
  }
  return tokenizer.tokenize(text);
};

export const extractProperNounList = async (
  text: string
): Promise<string[]> => {
  if (!tokenizer) {
    await initializeTokenizer().catch((err) => {
      throw new Error(
        `Failed to initialize tokenizer: ${err}`
      );
    });
  }

  const pnList: string[] = [];
  let consecutiveWord: string | null = null;

  tokenized(text).forEach((result) => {
    if (result.pos !== '名詞') {
      if (consecutiveWord !== null) {
        pnList.push(consecutiveWord);
      }
      consecutiveWord = null;
      return;
    }

    if (consecutiveWord === null) {
      consecutiveWord = result.surface_form;
    } else {
      consecutiveWord += result.surface_form;
    }
  });

  if (consecutiveWord !== null) {
    pnList.push(consecutiveWord);
  }

  return pnList;
};
