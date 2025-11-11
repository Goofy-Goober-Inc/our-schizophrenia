import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react'
import './Main.css'

const Main = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let chat = document.getElementById('chat')

    const fetchMessages = async () => {
      const response = await fetch("/message")
      const data = await response.json();

      data.forEach((msg: any) => {
        let p = document.createElement('p');
        p.textContent = `${msg.username}: ${msg.message}`;

        chat?.appendChild(p);
      })
    }

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

  const sendMessageOnClick = () => sendMessage(JSON.stringify({"username":username, "message":message}))

  return (
    <>
      <section>
        <h1>HAHAHA</h1>
        <div className='send-form'>
          <input type="text" name="username" id="username" placeholder='username' onChange={(e) => {setUsername(e.target.value)}}/>
          <input type="text" name="message" id="message" placeholder='message' onChange={(e) => {setMessage(e.target.value)}}/>
          <button onClick={sendMessageOnClick}>Send</button>
        </div>
        <div id='chat'></div>
      </section>
    </>
  )
}

export default Main;