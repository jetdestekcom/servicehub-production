'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { MapPinIcon } from '@heroicons/react/24/outline'
import { getCitySuggestions, turkishCities } from '@/lib/turkish-cities'

interface CityAutocompleteProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function CityAutocomplete({ 
  value, 
  onChange, 
  placeholder = "Konum (örn: İstanbul)",
  className = ""
}: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Längste Stadt für Breitenberechnung
  const longestCity = useMemo(() => {
    return turkishCities.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    )
  }, [])

  // Berechne die optimale Breite basierend auf der längsten Stadt
  const inputWidth = useMemo(() => {
    // Basisbreite für Icon und Padding
    const baseWidth = 60 // px für Icon und Padding
    // Zeichenbreite (ca. 8px pro Zeichen für die meisten Fonts)
    const charWidth = 8
    const textWidth = longestCity.length * charWidth
    // Mindestbreite für bessere UX
    const minWidth = 200
    const maxWidth = 400
    
    const calculatedWidth = Math.max(minWidth, Math.min(maxWidth, baseWidth + textWidth))
    return `${calculatedWidth}px`
  }, [longestCity])

  useEffect(() => {
    if (value.trim()) {
      const newSuggestions = getCitySuggestions(value, 8)
      setSuggestions(newSuggestions)
      setIsOpen(newSuggestions.length > 0)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
    setHighlightedIndex(-1)
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node) &&
          listRef.current && !listRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handleSuggestionClick = (suggestion: string) => {
    console.log('Clicking suggestion:', suggestion) // Debug log
    onChange(suggestion)
    setIsOpen(false)
    setHighlightedIndex(-1)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="relative">
      <div className="relative">
        <MapPinIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ width: inputWidth }}
          className={`pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${className}`}
          autoComplete="off"
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          style={{ width: inputWidth }}
          className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={suggestion}
              onClick={() => {
                console.log('Direct click on:', suggestion) // Debug
                
                // Direkt das Input-Element aktualisieren
                if (inputRef.current) {
                  inputRef.current.value = suggestion
                  // Trigger onChange event
                  const event = new Event('input', { bubbles: true })
                  inputRef.current.dispatchEvent(event)
                }
                
                // Auch die onChange Funktion aufrufen
                onChange(suggestion)
                
                setIsOpen(false)
                setHighlightedIndex(-1)
              }}
              className={`px-4 py-3 cursor-pointer transition-colors duration-150 flex items-center ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-900 hover:bg-gray-50'
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === suggestions.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
              <span className="truncate">{suggestion}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
