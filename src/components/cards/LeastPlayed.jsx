import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function LeastPlayed({ entries, className = '' }) {
  const [artwork, setArtwork] = useState(null)

  const leastPlayed = (() => {
    if (!Array.isArray(entries) || entries.length === 0) return null

    const totalMs = {}
    const trackMap = {}
    const earliestSkip = {}

    entries.forEach(entry => {
      if (!entry.master_metadata_track_name) return
      const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
      const ms = typeof entry.ms_played === 'number' ? entry.ms_played : 0
      totalMs[key] = (totalMs[key] || 0) + ms
      if (!trackMap[key]) trackMap[key] = entry

      const isSkip = entry.skipped === true || entry.reason_end === 'fwdbtn'
      if (!isSkip) return

      if (typeof entry.ms_played === 'number') {
        earliestSkip[key] = Math.min(
          earliestSkip[key] ?? Number.POSITIVE_INFINITY,
          entry.ms_played,
        )
      }
    })

    const minTotal = Math.min(...Object.values(totalMs))
    const candidateKeys = Object.entries(totalMs)
      .filter(([, total]) => total === minTotal)
      .map(([key]) => key)

    if (candidateKeys.length === 0) return null

    let selectedKey = candidateKeys[0]
    let bestSkipMs = earliestSkip[selectedKey] ?? Number.POSITIVE_INFINITY

    for (const key of candidateKeys) {
      const skipMs = earliestSkip[key] ?? Number.POSITIVE_INFINITY
      if (skipMs < bestSkipMs) {
        bestSkipMs = skipMs
        selectedKey = key
      }
    }

    return {
      entry: trackMap[selectedKey],
      totalMs: totalMs[selectedKey],
      earliestSkipMs: Number.isFinite(bestSkipMs) ? bestSkipMs : null,
    }
  })()

  const selectedEntry = leastPlayed?.entry

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

  const skipLabel = leastPlayed.earliestSkipMs != null
    ? `earliest skip at ${Math.round(leastPlayed.earliestSkipMs / 1000)}s`
    : 'no skip data'

  return (
    <StatsCard className={className}>
      <p className="stats-card-label">YOUR LEAST PLAYED</p>
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
        listened {Math.round(leastPlayed.totalMs / 1000)}s · {skipLabel}
      </p>
    </StatsCard>
  )
}

export default LeastPlayed
