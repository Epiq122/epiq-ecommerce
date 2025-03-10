import type { Metadata } from 'next';
import { Inter, Barlow } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-barlow',
});

export const metadata: Metadata = {
  title: 'epiq-ecommerce',
  description:
    'Welcome to epiq-ecommerce, your one stop shot for all your epiq needs.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} ${barlow.variable}`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
