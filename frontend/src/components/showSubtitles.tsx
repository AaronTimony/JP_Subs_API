import {useState} from "react"
import "../css/showsubtitles.css"
import JSZip from "jszip";
import DownloadIcon from "../Icons/download-svgrepo-com.svg"

type NameData = {
  ID: string
  FileName: string
  Title: string
  Episode: number
  DeckID: number
  Content: string
}

type DownloadData = {
  Episode: number
  Content: string
  Title: string
}


export default function ShowSubtitles({names}: {names: NameData[]}) {
  const [openDeckId, setOpenDeckId] = useState<number | null>(null);

  const toggleAccordion = (deckId: number) => {
    setOpenDeckId(openDeckId === deckId ? null : deckId);
  };

  const downloadZip = async (DeckData: NameData[]) => {
    const zip = new JSZip();

    DeckData.forEach((episode) => {
      const filename = `${episode.Title}_Episode_${episode.Episode}`
      zip.file(filename, episode.Content)
    })

    const content = await zip.generateAsync({type: 'blob'});
    const url = URL.createObjectURL(content)
    const link = document.createElement('a')
    link.href = url;
    link.download = `${DeckData[0].Title}_subtitles.zip`
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  
  const downloadSubtitle = (data: DownloadData) => {
    const blob = new Blob([data.Content], {type: 'text/plain'})
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url
    link.download = `${data.Title}_Episode_${data.Episode}`
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const groupedByDeck = names?.reduce((acc, item) => {
    if (!acc[item.DeckID]) {
      acc[item.DeckID] = [];
    }
    acc[item.DeckID].push(item);
    return acc;
  }, {} as Record<number, NameData[]>);

  return (
    <div className="accordion-container">
      {groupedByDeck && Object.entries(groupedByDeck).map(([deckId, episodes]) => (
        <div className="full-container">
          <div key={deckId} className="accordion-item">
            <button 
              className="accordion-header"
              onClick={() => toggleAccordion(Number(deckId))}
            >
              <div className="accordion-header-content">
                <span className="accordion-deck">Deck {deckId}</span>
                <span className="accordion-title">{episodes[0].Title}</span>
                <span className="episode-count">{episodes.length} episode{episodes.length > 1 ? 's' : ''}</span>



              </div>

              <span className={`accordion-icon ${openDeckId === Number(deckId) ? 'open' : ''}`}>
                ▼
              </span>
            </button>
            <div className="Download-All-Button">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadZip(episodes)
                }}
              >
                <img src={DownloadIcon} alt={"Download Here"} className="Download-Icon" />
              </button>
            </div>
          </div>

          {openDeckId === Number(deckId) && (
            <div className="accordion-content">
              {episodes.map((episode) => (
                <div key={episode.ID} className="episode-item">
                  <div className="episode-info">
                    <p><strong>Episode {episode.Episode}</strong></p>
                    <p className="episode-id">ID: {episode.ID}</p>
                  </div>
                  <button
                    onClick = {() => downloadSubtitle({
                      Episode: episode.Episode,
                      Content: episode.Content,
                      Title: episode.Title
                    })} className="download-btn">
                    Download
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
