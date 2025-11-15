# useWebCodecAPI Hook Documentation

A React custom hook for loading and animating APNG (Animated PNG) images using the WebCodecs API. This hook provides a simple interface to display animated images that play on mouse hover.

## Features

- 🎬 **Animated PNG Support**: Load and display APNG images with frame-by-frame animation
- 🖱️ **Mouse Interaction**: Automatically plays animation on mouse hover, stops on mouse leave
- ⚡ **WebCodecs API**: Uses modern WebCodecs API for efficient image decoding
- 📱 **React Integration**: Seamlessly integrates with React component lifecycle
- 🔄 **Loading States**: Provides loading and error states for better UX
- 🎯 **TypeScript Support**: Fully typed with TypeScript interfaces

## Installation

The hook is already available in your project. Simply import it:

```tsx
import { useWebCodecAPI } from './libs/useWebCodecAPI'
```

## API Reference

### Parameters

```tsx
interface UseWebCodecAPIProps {
    imageUrl: string
}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `imageUrl` | `string` | URL or path to the APNG image file |

### Return Values

```tsx
interface UseWebCodecAPIReturn {
    canvasRef: React.RefObject<HTMLCanvasElement | null>
    isLoading: boolean
    error: string | null
    isPlaying: boolean
}
```

| Property | Type | Description |
|----------|------|-------------|
| `canvasRef` | `React.RefObject<HTMLCanvasElement \| null>` | Ref to attach to your canvas element |
| `isLoading` | `boolean` | Whether the image is currently being loaded |
| `error` | `string \| null` | Error message if loading fails, null otherwise |
| `isPlaying` | `boolean` | Whether the animation is currently playing |

## Basic Usage

### Simple Animated Image Component

```tsx
import React from 'react'
import { useWebCodecAPI } from './libs/useWebCodecAPI'

function AnimatedImage() {
    const { canvasRef, isLoading, error, isPlaying } = useWebCodecAPI({
        imageUrl: '/images/animation.apng'
    })

    if (error) {
        return <div className="error">Error loading image: {error}</div>
    }

    return (
        <div className="animated-image-container">
            {isLoading && <div className="loading">Loading animation...</div>}
            <canvas 
                ref={canvasRef}
                style={{ 
                    border: '1px solid #ccc',
                    display: isLoading ? 'none' : 'block'
                }}
            />
            {isPlaying && <p>🎬 Animation playing</p>}
        </div>
    )
}

export default AnimatedImage
```

### Advanced Usage with Styling

```tsx
import React from 'react'
import { useWebCodecAPI } from './libs/useWebCodecAPI'
import './AnimatedImage.css'

interface AnimatedImageProps {
    src: string
    alt: string
    className?: string
}

function AnimatedImage({ src, alt, className }: AnimatedImageProps) {
    const { canvasRef, isLoading, error, isPlaying } = useWebCodecAPI({
        imageUrl: src
    })

    return (
        <div className={`animated-image ${className || ''}`}>
            {error && (
                <div className="animated-image__error" role="alert">
                    <p>Failed to load {alt}</p>
                    <small>{error}</small>
                </div>
            )}
            
            {isLoading && (
                <div className="animated-image__loading" aria-live="polite">
                    <div className="spinner"></div>
                    <span>Loading {alt}...</span>
                </div>
            )}
            
            <canvas
                ref={canvasRef}
                className="animated-image__canvas"
                style={{ display: isLoading || error ? 'none' : 'block' }}
                aria-label={alt}
            />
            
            <div className="animated-image__status">
                {isPlaying ? '▶️ Playing' : '⏸️ Hover to play'}
            </div>
        </div>
    )
}

export default AnimatedImage
```

### Usage in a Gallery Component

```tsx
import React, { useState } from 'react'
import { useWebCodecAPI } from './libs/useWebCodecAPI'

const animations = [
    { id: 1, url: '/animations/demo1.apng', title: 'Demo Animation 1' },
    { id: 2, url: '/animations/demo2.apng', title: 'Demo Animation 2' },
    { id: 3, url: '/animations/demo3.apng', title: 'Demo Animation 3' }
]

