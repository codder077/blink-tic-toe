"use client"

import { useTheme } from "../components/theme-provider"
import { Toggle, GooeyFilter } from "../components/ui/toggle"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (checked) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="relative">
      <GooeyFilter />
      <Toggle checked={theme === "dark"} onCheckedChange={handleThemeChange} variant="warning" showIcons={true} />
      <span className="sr-only">Toggle theme</span>
    </div>
  )
}
