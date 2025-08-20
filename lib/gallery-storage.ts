export interface GalleryItem {
  id: string
  type: 'base' | 'tattoo' | 'result'
  imageUrl: string
  thumbnail: string
  name?: string
  bodyPart?: string
  timestamp: number
}

const GALLERY_STORAGE_KEY = 'tattoo-gallery'
const MAX_ITEMS_PER_TYPE = 20

class GalleryStorage {
  private getItems(): GalleryItem[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(GALLERY_STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  private saveItems(items: GalleryItem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(items))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  private generateThumbnail(imageUrl: string): Promise<string> {
    return new Promise((resolve) => {
      // For data URLs or external URLs, try to generate thumbnail
      const img = new Image()
      
      // Handle CORS for external URLs
      if (imageUrl.startsWith('http')) {
        img.crossOrigin = 'anonymous'
      }
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          // Create thumbnail (150x150)
          canvas.width = 150
          canvas.height = 150
          
          if (ctx) {
            // Calculate dimensions to maintain aspect ratio
            const size = Math.min(img.width, img.height)
            const offsetX = (img.width - size) / 2
            const offsetY = (img.height - size) / 2
            
            ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, 150, 150)
            resolve(canvas.toDataURL('image/jpeg', 0.8))
          } else {
            resolve(imageUrl) // Fallback to original if canvas fails
          }
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error)
          resolve(imageUrl) // Fallback to original
        }
      }
      
      img.onerror = (error) => {
        console.warn('Failed to load image for thumbnail:', error)
        resolve(imageUrl) // Fallback to original
      }
      
      img.src = imageUrl
    })
  }

  async addItem(
    type: GalleryItem['type'], 
    imageUrl: string, 
    name?: string, 
    bodyPart?: string
  ): Promise<GalleryItem> {
    console.log('Adding item to gallery:', { type, imageUrl: imageUrl.substring(0, 50), name, isExternal: imageUrl.startsWith('http') })
    
    const items = this.getItems()
    
    // Check if the same image URL already exists for this type
    const existingItem = items.find(item => item.type === type && item.imageUrl === imageUrl)
    if (existingItem) {
      console.log('Image already exists in gallery, returning existing item:', existingItem.id)
      return existingItem
    }
    
    // For external URLs, use original URL as thumbnail to avoid CORS issues
    // For data URLs, try to generate thumbnail
    let thumbnail = imageUrl
    
    if (imageUrl.startsWith('data:')) {
      try {
        thumbnail = await this.generateThumbnail(imageUrl)
      } catch (error) {
        console.warn('Failed to generate thumbnail, using original:', error)
        thumbnail = imageUrl
      }
    }
    
    const newItem: GalleryItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      imageUrl,
      thumbnail,
      name,
      bodyPart,
      timestamp: Date.now()
    }
    
    // Remove oldest items if we exceed the limit for this type
    const itemsOfType = items.filter(item => item.type === type)
    if (itemsOfType.length >= MAX_ITEMS_PER_TYPE) {
      const toRemove = itemsOfType
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, itemsOfType.length - MAX_ITEMS_PER_TYPE + 1)
      
      toRemove.forEach(item => {
        const index = items.findIndex(i => i.id === item.id)
        if (index > -1) items.splice(index, 1)
      })
    }

    // Add new item
    items.push(newItem)
    this.saveItems(items)
    
    return newItem
  }

  getItemsByType(type: GalleryItem['type']): GalleryItem[] {
    return this.getItems()
      .filter(item => item.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
  }

  getAllItems(): GalleryItem[] {
    return this.getItems().sort((a, b) => b.timestamp - a.timestamp)
  }

  removeItem(id: string): void {
    const items = this.getItems().filter(item => item.id !== id)
    this.saveItems(items)
  }

  clearAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(GALLERY_STORAGE_KEY)
    }
  }

  clearByType(type: GalleryItem['type']): void {
    const items = this.getItems().filter(item => item.type !== type)
    this.saveItems(items)
  }
}

export const galleryStorage = new GalleryStorage()