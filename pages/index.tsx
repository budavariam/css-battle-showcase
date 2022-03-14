import { GetStaticProps } from 'next';
import React from 'react';
import Layout from '../components/Layout';
import { getAllPosts } from '../lib/api';
import { PostType } from '../types/post';

type IndexProps = {
  posts: PostType[];
};

export const Index = ({ posts: _posts }: IndexProps): JSX.Element => {
  return (
    <Layout>
      <h1>Hi!</h1>
      <p>Use the side bar to see some of my <a href="https://cssbattle.dev">CSS Battle</a> Solutions.</p>
      <p>You can see the solution date with some comments</p>
      <p>My solution is in an iframe on the <strong>left, </strong> the target image on the <strong>right </strong> 
        in a scrollable container.
        On the bottom of the page the solution in a syntax highlighted box with the number of characters.
      </p>
      <p>Happy browsing!</p>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const posts = getAllPosts(['date', 'description', 'slug', 'title']);

  return {
    props: { posts },
  };
};

export default Index;
