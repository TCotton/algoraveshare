import React from 'react'

import ErrorBoundary from '../libs/ErrorBoundary'
import { useWebCodecAPI } from '../libs/useWebCodecAPI'

type Props = {
    image: string
}

export default function CopyComponent(props: Props) {
    const { image } = props
    console.log(image)
    const { canvasRef, error, isLoading, isPlaying } = useWebCodecAPI({
        imageUrl: image
    })

    if (error) {
        return <div className="error">Error loading image: {error}</div>
    }
    
    return (
        <ErrorBoundary>
            <div>CopyComponent</div>
{/*
            <img src={image} alt="Logo" width='100' height='100' className='copy-component'/>
*/}
            {isLoading && <div className="loading">Loading animation...</div>}
            <canvas
                ref={canvasRef}
                style={{
                    border: '1px solid #ccc',
                    display: isLoading ? 'none' : 'block'
                }}
            />
            {isPlaying && <p>🎬 Animation playing</p>}
        </ErrorBoundary>
    )
}

