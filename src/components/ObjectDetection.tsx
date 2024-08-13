"use client"
import React, { useState, useEffect } from 'react'
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Image from 'next/image';
import ImageUploader from './common/ImageUploader'

interface ICanvasSize {
    width: number,
    height: number
}

const ObjectDetection = () => {
    const [image, setImage] = useState<string | null>(null);
    const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [predictedValues, setPredictedValues] = useState<cocoSsd.DetectedObject[]>();
    const [canvasSize, setCanvasSize] = useState<ICanvasSize>({ width: 0, height: 0 });

    const handleImageChange = (imageData: string) => {
        setPredictedValues(undefined);
        setImage(imageData);
        const img = new window.Image();
        img.src = imageData;
        img.onload = () => {
            setCanvasSize({ width: img.width, height: img.height });
            if (model) {
                predictImage(img);
            } else {
                console.error("Model has not loaded yet...");
            }
        };
    };

    // method to get the list of detected objects
    const predictImage = async (img: HTMLImageElement) => {
        if (model) {
            const predictions = await model.detect(img);
            setPredictedValues(predictions);
        }
    };

    // to show the rectangle around the detected objects
    const drawPredictions = (ctx: CanvasRenderingContext2D, predictions: cocoSsd.DetectedObject[]) => {
        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;
            ctx.strokeStyle = "red"; // set box color and stroke
            ctx.lineWidth = 4;
            ctx.strokeRect(x, y, width, height);
            ctx.font = "30px Inter"; // styles for text
            ctx.fillStyle = "red";
            ctx.fillText(
                `${prediction.class}: ${Math.round(prediction.score * 100)}%`,
                x,
                y > 10 ? y - 15 : 10,
            );
        });
    };

    // load the model
    useEffect(() => {
        const loadModel = async () => {
            const loadedModel = await cocoSsd.load();
            setModel(loadedModel);
        };
        loadModel();
    }, []);

    return (
        <>
            <ImageUploader handleFile={handleImageChange} />

            <div className='my-4 w-full flex flex-wrap gap-4 justify-center'>
                {image &&
                    <Image src={image} alt="uploaded image" width={320} height={440} className='p-1 border-2 border-lime-400 rounded-sm' />
                }
            </div>

            {predictedValues && predictedValues.length > 0 && (
                <div className='my-4'>
                    <h1 className='font-bold'>Predictions:</h1>
                    {predictedValues.map((eachPrediction, index) => (
                        <p key={index} className='capitalize'>
                            {eachPrediction.class}: {Math.round(eachPrediction.score * 100)}%
                        </p>
                    ))}
                </div>
            )}

            {predictedValues && predictedValues.length > 0 && image && (
                <div className='my-4 w-full flex flex-wrap gap-4 justify-center'>
                    <canvas
                        className='p-1 border-2 border-lime-400 rounded-sm w-full h-auto'
                        width={canvasSize.width}
                        height={canvasSize.height}
                        ref={(canvasRef) => {
                            if (canvasRef && predictedValues && predictedValues.length > 0) {
                                const ctx = canvasRef.getContext("2d");
                                const canvasImg = new window.Image();
                                canvasImg.src = image;
                                canvasImg.onload = () => {
                                    if (ctx) {
                                        ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                                        ctx.drawImage(canvasImg, 0, 0);
                                        drawPredictions(ctx, predictedValues);
                                    }
                                };
                            }
                        }}
                    />
                </div>
            )}
        </>
    )
}

export default ObjectDetection