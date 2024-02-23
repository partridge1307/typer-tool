import { useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { TypeData, parseText } from "@/utils/type-tool";
import TypeView from "@/components/type-view";
import Navigation from "@/components/navigation";

export default function Main() {
  const [data, setData] = useState<TypeData[]>([]);

  const readFile = async (path: string) => {
    try {
      const result: string = await invoke("read_file", { path });

      setData(parseText(result));
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

  return (
    <main className="layout">
      <article className="typer-root">
        {!data.length ? <p>Chưa có dữ liệu</p> : <TypeView data={data} />}
      </article>
      <Navigation openFile={openFile} />
    </main>
  );
}
