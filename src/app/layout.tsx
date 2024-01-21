import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import './globals.css';
import Header from '@/components/features/Header';
import Footer from '@/components/features/Footer';
import { ThemeProvider } from '@/components/functions/theme-provider';
import { YouTubeContextProvider } from '@/components/functions/youtube-provider';
import { Toaster } from '@/components/ui/sonner';

const notoSansJP = Noto_Sans_JP({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SCP Log',
  description:
    'SCP Log はプレイリストを作成するアプリです。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning={true}>
      <body className={notoSansJP.className}>
        <YouTubeContextProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {children}
            <Footer />
            <Toaster />
          </ThemeProvider>
        </YouTubeContextProvider>
      </body>
    </html>
  );
}
