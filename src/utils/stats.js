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

export function getRediscoveries(entries) {
  const groups = {}

  entries.forEach(entry => {
    if (!entry.master_metadata_track_name) return
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`
    groups[key] = groups[key] || []
    groups[key].push(entry)
  })

  return Object.entries(groups).flatMap(([, trackEntries]) => {
    if (trackEntries.length < 5) return []

    const sorted = [...trackEntries].sort((a, b) => new Date(a.ts) - new Date(b.ts))
    const sessions = [[sorted[0]]]

    for (let i = 1; i < sorted.length; i++) {
      const previous = new Date(sorted[i - 1].ts)
      const current = new Date(sorted[i].ts)
      const gapDays = (current - previous) / (1000 * 60 * 60 * 24)
      if (gapDays >= 90) {
        sessions.push([sorted[i]])
      } else {
        sessions[sessions.length - 1].push(sorted[i])
      }
    }

    if (sessions.length < 2) return []
    if (sorted.length < 5) return [] 

    for (let idx = 1; idx < sessions.length; idx++) {
      const session = sessions[idx]
      if (session.length >= 1) {
        const gapStart = new Date(sessions[0][sessions[0].length - 1].ts)
        const gapEnd = new Date(session[0].ts)
        const gapDays = Math.floor((gapEnd - gapStart) / (1000 * 60 * 60 * 24))
        return [{
          entry: session[0],
          gapDays
        }]
      }
    }

    return []
  })
}

export function getMorningEvening(entries) {
  const counts = {
    morning: {},
    evening: {}
  }
  const trackMap = {
    morning: {},
    evening: {}
  }

  entries.forEach(entry => {
    if (!entry.master_metadata_track_name) return
    const hour = new Date(entry.ts).getHours()
    const key = `${entry.master_metadata_track_name} - ${entry.master_metadata_album_artist_name}`

    if (hour >= 5 && hour <= 11) {
      counts.morning[key] = (counts.morning[key] || 0) + 1
      if (!trackMap.morning[key]) trackMap.morning[key] = entry
    } else if (hour >= 12 && hour <= 18) {
      counts.evening[key] = (counts.evening[key] || 0) + 1
      if (!trackMap.evening[key]) trackMap.evening[key] = entry
    }
  })

  const getTop = bucket => {
    const entryList = Object.entries(counts[bucket])
    if (entryList.length === 0) return null
    const [topKey] = entryList.sort((a, b) => b[1] - a[1])[0]
    return {
      entry: trackMap[bucket][topKey],
      count: counts[bucket][topKey]
    }
  }

  return {
    morning: getTop('morning'),
    evening: getTop('evening')
  }
}

export function computeStats(entries) {
  return {
    firstSong: entries[0],
    mostPlayed: getMostPlayed(entries),
    mostSkipped: getMostSkipped(entries),
    morningEvening: getMorningEvening(entries),
    allEntries: entries,
    rediscoveries: getRediscoveries(entries)
  }
}