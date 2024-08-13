"use client"
import React, { useState } from 'react'
import Tesseract from "tesseract.js";
import * as tf from "@tensorflow/tfjs";
import Image from 'next/image';
import ImageUploader from './common/ImageUploader';


const OCR = () => {
    const [image, setImage] = useState<string | null>(null);
    const [text, setText] = useState<string>("");

    const handleImageChange = (imageData: string) => {
        setText("");
        setImage(imageData);
        processImage(imageData);
    };

    // method to read the text from uploaded image
    const processImage = async (imageData: string): Promise<void> => {
        const myImg = new window.Image();
        myImg.src = imageData;

        myImg.onload = async () => {
            const originalWidth = myImg.width;
            const originalHeight = myImg.height;

            // convert the image to a TensorFlow.js tensor
            const tensor = tf.browser.fromPixels(myImg);

            // pre-processing
            const processedTensor = tf.tidy(() => {
                const gray = tf.mean(tensor, 2).expandDims(-1); // convert to grayscale
                const contrastFactor = 5; // adjust contrast
                const mean = gray.mean(); // calculate mean
                const adjustedContrast = gray.sub(mean).mul(contrastFactor).add(mean).clipByValue(0, 1); // float 32 so convert to 0-1 not 0-255
                return adjustedContrast;
            });

            // convert processed tensor to image data
            const processedImageData = await tf.browser.toPixels(processedTensor as tf.Tensor3D);

            // create a canvas to pass processed image data to Tesseract
            const canvas = document.createElement("canvas");
            canvas.width = originalWidth;
            canvas.height = originalHeight;
            const ctx = canvas.getContext("2d");

            if (ctx) {
                const imgData = ctx.createImageData(originalWidth, originalHeight);
                imgData.data.set(processedImageData);
                ctx.putImageData(imgData, 0, 0);
                const processedImageDataUrl = canvas.toDataURL();

                // use Tesseract to extract text
                Tesseract.recognize(processedImageDataUrl, "eng").then(({ data: { text } }) => setText(text));
            }

            // free up memory
            processedTensor.dispose();
        };
    };

    return (
        <>
            <ImageUploader handleFile={handleImageChange} />
            <div className='my-4 w-full flex justify-center'>
                {image &&
                    <Image src={image} alt="uploaded image" width={320} height={440} className='p-1 border-2 border-lime-400 rounded-sm' />
                }
            </div>
            {text.length > 0 && (
                <p className='my-4'>
                    <span className='font-bold'>Extracted Text:</span> {text}
                </p>
            )}
        </>
    )
}

export default OCR