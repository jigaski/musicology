import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function RageQuits({ entries, className = '' }) {
  const [artwork, setArtwork] = useState(null)

  const rageQuit = (() => {
    if (!Array.isArray(entries) || entries.length === 0) return null

    const playCounts = {}
    const totalMs = {}
    const trackMap = {}
    const invalidTrack = {}

    entries.forEach(entry => {
      if (!entry.master_metadata_track_name) return
      const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
      const ms = typeof entry.ms_played === 'number' ? entry.ms_played : 0
      const isSkip = entry.skipped === true || entry.reason_end === 'fwdbtn'
      const isUnder5 = ms < 5000

      playCounts[key] = (playCounts[key] || 0) + 1
      totalMs[key] = (totalMs[key] || 0) + ms
      if (!trackMap[key]) trackMap[key] = entry

      if (!isSkip || !isUnder5) {
        invalidTrack[key] = true
      }
    })

    const candidateKeys = Object.keys(playCounts).filter(key => !invalidTrack[key])
    if (candidateKeys.length === 0) return null

    candidateKeys.sort((a, b) => {
      if (playCounts[b] !== playCounts[a]) return playCounts[b] - playCounts[a]
      return totalMs[a] - totalMs[b]
    })

    const selectedKey = candidateKeys[0]

    return {
      entry: trackMap[selectedKey],
      plays: playCounts[selectedKey],
      totalMs: totalMs[selectedKey],
    }
  })()

  const selectedEntry = rageQuit?.entry

  useEffect(() => {
    if (!selectedEntry) return

    async function fetchArtwork() {
      try {
        const query = encodeURIComponent(
          `${selectedEntry.master_metadata_album_artist_name} ${selectedEntry.master_metadata_track_name}`,
        )
        const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
        const data = await res.json()
        const image = data.data?.[0]?.cover_xl
        if (image) setArtwork(image)
      } catch (err) {
        console.error('Failed to fetch artwork:', err)
      }
    }

    fetchArtwork()
  }, [selectedEntry])

  if (!selectedEntry) return null

  const date = new Date(selectedEntry.ts)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <StatsCard className={className}>
      <p className="stats-card-label">YOUR RAGE QUIT</p>
      {artwork && (
        <img
          src={artwork}
          alt={`${selectedEntry.master_metadata_track_name} artwork`}
          className="stats-card-image"
        />
      )}
      <h2 className="stats-card-title">{selectedEntry.master_metadata_track_name}</h2>
      <p className="stats-card-subtitle">{selectedEntry.master_metadata_album_artist_name}</p>
      <p className="stats-card-note">{selectedEntry.master_metadata_album_album_name}</p>
      <p className="stats-card-meta">{formattedDate} at {formattedTime}</p>
      <p className="stats-card-small">
        skipped under 5s every time · {rageQuit.plays} play{rageQuit.plays === 1 ? '' : 's'}
      </p>
    </StatsCard>
  )
}

export default RageQuits
