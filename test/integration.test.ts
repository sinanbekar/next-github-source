import { describe, it, beforeEach, afterEach, expect } from "vitest";
import { createClient } from "../src/core/client";
import {
  SimpleGitTestContext,
  createTestContext,
  setUpInit,
  io,
} from "./git-test-utils";

describe("integration", () => {
  // TODO: test more
  let context: SimpleGitTestContext;
  beforeEach(async () => {
    context = await createTestContext();
    await setUpInit(context);
    await context.files("test-post-1.md", "test-post-2.md", "test-post-3.md");
    await context.git.add(".");
    await context.git.commit("commit message");
  });

  afterEach(async () => {
    io.rimraf(context.rootResolvedPath);
  });

  it("should get all entries correctly", async () => {
    const client = createClient({
      repo: {
        remote: `file:///${context.rootResolvedPath}`,
      },
      pattern: `**`,
    });

    expect(await client.getAllEntries()).toEqual([
      { source: "File content test-post-1.md", slug: "test-post-1" },
      { source: "File content test-post-2.md", slug: "test-post-2" },
      { source: "File content test-post-3.md", slug: "test-post-3" },
    ]);
  });
});
