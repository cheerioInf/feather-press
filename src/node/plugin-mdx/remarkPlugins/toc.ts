import type { Plugin } from 'unified';
import Slugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { Root } from 'mdast';
import type { MdxjsEsm } from 'mdast-util-mdxjs-esm';
import { parse } from 'acorn';
import { Program } from 'mdast-util-mdxjs-esm/lib';

interface TocItem {
  id: string;
  text: string;
  depth: number;
}

interface ChildNode {
  type: 'link' | 'text' | 'inlineCode';
  value: string;
  children?: ChildNode[];
}

export const remarkPluginToc: Plugin<[], Root> = () => {
  return (tree) => {
    const toc: TocItem[] = [];
    const slugger = new Slugger();
    let title = '';
    visit(tree, 'heading', (node) => {
      // 如果 node 的 depth 不存在，或者 node 没有 children，直接返回
      if (!node.depth || !node.children) {
        return;
      }
      if (node.depth === 1) {
        title = (node.children[0] as ChildNode).value;
      }
      // h2 ~ h4
      if (node.depth > 1 && node.depth < 5) {
        // node.children 是一个数组，包含几种情况:
        // 1. 文本节点，如 '## title'
        // 结构如下:
        // {
        //   type: 'text',
        //   value: 'title'
        // }
        // 2. 链接节点，如 '## [title](/path)'
        // 结构如下:
        // {
        //   type: 'link',
        //     {
        //       type: 'text',
        //       value: 'title'
        //     }
        //   ]
        // }
        // 3. 内联代码节点，如 '## `title`'
        // 结构如下:
        // {
        //   type: 'inlineCode',
        //   value: 'title'
        // }
        const originText = (node.children as ChildNode[])
          .map((child) => {
            switch (child.type) {
              case 'link':
                // 如果是链接节点，则需要遍历链接节点的 children
                return child.children?.map((c) => c.value).join('') || '';
              default:
                return child.value;
            }
          })
          .join('');
        // slugger 的作用是将中文转换为英文，如 '中文' => 'zhong-wen'
        const id = slugger.slug(originText);
        toc.push({
          id,
          text: originText,
          depth: node.depth
        });
      }
    });

    const insertCode = `export const toc = ${JSON.stringify(toc, null, 2)};`;

    tree.children.push({
      type: 'mdxjsEsm',
      value: insertCode,
      data: {
        estree: parse(insertCode, {
          ecmaVersion: 2020,
          sourceType: 'module'
        }) as unknown as Program
      }
    } as MdxjsEsm);

    if (title) {
      const insertedTitle = `export const title = '${title}';`;

      tree.children.push({
        type: 'mdxjsEsm',
        value: insertedTitle,
        data: {
          estree: parse(insertedTitle, {
            ecmaVersion: 2020,
            sourceType: 'module'
          }) as unknown as Program
        }
      } as MdxjsEsm);
    }
  };
};
