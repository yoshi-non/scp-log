'use client';

import { LocalStorageObjects } from '@/types/localstrageObjects';
import { getDateString } from './getDateString';

export const localStorageDownload = (
  data: LocalStorageObjects
) => {
  const date = getDateString();
  const fileName: string = `scp_log_backup_${date}.json`;
  const jsonData = JSON.stringify(data);
  const blob = new Blob([jsonData], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
};
