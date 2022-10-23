# next-github-source

Use GitHub repo as CMS in Next.js (similar Hashnode's Github as source)

> **Warning** This package is early in development. Do NOT use in production environment.

## 🚀 Quick Start

```bash
npm install next-github-source
```

`lib/githubSourceClient.js`

```js
import { createClient } from "next-github-source";

export const client = createClient({
  repo: {
    remote: `https://github.com/Hashnode/Hashnode-source-from-github-template`,
  },
  pattern: [`**`, "!README.md"], // list all except README.md
});
```

`pages/index.js`

```js
import Link from "next/link";
import { client } from "../../lib/githubSourceClient";

export const getStaticProps = async () => {
  const posts = await client.getAllEntries();

  return {
    props: { posts },
  };
};

export default function Posts({ posts }) {
  return (
    <div>
      {posts.map((post, idx) => (
        <Link key={idx} href={`/posts/${post.slug}`}>
          <a>
            [{post.source}]({post.slug})
          </a>
        </Link>
      ))}
    </div>
  );
}
```

`pages/posts/[slug].js`

```js
import { client } from "../../lib/githubSourceClient";

export const getStaticPaths = async () => {
  return {
    paths: await client.getAllEntryPaths(),
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const post = await client.getEntry(params.slug);

  return {
    props: { post },
  };
};

export default function Post({ post }) {
  return <div>{JSON.stringify(post)}</div>;
}
```

## TODO

- [ ] Examples with `next-mdx-remote`
- [ ] On-demand revalidation support with examples
- [ ] Matter support with types & validation
- [ ] High test coverage
- [ ] Docs

## License

[MIT](./LICENSE) License © 2022 [Sinan Bekar](https://github.com/sinanbekar)
