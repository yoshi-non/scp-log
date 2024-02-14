'use client';

import { searchFiles } from '@/utils/existFile';

const TestPage = () => {
  console.log(searchFiles('/dict/base.dat.gz'));
  return <div className="container"></div>;
};

export default TestPage;
