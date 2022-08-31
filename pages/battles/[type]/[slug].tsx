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
  numOfItem: number,
  solution: string,
  solutionPath: string,
};

const BattlePage = ({ source, frontMatter, solution, solutionPath, numOfItem }: BattlePageProps): JSX.Element => {
  const originalImage = `https://cssbattle.dev/targets/${numOfItem}.png`
  const customMeta: MetaProps = {
    title: `${frontMatter.title} - Mátyás Budavári`,
    description: frontMatter.description,
    image: frontMatter.image
      ? `${WEBSITE_HOST_URL}${frontMatter.image}`
      : originalImage,
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
          I solved it on {format(parseISO(frontMatter.date), 'MMMM d, yyyy')}. You can try to beat my record on <a href={`https://cssbattle.dev/play/${numOfItem}`} target="_blank">CSSBattle</a>!
        </p>
        <div className="flex flex-1 gap-10 justify-between mb-5 overflow-x-auto">
          {/* NOTE: could use string with srcDoc, but my browser failed to render */}
          <iframe className="flex-shrink-0" src={solutionPath} width={400} height={300} title="My Solution" scrolling="no" />
          <img className="flex-shrink-0 min-w-min" src={originalImage} width={400} height={300} title="Target" />
        </div>
        <div className="text-slate-600">{solution.length} chars</div>
        <div className='overflow-auto w-full border-1 border-black p-5 mb-5 hljs'>
          <CodeHighlight code={solution}></CodeHighlight>
        </div>
        <div className="prose dark:prose-dark">
          <MDXRemote {...source} components={components} />
        </div>
      </article>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params.slug as unknown as string
  const type = params.type as unknown as string
  const postFilePath = path.join(BATTLE_PATH, type, `${slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const numOfItem = slug.toString().split("-")[0]
  const solutionBuildPath = path.join(process.cwd(), "public", "solutions", type, `${numOfItem}.html`);
  const solution = fs.readFileSync(solutionBuildPath);
  const solutionPath = path.join(process.env.basePath, "solutions", type, `${numOfItem}.html`);

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
      solution: solution.toString(),
      solutionPath,
      numOfItem,
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
