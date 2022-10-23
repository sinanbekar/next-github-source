import fs from "fs";
import { Repo, getRepoFiles, RepoFiles } from "./repo";
import { getSlugFromRelativePath } from "../utils";

interface GithubSourceOptions {
  repo: Repo;
  pattern: string | string[];
}

export class Client {
  options: GithubSourceOptions;
  private _repoFiles: RepoFiles | null;

  constructor(options: GithubSourceOptions) {
    this.options = options;
    this._repoFiles = null;
  }

  private async _getRepoFiles() {
    if (this._repoFiles === null) {
      this._repoFiles = await getRepoFiles({
        ...this.options.repo,
        pattern: this.options.pattern,
      });
    }
    return this._repoFiles;
  }

  get repoFiles() {
    return this._getRepoFiles();
  }

  async getAllEntries() {
    const repoFiles = await this.repoFiles;
    const entries = repoFiles.map(({ relativePath, absolutePath }) => {
      const source = fs.readFileSync(absolutePath, "utf8");
      return { source, slug: getSlugFromRelativePath(relativePath) };
    });

    return entries;
  }

  async getAllEntryPaths() {
    const repoFiles = await this.repoFiles;
    const paths = repoFiles.map(({ relativePath }) => {
      return getSlugFromRelativePath(relativePath);
    });

    return paths.map((slug) => ({ params: { slug } })); // nextjs getStaticPaths compability
  }

  async getEntry(slug: string) {
    const repoFiles = await this.repoFiles;
    const entry = repoFiles.find(
      ({ relativePath }) => getSlugFromRelativePath(relativePath) === slug,
    );

    if (!entry) return null;
    const source = fs.readFileSync(entry.absolutePath, "utf8");
    return { source, slug };
  }
}

export const createClient = (options: GithubSourceOptions) => {
  return new Client(options);
};
