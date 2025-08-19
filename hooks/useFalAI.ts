import { useState, useCallback } from 'react'
import { FalAIService } from '@/services/fal-ai'

interface UseFalAIOptions {
  onSuccess?: (imageUrl: string) => void
  onError?: (error: string) => void
}

interface FalAIResult {
  imageUrl: string | null
  isGenerating: boolean
  error: string | null
  requestId: string | null
  seed: number | null
}

export function useFalAI(options: UseFalAIOptions = {}) {
  const [result, setResult] = useState<FalAIResult>({
    imageUrl: null,
    isGenerating: false,
    error: null,
    requestId: null,
    seed: null,
  })

  const generateTattoo = useCallback(async (
    compositeImageDataUrl: string,
    additionalPrompt: string = ''
  ) => {
    setResult(prev => ({ ...prev, isGenerating: true, error: null }))

    try {
      // Upload or prepare the composite image
      console.log('Uploading composite image...')
      console.log('Input data URL length:', compositeImageDataUrl?.length)
      console.log('Input data URL starts with data:', compositeImageDataUrl?.startsWith('data:'))
      
      const imageUrl = await FalAIService.uploadImageAsDataUrl(compositeImageDataUrl)
      console.log('Uploaded image URL:', imageUrl)
      
      if (!imageUrl) {
        throw new Error('Upload returned undefined/null image URL')
      }

      // Generate the tattoo
      const response = await FalAIService.generateTattoo({
        imageUrl: imageUrl,
        prompt: additionalPrompt,
        num_inference_steps: 28,
        guidance_scale: 3.5,
      })

      if (response.images && response.images.length > 0) {
        const generatedImageUrl = response.images[0].url
        
        setResult({
          imageUrl: generatedImageUrl,
          isGenerating: false,
          error: null,
          requestId: response.requestId,
          seed: response.seed || null,
        })

        options.onSuccess?.(generatedImageUrl)
      } else {
        throw new Error('No images returned from FAL AI')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate tattoo'
      
      setResult({
        imageUrl: null,
        isGenerating: false,
        error: errorMessage,
        requestId: null,
        seed: null,
      })

      options.onError?.(errorMessage)
    }
  }, [options])

  const reset = useCallback(() => {
    setResult({
      imageUrl: null,
      isGenerating: false,
      error: null,
      requestId: null,
      seed: null,
    })
  }, [])

  return {
    ...result,
    generateTattoo,
    reset,
  }
}