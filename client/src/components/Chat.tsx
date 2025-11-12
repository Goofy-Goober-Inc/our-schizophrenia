import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react'
import './Chat.css'

type Msg = {
  username: string,
  message: string,
  image: URL | String
  }

const Main = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [auth, setAuth] = useState(false);

  const replaceEmotes = (msg: string) => {
    return fetch("/api/emotes")
      .then(res => res.json())
      .then(data => {
        let availableEmotes = data.availableEmotes;
        return msg.replace(/:[^:\s]+:/g, emote => {
          return availableEmotes.includes(`${emote.replaceAll(":", "")}.webp`) ?
            `<img src="/emotes/${emote.replaceAll(":", "")}.webp" />` : `${emote}`;
        })
      })
  }

  const showMessages = (msg: Msg, chat: HTMLElement | null) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message'

    msg.message = msg.message.replace(/(?<=\s|^)@[^@\s]+(?=\s|$)/g, mention => {
      return `<span style="color: blue !important;">${mention}</span>`
    })
    
    // msg.message = msg.message.replace(/(?<=\s|^):[^:\s]+:(?=\s|$)/g, emote => {
    //   return isEmoteAvailable(emote) ? "true" : "false";
    // })

    let p = document.createElement('p');
    p.innerHTML = `${msg.username}: ${msg.message}`;
    
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

    replaceEmotes(msg.message).then(newMsg => {
      p.innerHTML = `${msg.username}: ${newMsg}`;
    })
  }

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      console.log(result);
    });

    let chat = document.getElementById('chat')
    
    const isAuthorized = async () => {
      const response = await fetch("/user");
      const data = await response.json();
      const username = data.username
      setUsername(username);

      setAuth((response.status == 401) ? false : true);
      }

    const fetchMessages = async () => {
      const response = await fetch("/api/message")
      const data = await response.json();

      data.forEach((msg: Msg) => { showMessages(msg, chat) })
      }

    isAuthorized();
    fetchMessages();

  }, [])

  const socketURL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/chat`;
  const { sendMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('Connected'),
    onMessage: (msg) => {
      let chat = document.getElementById('chat')
      try {
        showMessages(JSON.parse(msg.data), chat)

        if (Notification?.permission === "granted" && !(document.hasFocus())) {
          new Notification(`${JSON.parse(msg.data).username}: ${JSON.parse(msg.data).message} ${JSON.parse(msg.data).image === null ? "" : "<image>"}`)
        }
      } catch(e) {
        console.log(e);
      }
    }
    });

  const sendMessageOnClick = () => {
    auth ? sendMessage(JSON.stringify({"username":username, "message":message, "image":imageUrl})) : null

    const messageInput = document.getElementById("message") as HTMLInputElement | null;
    const imageInput = document.getElementById("image") as HTMLInputElement | null;

    if (messageInput) messageInput.value = "";
    if (imageInput) imageInput.value = "";

    setMessage("")
    setImageUrl("")
    }

  return (
    <>
      <section>
        <div>
          <div id='chat'></div>
          { auth === true ? (
          <div className='send-form'>
            <input
              type="text"
              name="message"
              id="message"
              placeholder='message'
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
          ) : null}
        </div>
      </section>
    </>
  )
}

export default Main;