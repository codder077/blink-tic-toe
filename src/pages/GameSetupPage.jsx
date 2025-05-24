"use client"

import { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SocialButton } from "../components/ui/social-button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Switch } from "../components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs"
import { PremiumSlider } from "../components/ui/PremiumSlider"
import ThemeToggle from "../components/ThemeToggle"
import { EmojiContext } from "../contexts/EmojiContext"
import { AlertCircle, ArrowLeft, Clock, Gamepad2, Zap, Users, Settings, Crown, Timer, Target } from "lucide-react"

const emojiCategories = {
  animals: ["🐶", "🐱", "🐵", "🐰", "🦊", "🐼", "🐨", "🦁", "🐯"],
  food: ["🍕", "🍟", "🍔", "🍩", "🍦", "🍭", "🍫", "🍿", "🥤"],
  sports: ["⚽️", "🏀", "🏈", "🎾", "🏐", "🏉", "🎱", "🏓", "⛳️"],
  nature: ["🌸", "🌺", "🌻", "🌹", "🌴", "🌵", "🍄", "🌈", "⭐️"],
  travel: ["✈️", "🚗", "🚢", "🚁", "🚂", "🚲", "🏖️", "🗽", "🏰"],
}

const gameDurations = [
  { value: "eternal", label: "Eternal", description: "Play until someone wins", icon: "♾️" },
  { value: "2", label: "2 Minutes", description: "Quick game", icon: "⚡" },
  { value: "3", label: "3 Minutes", description: "Standard game", icon: "🎯" },
  { value: "4", label: "4 Minutes", description: "Extended game", icon: "🏆" },
  { value: "custom", label: "Custom Time", description: "Set your own time limit", icon: "⚙️" },
]

