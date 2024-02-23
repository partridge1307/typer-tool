import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { themes, setTheme } = useTheme();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        tabIndex={-1}
        className="w-7 h-7 rounded-full bg-white border-2 border-black"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("light");
        }}
      />
      <button
        tabIndex={-1}
        className="w-7 h-7 rounded-full bg-black border-2 border-white"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("dark");
        }}
      />
      <button
        tabIndex={-1}
        className="w-7 h-7 rounded-full bg-pink-300 border-2 border-pink-500"
        onClick={(e) => {
          e.stopPropagation();
          setTheme("pink");
        }}
      />
    </div>
  );
}
