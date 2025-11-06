package models

type UploadSubParams struct {
	FileName string
	Content  []byte
}

type UploadSubResponse struct {
	FileName string
}
