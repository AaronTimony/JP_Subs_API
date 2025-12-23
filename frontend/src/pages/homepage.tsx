import {useState} from "react"
import {SearchBar} from "../components/searchBar.tsx"
import ShowSubtitles from "../components/showSubtitles.tsx"
import {useGetSubs} from "../hooks/getSubs.tsx"
import "../css/homepage.css"
import { ClipLoader } from "react-spinners"

function HomePage() {
  const [pageSearchQuery, setPageSearchQuery] = useState<string>("")
  const {getAllSubs, searchSubs} = useGetSubs({searchQuery: pageSearchQuery});

  if (getAllSubs.isLoading || (pageSearchQuery && searchSubs.isLoading)) return (
    <div className="loading-container">
      <ClipLoader color="#0000FF" size={50} />
    </div>
  )

  return (
    <>
      <div className="homepage-header">
        <h1 className="homepage-title">Japanese Subtitles Public API</h1>
        <p className="homepage-description">An API for searching and accessing Japanese subtitles</p>
      </div>
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
