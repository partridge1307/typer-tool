import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/utils/utils";
import { Settings } from "lucide-react";
import { FC, memo, useCallback, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

interface INavigation {
  openFile: () => void;
  saveProgress: () => void;
}

const Navigation: FC<INavigation> = ({ openFile, saveProgress }) => {
  const matches = useMediaQuery("(min-width: 480px)");
  const [isOpen, setOpen] = useState(false);
  const [isPinned, setPin] = useState(false);

  const pin_app = useCallback(async () => {
    const appWindow = (await import("@tauri-apps/api/window")).appWindow;
    appWindow.setAlwaysOnTop(!isPinned);
    setPin(!isPinned);
  }, [isPinned]);

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
        <button
          aria-label="Save"
          tabIndex={-1}
          className="button"
          onClick={saveProgress}
        >
          Lưu File
        </button>
        {/* <button aria-label="Save" tabIndex={-1} className="button">
          {isActive ? "On" : "Off"}
        </button> */}
        <ThemeSwitcher />
      </div>
    </aside>
  ) : (
    <div className="absolute top-3 right-3">
      <button
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prevOpen) => !prevOpen);
        }}
      >
        <Settings />
      </button>
      <div
        className={cn(
          "absolute z-10 top-8 right-0 space-y-2 transition-transform duration-200",
          isOpen ? "translate-y-0" : "-translate-y-[999px]"
        )}
      >
        <button
          aria-label="pin"
          tabIndex={-1}
          className={isPinned ? "button destructive w-24" : "button w-24"}
          onClick={(e) => {
            e.stopPropagation();
            pin_app();
          }}
        >
          {isPinned ? "Bỏ ghim" : "Ghim"}
        </button>
        <button
          aria-label="Open"
          tabIndex={-1}
          className="button w-24"
          onClick={(e) => {
            e.stopPropagation();
            openFile();
          }}
        >
          Mở file
        </button>
        <button
          aria-label="Save"
          tabIndex={-1}
          className="button w-24"
          onClick={(e) => {
            e.stopPropagation();
            saveProgress();
          }}
        >
          Lưu File
        </button>
        {/* <button aria-label="Save" tabIndex={-1} className="button w-24">
          {isActive ? "On" : "Off"}
        </button> */}
        <ThemeSwitcher />
      </div>
    </div>
  );
};

export default memo(Navigation);