function AnimationGallery() {
    const [selectedAnimation, setSelectedAnimation] = useState(animations[0])
    
    const { canvasRef, isLoading, error, isPlaying } = useWebCodecAPI({
        imageUrl: selectedAnimation.url
    })

    return (
        <div className="animation-gallery">
            <h2>Animation Gallery</h2>
            
            {/* Animation selector */}
            <div className="gallery-controls">
                {animations.map((animation) => (
                    <button
                        key={animation.id}
                        onClick={() => setSelectedAnimation(animation)}
                        className={selectedAnimation.id === animation.id ? 'active' : ''}
                    >
                        {animation.title}
                    </button>
                ))}
            </div>
            
            {/* Animation display */}
            <div className="gallery-display">
                <h3>{selectedAnimation.title}</h3>
                
                {error && (
                    <div className="error-message">
                        Error: {error}
                    </div>
                )}
                
                {isLoading && (
                    <div className="loading-spinner">
                        Loading {selectedAnimation.title}...
                    </div>
                )}
                
                <canvas 
                    ref={canvasRef}
                    className="gallery-canvas"
                    style={{ 
                        display: (isLoading || error) ? 'none' : 'block',
                        maxWidth: '100%',
                        height: 'auto'
                    }}
                />
                
                <div className="animation-info">
                    <span>Status: {isPlaying ? 'Playing' : 'Paused'}</span>
                    <small>Hover over the animation to play</small>
                </div>
            </div>
        </div>
    )
}

export default AnimationGallery
```

## CSS Styling Example

```css
/* AnimatedImage.css */
.animated-image {
    position: relative;
    display: inline-block;
    max-width: 100%;
}

.animated-image__canvas {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s ease;
}

.animated-image__canvas:hover {
    transform: scale(1.02);
}

.animated-image__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #f5f5f5;
    border-radius: 8px;
    min-height: 200px;
    justify-content: center;
}

.spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #333;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.animated-image__error {
    padding: 1rem;
    background: #fee;
    color: #c33;
    border-radius: 4px;
    border-left: 4px solid #c33;
}

.animated-image__status {
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.9rem;
    color: #666;
}
```

## Browser Support

This hook requires:
- **WebCodecs API**: Currently supported in Chrome 94+, Edge 94+
- **APNG Support**: Most modern browsers support APNG images
- **Canvas 2D Context**: Universal browser support

### Feature Detection

```tsx
function AnimatedImageWithFallback({ src, alt }: { src: string; alt: string }) {
    const supportsWebCodecs = 'ImageDecoder' in window
    
    if (!supportsWebCodecs) {
        return (
            <img 
                src={src} 
                alt={alt}
                style={{ maxWidth: '100%' }}
            />
        )
    }
    
    const { canvasRef, isLoading, error } = useWebCodecAPI({ imageUrl: src })
    
    if (error) {
        return <img src={src} alt={alt} style={{ maxWidth: '100%' }} />
    }
    
    return (
        <>
            {isLoading && <div>Loading...</div>}
            <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
        </>
    )
}
```

## Troubleshooting

### Common Issues

1. **Image not loading**: Check that the image URL is accessible and the file is a valid APNG
2. **Animation not playing**: Ensure the image has multiple frames and try hovering over the canvas
3. **WebCodecs not supported**: The hook will throw an error in unsupported browsers

### Error Handling

```tsx
function RobustAnimatedImage({ src }: { src: string }) {
    const { canvasRef, isLoading, error } = useWebCodecAPI({ imageUrl: src })
    
    if (error) {
        console.error('Animation loading failed:', error)
        // Fallback to static image
        return <img src={src} alt="Static fallback" />
    }
    
    return (
        <>
            {isLoading ? (
                <div>Loading animation...</div>
            ) : (
                <canvas ref={canvasRef} />
            )}
        </>
    )
}
```

## Performance Tips

- 🖼️ **Optimize APNG files**: Keep file sizes reasonable for web delivery
- ⚡ **Lazy loading**: Consider loading animations only when needed
- 🧹 **Memory management**: The hook automatically cleans up resources
- 📱 **Responsive design**: Use CSS to make canvas responsive

## Examples Repository

Check out more examples and demos in the project's example components directory.