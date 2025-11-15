import { writeFileSync, readFileSync, existsSync } from "fs"

export const addEmote = (name: string, url: string | URL) => {
  if(!existsSync("./src/emotes.json")) {
    writeFileSync("./src/emotes.json", JSON.stringify({}, null, 2))
  }
  const json = JSON.parse(readFileSync("./src/emotes.json", "utf-8"));
  console.log(json)
  json[name] = url;
  writeFileSync("./src/emotes.json", JSON.stringify(json, null, 2))
}