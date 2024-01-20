import { StrictMode } from 'react';

export default function RootLayout(props: any) {
  const { children } = props;

  return <StrictMode>{children}</StrictMode>;
}
