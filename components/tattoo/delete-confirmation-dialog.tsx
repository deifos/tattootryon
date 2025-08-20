"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { type GalleryItem } from "@/lib/gallery-storage"

interface DeleteConfirmationState {
  isOpen: boolean
  type: 'item' | 'bulk'
  itemId?: string
  bulkType?: GalleryItem['type']
  itemName?: string
}

interface DeleteConfirmationDialogProps {
  deleteConfirmation: DeleteConfirmationState
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({
  deleteConfirmation,
  onConfirm,
  onCancel,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(open: boolean) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {deleteConfirmation.type === 'item' ? 'Delete Item' : 'Clear Gallery'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {deleteConfirmation.type === 'item' ? (
              <>
                Are you sure you want to delete &quot;{deleteConfirmation.itemName}&quot;? This action cannot be undone.
              </>
            ) : (
              <>
                {deleteConfirmation.bulkType ? (
                  <>Are you sure you want to clear all {deleteConfirmation.bulkType} images? This will permanently delete all {deleteConfirmation.bulkType} items from your gallery.</>
                ) : (
                  <>Are you sure you want to clear the entire gallery? This will permanently delete all items from your gallery.</>
                )}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {deleteConfirmation.type === 'item' ? 'Delete' : 'Clear'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export type { DeleteConfirmationState }