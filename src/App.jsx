import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import HomePage from "./pages/HomePage"
import GameSetupPage from "./pages/GameSetupPage"
import GameBoardPage from "./pages/GameBoardPage"
import { EmojiProvider } from "./contexts/EmojiContext"

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <EmojiProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/setup" element={<GameSetupPage />} />
            <Route path="/game" element={<GameBoardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </EmojiProvider>
    </ThemeProvider>
  )
}

export default App
