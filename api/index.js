// vercel環境でのみ動作するAPI
'use strict';

const kuromoji = require('kuromoji');
const path = require('path');
const dicPath = path.resolve(
  require.resolve('kuromoji'),
  '../../dict'
);

const tokenizerP = new Promise((resolve, reject) => {
  kuromoji
    .builder({ dicPath })
    .build((error, tokenizer) => {
      if (error) {
        return reject(err);
      }
      resolve(tokenizer);
    });
});

module.exports = (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).send('Only GET allowed');
  }
  if (!req.query.input) {
    return res
      .status(400)
      .send('Input query parameter required');
  }
  if (req.query.input === '') {
    return res.json([]);
  }
  tokenizerP
    .then((tokenizer) => {
      const result = tokenizer.tokenize(req.query.input);
      const pnList = [];
      let consecutiveWord = null;
      result.forEach((result) => {
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

      res.setHeader(
        'Cache-Control',
        'public, maxage=604800, immutable'
      );
      res.json(pnList);
    })
    .catch((error) => {
      res.status(500).send(error.stack);
    });
};
