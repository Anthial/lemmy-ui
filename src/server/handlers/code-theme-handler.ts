import type { Request, Response } from "express";
import { existsSync } from "fs";
import path from "path";

const extraThemesFolder =
  process.env["LEMMY_UI_EXTRA_THEMES_FOLDER"] || "./extra_themes";

export default async (req: Request, res: Response) => {
  res.contentType("text/css");

  const theme = req.params.name;

  if (!theme.endsWith(".css")) {
    res.status(400).send("Theme must be a css file");
    return;
  }

  const customTheme = path.resolve(extraThemesFolder, theme);

  if (existsSync(customTheme)) {
    res.sendFile(customTheme);
  } else {
    const internalTheme = path.resolve(
      `./dist/assets/css/code-themes/${theme}`,
    );

    // If the theme doesn't exist, just send atom-one-light
    if (existsSync(internalTheme)) {
      res.sendFile(internalTheme);
    } else {
      res.sendFile(
        path.resolve("./dist/assets/css/code-themes/atom-one-light.css"),
      );
    }
  }
};
