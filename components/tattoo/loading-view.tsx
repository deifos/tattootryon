"use client"

export function LoadingView() {
  return (
    <div className="flex items-center justify-center text-gray-500 w-full h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p>Loading images...</p>
      </div>
    </div>
  )
}