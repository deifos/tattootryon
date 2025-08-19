import { TattooTryOnClient } from "@/components/tattoo"

export default function TattooTryOnApp() {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tattoo Try-On Studio</h1>
          <p className="text-gray-600 text-lg">
            Upload your base image, design your tattoo, and see how it looks with AI
          </p>
        </div>

        <TattooTryOnClient />
      </div>
    </div>
  )
}
