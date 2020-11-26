#!/usr/bin/env -S deno run --unstable --allow-net --allow-read --allow-write --import-map=import_map.json
import { assert, assertStringIncludes } from "std/testing/asserts.ts";
import type { Item } from "./types.ts";

import {
  createArchive,
  createList,
  createReadme,
  getUrls,
  isUrl,
} from "./utils.ts";

Deno.test("createList", function (): void {
  const words: Item[] = [
    { url: "bar", doms: 2 },
    { url: "world", doms: 4 },
  ];

  assertStringIncludes(createList(words), "<!-- BEGIN -->");
  assertStringIncludes(createList(words), "<!-- END -->");
  assertStringIncludes(createList(words), "bar");
  assertStringIncludes(createList(words), "world");
  assertStringIncludes(createList(words), "4");
});

Deno.test("createArchive", function (): void {
  const words: Item[] = [
    { url: "bar", doms: 2 },
    { url: "world", doms: 4 },
  ];

  assertStringIncludes(createArchive(words, "2020-02-02"), "# 2020-02-02");
});

Deno.test("createReadme", async function (): Promise<void> {
  const words: Item[] = [
    { url: "bar", doms: 2 },
    { url: "world", doms: 4 },
  ];

  assertStringIncludes(await createReadme(words), "<!-- BEGIN -->");
  assertStringIncludes(
    await createReadme(words),
    "how_many_doms",
  );
});

Deno.test("isUrl", function (): void {
  assert(isUrl("https://foo.bar"));
  assert(isUrl("http://foo.bar"));
  assert(!isUrl("foo.bar"));
});

Deno.test("getUrls", async function () {
  assert(await getUrls());
  assert(Array.isArray(await getUrls()));
});
