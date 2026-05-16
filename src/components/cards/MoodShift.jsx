import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'
import { useRandomCycle } from '../../utils/useRandomCycle'

async function fetchArtwork(artist, album, track, setImage) {
  try {
    const query = encodeURIComponent(`${artist} ${album}`)
    const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
    const data = await res.json()
    let image = data.data?.[0]?.cover_xl

    if (!image) {
      const fallbackQuery = encodeURIComponent(`${artist} ${track}`)
      const fallback = await fetch(`/deezer/search?q=${fallbackQuery}&limit=1`)
      const fallbackData = await fallback.json()
      image = fallbackData.data?.[0]?.album?.cover_xl
    }

    if (image) setImage(image)
  } catch (err) {
    console.error('Failed to fetch artwork:', err)
  }
}

function MoodShift({ morningEvening, className = '' }) {
  const { current: morningItem, visible: morningVisible, next: nextMorning } = useRandomCycle(morningEvening?.morning)
  const { current: eveningItem, visible: eveningVisible, next: nextEvening } = useRandomCycle(morningEvening?.evening)

  const [morningImage, setMorningImage] = useState(null)
  const [eveningImage, setEveningImage] = useState(null)

  const morningTrack = morningItem?.entry
  const eveningTrack = eveningItem?.entry

  useEffect(() => {
    if (!morningTrack) return
    setMorningImage(null)
    fetchArtwork(
      morningTrack.master_metadata_album_artist_name,
      morningTrack.master_metadata_album_album_name,
      morningTrack.master_metadata_track_name,
      setMorningImage,
    )
  }, [morningTrack])

  useEffect(() => {
    if (!eveningTrack) return
    setEveningImage(null)
    fetchArtwork(
      eveningTrack.master_metadata_album_artist_name,
      eveningTrack.master_metadata_album_album_name,
      eveningTrack.master_metadata_track_name,
      setEveningImage,
    )
  }, [eveningTrack])

  if (!morningTrack || !eveningTrack) return null

  function handleClick() {
    nextMorning()
    nextEvening()
  }

  return (
    <StatsCard
      className={['stats-card-rediscovery', className].filter(Boolean).join(' ')}
      onClick={handleClick}
    >
      <p className="stats-card-label">mood shift</p>

      <div className="most-played-inner">
        <section className="most-played-panel">
          <p className="most-played-panel-label">morning</p>
          <div className={`rediscovery-content ${morningVisible ? 'visible' : 'hidden'}`}>
            {morningImage && (
              <img
                src={morningImage}
                alt={morningTrack.master_metadata_track_name}
                className="stats-card-image most-played-image"
              />
            )}
            <h2 className="stats-card-title">{morningTrack.master_metadata_track_name}</h2>
            <p className="stats-card-subtitle">{morningTrack.master_metadata_album_artist_name}</p>
            <p className="stats-card-note">{morningTrack.master_metadata_album_album_name}</p>
          </div>
        </section>

        <section className="most-played-panel">
          <p className="most-played-panel-label">evening</p>
          <div className={`rediscovery-content ${eveningVisible ? 'visible' : 'hidden'}`}>
            {eveningImage && (
              <img
                src={eveningImage}
                alt={eveningTrack.master_metadata_track_name}
                className="stats-card-image most-played-image"
              />
            )}
            <h2 className="stats-card-title">{eveningTrack.master_metadata_track_name}</h2>
            <p className="stats-card-subtitle">{eveningTrack.master_metadata_album_artist_name}</p>
            <p className="stats-card-note">{eveningTrack.master_metadata_album_album_name}</p>
          </div>
        </section>
      </div>
    </StatsCard>
  )
}

export default MoodShift
