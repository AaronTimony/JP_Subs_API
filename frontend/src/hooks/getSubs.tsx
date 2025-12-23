import {useQuery} from "@tanstack/react-query"

export function useGetSubs({searchQuery, limit, deckID}: {searchQuery?: string, limit?: number, deckID?: number}) {

  const getAllSubs = useQuery({
    queryKey: ["Available"],
    queryFn: async () => {
      const response = await fetch("http://localhost:8000/subtitles/getSubs")

      if (!response.ok) {
        throw new Error("Failed to fetch subtitle files")
      }

      const data = await response.json()

      return data
    }
  })

  const params = new URLSearchParams()
  if (searchQuery) params.append("search", searchQuery)
  if (limit) params.append("limit", limit.toString())

  const searchSubs = useQuery({
    queryKey: ["Search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/subtitles/searchSubs?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Could not search subtitles")
      }

      const data = await response.json()

      return data
    },
    enabled: !!searchQuery
  })

  const newParams = new URLSearchParams()
  if (deckID) newParams.append("DeckID", deckID.toString())

  const queryForSubs = useQuery({
    queryKey: ["Search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/subtitles/useAPI?${newParams.toString()}`)

      if (!response.ok) {
        throw new Error("Could not search subtitles")
      }

      const data = await response.json()

      return data
    },
    enabled: !!searchQuery
  })

  return {searchSubs, getAllSubs, queryForSubs}
}