export default function GameSetupPage() {
  const navigate = useNavigate()
  const { setGameSettings } = useContext(EmojiContext)

  const [player1Name, setPlayer1Name] = useState("Player 1")
  const [player2Name, setPlayer2Name] = useState("Player 2")
  const [player1Category, setPlayer1Category] = useState("animals")
  const [player2Category, setPlayer2Category] = useState("food")
  const [playWithComputer, setPlayWithComputer] = useState(false)
  const [gameDuration, setGameDuration] = useState("eternal")
  const [customMinutes, setCustomMinutes] = useState(5)
  const [enableQuickMoveBonus, setEnableQuickMoveBonus] = useState(true)
  const [separateTimers, setSeparateTimers] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("players")

  // Update player2Category if it's the same as player1Category
  useEffect(() => {
    if (player1Category === player2Category && !playWithComputer) {
      // Find the first available category that's different from player1Category
      const availableCategories = Object.keys(emojiCategories).filter((category) => category !== player1Category)
      if (availableCategories.length > 0) {
        setPlayer2Category(availableCategories[0])
      }
    }
  }, [player1Category, player2Category, playWithComputer])

  const handleStartGame = () => {
    // Validate that players have different categories when not playing with computer
    if (!playWithComputer && player1Category === player2Category) {
      setError("Both players cannot choose the same emoji category. Please select different categories.")
      return
    }

    setError("")

    const duration =
      gameDuration === "eternal" ? null : gameDuration === "custom" ? Number(customMinutes) : Number(gameDuration)

    // Create the game settings object
    const settings = {
      player1: {
        name: player1Name,
        category: player1Category,
        emojis: emojiCategories[player1Category],
        timeRemaining: duration ? duration * 60 : null, // Convert to seconds
      },
      player2: {
        name: playWithComputer ? "Computer" : player2Name,
        category: player2Category,
        emojis: emojiCategories[player2Category],
        timeRemaining: duration ? duration * 60 : null, // Convert to seconds
      },
      playWithComputer,
      gameDuration: duration,
      enableQuickMoveBonus,
      separateTimers,
    }

    // Log for debugging
    console.log("Starting game with settings:", settings)

    // Set the game settings in context
    setGameSettings(settings)

    // Navigate to the game page
    setTimeout(() => navigate("/game"), 100)
  }

  const handlePlayer1CategoryChange = (category) => {
    setPlayer1Category(category)

    // If player 2 has the same category, change it
    if (category === player2Category && !playWithComputer) {
      // Find the first available category that's different
      const availableCategories = Object.keys(emojiCategories).filter((cat) => cat !== category)
      if (availableCategories.length > 0) {
        setPlayer2Category(availableCategories[0])
      }
    }
  }

  // Handle slider value change
  const handleSliderChange = (value) => {
    setCustomMinutes(value)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 relative">
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
        <SocialButton
          variant="outline"
          size="sm"
          onClick={() => navigate("/")}
          className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </SocialButton>
        <ThemeToggle />
      </nav>

      {/* Main Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-4xl pt-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <Settings className="h-8 w-8 text-white dark:text-gray-900" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Game Setup</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">Configure your epic emoji battle</p>
          </div>

          {/* Setup Card */}
          <Card className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Customize Your Experience
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 text-center text-base">
                Set up players, choose categories, and configure game rules
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 p-1 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <TabsTrigger
                    value="players"
                    className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white transition-all duration-300"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Players
                  </TabsTrigger>
                  <TabsTrigger
                    value="settings"
                    className="text-gray-700 dark:text-gray-300 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white transition-all duration-300"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Game Setting
                  </TabsTrigger>
                </TabsList>

                <div className="relative min-h-[500px] mt-8">
                  <div
                    className={`transition-all duration-500 ease-out ${activeTab === "players" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 absolute inset-0 pointer-events-none"}`}
                  >
                    {/* Computer Toggle */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                            <Target className="h-5 w-5 text-white dark:text-gray-900" />
                          </div>
                          <div>
                            <h3 className="text-gray-900 dark:text-white font-medium">AI Opponent</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">Play against our intelligent computer</p>
                          </div>
                        </div>
                        <Switch
                          id="computer-opponent"
                          checked={playWithComputer}
                          onCheckedChange={setPlayWithComputer}
                          className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    {/* Players Side by Side */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-500">
                      {/* Player 1 Setup */}
                      <div className="transition-all duration-300 hover:-translate-y-1">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                          <div className="flex items-center mb-4">
                            <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                              <Crown className="h-5 w-5 text-white dark:text-gray-900" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player 1</h3>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="player1" className="text-gray-900 dark:text-white font-medium">
                                Player Name
                              </Label>
                              <Input
                                id="player1"
                                value={player1Name}
                                onChange={(e) => setPlayer1Name(e.target.value)}
                                className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                placeholder="Enter player 1 name"
                              />
                            </div>

                            <div>
                              <Label className="text-gray-900 dark:text-white font-medium mb-3 block">Choose Emoji Category</Label>
                              <RadioGroup
                                value={player1Category}
                                onValueChange={handlePlayer1CategoryChange}
                                className="grid grid-cols-1 gap-3"
                              >
                                {Object.entries(emojiCategories).map(([category, emojis]) => (
                                  <div
                                    key={category}
                                    className="flex items-center space-x-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                                  >
                                    <RadioGroupItem
                                      value={category}
                                      id={`p1-${category}`}
                                      className="border-gray-400 text-gray-900 dark:text-white"
                                    />
                                    <Label
                                      htmlFor={`p1-${category}`}
                                      className="flex items-center justify-between cursor-pointer w-full"
                                    >
                                      <span className="capitalize text-gray-900 dark:text-white font-medium">{category}</span>
                                      <div className="flex space-x-1">
                                        {emojis.slice(0, 3).map((emoji, i) => (
                                          <span key={i} className="text-xl">
                                            {emoji}
                                          </span>
                                        ))}
                                      </div>
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Player 2 Setup or Computer Message */}
                      <div
                        className={`transition-all duration-300 hover:-translate-y-1 ${playWithComputer ? "computer-active" : ""}`}
                      >
                        {playWithComputer ? (
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                            <div className="flex items-center mb-4">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                                <Target className="h-5 w-5 text-white dark:text-gray-900" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Computer Opponent</h3>
                            </div>

                            <div className="space-y-4">
                              <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-900 dark:text-white">Difficulty</span>
                                  <span className="text-gray-900 dark:text-white font-medium">Adaptive</span>
                                </div>
                              </div>

                              <div>
                                <Label className="text-gray-900 dark:text-white font-medium mb-3 block">
                                  Choose Computer's Emoji Category
                                </Label>
                                <RadioGroup
                                  value={player2Category}
                                  onValueChange={setPlayer2Category}
                                  className="grid grid-cols-1 gap-3"
                                >
                                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                                    <div
                                      key={category}
                                      className={`flex items-start space-x-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                                      ${category === player1Category ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                    >
                                      <RadioGroupItem
                                        value={category}
                                        id={`computer-${category}`}
                                        disabled={category === player1Category}
                                        className="border-gray-400 text-gray-900 dark:text-white mt-1"
                                      />
                                      <Label
                                        htmlFor={`computer-${category}`}
                                        className={`flex-1 ${category === player1Category ? "cursor-not-allowed" : "cursor-pointer"}`}
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                          <div className="flex items-center">
                                            <span className="capitalize text-gray-900 dark:text-white font-medium mr-3">{category}</span>
                                            <div className="flex space-x-1">
                                              {emojis.slice(0, 3).map((emoji, i) => (
                                                <span key={i} className="text-xl">
                                                  {emoji}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                          {category === player1Category && (
                                            <div className="flex items-center">
                                              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-1 flex items-center whitespace-nowrap">
                                                <AlertCircle className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                                <span className="text-amber-700 dark:text-amber-300">Taken</span>
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                            <div className="flex items-center mb-4">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                                <Crown className="h-5 w-5 text-white dark:text-gray-900" />
                              </div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Player 2</h3>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="player2" className="text-gray-900 dark:text-white font-medium">
                                  Player Name
                                </Label>
                                <Input
                                  id="player2"
                                  value={player2Name}
                                  onChange={(e) => setPlayer2Name(e.target.value)}
                                  className="mt-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                                  placeholder="Enter player 2 name"
                                />
                              </div>

                              <div>
                                <Label className="text-gray-900 dark:text-white font-medium mb-3 block">Choose Emoji Category</Label>
                                <RadioGroup
                                  value={player2Category}
                                  onValueChange={setPlayer2Category}
                                  className="grid grid-cols-1 gap-3"
                                >
                                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                                    <div
                                      key={category}
                                      className={`flex items-start space-x-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                                      ${category === player1Category ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                                    >
                                      <RadioGroupItem
                                        value={category}
                                        id={`p2-${category}`}
                                        disabled={category === player1Category}
                                        className="border-gray-400 text-gray-900 dark:text-white mt-1"
                                      />
                                      <Label
                                        htmlFor={`p2-${category}`}
                                        className={`flex-1 ${category === player1Category ? "cursor-not-allowed" : "cursor-pointer"}`}
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                          <div className="flex items-center">
                                            <span className="capitalize text-gray-900 dark:text-white font-medium mr-3">{category}</span>
                                            <div className="flex space-x-1">
                                              {emojis.slice(0, 3).map((emoji, i) => (
                                                <span key={i} className="text-xl">
                                                  {emoji}
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                          {category === player1Category && (
                                            <div className="flex items-center">
                                              <span className="text-xs bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-full px-2 py-1 flex items-center whitespace-nowrap">
                                                <AlertCircle className="h-3 w-3 mr-1 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                                <span className="text-amber-700 dark:text-amber-300">Taken</span>
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-500 ease-out ${activeTab === "settings" ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95 absolute inset-0 pointer-events-none"}`}
                  >
                    {/* Game Duration */}
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                          <Timer className="h-5 w-5 text-white dark:text-gray-900" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Game Duration</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <RadioGroup
                            value={gameDuration}
                            onValueChange={setGameDuration}
                            className="grid grid-cols-1 gap-3"
                          >
                            {gameDurations.slice(0, 3).map((duration) => (
                              <div
                                key={duration.value}
                                className="flex items-center space-x-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                              >
                                <RadioGroupItem
                                  value={duration.value}
                                  id={`duration-${duration.value}`}
                                  className="border-gray-400 text-gray-900 dark:text-white"
                                />
                                <Label
                                  htmlFor={`duration-${duration.value}`}
                                  className="flex items-center justify-between cursor-pointer w-full"
                                >
                                  <div className="flex items-center">
                                    <span className="text-2xl mr-3">{duration.icon}</span>
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-white">{duration.label}</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">{duration.description}</div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>

                        <div className="space-y-3">
                          <RadioGroup
                            value={gameDuration}
                            onValueChange={setGameDuration}
                            className="grid grid-cols-1 gap-3"
                          >
                            {gameDurations.slice(3).map((duration) => (
                              <div
                                key={duration.value}
                                className="flex items-center space-x-3 bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                              >
                                <RadioGroupItem
                                  value={duration.value}
                                  id={`duration-${duration.value}`}
                                  className="border-gray-400 text-gray-900 dark:text-white"
                                />
                                <Label
                                  htmlFor={`duration-${duration.value}`}
                                  className="flex items-center justify-between cursor-pointer w-full"
                                >
                                  <div className="flex items-center">
                                    <span className="text-2xl mr-3">{duration.icon}</span>
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-white">{duration.label}</div>
                                      <div className="text-sm text-gray-600 dark:text-gray-400">{duration.description}</div>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {gameDuration === "custom" && (
                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mt-3 transition-all duration-300 transform">
                              <PremiumSlider
                                min={1}
                                max={20}
                                value={customMinutes}
                                onChange={handleSliderChange}
                                label="Custom Duration"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Advanced Settings */}
                    {gameDuration !== "eternal" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-500 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                                <Clock className="h-5 w-5 text-white dark:text-gray-900" />
                              </div>
                              <div>
                                <h3 className="text-gray-900 dark:text-white font-medium">Separate Time Banks</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {separateTimers ? "Each player has their own timer" : "Players share one timer"}
                                </p>
                              </div>
                            </div>
                            <Switch
                              id="separate-timers"
                              checked={separateTimers}
                              onCheckedChange={setSeparateTimers}
                              className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white transition-all duration-300"
                            />
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mr-3">
                                <Zap className="h-5 w-5 text-white dark:text-gray-900" />
                              </div>
                              <div>
                                <h3 className="text-gray-900 dark:text-white font-medium">Quick Move Bonus</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  Earn +5 seconds for moves made within 10 seconds
                                </p>
                              </div>
                            </div>
                            <Switch
                              id="quick-move-bonus"
                              checked={enableQuickMoveBonus}
                              onCheckedChange={setEnableQuickMoveBonus}
                              className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white transition-all duration-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Tabs>

              {error && (
                <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0" />
                  <span className="text-red-700 dark:text-red-300">{error}</span>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4 pb-8">
              <SocialButton className="w-full text-lg py-6 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" onClick={handleStartGame}>
                <Gamepad2 className="h-6 w-6 mr-2" />
                Launch Game
              </SocialButton>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
