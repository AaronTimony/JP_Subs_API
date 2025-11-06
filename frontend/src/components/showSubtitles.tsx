
export default function ShowSubtitles({names}: {names: string[]}) {
  console.log("HERE ARE THE NAMES", names)
  return (
    <div className="showAllSubs-box">
      {names && names.map((name, index) => (
        <p key={index}>{name}</p>
      ))}
    </div>
  )
}
