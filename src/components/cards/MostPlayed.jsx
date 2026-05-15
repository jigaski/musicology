import { useEffect, useState } from 'react'
import StatsCard from './StatsCard'

function MostPlayed({ mostPlays, mostMinutes, className = '' }) {
  const [playsImage, setPlaysImage] = useState(null)
  const [minutesImage, setMinutesImage] = useState(null)

  const playsTrack = mostPlays.entry
  const minutesTrack = mostMinutes.entry

  function cleanName(name) {
    return name
      .replace(/\s*-\s*(remix|edit|version|remaster)/gi, '')
      .trim()
  }

async function fetchArtwork(artist, albumName, setImage) {
  try {
    const query = encodeURIComponent(`${artist} ${albumName}`)
    const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
    const data = await res.json()
    const image = data.data?.[0]?.cover_xl
    if (image) setImage(image)
  } catch (err) {
    console.error('Failed to fetch artwork:', err)
  }
}

useEffect(() => {
  fetchArtwork(playsTrack.master_metadata_album_artist_name, playsTrack.master_metadata_album_album_name, setPlaysImage)
fetchArtwork(minutesTrack.master_metadata_album_artist_name, minutesTrack.master_metadata_album_album_name, setMinutesImage)
}, [playsTrack, minutesTrack])

  const hoursListened = Math.round(mostMinutes.ms_played / 1000 / 60 / 60)

  return (
    <StatsCard className={className}>
      <p className="stats-card-label">
        YOUR MOST PLAYED
      </p>

      <div className="most-played-inner">
        <section className="most-played-panel">
          <p className="most-played-panel-label">MOST PLAYS</p>
          {playsImage && (
            <img
              src={playsImage}
              alt={playsTrack.master_metadata_track_name}
              className="stats-card-image most-played-image"
            />
          )}
          <h2 className="stats-card-title">{playsTrack.master_metadata_track_name}</h2>
          <p className="stats-card-subtitle">{playsTrack.master_metadata_album_artist_name}</p>
          <p className="stats-card-note">{playsTrack.master_metadata_album_album_name}</p>
          <p className="stats-card-note">played {mostPlays.count} times</p>
        </section>

        <section className="most-played-panel">
          <p className="most-played-panel-label">MOST TIME</p>
          {minutesImage && (
            <img
              src={minutesImage}
              alt={minutesTrack.master_metadata_track_name}
              className="stats-card-image most-played-image"
            />
          )}
          <h2 className="stats-card-title">{minutesTrack.master_metadata_track_name}</h2>
          <p className="stats-card-subtitle">{minutesTrack.master_metadata_album_artist_name}</p>
          <p className="stats-card-note">{minutesTrack.master_metadata_album_album_name}</p>
          <p className="stats-card-note">{hoursListened} hours of listening</p>
        </section>
      </div>
    </StatsCard>
  )
}

export default MostPlayed