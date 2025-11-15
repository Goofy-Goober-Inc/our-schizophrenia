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

addEmote("catJAM", "https://cdn.7tv.app/emote/01F6MQ33FG000FFJ97ZB8MWV52/1x.avif") // PLEASE USE 32x32