// stats.js

export function getMostPlayed(entries) {
  const counts = {}
  const msPlayed = {}
  const trackMap = {}

  entries.forEach(entry => {
    if (!entry.master_metadata_track_name) return
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`

    counts[key] = (counts[key] || 0) + 1
    msPlayed[key] = (msPlayed[key] || 0) + entry.ms_played

    if (!trackMap[key]) trackMap[key] = entry
  })

  const mostPlaysKey = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
  const mostMinutesKey = Object.entries(msPlayed).sort((a, b) => b[1] - a[1])[0][0]
  const playsTrack = trackMap[mostPlaysKey]
  const minutesTrack = trackMap[mostMinutesKey]
  return {
    mostPlays: {
      entry: trackMap[mostPlaysKey],
      count: counts[mostPlaysKey]
    },
    mostMinutes: {
      entry: trackMap[mostMinutesKey],
      ms_played: msPlayed[mostMinutesKey]
    }
  }
}


export function getMostSkipped(entries) {
  const skipCounts = {}
  const skipMs = {}
  const totalPlays = {}
  const trackMap = {}

  entries.forEach(entry => {
    if (!entry.master_metadata_track_name) return
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
    totalPlays[key] = (totalPlays[key] || 0) + 1
    if (!trackMap[key]) trackMap[key] = entry
    const isSkip = entry.skipped === true || entry.reason_end === 'fwdbtn'
    if (!isSkip) return
    skipCounts[key] = (skipCounts[key] || 0) + 1
    skipMs[key] = (skipMs[key] || 0) + entry.ms_played
  })

  const topSkip = Object.entries(skipCounts).sort((a, b) => b[1] - a[1])[0]
  if (!topSkip) return null

  const avgMs = Math.round(skipMs[topSkip[0]] / topSkip[1])

  return {
    entry: trackMap[topSkip[0]],
    skipCount: topSkip[1],
    avgSkipMs: avgMs,
    totalPlays: totalPlays[topSkip[0]]
  }
}

export function computeStats(entries) {
  return {
    firstSong: entries[0],
    mostPlayed: getMostPlayed(entries),
    mostSkipped: getMostSkipped(entries)
  }
}