import { useState } from 'react'
import './Login.css'

const AddEmote = () => {
  const [emoteName, setEmoteName] = useState('');
  const [emoteUrl, setEmoteUrl] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch('/api/emote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ emoteName, emoteUrl })
    })
    // if(response.status === 200) window.location.href = "/"

    const emoteNameElement = document.getElementById("emoteName") as HTMLInputElement | null;
    const emoteUrlElement = document.getElementById("emoteUrl") as HTMLInputElement | null;

    if(emoteNameElement) emoteNameElement.value = ""
    if(emoteUrlElement) emoteUrlElement.value = ""

    setEmoteName("")
    setEmoteUrl("")
  }

  return (
    <section id='main'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="emoteName" id="emoteName" placeholder='Emote name' onChange={(e) => {setEmoteName(e.target.value)}}/>
        <input type="text" name="emoteUrl" id="emoteUrl" placeholder='Emote url' onChange={(e) => {setEmoteUrl(e.target.value)}}/>
        <button type="submit">Login</button>
      </form>
    </section>
  )
}

export default AddEmote;