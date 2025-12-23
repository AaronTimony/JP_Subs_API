import {useState, useRef, type FormEvent, type ChangeEvent} from "react"
import "../css/searchbar.css"

interface SearchBarProps {
  setPageSearchQuery: (query: string) => void,
  detail: string
}

export function SearchBar({setPageSearchQuery, detail}: SearchBarProps) {
  // Requires two states as one state is the current appearance of the search bar
  // and the other state is what we send to the backend when the form is submitted for searching.
  
  const [searchQuery, setSearchQuery] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPageSearchQuery(searchQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-container">
        <label htmlFor="search-box" className="sr-only">
          Search
        </label>
        <input
          ref={inputRef}
          id="search-box"
          type="text"
          placeholder={`Search ${detail}`}
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  )
}
