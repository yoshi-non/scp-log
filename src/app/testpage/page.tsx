'use client';

import { searchFiles } from '@/utils/existFile';

const TestPage = () => {
  console.log(searchFiles('./dict/base.dat.gz'));
  console.log(searchFiles('/node_modules'));
  console.log(searchFiles('./node_modules'));
  return <div className="container"></div>;
};

export default TestPage;
