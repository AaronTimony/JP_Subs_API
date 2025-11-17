import {useState} from "react"
import {SearchBar} from "../components/searchBar.tsx"
import ShowSubtitles from "../components/showSubtitles.tsx"
import {useGetSubs} from "../hooks/getSubs.tsx"

function HomePage() {
  const [pageSearchQuery, setPageSearchQuery] = useState<string>("")
  const {getAllSubs, searchSubs} = useGetSubs({searchQuery: pageSearchQuery});

  if (getAllSubs.isLoading || (pageSearchQuery && searchSubs.isLoading)) return <h1> LOADING... </h1>

  return (
    <>
      <h1> Japanese Subtitles Public API  </h1>
      <p> An API for searching and accessing Japanese subtitles </p>
        <SearchBar setPageSearchQuery={setPageSearchQuery} detail={"Subtitle Files..."} />
      {!pageSearchQuery ? (
        <ShowSubtitles names={getAllSubs.data}/>
      ) : (
        <ShowSubtitles names={searchSubs.data}/>
        )}
    </>
  )
}

export default HomePage;
