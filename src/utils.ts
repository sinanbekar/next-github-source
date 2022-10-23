import path from "path";

export const getSlugFromRelativePath = (relativePath: string) => {
  const parsed = path.parse(relativePath);
  return path.join(parsed.dir, parsed.name);
};
