'use server';

const { PornHub } = require('pornhub.js');

export const getPornhubData = async (keyword: string) => {
  const pornhub = new PornHub();
  const result = await pornhub.searchVideo(keyword);
  return result;
};
