"use client"

import { useEffect, useRef, useState } from "react"

export function PremiumSlider({ min = 1, max = 20, value, onChange, label, className = "" }) {
  const [sliderValue, setSliderValue] = useState(value || min)
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const sliderRef = useRef(null)
  const trackRef = useRef(null)
  const handleRef = useRef(null)

  const getPositionFromValue = (val) => ((val - min) / (max - min)) * 100
  const getValueFromPosition = (position) => Math.round(min + ((max - min) * position) / 100)
  const position = getPositionFromValue(sliderValue)

  useEffect(() => {
    if (value !== undefined && value !== sliderValue) {
      setSliderValue(value)
    }
  }, [value])

  useEffect(() => {
    if (onChange && value !== sliderValue) {
      onChange(sliderValue)
    }
  }, [sliderValue, onChange, value])

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setShowTooltip(true)
    updateValueFromClientX(e.clientX)
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    e.preventDefault()
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      updateValueFromClientX(e.clientX)
    }
    if (sliderRef.current) {
      const rect = sliderRef.current.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      sliderRef.current.style.setProperty("--x", `${x}%`)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setTimeout(() => setShowTooltip(false), 1000)
    document.removeEventListener("mousemove", handleMouseMove)
    document.removeEventListener("mouseup", handleMouseUp)
  }

  const handleSliderClick = (e) => {
    if (!isDragging) {
      updateValueFromClientX(e.clientX)
    }
  }

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => {
    if (!isDragging) setShowTooltip(false)
  }

  const updateValueFromClientX = (clientX) => {
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect()
      const position = ((clientX - rect.left) / rect.width) * 100
      const clampedPosition = Math.max(0, Math.min(position, 100))
      const newValue = getValueFromPosition(clampedPosition)
      setSliderValue(newValue)
    }
  }

  const handleTouchStart = (e) => {
    setIsDragging(true)
    setShowTooltip(true)
    updateValueFromClientX(e.touches[0].clientX)
    e.preventDefault()
  }

  const handleTouchMove = (e) => {
    if (isDragging) {
      updateValueFromClientX(e.touches[0].clientX)
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    setTimeout(() => setShowTooltip(false), 1000)
  }

  return (
    <div className={`${className}`}>
      <div className="flex justify-between items-center mb-4">
        <label className="text-white font-medium text-lg">{label}</label>
        <div className="bg-white/10 rounded-full px-3 py-1 border border-white/20">
          <span className="text-white font-semibold">{sliderValue} minutes</span>
        </div>
      </div>

      <div
        ref={sliderRef}
        className="relative py-6 px-4 touch-none cursor-pointer"
        onClick={handleSliderClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        style={{
          "--x": "50%",
          "--y": "50%",
          backgroundImage: isDragging
            ? "radial-gradient(circle at var(--x) 50%, rgba(124, 58, 237, 0.15), transparent 70%)"
            : "none",
        }}
      >
        <div
          ref={trackRef}
          className="absolute inset-0 my-auto h-2 bg-white/10 rounded-full overflow-hidden"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="absolute h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-200"
            style={{ width: `${position}%` }}
          ></div>
        </div>

        <div
          className={`absolute -top-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2 py-1 rounded-md font-semibold text-sm transition-all duration-200 shadow-lg ${
            showTooltip ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
          style={{
            left: `${position}%`,
            transform: "translate(-50%, -100%)",
          }}
        >
          {sliderValue}m
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-purple-600"></div>
        </div>

        <div
          ref={handleRef}
          className={`absolute top-1/2 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white shadow-lg transition-all ${
            isDragging
              ? "cursor-grabbing scale-110 shadow-purple-500/50"
              : "cursor-grab hover:scale-110 hover:shadow-purple-500/30"
          }`}
          style={{
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            transition: isDragging ? "none" : "all 0.2s cubic-bezier(0.33, 1, 0.68, 1)",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        ></div>

        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-0.5 h-2 bg-white/20 rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm text-white/70 mt-2">
        <span>Quick ({min}m)</span>
        <span>Extended ({max}m)</span>
      </div>
    </div>
  )
}
