"use client"

import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import ThemeToggle from "../components/ThemeToggle"
import { SocialButton } from "../components/ui/social-button"
import { Gamepad2, Star, Zap, Users, Clock, Sparkles, Play, Heart } from "lucide-react"
import { useEffect } from "react"

export default function HomePage() {
  // Function to handle continuous fade animations on scroll
  useEffect(() => {
    // Create an Intersection Observer for continuous fade animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When element enters viewport
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("fade-in")
            }, 50)
          } else {
            // When element leaves viewport, reset animation
            entry.target.classList.remove("fade-in")
          }
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -100px 0px", // Start animation when element is 100px from bottom
        threshold: 0.1, // Trigger when 10% of element is visible
      },
    )

    // Create observer for staggered fade-in effects that reset on scroll
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Get all stagger children
            const children = entry.target.querySelectorAll(".stagger-fade")

            // Animate each child with delay
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("fade-in")
              }, index * 180)
            })
          } else {
            // Reset all children when container leaves viewport
            const children = entry.target.querySelectorAll(".stagger-fade")
            children.forEach((child) => {
              child.classList.remove("fade-in")
            })
          }
        })
      },
      {
        root: null,
        rootMargin: "0px 0px -50px 0px",
        threshold: 0.1,
      },
    )

    // Select elements for animation
    const fadeElements = document.querySelectorAll(".fade-element")
    const staggerParents = document.querySelectorAll(".stagger-container")

    // Observe elements
    fadeElements.forEach((el) => observer.observe(el))
    staggerParents.forEach((el) => staggerObserver.observe(el))

    // Cleanup
    return () => {
      fadeElements.forEach((el) => observer.unobserve(el))
      staggerParents.forEach((el) => staggerObserver.unobserve(el))
    }
  }, [])

  return (
    <>
      <style jsx global>{`
        /* Continuous Scroll Fade Animation Styles */
        .fade-element {
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.33, 1, 0.68, 1);
          will-change: opacity;
        }

        .stagger-fade {
          opacity: 0;
          transition: opacity 1s cubic-bezier(0.33, 1, 0.68, 1);
          will-change: opacity;
        }

        .fade-in {
          opacity: 1 !important;
        }

        /* Delay classes for sequential fading */
        .fade-delay-100 { transition-delay: 100ms; }
        .fade-delay-200 { transition-delay: 200ms; }
        .fade-delay-300 { transition-delay: 300ms; }
        .fade-delay-400 { transition-delay: 400ms; }
        .fade-delay-500 { transition-delay: 500ms; }
        .fade-delay-600 { transition-delay: 600ms; }

        /* Hero section special fade */
        .hero-fade {
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity;
        }

        /* Smooth hover effects */
        .smooth-hover {
          transition: all 0.3s ease;
        }
        
        .smooth-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="min-h-screen bg-white dark:bg-gray-900 relative">
        {/* Navigation */}
        <nav className="relative z-50 flex items-center justify-between p-6 lg:px-8 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white dark:text-gray-900" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Blink Tic Toe</span>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative z-10 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl pt-20 pb-24 sm:pt-32 sm:pb-32">
            <div className="text-center">
              <div className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl lg:text-8xl">
                <span className="block hero-fade fade-element">Blink</span>
                <span className="block text-gray-900 dark:text-white hero-fade fade-element fade-delay-200">
                  Tic Toe
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2 text-gray-600 dark:text-gray-300 hero-fade fade-element fade-delay-400">
                  The Future of Gaming
                </span>
              </div>

              <p className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-gray-600 dark:text-gray-300 sm:text-2xl fade-element fade-delay-500">
                Experience the next evolution of tic-tac-toe. Where lightning-fast reflexes meet strategic gameplay in a
                revolutionary gaming experience that will keep you on the edge of your seat.
              </p>

              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 fade-element fade-delay-600">
                <Link to="/setup" className="w-full sm:w-auto">
                  <SocialButton
                    size="lg"
                    variant="default"
                    className="w-full sm:w-auto text-lg px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Playing Now
                  </SocialButton>
                </Link>
              </div>

              <div className="mt-16 flex justify-center px-4 stagger-container">
                <div className="grid grid-cols-1 gap-20 sm:grid-cols-3">
                  <div className="text-center stagger-fade">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">100k+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Active Players</div>
                  </div>

                  <div className="text-center stagger-fade">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">2M+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
                  </div>

                  <div className="text-center stagger-fade">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">4.9/5</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Player Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Preview Section */}
        <div className="relative z-10 px-6 lg:px-8 pb-24 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-16 fade-element">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">Experience the Speed</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Watch how Blink Tic Toe revolutionizes the classic game with lightning-fast gameplay
              </p>
            </div>

            <Card className="mx-auto max-w-md bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-lg fade-element fade-delay-200 smooth-hover">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                    <Sparkles className="h-8 w-8 text-white dark:text-gray-900" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Live Game Preview</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                  Experience the thrill of rapid-fire moves and strategic plays
                </CardDescription>
              </CardHeader>

              <CardContent className="px-8">
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {[
                    { emoji: "🐶", player: 1 },
                    { emoji: "🍕", player: 2 },
                    { emoji: "🐱", player: 1 },
                    null,
                    { emoji: "🍟", player: 2 },
                    null,
                    { emoji: "🐵", player: 1 },
                    null,
                    { emoji: "🍔", player: 2 },
                  ].map((cell, index) => (
                    <div
                      key={index}
                      className="aspect-square flex items-center justify-center text-3xl bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                    >
                      {cell && <span className={`${cell.player === 1 ? "animate-pulse" : ""}`}>{cell.emoji}</span>}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-white dark:text-gray-900">P1</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">Animals</span>
                    </div>
                    <div className="flex space-x-1">
                      {["🐶", "🐱", "🐵"].map((emoji, i) => (
                        <span key={i} className="text-lg">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-2">
                      <div className="h-6 w-6 rounded-full bg-gray-900 dark:bg-white flex items-center justify-center mr-2">
                        <span className="text-xs font-bold text-white dark:text-gray-900">P2</span>
                      </div>
                      <span className="text-gray-900 dark:text-white font-medium">Food</span>
                    </div>
                    <div className="flex space-x-1">
                      {["🍕", "🍟", "🍔"].map((emoji, i) => (
                        <span key={i} className="text-lg">
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-8 pb-8">
                <Link to="/setup" className="w-full">
                  <SocialButton className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100" variant="default">
                    <Gamepad2 className="h-5 w-5 mr-2" />
                    Try It Now
                  </SocialButton>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative z-10 px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16 fade-element">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-4">Why Players Choose Blink Tic Toe</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Revolutionary features that make every game an adrenaline-pumping experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-container">
              {[
                {
                  icon: Zap,
                  title: "Instant Thrills",
                  description: "Feel the rush of adrenaline as you make split-second decisions in our heart-pounding matches. Every move counts!",
                },
                {
                  icon: Clock,
                  title: "Power Moves",
                  description: "Unlock special abilities and power-ups that turn the tide of battle. Master the art of strategic timing!",
                },
                {
                  icon: Users,
                  title: "Epic Showdowns",
                  description: "Face off against the world's best players in intense 1v1 battles. Rise through the ranks and claim your glory!",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-900 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 smooth-hover stagger-fade"
                >
                  <div className="h-12 w-12 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white dark:text-gray-900" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="relative z-10 px-6 lg:px-8 pb-24 bg-gray-50 dark:bg-gray-800">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl mb-12 fade-element">What Players Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 stagger-container">
              {[
                {
                  quote: "I've never felt this level of excitement in a game before. The rush of making the perfect move under pressure is absolutely addictive!",
                  author: "Luna Chen",
                  role: "Gaming Influencer",
                  rating: 5,
                },
                {
                  quote: "This isn't just a game, it's a lifestyle. The community is amazing, and the competitive scene is absolutely fire!",
                  author: "Max Rodriguez",
                  role: "Tournament Champion",
                  rating: 5,
                },
                {
                  quote: "The perfect blend of strategy and speed. I've been playing for hours and still can't get enough of that winning feeling!",
                  author: "Sophie Anderson",
                  role: "Pro Gamer",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 smooth-hover stagger-fade"
                >
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 fade-element">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Join our community of 100,000+ players</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative z-10 px-6 lg:px-8 pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 fade-element smooth-hover">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">Ready to Test Your Reflexes?</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of players who have discovered the most exhilarating puzzle game of 2025. Challenge your
                speed, strategy, and reflexes in Blink Tic Toe today.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/setup" className="w-full sm:w-auto">
                  <SocialButton
                    size="lg"
                    variant="default"
                    className="w-full text-lg px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Start Playing Free
                  </SocialButton>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white dark:text-gray-900" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">Blink Tic Toe</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 max-w-md">
                  The fastest and most exciting tic-tac-toe experience ever created. Join millions of players worldwide in this revolutionary gaming phenomenon.
                </p>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Company</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">About</a></li>
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Blog</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-900 dark:text-white font-semibold mb-2">Support</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Help Center</a></li>
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact Us</a></li>
                    <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>&copy; 2025 Blink Tic Toe. All rights reserved. Made with ❤️ for puzzle lovers.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
