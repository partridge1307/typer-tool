const regex = /^(?:(?:Trang)|(?:Tr)|(?:\/\/))\s+(\d+):$/;
const italic_regex = /^(?:\*\*)(.*)(?:\*\*)$/;
const underline_regex = /^(?:\_\_)(.*)(?:\_\_)$/;

export type TypeData = {
  page: number;
  is_underline: boolean;
  is_italic: boolean;
  content: string;
};

export const parseText = (data: string): TypeData[] => {
  let result: TypeData[] = [];
  let current_page = 0;

  for (const paragraph of data.split("\n")) {
    if (!paragraph) continue;

    const page_paragraph = regex.exec(paragraph);

    if (page_paragraph !== null) {
      current_page = Number(page_paragraph[1]);
    } else {
      const is_underline = underline_regex.exec(paragraph);
      const is_italic = italic_regex.exec(paragraph);

      result.push({
        page: current_page,
        is_underline: is_underline !== null,
        is_italic: is_italic !== null,
        content:
          (!!is_underline && is_underline[1]) ||
          (!!is_italic && is_italic[1]) ||
          paragraph,
      });
    }
  }

  return result;
};
