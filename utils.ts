import type { Item } from "./types.ts";

/** 从 urls.txt 文件中读取所有的 url */
export async function getUrls(): Promise<string[]> {
  const content = await Deno.readTextFile("./urls.txt");
  return content.split("\n").filter((x) => isUrl(x));
}

export function isUrl(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export async function createReadme(words: Item[]): Promise<string> {
  const readme = await Deno.readTextFile("./README.md");
  return readme.replace(/<!-- BEGIN -->[\W\w]*<!-- END -->/, createList(words));
}

export function createList(words: Item[]): string {
  return `<!-- BEGIN -->
<!-- 最后更新时间 ${Date()} -->
url | divs | doms
:- | -: | -:
${
    words.map((x) => `${x.url} | ${x.divs} | ${x.doms}`)
      .join("\n")
  }
<!-- END -->`;
}

export function createArchive(words: Item[], date: string): string {
  return `# ${date}\n
${createList(words)}
`;
}
