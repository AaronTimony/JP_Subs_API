import {useMutation} from "@tanstack/react-query"

type addedFile = {
  name: string;
  file: File
}

export function useAddSubs() {
  const uploadSubFiles = useMutation({
    mutationFn: async (fileList: addedFile[]) => {
      const formdata = new FormData();

      fileList.forEach((file) => {
        formdata.append("name", file.name)
        formdata.append("files", file.file);
      })

      const response = await fetch("http://localhost:8000/subtitles/upload", {
        method: "POST",
        credentials: "include",
        body: formdata
      })

      if (!response.ok) {
        throw new Error("Could not send files to server")
      }

      const data = await response.json()

      return data
    },
  })

  return {uploadSubFiles}
  
}
