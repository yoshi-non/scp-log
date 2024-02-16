 // 重複を数えて頻繁に使われている3単語を配列で出力する関数
export const findMostFrequentWords = (
  words: string[]
): string[] => {
  const wordCounts: { [word: string]: number } = {};
  // 単語の出現回数をカウントする
  for (const word of words) {
    if (wordCounts[word]) {
      wordCounts[word]++;
    } else {
      wordCounts[word] = 1;
    }
  }
  // カウントされた単語を降順にソートする
  const sortedWords = Object.keys(wordCounts).sort(
    (a, b) => wordCounts[b] - wordCounts[a]
  );
  // 最も頻繁に使用されている3単語を取得する
  const mostFrequentWords = sortedWords.slice(0, 3);
  return mostFrequentWords;
};
