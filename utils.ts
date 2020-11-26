import type { Item } from "./types.ts";

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
Last updated at ${new Date().toISOString()}\n
url | doms
:- | -:
${words.map((x) => `${x.url} | ${x.doms}`).join("\n")}
<!-- END -->`;
}

export function createArchive(words: Item[], date: string): string {
  return `# ${date}\n
${createList(words)}
`;
}
