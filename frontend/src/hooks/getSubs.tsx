import {useQuery} from "@tanstack/react-query"

export function useGetSubs({searchQuery}: {searchQuery: string}) {

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

  const searchSubs = useQuery({
    queryKey: ["Search", searchQuery],
    queryFn: async () => {
      const response = await fetch(`http://localhost:8000/subtitles/searchSubs?search=${searchQuery}`)

      if (!response.ok) {
        throw new Error("Could not search subtitles")
      }

      const data = await response.json()

      return data
    },
    enabled: !!searchQuery
  })

  return {searchSubs, getAllSubs}
}

