import React from 'react'
import OCR from '@/components/OCR';

const page = () => {
    return (
        <div className="min-h-[85vh] mt-20">
            <div className='self-start mb-2 px-16'>
                <h1 className='text-lg font-semibold'>Optical Character Recognition</h1>
                <p className='text-sm font-normal my-0'>Upload your image, we will try to extract text out of it. We are using Tesseract and Tensorflow tfjs model.</p>
            </div>
            <div className='my-4 mx-16'>
                <OCR />
            </div>
        </div>
    )
}

export default page