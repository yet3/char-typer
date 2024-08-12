import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginSass } from "@rsbuild/plugin-sass";

const AUTHOR = "Maksymilian Kasperowicz <yet3.dev@gmail.com>";
const TITLE = "Char typer";
const DESCRIPTION = "Yet another app to train your typing skills";
const URL = "https://char-typer.vercel.app/";
const LOCALE = "en_US";
const COVER_IMG = "/cover.jpeg";

export default defineConfig({
  plugins: [pluginReact(), pluginSass()],
  output: {
    manifest: "./public/manifest.json",
  },
  html: {
    title: TITLE,
    favicon: "./public/favicon.svg",
    appIcon: "./public/favicon.svg",
    meta: {
      author: AUTHOR,
      keywords:
        "typing, typing test, typing skills, typing game, typing practice, typing speed test, test, keyboard, minimalistic, minimal, wpm, cpm, cps, words per minute, accuracy",
      description: DESCRIPTION,
      robots: "index, follow",
      canonical: URL,

      "og:title": TITLE,
      "og:locale": LOCALE,
      "og:site_name": TITLE,
      "og:description": DESCRIPTION,
      "og:image": COVER_IMG,
      "og:url": URL,
      "og:type": "website",

      "twitter:title": TITLE,
      "twitter:description": DESCRIPTION,
      "twitter:card": "summary_large_image",
      "twitter:image": COVER_IMG,
      "twitter:url": URL,
    },
  },
});
