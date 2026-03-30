import { useEffect, useState } from 'react'

function MostSkipped({ entry, skipCount, avgSkipMs, totalPlays }) {
  const [image, setImage] = useState(null)

  const title = entry.master_metadata_track_name
  const artist = entry.master_metadata_album_artist_name
  const albumName = entry.master_metadata_album_album_name
  const avgSeconds = Math.round(avgSkipMs / 1000)
  const avgMinutes = Math.floor(avgSeconds / 60)
  const avgRemainder = avgSeconds % 60

  useEffect(() => {
    async function fetchArtwork() {
      try {
        const query = encodeURIComponent(`${artist} ${albumName}`)
        const res = await fetch(`/deezer/search/album?q=${query}&limit=1`)
        const data = await res.json()
        const img = data.data?.[0]?.cover_xl
        if (img) setImage(img)
      } catch (err) {
        console.error('Failed to fetch artwork:', err)
      }
    }
    fetchArtwork()
  }, [entry])

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
        YOUR MOST SKIPPED
      </p>
      {image && (
        <img src={image} alt={title}
          style={{ width: '100%', borderRadius: '12px', marginBottom: '16px' }} />
      )}
      <h2 style={{ margin: '0 0 4px' }}>{title}</h2>
      <p style={{ color: '#aaa', margin: '0 0 4px' }}>{artist}</p>
      <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
        played {totalPlays} times · skipped {skipCount} of them
      </p>
      <p style={{ color: '#888', fontSize: '13px' }}>
        you tend to quit around {avgMinutes}:{avgRemainder.toString().padStart(2, '0')}
      </p>
    </div>
  )
}

export default MostSkipped