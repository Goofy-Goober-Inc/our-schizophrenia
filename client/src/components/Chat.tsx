import useWebSocket from 'react-use-websocket'
import { useState, useEffect } from 'react'
import './Chat.css'

const Main = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [imageUri, setImageUri] = useState("");
  const [auth, setAuth] = useState(false);

  // const isImageURI = async (imgURI: any) => {
  //   const response = await fetch(imgURI)
  //   if (response.status === 404) imgURI = "";
  //   return imgURI;
  //   }

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
        // msg.image = isImageURI(msg.image);
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message'

        let img = document.createElement('img')
        img.src = `${msg.image}`;
        img.className = 'image'

        let p = document.createElement('p');
        p.textContent = `${msg.username}: ${msg.message}`;

        messageDiv.appendChild(p);
        if (msg.image !== '') messageDiv.appendChild(img)

        chat?.appendChild(messageDiv)
        chat?.scrollTo(0, chat.scrollHeight)
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
      let messageDiv = document.createElement('div')
      messageDiv.className = 'message'

      // let imageURI = isImageURI(JSON.parse(msg.data).image);

      let p = document.createElement('p');
      p.textContent = `${JSON.parse(msg.data).username}: ${JSON.parse(msg.data).message}`;

      let img = document.createElement('img')
      img.src = `${JSON.parse(msg.data).image}`;
      img.className = 'image'

      messageDiv.appendChild(p);
      if (JSON.parse(msg.data).image !== "") messageDiv.appendChild(img);

      chat?.appendChild(messageDiv);
      chat?.scrollTo(0, chat.scrollHeight)
    },
  });

  const sendMessageOnClick = () => {
    auth ? sendMessage(JSON.stringify({"username":username, "message":message, "image":imageUri})) : null
    const messageInput = document.getElementById("message") as HTMLInputElement | null;
    if (messageInput) messageInput.value = "";
    const imageInput = document.getElementById("image") as HTMLInputElement | null;
    if (imageInput) imageInput.value = "";
    setMessage("")
    setImageUri("")
    }

  return (
    <>
      <section>
        <h1>Username: {username}</h1>
        <h1>Auth: {auth === true ? "true" : "false"}</h1>
        { auth === true ? (
        <div className='send-form'>
          <input type="text" name="message" id="message" placeholder='message' onChange={(e) => {setMessage(e.target.value)}} onKeyUp={(e) => {if(e.key === "Enter") sendMessageOnClick()}}/>
          <input type="text" name="image" id="image" placeholder='IMG URI' onChange={(e) => {setImageUri(e.target.value)}} onKeyUp={(e) => {if(e.key === "Enter") sendMessageOnClick()}}/>
          <button onClick={sendMessageOnClick} id='sendButton'>Send</button>
        </div>
        ) : null}
        <div id='chat'></div>
      </section>
    </>
  )
}

export default Main;