import {useState, useRef, type FormEvent, type ChangeEvent} from "react"

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
    <div className="search-bar-div">
      <form onSubmit={handleSubmit} className="search-bar-form">
        <input
          ref={inputRef}
          id="search-box"
          placeholder={`Search ${detail}...`}
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
          autoComplete="off"
        />
      </form>
    </div>
  )
}
