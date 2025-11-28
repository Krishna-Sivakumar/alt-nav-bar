import { editor, markdown, space } from "@silverbulletmd/silverbullet/syscalls";
import { ParseTree } from "@silverbulletmd/silverbullet/lib/tree";

export function resolveMdBlockText(tree: ParseTree | undefined) {
  return tree?.children?.map((tree) => tree.text).join("");
}

// finds and returns code blocks with the calorie tag
export async function calorieBlocks(): Promise<string[]> {
  const file = await space.readPage(await editor.getCurrentPage());
  const tree = await markdown.parseMarkdown(file);

  let codeBlocks: string[] = [];

  tree.children?.forEach(
    (node) => {
      if (node.type == "FencedCode") {
        const info = resolveMdBlockText(
          node.children?.filter((node) => node.type == "CodeInfo")?.at(0),
        );
        const text = resolveMdBlockText(
          node.children?.filter((node) => node.type == "CodeText")?.at(0),
        );
        if (info && text && info.trim() == "calorie") {
          codeBlocks = [...codeBlocks, text];
        }
      }
    },
  );

  return codeBlocks;
}
