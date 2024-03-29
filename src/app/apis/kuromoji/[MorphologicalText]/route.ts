// 開発環境でのみ (npm run dev) で動作するAPI
import kuromoji from 'kuromoji';

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures> | null =
  null;

const initializeTokenizer = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    kuromoji
      .builder({
        dicPath: './node_modules/kuromoji/dict',
      })
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

export async function GET(
  request: Request,
  { params }: { params: { MorphologicalText: string } }
) {
  try {
    const text = params.MorphologicalText;
    if (!text) {
      console.error('text is empty');
      return new Response('text is empty!', {
        status: 400,
      });
    }
    if (!tokenizer) {
      await initializeTokenizer();
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
    return new Response(
      JSON.stringify({ properNounList: pnList }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(`failed.`, {
      status: 400,
    });
  }
}
