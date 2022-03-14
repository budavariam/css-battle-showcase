import { format, parseISO } from 'date-fns';
import fs from 'fs';
import matter from 'gray-matter';
import mdxPrism from 'mdx-prism';
import { GetStaticPaths, GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Head from 'next/head';
import Link from 'next/link';
import path from 'path';
import React from 'react';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import Layout, { WEBSITE_HOST_URL } from '../../../components/Layout';
import CodeHighlight from '../../../components/CodeHighlight';
import { MetaProps } from '../../../types/layout';
import { BattleType } from '../../../types/battle';
import { BATTLE_PATH } from '../../../utils/battleUtils';
import { useRouter } from 'next/router';
import { useFetch } from 'use-http';

// Custom components/renderers to pass to MDX.
// Since the MDX files aren't loaded by webpack, they have no knowledge of how
// to handle import statements. Instead, you must include components in scope
// here.
const components = {
  Head,
  Link,
};

type BattlePageProps = {
  source: MDXRemoteSerializeResult;
  frontMatter: BattleType;
};

const BattlePage = ({ source, frontMatter }: BattlePageProps): JSX.Element => {
  const router = useRouter()
  const { type, slug } = router.query
  const numOftem = slug.toString().split("-")[0]

  const solution = `/solutions/${type}/${numOftem}.html`

  const options = {} // these options accept all native `fetch` options
  // the last argument below [] means it will fire onMount (GET by default)
  const { loading, error, data = [] } = useFetch(solution, options, [solution])

  const customMeta: MetaProps = {
    title: `${frontMatter.title} - Mátyás Budavári`,
    description: frontMatter.description,
    image: `${WEBSITE_HOST_URL}${frontMatter.image}`,
    date: frontMatter.date,
    type: 'article',
  };
  return (
    <Layout customMeta={customMeta}>
      <article>
        <h1 className="mb-3 text-gray-900 dark:text-white">
          {frontMatter.title}
        </h1>
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {format(parseISO(frontMatter.date), 'MMMM dd, yyyy')}
        </p>
        <div className="prose dark:prose-dark">
          <MDXRemote {...source} components={components} />
        </div>
        <div className="flex flex-1 gap-10 justify-between mb-5 overflow-x-auto">
          <iframe className="flex-shrink-0" src={solution} width={400} height={300} title="My Solution" />
          <img className="flex-shrink-0" src={`//cssbattle.dev/targets/${numOftem}.png`} title="Target" />
        </div>

        {data && <div className="text-slate-600">{data.length} chars</div>}
        <div className='overflow-hidden w-full border-1 border-black p-5' style={{ background: "#272822" }}>
          <>
            {error && 'Failed to load my solution!'}
            {loading && 'Loading...'}
            {!loading && !error && data && (
              <>
                <CodeHighlight code={data}></CodeHighlight>
              </>
            )}
          </>
        </div>
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const category = params.type as unknown as string
  const postFilePath = path.join(BATTLE_PATH, category, `${params.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);

  const mdxSource = await serialize(content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [require('remark-code-titles')],
      rehypePlugins: [mdxPrism, rehypeSlug, rehypeAutolinkHeadings],
    },
    scope: data,
  });

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const menus = process.env.menu as unknown as { link: string, name: string, children: { name: string, link: string }[] }[]
  const paths = menus
    // Map the path into the static paths object required by Next.js
    // .map((folder) => ({ params: { slug: folder.children.map(file => `${folder.link}/${file.name}`) } }));
    .flatMap((folder) => folder.children.map(file => (
      {
        params: {
          type: folder.link,
          slug: file.name,
        }
      }
    )));

  return {
    paths,
    fallback: false,
  };
};

export default BattlePage;
