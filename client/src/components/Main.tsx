import useWebSocket from 'react-use-websocket'
import { useState } from 'react'
import './Main.css'

const Main = () => {
  const [message, setMessage] = useState("");

  const socketURL = "ws://192.168.137.22:3000/chat";
  const { sendMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('Connected'),
    onMessage: (msg) => {
      let chat = document.getElementById('chat')

      let p = document.createElement('p');
      p.textContent = msg.data;

      chat?.appendChild(p);
    },
  });

  const sendMessageOnClick = () => sendMessage(message)

  return (
    <>
      <section>
        <h1>HAHAHA</h1>
        <div>
          <input type="text" name="message" id="message" onChange={(e) => {setMessage(e.target.value)}}/>
          <button onClick={sendMessageOnClick}>Send</button>
        </div>
        <div id='chat'></div>
      </section>
    </>
  )
}

export default Main;