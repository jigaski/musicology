import { useState } from 'react'
import JSZip from 'jszip'

function Upload() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleDrop(event) {
    event.preventDefault()
    setLoading(true)
    const file = event.dataTransfer.files[0]
    console.log(file.name, file.type, file.size)
    const zip = await JSZip.loadAsync(file)
    
    const audioFiles = Object.values(zip.files).filter(f => 
      f.name.includes('Streaming_History_Audio') && f.name.endsWith('.json')
    )

    const allEntries = []
    for (const audioFile of audioFiles) {
      const text = await audioFile.async('text')
      const parsed = JSON.parse(text)
      allEntries.push(...parsed)
    }

    allEntries.sort((a, b) => new Date(a.ts) - new Date(b.ts))

    setData(allEntries)
    setLoading(false)
    console.log(allEntries)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <h1>Musicology</h1>
      <div>Drop your Spotify zip file here</div>
      {loading && <p>Processing...</p>}
      {data && <p>Loaded {data.length} entries from 2016 to 2026</p>}
    </div>
  )
}

export default Upload