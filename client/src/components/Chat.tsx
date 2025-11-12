import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react'
import './Chat.css'

type Msg = {
  username: String,
  message: String,
  image: URL | String
  }

const Main = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [auth, setAuth] = useState(false);

  const showMessages = (msg: Msg, chat: HTMLElement | null) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message'

    let p = document.createElement('p');
    p.textContent = `${msg.username}: ${msg.message}`;
    
    messageDiv.appendChild(p);
    
    if (msg.image !== null) {
      let img = document.createElement('img')
      img.src = `${msg.image}`;
      img.className = 'image'
      messageDiv.appendChild(img);
      }


    chat?.appendChild(messageDiv)
    chat?.scrollTo(0, chat.scrollHeight)
    }

  useEffect(() => {
    let chat = document.getElementById('chat')
    
    const isAuthorized = async () => {
      const response = await fetch("/user");
      const data = await response.json();
      const username = data.username
      setUsername(username);

      setAuth((response.status == 401) ? false : true);
      }

    const fetchMessages = async () => {
      const response = await fetch("/message")
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
      showMessages(JSON.parse(msg.data), chat)
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
        <h1>Username: {username}</h1>
        <h1>Auth: {auth === true ? "true" : "false"}</h1>
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
        <div id='chat'></div>
      </section>
    </>
  )
}

export default Main;