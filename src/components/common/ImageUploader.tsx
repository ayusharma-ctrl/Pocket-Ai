import React, { useRef } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'

interface ImageUploaderProps {
    handleFile: (file: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ handleFile }) => {

    const hiddenFileInput = useRef<HTMLInputElement>(null); // reference to hidden input element 

    // open the image uploader on button click
    const handleClick = () => {
        hiddenFileInput.current?.click();
    };

    // method to handle the selected image 
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files ? event.target.files[0] : null;
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) handleFile(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    return (
        <>
            <Button variant={'destructive'} onClick={handleClick} aria-label='upload-image'>
                Upload Image
            </Button>
            <Input
                type="file"
                accept="image/*"
                onChange={handleChange}
                ref={hiddenFileInput}
                className='hidden'
            />
        </>
    )
}

export default ImageUploader;