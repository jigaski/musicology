import { useEffect, useMemo, useState } from 'react'
import StatsCard from './StatsCard'
import { useRandomCycle } from '../../utils/useRandomCycle'

function RageQuits({ entries, className = '' }) {
  const [artwork, setArtwork] = useState(null)

  const rageQuits = useMemo(() => {
    if (!Array.isArray(entries) || entries.length === 0) return []

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
    candidateKeys.sort((a, b) => {
      if (playCounts[b] !== playCounts[a]) return playCounts[b] - playCounts[a]
      return totalMs[a] - totalMs[b]
    })

    return candidateKeys.map(key => ({
      entry: trackMap[key],
      plays: playCounts[key],
      totalMs: totalMs[key],
    }))
  }, [entries])

  const { current, visible, next } = useRandomCycle(rageQuits)

  const selectedEntry = current?.entry

  useEffect(() => {
    if (!selectedEntry) return
    setArtwork(null)

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

  return (
    <StatsCard
      className={['stats-card-rediscovery', className].filter(Boolean).join(' ')}
      onClick={next}
    >
      <div className={`rediscovery-content ${visible ? 'visible' : 'hidden'}`}>
        <p className="stats-card-label">YOUR RAGE QUITS</p>
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
        <p className="stats-card-small">
          skipped under 5s every time · {current.plays} play{current.plays === 1 ? '' : 's'}
        </p>
      </div>
    </StatsCard>
  )
}

export default RageQuits
