import { useState, useEffect } from "react"

interface ImageLoadResult {
  imageObj: HTMLImageElement | null
  isLoading: boolean
  error: string | null
}

export function useImageLoader(src: string | null) {
  const [result, setResult] = useState<ImageLoadResult>({
    imageObj: null,
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!src) {
      setResult({
        imageObj: null,
        isLoading: false,
        error: null,
      })
      return
    }

    setResult(prev => ({ ...prev, isLoading: true, error: null }))

    const img = new Image()
    img.crossOrigin = "anonymous"

    const handleLoad = () => {
      setResult({
        imageObj: img,
        isLoading: false,
        error: null,
      })
    }

    const handleError = () => {
      setResult({
        imageObj: null,
        isLoading: false,
        error: 'Failed to load image',
      })
    }

    img.addEventListener('load', handleLoad)
    img.addEventListener('error', handleError)
    img.src = src

    return () => {
      img.removeEventListener('load', handleLoad)
      img.removeEventListener('error', handleError)
    }
  }, [src])

  return result
}