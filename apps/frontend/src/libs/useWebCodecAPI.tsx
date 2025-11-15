import React, { useCallback, useEffect, useRef, useState } from 'react'

interface Frame {
    bitmap: ImageBitmap
    delay: number
}

interface UseWebCodecAPIProps {
    imageUrl: string
}

interface UseWebCodecAPIReturn {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    isLoading: boolean
    error: string | null
    isPlaying: boolean
    originalImage: string
}

export function useWebCodecAPI({ imageUrl }: UseWebCodecAPIProps): UseWebCodecAPIReturn {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [originalImage, setOriginalImage] = useState<string | undefined>()
    
    const framesRef = useRef<Array<Frame>>([])
    const indexRef = useRef(0)
    const nextFrameTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const loadAPNG = useCallback(async (url: string) => {
        if (!canvasRef.current) {
            return
        }

        setIsLoading(true)
        setError(null)
        
        try {
            const canvas = canvasRef.current
            const ctx = canvas.getContext('2d')

            if (!ctx) {
                throw new Error('Could not get 2D context from canvas')
            }

            // Check if APNG is supported
            const isApngSupported = await ImageDecoder.isTypeSupported('image/apng')
            const isPngSupported = await ImageDecoder.isTypeSupported('image/png')
            
            console.log('APNG supported:', isApngSupported, 'PNG supported:', isPngSupported)

            const res = await fetch(url)
            console.dir(res)
            if (!res.ok) {
                throw new Error(`Failed to fetch image: ${res.statusText}`)
            }
            
            const buf = await res.arrayBuffer()
            console.log('Buffer size:', buf.byteLength)

            let decoder: ImageDecoder | null = null
            let decodingError: Error | null = null

            // Try different approaches to create the decoder
            const attempts = [
                () => new ImageDecoder({ data: buf, type: 'image/apng' }),
                () => new ImageDecoder({ data: buf, type: 'image/png' })
            ]

            for (let i = 0; i < attempts.length; i++) {
                try {
                    decoder = attempts[i]()
                    
                    // Wait for the decoder to be ready (if needed)
                    if (decoder.completed) {
                        await decoder.completed
                    }
                    
                    console.log(`Attempt ${i + 1} successful. Decoder tracks length:`, decoder.tracks.length)
                    
                    if (decoder.tracks.length > 0) {
                        console.log('Success with attempt', i + 1)
                        break
                    } else {
                        throw new Error(`Attempt ${i + 1}: No tracks found`)
                    }
                } catch (err) {
                    console.warn(`Attempt ${i + 1} failed:`, err)
                    decodingError = err instanceof Error ? err : new Error('Unknown decoder error')
                    decoder = null
                    
                    if (i === attempts.length - 1) {
                        throw decodingError
                    }
                }
            }

            if (!decoder) {
                throw new Error('Failed to create decoder after all attempts')
            }

            console.log('Final decoder tracks:', decoder.tracks.length)

            if (decoder.tracks.length === 0) {
                throw new Error('No tracks found in image after all attempts')
            }

            const track = decoder.tracks[0]
            console.log('Selected track:', track)
            
            if (!track) {
                throw new Error('First track is undefined')
            }
            
            // Try to get actual dimensions from the track or use defaults
            let width = 300
            let height = 300
            
            // If we can decode the first frame to get dimensions
            try {
                const firstFrame = await decoder.decode({ frameIndex: 0 })
                width = firstFrame.image.displayWidth || firstFrame.image.codedWidth || 300
                height = firstFrame.image.displayHeight || firstFrame.image.codedHeight || 300
                firstFrame.image.close() // Clean up the first frame
            } catch (dimensionError) {
                console.warn('Could not get dimensions from first frame, using defaults:', dimensionError)
            }
            
            canvas.width = width
            canvas.height = height

            const totalFrames = track.frameCount || 1
            console.log('Total frames:', totalFrames)
            const frames: Array<Frame> = []

            for (let i = 0; i < totalFrames; i++) {
                const result = await decoder.decode({ frameIndex: i })
                const bitmap = await createImageBitmap(result.image)
                frames.push({
                    bitmap,
                    delay: 100 // Default delay since duration might not be available
                })
            }
            
            framesRef.current = frames
            indexRef.current = 0
        } catch (err) {
            console.log(err)
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
        } finally {
            setIsLoading(false)
        }
    }, [])

    const playFrames = useCallback(() => {
        if (!isPlaying || !canvasRef.current || framesRef.current.length === 0) {
            return
        }

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
            return
        }

        const frame = framesRef.current[indexRef.current]
        ctx.drawImage(frame.bitmap, 0, 0)
        indexRef.current = (indexRef.current + 1) % framesRef.current.length

        nextFrameTimeoutRef.current = setTimeout(playFrames, frame.delay)
    }, [isPlaying])

    const startAnimation = useCallback(() => {
        if (!isPlaying && framesRef.current.length > 0) {
            setIsPlaying(true)
        }
    }, [isPlaying])

    const stopAnimation = useCallback(() => {
        setIsPlaying(false)
        if (nextFrameTimeoutRef.current) {
            clearTimeout(nextFrameTimeoutRef.current)
            nextFrameTimeoutRef.current = null
        }
    }, [])

    // Set the original image URL when the component mounts
    useEffect(() => {
        setOriginalImage(imageUrl)
    }, [imageUrl])

    // Load the image when imageUrl changes
    useEffect(() => {
        if (imageUrl) {
            loadAPNG(imageUrl).catch(console.error)
        }
    }, [imageUrl, loadAPNG])

    // Handle play/pause logic
    useEffect(() => {
        if (isPlaying) {
            playFrames()
        } else {
            if (nextFrameTimeoutRef.current) {
                clearTimeout(nextFrameTimeoutRef.current)
                nextFrameTimeoutRef.current = null
            }
        }
    }, [isPlaying, playFrames])

    // Set up canvas event listeners
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) {
            return
        }

        canvas.addEventListener('mouseenter', startAnimation)
        canvas.addEventListener('mouseleave', stopAnimation)

        return () => {
            canvas.removeEventListener('mouseenter', startAnimation)
            canvas.removeEventListener('mouseleave', stopAnimation)
            if (nextFrameTimeoutRef.current) {
                clearTimeout(nextFrameTimeoutRef.current)
            }
        }
    }, [startAnimation, stopAnimation])

    return {
        canvasRef,
        error,
        isLoading,
        isPlaying,
        originalImage: originalImage || imageUrl
    }
}