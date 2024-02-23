import { useMediaQuery } from "@/hooks/useMediaQuery";
import { FC, memo, useState } from "react";

interface INavigation {
  openFile: () => void;
}

const Navigation: FC<INavigation> = ({ openFile }) => {
  const matches = useMediaQuery("(min-width: 480px)");
  const [isPinned, setPin] = useState(false);

  const pin_app = async () => {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.setAlwaysOnTop(!isPinned);
    setPin(!isPinned);
  };

  return matches ? (
    <aside>
      <div className="fixed flex flex-col w-[25%] p-2 space-y-3">
        <button
          aria-label="pin"
          tabIndex={-1}
          className={isPinned ? "button destructive" : "button"}
          onClick={pin_app}
        >
          {isPinned ? "Bỏ ghim" : "Ghim"}
        </button>
        <button
          aria-label="Open"
          tabIndex={-1}
          className="button"
          onClick={openFile}
        >
          Mở file
        </button>
      </div>
    </aside>
  ) : (
    "false"
  );
};

export default memo(Navigation);
