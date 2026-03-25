import { useState } from 'react'
import JSZip from 'jszip'
import { computeStats } from './utils/stats'
import FirstSong from './FirstSong'
import MostPlayed from './MostPlayed'
import MostSkipped from './MostSkipped'

function Upload() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  async function handleDrop(event) {
    event.preventDefault()
    setLoading(true)
    const file = event.dataTransfer.files[0]
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
    console.log('mostSkipped:', computeStats(allEntries).mostSkipped)
    setStats(computeStats(allEntries))
    setLoading(false)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  return (
    <div onDrop={handleDrop} onDragOver={handleDragOver}>
      <h1>Musicology</h1>
      <div>Drop your Spotify zip file here</div>
      {loading && <p>Processing...</p>}
      {stats && <p>Loaded entries from 2016 to 2026</p>}
      {stats && <FirstSong entry={stats.firstSong} />}
      {stats && <MostPlayed mostPlays={stats.mostPlayed.mostPlays} mostMinutes={stats.mostPlayed.mostMinutes} />}
      {stats && <MostSkipped track={stats.mostSkipped.track} skipCount={stats.mostSkipped.skipCount} avgSkipMs={stats.mostSkipped.avgSkipMs} totalPlays={stats.mostSkipped.totalPlays} />}
    </div>
  )
}

export default Upload