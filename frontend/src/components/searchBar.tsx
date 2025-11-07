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
<>
  <form
    onSubmit={handleSubmit}
    className="relative max-w-md mx-auto mt-8"
  >
    <div className="relative">
      <label
        htmlFor="search-box"
        className="sr-only"
      >
        Search
      </label>

      <input
        ref={inputRef}
        id="search-box"
        type="text"
        placeholder={`Search ${detail}`}
        value={searchQuery}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        className="block w-full rounded-lg border border-gray-600 bg-gray-800 p-4 pr-24 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        Search
      </button>
    </div>
  </form>
</>
  )
}
