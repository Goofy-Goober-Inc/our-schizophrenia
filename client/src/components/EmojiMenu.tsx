import { useEffect } from "react";
import { emoteCache } from './SendForm';
import './EmojiMenu.css'

type EmojiMenuProps = {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const EmoteMenu = ({ setMessage }: EmojiMenuProps) => {
  useEffect(() => {
    const emoteMenu = document.getElementById('emoteMenu')
    const availableEmotesDiv = document.createElement('div')
    availableEmotesDiv.className = "availableEmotes"

    emoteCache.forEach(emote => {
      const imgEmoteElement: HTMLImageElement = document.createElement('img')
      imgEmoteElement.src = `/emotes/${emote}`
      imgEmoteElement.onclick = () => {
        setMessage((prevMsg) => prevMsg + `:${emote.split(".")[0]}:`)
      }
      availableEmotesDiv.appendChild(imgEmoteElement);
    })

    if(emoteMenu) emoteMenu.appendChild(availableEmotesDiv)
  }, [])

  return (
    <>
      <div id="emoteMenu">
        
      </div>
    </>
  )
}

export default EmoteMenu;