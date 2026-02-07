     'use client'

    import React, { useState, FormEvent, ChangeEvent, useEffect, useRef } from 'react'
    import { useTheme } from 'next-themes'
    import Link from 'next/link'

    type Hit = {
        title: string
        slug: string
        excerpt?: string
    }

    const SearchBar: React.FC = () => {
        const [query, setQuery] = useState('')
        const [results, setResults] = useState<Hit[]>([])
        const [loading, setLoading] = useState(false)
        const [selectedIndex, setSelectedIndex] = useState(-1)
        const { theme } = useTheme()
        const debounceRef = useRef<number | null>(null)
        const inputRef = useRef<HTMLInputElement>(null)

        useEffect(() => {
            // debounce search
            if (debounceRef.current) window.clearTimeout(debounceRef.current)
            if (!query || query.trim().length < 2) {
                setResults([])
                setSelectedIndex(-1)
                setLoading(false)
                return
            }

            setLoading(true)
            // @ts-ignore - window.setTimeout returns number
            debounceRef.current = window.setTimeout(async () => {
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    if (res.ok) {
                        const json = await res.json()
                        setResults(json)
                        setSelectedIndex(-1)
                    } else {
                        setResults([])
                        setSelectedIndex(-1)
                    }
                } catch (err) {
                    // eslint-disable-next-line no-console
                    console.error('Search fetch error', err)
                    setResults([])
                    setSelectedIndex(-1)
                } finally {
                    setLoading(false)
                }
            }, 300)

            return () => {
                if (debounceRef.current) window.clearTimeout(debounceRef.current)
            }
        }, [query])

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (!results.length) return

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
                    break
                case 'Enter':
                    e.preventDefault()
                    if (selectedIndex >= 0 && results[selectedIndex]) {
                        window.location.href = `/blog/${results[selectedIndex].slug}`
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    setQuery('')
                    setResults([])
                    setSelectedIndex(-1)
                    break
                default:
                    break
            }
        }

        const handleSearch = (e: FormEvent) => {
            e.preventDefault()
            // focusing and debounce already handle searching; on submit we'll just keep results
        }

        return (
            <div className="w-full border-t border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <form onSubmit={handleSearch} className="flex items-center gap-3">
                        <label htmlFor="site-search" className="sr-only">
                            Search the site
                        </label>
                        <div className="flex-1 relative">
                            <input
                                ref={inputRef}
                                id="site-search"
                                type="search"
                                value={query}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search posts, tags, categories..."
                                className={`w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                    theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300'
                                }`}
                                aria-label="Search"
                            />

                            {/* results dropdown */}
                            {query.trim().length >= 2 && (
                                <div
                                    className={`absolute left-0 right-0 mt-2 z-40 max-h-80 overflow-auto rounded-md shadow-lg ${
                                        theme === 'dark' ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-200'
                                    }`}
                                >
                                    <div className="p-2">
                                        {loading && <div className="px-2 py-3 text-sm text-zinc-500">Searching...</div>}
                                        {!loading && results.length === 0 && (
                                            <div className="px-2 py-3 text-sm text-zinc-500">No results</div>
                                        )}
                                        {!loading && results.map((r, idx) => (
                                            <div
                                                key={r.slug}
                                                className={`px-3 py-2 rounded transition-colors cursor-pointer ${
                                                    selectedIndex === idx
                                                        ? theme === 'dark'
                                                            ? 'bg-zinc-700'
                                                            : 'bg-blue-100'
                                                        : theme === 'dark'
                                                        ? 'hover:bg-zinc-800'
                                                        : 'hover:bg-zinc-50'
                                                }`}
                                                onClick={() => {
                                                    window.location.href = `/blog/${r.slug}`
                                                }}
                                            >
                                                <Link href={`/blog/${r.slug}`} className="block no-underline">
                                                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{r.title}</div>
                                                    {r.excerpt && <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{r.excerpt}</div>}
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`inline-flex items-center px-4 py-2 rounded-md font-medium border transition-colors ${
                                theme === 'dark'
                                    ? 'border-zinc-700 bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                                    : 'border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50'
                            }`}
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    export default SearchBar