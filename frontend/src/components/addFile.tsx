import {useState, type FormEvent} from "react"
import {useAddSubs} from "../hooks/useAddSubs"

type addedFile = {
  name: string;
  file: File
}

export default function AddSubtitles() {
  const {uploadSubFiles} = useAddSubs();
  const [selectedFiles, setSelectedFiles] = useState<addedFile[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const newFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      file: file
    }))

    setSelectedFiles(newFiles);

  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    uploadSubFiles.mutate(selectedFiles)
  }
  return (
    <>
      <form onSubmit={handleSubmit} className="subtitle-submit-form">
        <label htmlFor="fileUpload"> Add subtitles here: </label>
        <input
        id="fileUpload"
        type="file"
        multiple
        onChange={handleFileChange}
        placeholder="submit here"
        />
        <button type="submit" className="submit-files-btn"> Submit </button>
      </form>
    </>
  )
}
