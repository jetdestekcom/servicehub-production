'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { TagIcon } from '@heroicons/react/24/outline'
import { SERVICE_CATEGORIES, getAllSubcategories } from '@/lib/service-categories'

interface CategoryAutocompleteProps {
  value: string
  onChange: (category: string) => void
  placeholder?: string
  className?: string
}

export function CategoryAutocomplete({ value, onChange, placeholder, className }: CategoryAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Alle Kategorien und Unterkategorien für die Suche
  const allCategories = [
    ...SERVICE_CATEGORIES.map(cat => cat.name),
    ...getAllSubcategories().map(sub => sub.name)
  ]

  const getCategorySuggestions = useCallback((query: string, limit: number = 10): string[] => {
    if (!query || query.length < 1) return []
    
    const lowercaseQuery = query.toLowerCase()
    
    // Zuerst Kategorien die mit dem Query beginnen
    const startsWith = allCategories.filter(category => 
      category.toLowerCase().startsWith(lowercaseQuery)
    ).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))

    // Dann Kategorien die den Query enthalten
    const contains = allCategories.filter(category => 
      !category.toLowerCase().startsWith(lowercaseQuery) && category.toLowerCase().includes(lowercaseQuery)
    ).sort((a, b) => a.localeCompare(b, 'tr', { sensitivity: 'base' }))

    return [...startsWith, ...contains].slice(0, limit)
  }, [])

  useEffect(() => {
    if (value.length > 0) {
      setSuggestions(getCategorySuggestions(value))
      setIsOpen(true)
    } else {
      setSuggestions([])
      setIsOpen(false)
    }
    setHighlightedIndex(-1)
  }, [value, getCategorySuggestions])

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
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex !== -1) {
          onChange(suggestions[highlightedIndex])
          setIsOpen(false)
          setHighlightedIndex(-1)
        } else if (suggestions.length > 0 && value.length > 0) {
          // Wenn keine Suggestion hervorgehoben ist, aber es Vorschläge gibt, nimm den ersten
          onChange(suggestions[0])
          setIsOpen(false)
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.name === categoryName)
    return category?.icon || '🔧'
  }

  const getCategoryInfo = (categoryName: string) => {
    const category = SERVICE_CATEGORIES.find(cat => cat.name === categoryName)
    if (category) {
      return { type: 'main', icon: category.icon }
    }
    
    const subcategory = getAllSubcategories().find(sub => sub.name === categoryName)
    if (subcategory) {
      return { type: 'sub', icon: subcategory.icon, parent: subcategory.categoryName }
    }
    
    return { type: 'unknown', icon: '🔧' }
  }

  return (
    <div className="relative w-full" style={{ zIndex: 999999 }}>
      <div className="relative">
        <TagIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (value.length > 0) {
              setSuggestions(getCategorySuggestions(value))
              setIsOpen(true)
            }
          }}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 ${className}`}
          autoComplete="off"
        />
      </div>
      {isOpen && suggestions.length > 0 && (
        <motion.ul
          ref={listRef}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
          style={{ zIndex: 999999 }}
        >
          {suggestions.map((suggestion, index) => {
            const categoryInfo = getCategoryInfo(suggestion)
            return (
              <li
                key={suggestion}
                onClick={() => {
                  console.log('Direct click on category:', suggestion) // Debug
                  
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
                className={`px-4 py-3 cursor-pointer transition-colors duration-150 ${
                  index === highlightedIndex
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-900 hover:bg-gray-50'
                } ${index === 0 ? 'rounded-t-xl' : ''} ${
                  index === suggestions.length - 1 ? 'rounded-b-xl' : ''
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3 flex-shrink-0">
                    {categoryInfo.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {suggestion}
                      {categoryInfo.type === 'main' && (
                        <span className="text-xs text-blue-600 ml-2">(Ana Kategori)</span>
                      )}
                    </div>
                    {categoryInfo.type === 'sub' && categoryInfo.parent && (
                      <div className="text-xs text-gray-500 truncate">
                        {categoryInfo.parent}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </motion.ul>
      )}
    </div>
  )
}
