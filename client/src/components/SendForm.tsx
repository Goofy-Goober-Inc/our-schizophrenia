import { useEffect, useState } from "react"
import useWebSocket from "react-use-websocket"
import EmojiMenu from './EmojiMenu'
import './SendForm.css'

type Msg = {
  username: string,
  message: string,
  image: URL | String
}

export let emoteCache: Record<string, string> = {};

const replaceEmotes = (msg: string) => {
  // return msg.replace(/:[^:\s]+:/g, emote => {
  //   return emoteCache.includes(`${emote.replaceAll(":", "")}.${emote.split(".")[1]}`) ?
  //     `<img src="/emotes/${emote.replaceAll(":", "")}.${emote.split(".")[1]}" />` : `${emote}`;
  // })
  return msg.replace(/:[^:\s]+:/g, emote => {
    // console.log(emoteCache[emote.replaceAll(":", "")])
    return `<img src="${emoteCache[emote.replaceAll(":", "")]}" />`
  })
}

export const showMessages = (msg: Msg, chat: HTMLElement | null) => {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message'

  msg.message = msg.message.replace(/(?<=\s|^)@[^@\s]+(?=\s|$)/g, mention => {
    return `<span style="color: blue !important;">${mention}</span>`
  })
  
  let p = document.createElement('p');
  p.innerHTML = `${msg.username}: ${replaceEmotes(msg.message)}`;
  
  messageDiv.appendChild(p);
  
  if (msg.image !== null) {
    let img = document.createElement('img')
    img.src = `${msg.image}`;
    img.className = 'image'
    messageDiv.appendChild(img);
  }

  if(!chat) {
    throw new Error("Chat div wasnt found.") // did it for fun
  }

  chat.appendChild(messageDiv)
  chat.scrollTo(0, chat.scrollHeight)

  // replaceEmotes(msg.message).then(newMsg => {
  //   p.innerHTML = `${msg.username}: ${newMsg}`;
  // })
}

const SendForm = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [auth, setAuth] = useState(false);

  useEffect(() => {    
    const isAuthorized = async () => {
      const response = await fetch("/user");
      const data = await response.json();
      const username = data.username
      setUsername(username);

      setAuth((response.status == 401) ? false : true);
    }

    const fetchEmotes = async () => {
      if (Object.keys(emoteCache).length > 0) return emoteCache;

      const res = await fetch("/api/emotes");
      const data = await res.json();

      if(data) {
        emoteCache = data;
        // console.log(emoteCache)
        return data;
      }
    }

    fetchEmotes();
    isAuthorized();

  }, [])

  const sendMessageOnClick = () => {
    auth ? sendMessage(JSON.stringify({"username":username, "message":message, "image":imageUrl})) : null

    const messageInput = document.getElementById("message") as HTMLInputElement | null;
    const imageInput = document.getElementById("image") as HTMLInputElement | null;

    if (messageInput) messageInput.value = "";
    if (imageInput) imageInput.value = "";

    setMessage("")
    setImageUrl("")
  }

  const socketURL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/chat`;
  const { sendMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('Connected'),
    onMessage: (msg) => {
      let chat = document.getElementById('chat')
      try {
        showMessages(JSON.parse(msg.data), chat)
      } catch(e) {
        console.log(e);
      }
    }
  });

  return (
    <>
      { auth === true ? (
      <div>
        <div className='send-form'>
          <input
            type="text"
            name="message"
            id="message"
            placeholder='message'
            value={message}
            onChange={(e) => {setMessage(e.target.value)}}
            onKeyUp={(e) => {if(e.key === "Enter") sendMessageOnClick()}}
          />
          <input
            type="text"
            name="image"
            id="image"
            placeholder='image url'
            onChange={(e) =>{setImageUrl(e.target.value)}}
            onKeyUp={(e) => {if(e.key === "Enter") sendMessageOnClick()}}
          />
          <button onClick={sendMessageOnClick} id='sendButton'>Send</button>
        </div>
        <EmojiMenu setMessage={setMessage} />
      </div>
      ) : null}
    </>
  )
}

export default SendForm;