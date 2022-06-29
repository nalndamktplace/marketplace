import { useRef, useState } from "react"

import Button from "../Buttons/Button"

import { isFilled } from "../../../helpers/functions"

const FilePicker = (props) => {
	const fileInputRef = useRef()
	const [file, setFile] = useState(null)

	const handleUploadButton = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (e) => {
		if(isFilled(e.target.files)){
			setFile(e.target.files[0].name)
		} else {
			setFile("")
		}
		(typeof props.onChange === "function") && props.onChange(e)
	}

	return (
		<div className="file-input">
			<Button type="primary" onClick={handleUploadButton} >Upload</Button>
			<input
				className="file-input__hidden-input"
				type="file"
				accept={props.accept}
				onChange={handleFileChange}
				ref={fileInputRef}
			/>
			<div className="file-input__file-name typo__color--n400">{file ? file : props.placeholder || "Upload File"}</div>
		</div>
	)
}

export default FilePicker
