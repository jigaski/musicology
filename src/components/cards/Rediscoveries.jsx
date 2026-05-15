import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function Rediscoveries({ rediscoveries }) {
  const [currentIndex, setCurrentIndex] = useState(() => {
    return Array.isArray(rediscoveries) && rediscoveries.length
      ? Math.floor(Math.random() * rediscoveries.length)
      : 0
  })
  const [visible, setVisible] = useState(true)
  const [artwork, setArtwork] = useState(null)

  useEffect(() => {
    if (!Array.isArray(rediscoveries) || rediscoveries.length === 0) return
    setCurrentIndex(Math.floor(Math.random() * rediscoveries.length))
  }, [rediscoveries])

  const selected = Array.isArray(rediscoveries) && rediscoveries.length
    ? rediscoveries[currentIndex]
    : null
  const entry = selected?.entry

  useEffect(() => {
    if (!entry) return

    setArtwork(null)

    async function fetchArtwork() {
      try {
        const query = encodeURIComponent(
          `${entry.master_metadata_album_artist_name} ${entry.master_metadata_track_name}`,
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
  }, [entry])

  if (!entry) return null

  function handleClick() {
    if (!Array.isArray(rediscoveries) || rediscoveries.length < 2) return

    setVisible(false)
    const nextIndex = (() => {
      const length = rediscoveries.length
      let candidate = currentIndex
      while (candidate === currentIndex) {
        candidate = Math.floor(Math.random() * length)
      }
      return candidate
    })()

    window.setTimeout(() => {
      setCurrentIndex(nextIndex)
      setVisible(true)
    }, 150)
  }

  return (
    <StatsCard className="stats-card-rediscovery" onClick={handleClick}>
      <div className={`rediscovery-content ${visible ? 'visible' : 'hidden'}`}>
        <p className="stats-card-label">A REDISCOVERY</p>
        {artwork && (
          <img
            src={artwork}
            alt={`${entry.master_metadata_track_name} artwork`}
            className="stats-card-image"
          />
        )}
        <h2 className="stats-card-title">{entry.master_metadata_track_name}</h2>
        <p className="stats-card-subtitle">{entry.master_metadata_album_artist_name}</p>
        <p className="stats-card-note">{entry.master_metadata_album_album_name}</p>
        <p className="stats-card-meta">
          you came back after {selected.gapDays} days
        </p>
      </div>
    </StatsCard>
  )
}

export default Rediscoveries
