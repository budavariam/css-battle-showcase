import React from 'react';
import { MetaProps } from '../types/layout';
import Head from './Head';
import Navigation from './Navigation';
import ThemeSwitch from './ThemeSwitch';
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
    </div>
  );
};

export default Layout;
