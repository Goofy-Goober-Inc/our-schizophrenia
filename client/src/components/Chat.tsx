import { useEffect } from 'react'
import './Chat.css'
import SendForm, { showMessages } from './SendForm'


type Msg = {
  username: string,
  message: string,
  image: URL | String
  }

const Main = () => {
  useEffect(() => {
    let chat = document.getElementById('chat')

    const fetchMessages = async () => {
      const response = await fetch("/api/message")
      const data = await response.json();

      data.forEach((msg: Msg) => { showMessages(msg, chat) })
    }

    fetchMessages();

  }, [])

  return (
    <>
      <section>
        <div>
          <div id='chat'></div>
          <SendForm />
        </div>
      </section>
    </>
  )
}

export default Main;