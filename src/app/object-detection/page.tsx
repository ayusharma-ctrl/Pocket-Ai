import React from 'react'
import ObjectDetection from '@/components/ObjectDetection'

const page = () => {
    return (
        <div className="min-h-[85vh] mt-20">
            <div className='self-start mb-2 px-16'>
                <h1 className='text-lg font-semibold'>Object Detection</h1>
                <p className='text-sm font-normal my-0'>Upload your image, we will try to detect the objects. We are using Tensorflow coco-ssd model.</p>
            </div>
            <div className='my-4 mx-16'>
                <ObjectDetection />
            </div>
        </div>
    )
}

export default page