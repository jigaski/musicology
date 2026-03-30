import { useEffect, useState } from 'react'

function MostPlayed({ mostPlays, mostMinutes }) {
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
    <div style={{
      border: '1px solid #333',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      margin: '16px auto',
      textAlign: 'center'
    }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '16px' }}>
        YOUR MOST PLAYED
      </p>

      <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>MOST PLAYS</p>
      {playsImage && (
        <img src={playsImage} alt={playsTrack.master_metadata_track_name}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
      )}
      <h2 style={{ margin: '0 0 4px' }}>{playsTrack.master_metadata_track_name}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{playsTrack.master_metadata_album_artist_name}</p>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
        played {mostPlays.count} times
      </p>

      <p style={{ color: '#666', fontSize: '11px', marginBottom: '4px' }}>MOST TIME</p>
      {minutesImage && (
        <img src={minutesImage} alt={minutesTrack.master_metadata_track_name}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
      )}
      <h2 style={{ margin: '0 0 4px' }}>{minutesTrack.master_metadata_track_name}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{minutesTrack.master_metadata_album_artist_name}</p>
      <p style={{ color: '#888', fontSize: '13px' }}>
        {hoursListened} hours of listening
      </p>
    </div>
  )
}

export default MostPlayed