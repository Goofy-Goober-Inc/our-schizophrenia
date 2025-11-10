import useWebSocket from 'react-use-websocket'
import { useCallback } from 'react'
import './Main.css'

const Main = () => {
  const socketURL = "ws://localhost:3000/chat";
  const { sendMessage } = useWebSocket(socketURL, {
    onOpen: () => console.log('Connected'),
  });

  const sendMessageOnClick = useCallback(() => sendMessage('Hello'), [])

  return (
    <>
      <section>
        <h1>HAHAHA</h1>
        <button onClick={sendMessageOnClick}>Say Hello to server</button>
        <div id="shit"></div>
      </section>
    </>
  )
}

export default Main;