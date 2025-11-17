
type NameData = {
  ID: string
  FileName: string
  Title: string
  Episode: number
  DeckID: number;
}


export default function ShowSubtitles({names}: {names: NameData[]}) {
  return (
    <div className="showAllSubs-box">
      {names && names.map((name) => (
        <p key={name.ID}> {name.Title} {name.Episode} {name.ID} {name.DeckID}</p>
      ))}
    </div>
  )
}
