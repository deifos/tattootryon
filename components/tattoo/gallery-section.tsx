"use client"

import Image from "next/image"
import { Button } from "@heroui/button"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Tabs, Tab } from "@heroui/tabs"
import { Image as ImageIcon, Trash2 } from "lucide-react"
import { type GalleryItem } from "@/lib/gallery-storage"

interface GallerySectionProps {
  galleryItems: GalleryItem[]
  onReuseImage: (item: GalleryItem) => void
  onDeleteFromGallery: (id: string, itemName?: string) => void
  onClearGallery: (type?: GalleryItem['type']) => void
}

export function GallerySection({
  galleryItems,
  onReuseImage,
  onDeleteFromGallery,
  onClearGallery,
}: GallerySectionProps) {
  const tabs = [
    {
      id: "all",
      type: "all" as const,
      label: `All (${galleryItems.length})`,
    },
    {
      id: "base",
      type: "base" as const,
      label: `Base Images (${galleryItems.filter(i => i.type === 'base').length})`,
    },
    {
      id: "tattoo", 
      type: "tattoo" as const,
      label: `Tattoos (${galleryItems.filter(i => i.type === 'tattoo').length})`,
    },
    {
      id: "result",
      type: "result" as const, 
      label: `Results (${galleryItems.filter(i => i.type === 'result').length})`,
    },
  ]

  return (
    <div className="mt-8">
      <Card className="border-none shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            <h3 className="text-lg font-semibold">Gallery</h3>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="bordered" 
              size="sm"
              onPress={() => onClearGallery()}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Tabs aria-label="Gallery tabs" items={tabs}>
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <Card shadow="sm">
                  <CardBody>

                    {item.type === 'all' && (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {galleryItems.map((item) => (
                            <GalleryItem 
                              key={item.id} 
                              item={item} 
                              onReuse={onReuseImage} 
                              onDelete={onDeleteFromGallery}
                              typeLabel={`${item.type} image`}
                            />
                          ))}
                        </div>
                        {galleryItems.length === 0 && (
                          <EmptyGalleryMessage />
                        )}
                      </>
                    )}

                    {item.type === 'base' && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Base images you&apos;ve uploaded</p>
                          <Button 
                            variant="bordered" 
                            size="sm"
                            onPress={() => onClearGallery('base')}
                          >
                            Clear Base Images
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {galleryItems.filter(item => item.type === 'base').map((item) => (
                            <GalleryItem 
                              key={item.id} 
                              item={item} 
                              onReuse={onReuseImage} 
                              onDelete={onDeleteFromGallery}
                              typeLabel="Base image"
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {item.type === 'tattoo' && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Tattoo designs you&apos;ve uploaded or generated</p>
                          <Button 
                            variant="bordered" 
                            size="sm"
                            onPress={() => onClearGallery('tattoo')}
                          >
                            Clear Tattoos
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {galleryItems.filter(item => item.type === 'tattoo').map((item) => (
                            <GalleryItem 
                              key={item.id} 
                              item={item} 
                              onReuse={onReuseImage} 
                              onDelete={onDeleteFromGallery}
                              typeLabel="Tattoo design"
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {item.type === 'result' && (
                      <>
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm text-gray-600">Generated tattoo results</p>
                          <Button 
                            variant="bordered" 
                            size="sm"
                            onPress={() => onClearGallery('result')}
                          >
                            Clear Results
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {galleryItems.filter(item => item.type === 'result').map((item) => (
                            <GalleryItem 
                              key={item.id} 
                              item={item} 
                              onReuse={onReuseImage} 
                              onDelete={onDeleteFromGallery}
                              typeLabel="Generated Result"
                              actionLabel="Use as Base"
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </CardBody>
                </Card>
              </Tab>
            )}
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

interface GalleryItemProps {
  item: GalleryItem
  onReuse: (item: GalleryItem) => void
  onDelete: (id: string, itemName?: string) => void
  typeLabel: string
  actionLabel?: string
}

function GalleryItem({ item, onReuse, onDelete, typeLabel, actionLabel = "Use" }: GalleryItemProps) {
  return (
    <div className="space-y-2">
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={item.thumbnail}
          alt={item.name || typeLabel}
          width={200}
          height={200}
          className="w-full h-full object-cover bg-white"
          unoptimized
          // onLoad={() => {
          //   console.log('Image loaded successfully:', item.thumbnail.substring(0, 50))
          // }}
          onError={(e) => {
            console.error('Image failed to load:', item.thumbnail)
            // Try original image URL if thumbnail fails
            const target = e.target as HTMLImageElement
            if (target.src !== item.imageUrl) {
              target.src = item.imageUrl
            }
          }}
          style={{ 
            minWidth: '100%', 
            minHeight: '100%',
            backgroundColor: 'white'
          }}
        />
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          onPress={() => onReuse(item)}
          className="flex-1 text-xs"
        >
          {actionLabel}
        </Button>
        <Button
          color="danger"
          size="sm"
          onPress={() => onDelete(item.id, item.name || typeLabel)}
          className="px-2"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <div className="mt-1">
        <p className="text-xs text-gray-500 truncate">
          {item.name || typeLabel}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-xs px-1.5 py-0.5 rounded text-white ${
            item.type === 'base' ? 'bg-blue-500' :
            item.type === 'tattoo' ? 'bg-purple-500' :
            'bg-green-500'
          }`}>
            {item.type}
          </span>
          {item.bodyPart && (
            <span className="text-xs text-gray-400">
              {item.bodyPart}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function EmptyGalleryMessage() {
  return (
    <div className="text-center py-12 text-gray-500">
      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>No images in gallery yet</p>
      <p className="text-sm mt-1">Upload images or generate tattoos to see them here</p>
    </div>
  )
}