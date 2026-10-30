'use client'

import { useEffect } from 'react'

// Development only: lists the facts in chewpack-docs.json still marked to verify.
export function VerifyNotes ({ notes }: { notes: { id: string, verify: string[] }[] }) {
  useEffect(() => {
    if (!notes.length) return
    console.groupCollapsed(`[docs] ${notes.length} features have facts to verify`)
    for (const note of notes) console.info(note.id, note.verify)
    console.groupEnd()
  }, [notes])

  return null
}
