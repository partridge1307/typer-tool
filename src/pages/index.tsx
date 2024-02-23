import { useCallback, useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { TypeData, parseText } from "@/utils/type-tool";
import TypeView from "@/components/type-view";
import Navigation from "@/components/navigation";

type TCurrentProgress = {
  path: string;
  page: number;
};

export default function Main() {
  const [data, setData] = useState<TypeData[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [current, setCurrent] = useState(0);

  const readFile = async (path: string) => {
    try {
      const result: string = await invoke("read_file", { path });

      setData(parseText(result));
      setCurrentPath(path);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    document.onpaste = async () => {
      try {
        const pasted = await navigator.clipboard.readText();
        if (!pasted) return;

        readFile(pasted);
      } catch (error) {
        console.error(error);
      }
    };

    const savedProgress = localStorage.getItem("progress");
    if (!savedProgress) return;

    const { path, page } = JSON.parse(savedProgress) as TCurrentProgress;

    console.log(page);

    readFile(path);
    setCurrent(page);
  }, []);

  async function openFile() {
    let file = await open({
      multiple: false,
      filters: [
        {
          name: "Type file",
          extensions: ["docx", "txt"],
        },
      ],
    });
    if (!file) return;

    readFile(file as string);
  }

  const save_current_progress = useCallback(() => {
    localStorage.setItem(
      "progress",
      JSON.stringify({
        path: currentPath,
        page: current,
      })
    );
  }, [current, currentPath]);

  return (
    <main className="layout">
      <article className="typer-root">
        {!data.length ? (
          <p>Chưa có dữ liệu</p>
        ) : (
          <TypeView
            data={data}
            current={current}
            onCurrentChange={setCurrent}
            saveProgress={save_current_progress}
          />
        )}
      </article>
      <Navigation openFile={openFile} saveProgress={save_current_progress} />
    </main>
  );
}
