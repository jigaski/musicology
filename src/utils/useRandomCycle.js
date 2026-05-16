import { useEffect, useRef, useState } from 'react'

export function useRandomCycle(items) {
  const [index, setIndex] = useState(() =>
    Array.isArray(items) && items.length
      ? Math.floor(Math.random() * items.length)
      : 0
  )
  const [visible, setVisible] = useState(true)
  const indexRef = useRef(index)

  useEffect(() => {
    if (!Array.isArray(items) || items.length === 0) return
    const i = Math.floor(Math.random() * items.length)
    indexRef.current = i
    setIndex(i)
    setVisible(true)
  }, [items])

  function next() {
    if (!Array.isArray(items) || items.length < 2) return
    const prev = indexRef.current
    setVisible(false)
    window.setTimeout(() => {
      let candidate
      do {
        candidate = Math.floor(Math.random() * items.length)
      } while (candidate === prev)
      indexRef.current = candidate
      setIndex(candidate)
      setVisible(true)
    }, 250)
  }

  return {
    current: Array.isArray(items) && items.length ? items[index] : null,
    visible,
    next,
  }
}
