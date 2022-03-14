import React from 'react';
import { MetaProps } from '../types/layout';
import Head from './Head';
import BattleNavigation from './BattleNavigation';

type LayoutProps = {
  children: React.ReactNode;
  customMeta?: MetaProps;
};

export const WEBSITE_HOST_URL = 'https://nextjs-typescript-mdx-blog.vercel.app';

const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
  return (
    <div className="h-screen flex flex-col overscroll-none">
      <Head customMeta={customMeta} />
      <main className="flex flex-col md:flex-row flex-1">
        <BattleNavigation />
        <div className="max-w-5xl px-8 py-4 overflow-auto">{children}</div>
      </main>
      <footer className="text-center fixed bottom-0 left-0 right-0 text-slate-700 bg-gray-50 dark:bg-gray-800">Mátyás Budavári - <a href="https://budavariam.github.io/">blog</a></footer>
    </div>
  );
};

export default Layout;
