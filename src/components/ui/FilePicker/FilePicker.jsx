import { useRef, useState } from "react";
import { isFilled, isUsable } from "../../../helpers/functions";
import PrimaryButton from "../Buttons/Primary";

const FilePicker = (props) => {
    const fileInputRef = useRef();
    const [file, setFile] = useState(null);

    const handleUploadButton = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        if(isFilled(e.target.files)){
            setFile(e.target.files[0].name)
        } else {
            setFile("");
        }
        (typeof props.onChange === "fucntion") && props.onChange(e);
    }

    return (
        <div className="file-input">
            <PrimaryButton label="Upload" onClick={handleUploadButton} />
            <input
                className="file-input__hidden-input"
                type="file"
                accept={props.file}
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <div className="file-input__file-name">{file ? file : props.placeholder || "Upload File"}</div>
        </div>
    );
};

export default FilePicker;
