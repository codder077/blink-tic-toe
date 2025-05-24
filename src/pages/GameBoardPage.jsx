"use client"

import { useState, useEffect, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { SocialButton } from "../components/ui/social-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Progress } from "../components/ui/progress"
import ThemeToggle from "../components/ThemeToggle"
import { EmojiContext } from "../contexts/EmojiContext"
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  RotateCcw,
  Zap,
  Trophy,
  Sparkles,
  Crown,
  Target,
  Timer,
  Flame,
  Star,
} from "lucide-react"

// Sound effects
const moveSound = new Audio("/sounds/move.mp3")
const winSound = new Audio("/sounds/win.mp3")
const tieSound = new Audio("/sounds/tie.mp3")

// Constants
const QUICK_MOVE_TIME = 10 // seconds
const QUICK_MOVE_BONUS = 5 // seconds

export default function GameBoardPage() {
  const navigate = useNavigate()
  const { gameSettings } = useContext(EmojiContext)

  const [board, setBoard] = useState(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState(1) // 1 for player 1, 2 for player 2
  const [player1Moves, setPlayer1Moves] = useState([])
  const [player2Moves, setPlayer2Moves] = useState([])
  const [currentEmoji, setCurrentEmoji] = useState(null)
  const [winner, setWinner] = useState(null)
  const [winningLine, setWinningLine] = useState([])
  const [showHelp, setShowHelp] = useState(false)

  // Timer related state
  const [gameTime, setGameTime] = useState(null) // Combined timer for non-separate mode
  const [player1Time, setPlayer1Time] = useState(null)
  const [player2Time, setPlayer2Time] = useState(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeIsUp, setTimeIsUp] = useState(false)
  const timerRef = useRef(null)

  // Track whether we're using separate timers
  const [usingSeparateTimers, setUsingSeparateTimers] = useState(false)

  // Turn timer for quick move bonus
  const [turnTimeRemaining, setTurnTimeRemaining] = useState(QUICK_MOVE_TIME)
  const [showPlayer1Bonus, setShowPlayer1Bonus] = useState(false)
  const [showPlayer2Bonus, setShowPlayer2Bonus] = useState(false)
  const turnTimerRef = useRef(null)
  const turnStartTimeRef = useRef(null)

  useEffect(() => {
    console.log("GameBoardPage mounted, gameSettings:", gameSettings)

    if (!gameSettings) {
      console.log("No game settings found, redirecting to setup")
      navigate("/setup")
      return
    }

    // Initialize the game
    console.log("Initializing game with settings:", gameSettings)
    setCurrentEmoji(getRandomEmoji(1))

    // Initialize timers if game has a duration
    if (gameSettings.gameDuration) {
      console.log(
        "Setting up timers with duration:",
        gameSettings.gameDuration,
        "separateTimers:",
        gameSettings.separateTimers,
      )

      // Store the timer mode for reference
      setUsingSeparateTimers(gameSettings.separateTimers)

      if (gameSettings.separateTimers) {
        // Separate timers for each player
        setPlayer1Time(gameSettings.player1.timeRemaining)
        setPlayer2Time(gameSettings.player2.timeRemaining)
        setGameTime(null) // Not using combined timer
        console.log("Using separate timers:", gameSettings.player1.timeRemaining, gameSettings.player2.timeRemaining)
      } else {
        // Single shared timer
        setGameTime(gameSettings.gameDuration * 60)
        setPlayer1Time(null) // Not using separate timers
        setPlayer2Time(null) // Not using separate timers
        console.log("Using shared timer:", gameSettings.gameDuration * 60)
      }

      setIsTimerRunning(true)
    }

    // Initialize turn timer
    if (gameSettings.enableQuickMoveBonus) {
      console.log("Setting up quick move bonus timer")
      turnStartTimeRef.current = Date.now()
      setTurnTimeRemaining(QUICK_MOVE_TIME)
      startTurnTimer()
    }
  }, [gameSettings, navigate])

  // Main game timer effect
  useEffect(() => {
    if (!isTimerRunning || !gameSettings?.gameDuration) return

    console.log("Timer running, mode:", usingSeparateTimers ? "separate" : "shared")

    timerRef.current = setInterval(() => {
      if (usingSeparateTimers) {
        // Separate timers mode
        if (currentPlayer === 1) {
          setPlayer1Time((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              setIsTimerRunning(false)
              setTimeIsUp(true)
              setWinner(2) // Player 2 wins if Player 1 runs out of time
              return 0
            }
            return prev - 1
          })
        } else {
          setPlayer2Time((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current)
              setIsTimerRunning(false)
              setTimeIsUp(true)
              setWinner(1) // Player 1 wins if Player 2 runs out of time
              return 0
            }
            return prev - 1
          })
        }
      } else {
        // Shared timer mode
        setGameTime((prev) => {
          if (!prev) return null
          if (prev <= 1) {
            clearInterval(timerRef.current)
            setIsTimerRunning(false)
            setTimeIsUp(true)
            // In shared timer mode, the current player loses when time runs out
            setWinner(currentPlayer === 1 ? 2 : 1)
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isTimerRunning, currentPlayer, usingSeparateTimers, gameSettings?.gameDuration])

  // Turn timer effect for quick move bonus
  useEffect(() => {
    if (!gameSettings?.enableQuickMoveBonus || !isTimerRunning || winner || timeIsUp) return

    // Start turn timer when component mounts or when player changes
    if (gameSettings?.enableQuickMoveBonus && isTimerRunning) {
      startTurnTimer()
    }

    return () => {
      if (turnTimerRef.current) clearInterval(turnTimerRef.current)
    }
  }, [gameSettings, isTimerRunning, winner, timeIsUp, currentPlayer])

  // Cleanup animation effect for player 1 bonus
  useEffect(() => {
    if (showPlayer1Bonus) {
      const timer = setTimeout(() => {
        setShowPlayer1Bonus(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showPlayer1Bonus])

  // Cleanup animation effect for player 2 bonus
  useEffect(() => {
    if (showPlayer2Bonus) {
      const timer = setTimeout(() => {
        setShowPlayer2Bonus(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showPlayer2Bonus])

  function startTurnTimer() {
    if (turnTimerRef.current) {
      clearInterval(turnTimerRef.current)
    }

    setTurnTimeRemaining(QUICK_MOVE_TIME)
    turnStartTimeRef.current = Date.now()

    turnTimerRef.current = setInterval(() => {
      if (!turnStartTimeRef.current) return

      const elapsedTime = Math.floor((Date.now() - turnStartTimeRef.current) / 1000)
      const remaining = Math.max(0, QUICK_MOVE_TIME - elapsedTime)

      setTurnTimeRemaining(remaining)

      if (remaining <= 0) {
        clearInterval(turnTimerRef.current)
      }
    }, 1000)
  }

  function checkForQuickMoveBonus() {
    if (!gameSettings?.enableQuickMoveBonus || !isTimerRunning) return false

    if (!turnStartTimeRef.current) return false

    const moveTime = Math.floor((Date.now() - turnStartTimeRef.current) / 1000)
    return moveTime <= QUICK_MOVE_TIME
  }

  function getRandomEmoji(playerNum) {
    const player = playerNum === 1 ? gameSettings.player1 : gameSettings.player2
    const randomIndex = Math.floor(Math.random() * player.emojis.length)
    return player.emojis[randomIndex]
  }

  // Function to play sound with error handling
  const playSound = (sound) => {
    try {
      sound.currentTime = 0 // Reset the sound to start
      sound.play().catch(error => {
        console.log("Sound playback failed:", error)
      })
    } catch (error) {
      console.log("Sound error:", error)
    }
  }

  function handleCellClick(index) {
    if (winner || timeIsUp || board[index] !== null) return

    // Play move sound
    playSound(moveSound)

    // Check for quick move bonus
    const earnedBonus = checkForQuickMoveBonus()

    // Add bonus time if earned
    if (earnedBonus && gameSettings.enableQuickMoveBonus) {
      if (usingSeparateTimers) {
        // Add bonus to the current player's timer
        if (currentPlayer === 1 && player1Time !== null) {
          setPlayer1Time((prev) => prev + QUICK_MOVE_BONUS)
          setShowPlayer1Bonus(true)
        } else if (currentPlayer === 2 && player2Time !== null) {
          setPlayer2Time((prev) => prev + QUICK_MOVE_BONUS)
          setShowPlayer2Bonus(true)
        }
      } else {
        // Add bonus to the shared timer
        setGameTime((prev) => prev + QUICK_MOVE_BONUS)
        if (currentPlayer === 1) {
          setShowPlayer1Bonus(true)
        } else {
          setShowPlayer2Bonus(true)
        }
      }
    }

    // Create a new board
    const newBoard = [...board]

    // Track moves for the current player
    if (currentPlayer === 1) {
      // Check if player already has 3 emojis on the board
      if (player1Moves.length === 3) {
        const oldestMoveIndex = player1Moves[0]

        // Cannot place 4th emoji where the 1st was
        if (index === oldestMoveIndex) return

        // Remove the oldest emoji
        newBoard[oldestMoveIndex] = null

        // Update player1Moves (remove oldest and add new)
        setPlayer1Moves([...player1Moves.slice(1), index])
      } else {
        // Add new move
        setPlayer1Moves([...player1Moves, index])
      }
    } else {
      // Same logic for player 2
      if (player2Moves.length === 3) {
        const oldestMoveIndex = player2Moves[0]

        // Cannot place 4th emoji where the 1st was
        if (index === oldestMoveIndex) return

        // Remove the oldest emoji
        newBoard[oldestMoveIndex] = null

        // Update player2Moves (remove oldest and add new)
        setPlayer2Moves([...player2Moves.slice(1), index])
      } else {
        // Add new move
        setPlayer2Moves([...player2Moves, index])
      }
    }

    // Place the current emoji
    newBoard[index] = { emoji: currentEmoji, player: currentPlayer }
    setBoard(newBoard)

    // Check for winner
    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setIsTimerRunning(false)
      if (turnTimerRef.current) clearInterval(turnTimerRef.current)
      
      // Play win sound
      playSound(winSound)
      return
    }

    // Switch player
    const nextPlayer = currentPlayer === 1 ? 2 : 1
    setCurrentPlayer(nextPlayer)
    setCurrentEmoji(getRandomEmoji(nextPlayer))

    // Reset turn timer for next player
    if (gameSettings.enableQuickMoveBonus && isTimerRunning) {
      startTurnTimer()
    }

    // Computer move
    if (nextPlayer === 2 && gameSettings.playWithComputer && !result && !timeIsUp) {
      setTimeout(() => {
        makeComputerMove(newBoard)
      }, 800)
    }
  }

  function makeComputerMove(currentBoard) {
    // Don't make a move if time is up
    if (timeIsUp) return

    // Play move sound for computer's move
    playSound(moveSound)

    // Create a new board copy to work with
    const newBoard = [...currentBoard]

    // Find empty cells
    const emptyCells = []
    newBoard.forEach((cell, index) => {
      if (cell === null) {
        emptyCells.push(index)
      }
    })

    if (emptyCells.length === 0) return

    // Get a random emoji for the computer
    const computerEmoji = getRandomEmoji(2)

    // Choose a random empty cell
    let targetCell

    // If player2 has 3 moves and needs to remove the oldest
    if (player2Moves.length === 3) {
      // Filter out the oldest move position from valid moves
      const validCells = emptyCells.filter((cell) => cell !== player2Moves[0])

      if (validCells.length === 0) return

      // Choose a random valid cell
      const randomIndex = Math.floor(Math.random() * validCells.length)
      targetCell = validCells[randomIndex]

      // Remove the oldest emoji from the board
      newBoard[player2Moves[0]] = null

      // Update player2Moves (remove oldest and add new)
      setPlayer2Moves([...player2Moves.slice(1), targetCell])
    } else {
      // Choose any empty cell
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      targetCell = emptyCells[randomIndex]

      // Add new move to player2Moves
      setPlayer2Moves([...player2Moves, targetCell])
    }

    // Place the computer's emoji
    newBoard[targetCell] = { emoji: computerEmoji, player: 2 }

    // Update the board
    setBoard(newBoard)

    // Check for winner
    const result = checkWinner(newBoard)
    if (result) {
      setWinner(result.winner)
      setWinningLine(result.line)
      setIsTimerRunning(false)
      if (turnTimerRef.current) clearInterval(turnTimerRef.current)
      
      // Play win sound
      playSound(winSound)
      return
    }

    // Switch back to player 1
    setCurrentPlayer(1)
    setCurrentEmoji(getRandomEmoji(1))

    // Reset turn timer for player 1
    if (gameSettings.enableQuickMoveBonus && isTimerRunning) {
      startTurnTimer()
    }
  }

  function checkWinner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (
        board[a] &&
        board[b] &&
        board[c] &&
        board[a].player === board[b].player &&
        board[a].player === board[c].player
      ) {
        return {
          winner: board[a].player,
          line: [a, b, c],
        }
      }
    }

    return null
  }

  function resetGame() {
    setBoard(Array(9).fill(null))
    setCurrentPlayer(1)
    setPlayer1Moves([])
    setPlayer2Moves([])
    setCurrentEmoji(getRandomEmoji(1))
    setWinner(null)
    setWinningLine([])
    setTimeIsUp(false)
    setShowPlayer1Bonus(false)
    setShowPlayer2Bonus(false)

    // Reset timers if game has a duration
    if (gameSettings.gameDuration) {
      if (usingSeparateTimers) {
        setPlayer1Time(gameSettings.gameDuration * 60)
        setPlayer2Time(gameSettings.gameDuration * 60)
        setGameTime(null)
      } else {
        setGameTime(gameSettings.gameDuration * 60)
        setPlayer1Time(null)
        setPlayer2Time(null)
      }
      setIsTimerRunning(true)

      // Reset turn timer
      if (gameSettings.enableQuickMoveBonus) {
        startTurnTimer()
      }
    }
  }

  function isWinningCell(index) {
    return winningLine.includes(index)
  }

  function formatTime(seconds) {
    if (seconds === null) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  function getTimerColor(time, isActive) {
    if (time === null) return ""
    if (time < 10) return "text-red-400 font-bold animate-pulse"
    if (time < 30) return "text-amber-400 font-medium"
    return isActive ? "text-blue-400 font-medium" : "text-white/70"
  }

  function getProgressValue(time) {
    if (!gameSettings.gameDuration || time === null) return 100
    return (time / (gameSettings.gameDuration * 60)) * 100
  }

  function getTurnProgressValue() {
    return (turnTimeRemaining / QUICK_MOVE_TIME) * 100
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <SocialButton
          variant="outline"
          size="sm"
          onClick={() => navigate("/setup")}
          className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Setup
        </SocialButton>
        <div className="flex items-center space-x-4">
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <SocialButton
                variant="outline"
                size="sm"
                className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                Rules
              </SocialButton>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center text-gray-900 dark:text-white">
                  <Sparkles className="h-6 w-6 mr-3 text-gray-600 dark:text-gray-400" />
                  Game Rules & Strategy
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400 text-base">
                  Master the art of vanishing emoji warfare
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    {
                      icon: Target,
                      title: "Board Setup",
                      description: "3×3 grid with maximum 6 active emojis (3 per player)",
                    },
                    {
                      icon: Crown,
                      title: "Emoji Categories",
                      description: "Each player uses emojis from their chosen category",
                    },
                    {
                      icon: Timer,
                      title: "Turn System",
                      description: "Players alternate placing one emoji per turn",
                    },
                    {
                      icon: Flame,
                      title: "Vanishing Rule",
                      description: "4th emoji removes oldest. Can't place where 1st was",
                    },
                    {
                      icon: Star,
                      title: "Victory",
                      description: "Form a line of 3 emojis horizontally, vertically, or diagonally",
                    },
                    {
                      icon: Zap,
                      title: "Quick Bonus",
                      description: "Move within 10 seconds to earn +5 seconds",
                    },
                  ].map((rule, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-2">
                        <div className="h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                          <rule.icon className="h-4 w-4 text-white dark:text-gray-900" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{rule.title}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">{rule.description}</p>
                    </div>
                  ))}
                </div>
                {gameSettings.gameDuration && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                      Time Rules
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {usingSeparateTimers
                        ? `Each player has ${gameSettings.gameDuration} minutes. If time runs out, that player loses.`
                        : `Players share ${gameSettings.gameDuration} minutes. Current player loses when time expires.`}
                      {gameSettings.enableQuickMoveBonus && " Quick moves (≤10s) earn bonus time!"}
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Game Area - Timers Above Board */}
      <div className="flex-grow flex items-center justify-center p-2 md:p-4">
        <div className="w-full max-w-2xl mx-auto space-y-4">
          {/* Timer Display - Above Game Board */}
          {gameSettings.gameDuration && (
            <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardContent className="p-4">
                {usingSeparateTimers ? (
                  // Separate timers display - Horizontal layout
                  <div className="grid grid-cols-2 gap-4">
                    {/* Player 1 Timer */}
                    <div
                      className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${currentPlayer === 1 ? "scale-105 shadow-lg" : "opacity-70"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{gameSettings.player1.name}</span>
                        </div>
                        {showPlayer1Bonus && (
                          <div className="flex items-center text-amber-600 dark:text-amber-400 animate-pulse">
                            <Zap className="h-3 w-3 mr-1" />
                            <span className="text-xs font-bold">+{QUICK_MOVE_BONUS}s</span>
                          </div>
                        )}
                      </div>
                      <div className={`text-xl font-bold ${getTimerColor(player1Time, currentPlayer === 1)}`}>
                        {formatTime(player1Time)}
                      </div>
                      <Progress value={getProgressValue(player1Time)} className="h-2 mt-2 bg-gray-200 dark:bg-gray-700" />
                    </div>

                    {/* Player 2 Timer */}
                    <div
                      className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${currentPlayer === 2 ? "scale-105 shadow-lg" : "opacity-70"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 text-gray-600 dark:text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900 dark:text-white text-sm">{gameSettings.player2.name}</span>
                        </div>
                        {showPlayer2Bonus && (
                          <div className="flex items-center text-amber-600 dark:text-amber-400 animate-pulse">
                            <Zap className="h-3 w-3 mr-1" />
                            <span className="text-xs font-bold">+{QUICK_MOVE_BONUS}s</span>
                          </div>
                        )}
                      </div>
                      <div className={`text-xl font-bold ${getTimerColor(player2Time, currentPlayer === 2)}`}>
                        {formatTime(player2Time)}
                      </div>
                      <Progress value={getProgressValue(player2Time)} className="h-2 mt-2 bg-gray-200 dark:bg-gray-700" />
                    </div>
                  </div>
                ) : (
                  // Shared timer display
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
                        <span className="text-lg font-medium text-gray-900 dark:text-white">Shared Time</span>
                      </div>
                      {(showPlayer1Bonus || showPlayer2Bonus) && (
                        <div className="flex items-center text-amber-600 dark:text-amber-400 animate-pulse">
                          <Zap className="h-4 w-4 mr-2" />
                          <span className="font-bold">+{QUICK_MOVE_BONUS}s Bonus!</span>
                        </div>
                      )}
                    </div>
                    <div className={`text-2xl font-bold ${getTimerColor(gameTime, true)}`}>
                      {formatTime(gameTime)}
                    </div>
                    <Progress value={getProgressValue(gameTime)} className="h-3 mt-3 bg-gray-200 dark:bg-gray-700" />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Game Board Card */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-2 pt-4">
              <CardTitle className="text-xl font-bold text-center text-gray-900 dark:text-white">
                Emoji Battle Arena
              </CardTitle>

              {/* Current Player Display */}
              {!winner && !timeIsUp ? (
                <CardDescription className="text-center mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center">
                      <div
                        className={`h-8 w-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-2`}
                      >
                        <Crown className={`h-4 w-4 text-white dark:text-gray-900`} />
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {currentPlayer === 1 ? gameSettings.player1.name : gameSettings.player2.name}'s Turn
                      </span>
                      <span className="text-3xl ml-3 animate-bounce">{currentEmoji}</span>
                    </div>

                    {gameSettings.enableQuickMoveBonus && gameSettings.gameDuration && !timeIsUp && (
                      <div className="mt-2">
                        <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <Zap className="h-4 w-4 mr-1 text-amber-600 dark:text-amber-400" />
                          <span>Quick move bonus: {turnTimeRemaining}s remaining</span>
                        </div>
                        <Progress value={getTurnProgressValue()} className="h-2 bg-gray-200 dark:bg-gray-700" />
                      </div>
                    )}
                  </div>
                </CardDescription>
              ) : (
                <CardDescription className="text-center mt-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    {winner === 0 ? (
                      <div className="text-xl font-bold text-gray-900 dark:text-white">🤝 It's a Tie!</div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="flex items-center">
                          <Trophy className="h-6 w-6 text-amber-600 dark:text-amber-400 mr-2" />
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">
                            {winner === 1 ? gameSettings.player1.name : gameSettings.player2.name} Wins!
                          </span>
                        </div>
                        {timeIsUp && (
                          <div className="bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-gray-700 dark:text-gray-300 mt-2">⏰ Time's up!</div>
                        )}
                      </div>
                    )}
                  </div>
                </CardDescription>
              )}
            </CardHeader>

            <CardContent className="px-4 py-3">
              {/* Game Board */}
              <div className="grid grid-cols-3 gap-3 aspect-square mb-4 max-w-sm mx-auto">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    className={`aspect-square flex items-center justify-center text-3xl rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95
                      ${
                        isWinningCell(index)
                          ? "bg-green-100 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 shadow-lg animate-pulse"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                      }`}
                    onClick={() => handleCellClick(index)}
                    disabled={winner !== null || timeIsUp}
                  >
                    {cell && <span className={isWinningCell(index) ? "animate-bounce" : ""}>{cell.emoji}</span>}
                  </button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <SocialButton
                  variant="outline"
                  onClick={() => navigate("/setup")}
                  className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  New Game
                </SocialButton>
                {(winner !== null || timeIsUp) && (
                  <SocialButton 
                    className="bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" 
                    onClick={resetGame}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Play Again
                  </SocialButton>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Player Categories Display - Below Game Board */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="h-6 w-6 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-2">
                      <Crown className="h-3 w-3 text-white dark:text-gray-900" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{gameSettings.player1.name}</span>
                  </div>
                  <div className="flex justify-center space-x-2 mb-2">
                    {gameSettings.player1.emojis.slice(0, 5).map((emoji, i) => (
                      <span key={i} className="text-lg">
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <div className="text-center text-gray-600 dark:text-gray-400 text-xs capitalize">{gameSettings.player1.category}</div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center mb-3">
                    <div className="h-6 w-6 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-2">
                      <Crown className="h-3 w-3 text-white dark:text-gray-900" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white text-sm">{gameSettings.player2.name}</span>
                  </div>
                  <div className="flex justify-center space-x-2 mb-2">
                    {gameSettings.player2.emojis.slice(0, 5).map((emoji, i) => (
                      <span key={i} className="text-lg">
                        {emoji}
                      </span>
                    ))}
                  </div>
                  <div className="text-center text-gray-600 dark:text-gray-400 text-xs capitalize">{gameSettings.player2.category}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
