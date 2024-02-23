import { TypeData } from "@/utils/type-tool";
import { cn } from "@/utils/utils";
import { useCallback, useEffect, useState, type FC } from "react";
import { register, unregister } from "@tauri-apps/api/globalShortcut";

interface ITypeView {
  data: TypeData[];
}

const TypeView: FC<ITypeView> = ({ data }) => {
  const [current, setCurrent] = useState(0);

  const scroll_to_paragraph = useCallback((index: number) => {
    const next_paragraph = document.querySelector(`[paragraph="${index}"]`);

    return next_paragraph?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }, []);

  const jump_to_paragraph = useCallback(() => {
    const index = current + 1;
    if (index >= data.length) return;

    navigator.clipboard.writeText(data[index].content);
    scroll_to_paragraph(index);
    setCurrent(index);
  }, [current, data, scroll_to_paragraph]);

  useEffect(() => {
    register("CommandOrControl+P", jump_to_paragraph);

    return () => {
      unregister("CommandOrControl+P");
    };
  }, [jump_to_paragraph]);

  useEffect(() => {
    const listener = async (event: KeyboardEvent) => {
      if (!event.isTrusted) return;

      if (event.key === "Tab") {
        jump_to_paragraph();
      }
    };

    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, [jump_to_paragraph]);

  return (
    <table>
      <tbody>
        {data.map((paragraph, index) => {
          return (
            <tr
              key={index}
              //   @ts-ignore
              paragraph={index}
              className={cn(
                current === index && "text",
                "transition-[background-color] duration-200 hover:cursor-pointer"
              )}
              onClick={() => {
                navigator.clipboard.writeText(data[index].content);
                scroll_to_paragraph(index);
                setCurrent(index);
              }}
            >
              <td className="px-1.5 border-r-1 align-top">
                {current === index && paragraph.page}
              </td>
              <td
                className={cn(
                  "pl-1.5 pr-2",
                  paragraph.is_underline
                    ? "underline"
                    : paragraph.is_italic
                    ? "italic"
                    : "normal-case"
                )}
              >
                {paragraph.content}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TypeView;
