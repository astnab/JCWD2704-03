import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
const inter = Inter({ subsets: ['latin'] });
// import Head from "next/head";

export const metadata: Metadata = {
  title: 'atCasa',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Head>
        <img
          src="https://i.ibb.co.com/XWMvj0b/Tickzy-1.png"
          alt=""
          rel="icon"
        />
      </Head> */}

      <html lang="en">
        <body>
          <main>{children}</main>
        </body>
      </html>
    </>
  );
}
