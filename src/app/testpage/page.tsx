'use client';

import { searchFiles } from '@/utils/existFile';

const TestPage = () => {
  console.log(searchFiles('/dist'));
  return <div className="container"></div>;
};

export default TestPage;
