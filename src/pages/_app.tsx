import Providers from "@/components/providers";
import type { AppProps } from "next/app";
import { fontMono, fontSans } from "@/configs/fonts";
import "@/styles/globals.css";
import "@/styles/typer.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Providers>
      <Component {...pageProps} />
    </Providers>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
