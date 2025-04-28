import { type Block, type ListItem } from '@/types';

interface BlockViewerProps {
  blocks: { blocks: Block[] };
}

export default function BlockViewer({ blocks }: BlockViewerProps) {
  function convertDataToHtml(blocks: { blocks: Block[] }) {
    let convertedHtml = "";

    function processList(items: ListItem[], isOrdered: boolean): string {
      let listHtml = isOrdered ? "<ol class='viewer-content'>" : "<ul class='viewer-content'>";
      items.forEach((item) => {
        listHtml += `<li>${item.content}`;
        if (item.items && item.items.length > 0) {
          listHtml += processList(item.items, isOrdered);
        }
        listHtml += "</li>";
      });
      listHtml += isOrdered ? "</ol>" : "</ul>";
      return listHtml;
    }

    if (blocks && Array.isArray(blocks.blocks)) {
      blocks.blocks.forEach((block) => {
        switch (block.type) {
          case "header":
            convertedHtml += `<h${block.data.level} class="viewer-content">${block.data.text}</h${block.data.level}>`;
            break;
          case "list":
            convertedHtml += processList(block.data.items || [], block.data.style === "ordered");
            break;
          case "paragraph":
            convertedHtml += `<p class='viewer-content'>${block.data.text}</p>`;
            break;
          case "delimiter":
            convertedHtml += "<hr class='viewer-content' />";
            break;
          case "image":
            convertedHtml += `<img class="img-fluid class='viewer-content'" src="${block.data.file?.url}" title="${block.data.caption}" /><br /><em>${block.data.caption}</em>`;
            break;
          default:
            console.log("Unknown block type", block.type);
            break;
        }
      });
    } else {
      console.error("Invalid blocks data:", blocks);
    }

    return convertedHtml;
  }

  return <div dangerouslySetInnerHTML={{ __html: convertDataToHtml(blocks) }} />;
}
