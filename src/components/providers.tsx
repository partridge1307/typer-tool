"use client";

import { store } from "@/state/store";
import { ThemeProvider } from "next-themes";
import { Provider as ReduxProvider } from "react-redux";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </ReduxProvider>
  );
}
