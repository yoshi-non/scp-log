'use client';

import { Button } from '@/components/ui/button';
import Contaienr from '@/components/features/DndKit/Container';
import { useEffect, useState } from 'react';
import { getPornhubData } from '@/libs/pornhub';

const TestPage = () => {
  const [pornData, setPornData] = useState<object[]>([]);
  useEffect(() => {
    console.log(pornData);
  }, [pornData]);

  const testHandler = async () => {
    console.log('test');
    const data = await getPornhubData('猫耳');
    console.log(data);
  };

  return (
    <div className="container">
      <Button onClick={testHandler}>test</Button>
    </div>
  );
};

export default TestPage;
