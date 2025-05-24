"use client"

import { createContext, useState, useEffect } from "react"

export const EmojiContext = createContext()

export function EmojiProvider({ children }) {
  const [gameSettings, setGameSettings] = useState(null)

  // For debugging
  useEffect(() => {
    if (gameSettings) {
      console.log("Game settings updated:", gameSettings)
    }
  }, [gameSettings])

  return <EmojiContext.Provider value={{ gameSettings, setGameSettings }}>{children}</EmojiContext.Provider>
}
