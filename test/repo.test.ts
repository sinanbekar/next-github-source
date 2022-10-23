/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, beforeEach, afterEach, expect } from "vitest";
import {
  SimpleGitTestContext,
  createTestContext,
  setUpInit,
  io,
} from "./git-test-utils";

describe("repo", () => {
  // TODO: test
  let context: SimpleGitTestContext;
  /*
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
  */

  it.todo("should get repo correctly");
  it.todo("should hard reset (shallow copy) if it is already cloned");
  it.todo("should get default branch if no branch is specified");
  it.todo("should always get latest changes");
  it.todo("should throw an error if the repo is not valid");
  it.todo("should get repo files correctly");
  it.todo("should get files that only specified with pattern");
});
