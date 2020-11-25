#!/usr/bin/env -S deno run --unstable --allow-net --allow-read --allow-write --import-map=import_map.json
// Copyright 2020 justjavac(迷渡). All rights reserved. MIT license.
import { format } from "std/datetime/mod.ts";
import { join } from "std/path/mod.ts";
import { CHAR_LOWERCASE_Z } from "https://deno.land/std@0.79.0/path/_constants.ts";

import type { Item } from "./types.ts";
import { createArchive, createReadme, getUrls } from "./utils.ts";

const urls = await getUrls();

const result: Item[] = await Promise.all(urls.map(async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const divs = -1;
      const doms = -1;
      const error = response.statusText;
      return { url, divs, doms, error };
    }

    const output = await response.text();
    const divs = Array.from(output.matchAll(/<div/g)).length;
    const doms = Array.from(output.matchAll(/<[a-zA-Z]+/g)).length;
    return { url, divs, doms };
  } catch (ex) {
    const error = (ex as Error).message;
    return { url, divs: -1, doms: -1, error };
  }
}));

const yyyyMMdd = format(new Date(), "yyyy-MM-dd");
const fullPath = join("raw", `${yyyyMMdd}.json`);

result.sort((a, b) => b.doms - a.doms);

// 保存原始数据
await Deno.writeTextFile(fullPath, JSON.stringify(result));

// 更新 README.md
const readme = await createReadme(result);
await Deno.writeTextFile("./README.md", readme);

// 更新 archives
const archiveText = createArchive(result, yyyyMMdd);
const archivePath = join("archives", `${yyyyMMdd}.md`);
await Deno.writeTextFile(archivePath, archiveText);
