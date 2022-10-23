// refactored & ported from
// https://github.com/WeZZard/gatsby-source-git-as-filesystem/blob/17727774e36595115c5c89efafe5f780fe452fb0/gatsby-node.ts

import git, { SimpleGit } from "simple-git";
import gitUrlParse from "git-url-parse";
import fastGlob from "fast-glob";
import fs from "fs";
import path from "path";

export interface Repo {
  remote: string;
  branch?: string;
}

const defaultCachePath = (name: string, branch = "HEAD") =>
  path.join(process.cwd(), ".cache", "next-github-source", name, branch);

const isAlreadyCloned = async (remote: Repo["remote"], localPath: string) => {
  if (!fs.existsSync(localPath) || fs.readdirSync(localPath).length === 0) {
    return false;
  }

  const existingRemote = await git(localPath).listRemote(["--get-url"]);
  return existingRemote.trim() == remote.trim();
};

export async function getRepo(
  remote: Repo["remote"],
  branch: Repo["branch"],
  customCacheDir?: string,
) {
  const parsedRemote = gitUrlParse(remote);

  if (parsedRemote.source !== "github.com") {
    console.warn("Remote source is not GitHub, use at your own risk.");
  }

  const cachePath =
    customCacheDir ||
    defaultCachePath(`${parsedRemote.owner}/${parsedRemote.name}`, branch);

  let repo: SimpleGit;

  if (await isAlreadyCloned(remote, cachePath)) {
    repo = git(cachePath);
    const target = `origin/${branch ?? "HEAD"}`; // fallback to the default branch (HEAD) if no branch is specified
    await repo
      .fetch([`--depth`, `1`])
      .then(() => repo.reset([`--hard`, target])); // refresh our shallow clone with the latest commit
  } else {
    const opts = [`--depth`, `1`];
    if (branch) opts.push(`--branch`, branch);
    await git().clone(remote, cachePath, opts);
    repo = git(cachePath);
  }

  return repo;
}

export async function getRepoFiles({
  remote,
  branch,
  pattern = `**`,
}: Repo & { pattern: string | string[] }) {
  let repo;
  try {
    repo = await getRepo(remote, branch);
  } catch (e) {
    console.error("Error happened while getting repo.");
    throw e;
  }

  const localPath = (await repo.raw(["rev-parse", "--show-toplevel"])).trim(); // get local repo root dir

  const repoFiles = (
    await fastGlob(pattern, {
      cwd: localPath,
      absolute: true,
    })
  ).map((absolutePath) => {
    return {
      relativePath: path.relative(localPath, absolutePath),
      absolutePath,
    };
  });

  return repoFiles;
}

export type RepoFiles = Awaited<ReturnType<typeof getRepoFiles>>;
