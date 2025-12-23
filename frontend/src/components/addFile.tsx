import {useState, type FormEvent} from "react"
import {useAddSubs} from "../hooks/useAddSubs"
import "../css/addSubs.css"

type addedFile = {
  name: string;
  title: string;
  episode: number;
  season: number
  media: string;
  fileType: string;
  file: File
  deckId: number;
}

type MetaDataType = {
  title: string;
  season: number;
  episode: number;
  media: string;
  deckId: number;
}

export default function AddSubtitles() {
  const {uploadSubFiles} = useAddSubs();
  const [files, setFiles] = useState<File[]>([]);
  const [metaData, setMetaData] = useState<MetaDataType>({
    title: '',
    season: 0,
    episode: 0,
    media: '',
    deckId: 0
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

  setFiles(Array.from(e.target.files))

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setMetaData(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const selectedFiles: addedFile[] = files.map(file => ({
      name: file.name,
      title: metaData.title,
      episode: Number(metaData.episode),
      season: Number(metaData.season),
      media: metaData.media,
      fileType: ".srt",
      file: file,
      deckId: Number(metaData.deckId),
    }));

    uploadSubFiles.mutate(selectedFiles)
  }

  return (
    <form onSubmit={handleSubmit} className="subtitle-submit-form">
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          name="title"
          type="text"
          value={metaData.title}
          onChange={handleInputChange}
          placeholder="e.g. Attack on Titan"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="media">Media Type:</label>
        <select 
          id="media" 
          name="media"
          value={metaData.media}
          onChange={handleInputChange}
          required
        >
          <option value="">Select type</option>
          <option value="tv">TV Show</option>
          <option value="anime">Anime</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="season">Season:</label>
        <input
          id="season"
          name="season"
          type="number"
          min="1"
          value={metaData.season}
          onChange={handleInputChange}
          placeholder="e.g. 1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="episode">Episode:</label>
        <input
          id="episode"
          name="episode"
          type="number"
          min="1"
          value={metaData.episode}
          onChange={handleInputChange}
          placeholder="e.g. 1"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="episode">Deck ID:</label>
        <input
          id="deckId"
          name="deckId"
          type="number"
          min="1"
          value={metaData.deckId}
          onChange={handleInputChange}
          placeholder="e.g. 1"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="fileUpload">Add subtitles here:</label>
        <input
          id="fileUpload"
          type="file"
          multiple
          onChange={handleFileChange}
          accept=".srt,.vtt,.ass,.ssa"
          required
        />
      </div>

      <button type="submit" className="submit-files-btn">
        Submit
      </button>
    </form>
  );
}
