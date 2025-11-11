import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react'
import './Chat.css'

const Main = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [auth, setAuth] = useState(false);

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

      data.forEach((msg: any) => {
        let p = document.createElement('p');
        p.textContent = `${msg.username}: ${msg.message}`;

        chat?.appendChild(p);
      })
    }

    isAuthorized();
    fetchMessages();

  }, [])

  const socketURL = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/chat`;
  const { sendMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('Connected'),
    onMessage: (msg) => {
      let chat = document.getElementById('chat')

      let p = document.createElement('p');
      p.textContent = `${JSON.parse(msg.data).username}: ${JSON.parse(msg.data).message}`;

      chat?.appendChild(p);
      chat?.scrollTo(0, chat.scrollHeight)
    },
  });

  const sendMessageOnClick = () => {
    auth ? sendMessage(JSON.stringify({"username":username, "message":message})) : null
    }

  return (
    <>
      <section>
        <h1>Username: {username}</h1>
        <h1>Auth: {auth === true ? "true" : "false"}</h1>
        { auth === true ? (
        <div className='send-form'>
          <input type="text" name="message" id="message" placeholder='message' onChange={(e) => {setMessage(e.target.value)}} onKeyUp={(e) => {if(e.key === "Enter") sendMessageOnClick()}}/>
          <button onClick={sendMessageOnClick} id='sendButton'>Send</button>
        </div>
        ) : null}
        <div id='chat'></div>
      </section>
    </>
  )
}

export default Main;