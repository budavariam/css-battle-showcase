import Link from 'next/link';
import React from 'react';

const Navigation = (): JSX.Element => {
  return (
    <nav>
      <Link href="/" className="text-gray-900 dark:text-white pr-6 py-4">
        Home
      </Link>
      <Link href="/about" className="text-gray-900 dark:text-white px-6 py-4">
        About
      </Link>
    </nav>
  );
};

export default Navigation;
