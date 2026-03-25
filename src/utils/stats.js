export function getMostPlayed(entries) {
  const counts = {}
  const msPlayed = {}
  entries.forEach(entry => {
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
    if (!entry.master_metadata_track_name) return
    counts[key] = (counts[key] || 0) + 1
    msPlayed[key] = (msPlayed[key] || 0) + entry.ms_played
  })
  return {
    mostPlays: Object.entries(counts).sort((a, b) => b[1] - a[1])[0],
    mostMinutes: Object.entries(msPlayed).sort((a, b) => b[1] - a[1])[0]
  }
}

export function getMostSkipped(entries) {
  const skipCounts = {}
  const skipMs = {}
  const totalPlays = {}

  entries.forEach(entry => {
    if (!entry.master_metadata_track_name) return
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
    totalPlays[key] = (totalPlays[key] || 0) + 1
    const isSkip = entry.skipped === true || entry.reason_end === 'fwdbtn'
    if (!isSkip) return
    skipCounts[key] = (skipCounts[key] || 0) + 1
    skipMs[key] = (skipMs[key] || 0) + entry.ms_played
  })

  const topSkip = Object.entries(skipCounts).sort((a, b) => b[1] - a[1])[0]
  const avgMs = Math.round(skipMs[topSkip[0]] / topSkip[1])
  
  return {
    track: topSkip[0],
    skipCount: topSkip[1],
    avgSkipMs: avgMs,
    totalPlays: totalPlays[topSkip[0]]
  }
}

export function computeStats(entries) {
  return {
    firstSong: entries[0],
    mostPlayed: getMostPlayed(entries),
    mostSkipped: getMostSkipped(entries),
  }
}