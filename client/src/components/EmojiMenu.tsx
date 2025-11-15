import { useEffect } from "react";
import './EmojiMenu.css'

type EmojiMenuProps = {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const EmojiMenu = ({ setMessage }: EmojiMenuProps) => {
  useEffect(() => {
    const fetchEmojis = () => {
      fetch("/api/emotes")
        .then(res => res.json())
        .then(data => {
          const emojiMenu = document.getElementById('emojiMenu')
          const availableEmotesDiv = document.createElement('div')
          availableEmotesDiv.className = "availableEmotes"
          const emotes = data.availableEmotes

          emotes.forEach((emote: string) => {
            const imgEmoteElement: HTMLImageElement = document.createElement('img')
            imgEmoteElement.src = `/emotes/${emote}`

            imgEmoteElement.onclick = () => {
              setMessage((prevMsg) => prevMsg + `:${emote.split(".")[0]}:`)
            }
            
            availableEmotesDiv.appendChild(imgEmoteElement);
          })

          if(emojiMenu) emojiMenu.appendChild(availableEmotesDiv)

        })
    }

    fetchEmojis();
  }, [])

  return (
    <>
      <div id="emojiMenu">
        
      </div>
    </>
  )
}

export default EmojiMenu;