'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, Zap, Eye, Camera, ArrowRight, Check, Star, Menu, X } from 'lucide-react';
import { CircularPatterns } from '@/components/ink-splash';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 relative overflow-hidden">
      {/* White Grid with Dots Background */}
      <CircularPatterns />
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-sm border-b-2 border-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-3xl font-cursive font-bold tracking-tight text-white">TattooTryOn</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-gray-300 transition-colors font-semibold text-white">Features</a>
              <a href="#how-it-works" className="hover:text-gray-300 transition-colors font-semibold text-white">How It Works</a>
              <a href="#examples" className="hover:text-gray-300 transition-colors font-semibold text-white">Examples</a>
              <Link href="/dashboard" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-xl font-bold transition-colors">
                Try Now
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X className="text-white" /> : <Menu className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-white">
            <div className="px-4 py-6 space-y-4">
              <a href="#features" className="block hover:text-gray-300 transition-colors font-medium text-white">Features</a>
              <a href="#how-it-works" className="block hover:text-gray-300 transition-colors font-medium text-white">How It Works</a>
              <a href="#examples" className="block hover:text-gray-300 transition-colors font-medium text-white">Examples</a>
              <Link href="/dashboard" className="block w-full bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-xl font-bold transition-colors text-center">
                Try Now
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight font-sans">
              <span className="font-cursive font-bold text-5xl md:text-7xl">See Your Tattoo</span>
              <br />
              <span className="font-sans">Before You Ink</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto font-medium">
              Upload your body part photo and tattoo design. Our AI shows you exactly how it&lsquo;ll look in real life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard" className="bg-gray-900 text-white hover:bg-gray-800 px-10 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center space-x-2 shadow-lg">
                <span>Start Now - Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
              {/* Example cards showing before/after results */}
              <div className="bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-center mb-3">
                  <h3 className="font-bold text-gray-900 text-lg">Dragon Sleeve</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden w-full">
                      <div className="w-full h-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      BODY
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden w-full">
                      <div className="w-full h-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      DESIGN
                    </div>
                  </div>
                  <div className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden w-full">
                      <div className="w-full h-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                        <Zap className="w-8 h-8 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                      RESULT
                    </div>
                  </div>
                </div>
              </div>

              {/* More example cards */}
              {[
                { title: "Rose Shoulder", colors: ["blue", "yellow", "red"] },
                { title: "Geometric Back", colors: ["indigo", "pink", "orange"] },
                { title: "Script Wrist", colors: ["cyan", "emerald", "violet"] },
                { title: "Mandala Forearm", colors: ["amber", "rose", "teal"] },
                { title: "Phoenix Chest", colors: ["red", "orange", "yellow"] }
              ].map((example, index) => (
                <div key={index} className="bg-white border-2 border-gray-900 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-center mb-3">
                    <h3 className="font-bold text-gray-900 text-lg">{example.title}</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {example.colors.map((color, colorIndex) => (
                      <div key={colorIndex} className="relative">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden w-full">
                          <div className={`w-full h-full bg-gradient-to-br from-${color}-200 to-${color}-300 flex items-center justify-center`}>
                            {colorIndex === 0 && <Camera className="w-6 h-6 text-gray-600" />}
                            {colorIndex === 1 && <Eye className="w-6 h-6 text-gray-600" />}
                            {colorIndex === 2 && <Zap className="w-6 h-6 text-gray-600" />}
                          </div>
                        </div>
                        <div className="absolute bottom-1 left-1 bg-gray-900 text-white px-1.5 py-0.5 rounded text-xs font-bold">
                          {colorIndex === 0 ? 'BODY' : colorIndex === 1 ? 'DESIGN' : 'RESULT'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t-4 border-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
              <span className="font-cursive font-bold">Powered by</span> AI Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-medium">
              Professional-grade tattoo visualization that artists and clients trust
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Smart Upload</h3>
              <p className="text-gray-600 mb-6 font-medium min-h-[72px]">
                Upload any body part photo. Our AI detects skin tone, curves, and optimal placement zones automatically.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Auto skin detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Perfect positioning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Size optimization</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Design Generator</h3>
              <p className="text-gray-600 mb-6 font-medium min-h-[72px]">
                Upload your design or generate new ones. AI creates tattoos that fit your body&lsquo;s natural contours.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Custom generation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Style matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Perfect scaling</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl hover:bg-gray-50 transition-colors shadow-lg">
              <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Realistic Preview</h3>
              <p className="text-gray-600 mb-6 font-medium min-h-[72px]">
                See exactly how your tattoo will look with realistic shadows, skin integration, and lighting.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Real-time rendering</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>Skin tone matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-gray-900" />
                  <span>HD quality output</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
              <span className="font-cursive font-bold">Simple</span> Process
            </h2>
            <p className="text-xl text-gray-600 font-medium">
              Get your tattoo preview in under 2 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Upload Photo</h3>
              <p className="text-gray-600 font-medium">
                Take or upload a clear photo of where you want your tattoo
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Add Design</h3>
              <p className="text-gray-600 font-medium">
                Upload your tattoo design or generate one with our AI
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-black shadow-lg">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">See Results</h3>
              <p className="text-gray-600 font-medium">
                AI overlays your design with photorealistic precision
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="examples" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t-4 border-gray-900 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 font-sans">
              <span className="font-cursive font-bold">Trusted by</span> Tattoo Artists
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-gray-900 text-gray-900" />
              ))}
              <span className="text-xl font-bold ml-2 text-gray-900">4.9/5 from 25,000+ users</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 font-medium">
                &quot;Game changer! I could see exactly how my sleeve would look before booking. Saved me from making a huge mistake.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <p className="font-bold text-gray-900">Mike Chen</p>
                  <p className="text-sm text-gray-500">Tattoo Collector</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 font-medium">
                &quot;As a tattoo artist, this tool helps me show clients exactly what their piece will look like. Essential for consultations.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold">
                  S
                </div>
                <div>
                  <p className="font-bold text-gray-900">Sarah Martinez</p>
                  <p className="text-sm text-gray-500">Professional Artist</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 border-2 border-gray-900 rounded-2xl shadow-lg">
              <div className="flex items-center space-x-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gray-900 text-gray-900" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 font-medium">
                &quot;The realism is incredible! Tried 20+ designs and found the perfect one. My artist was impressed with the accuracy.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold">
                  A
                </div>
                <div>
                  <p className="font-bold text-gray-900">Alex Rivera</p>
                  <p className="text-sm text-gray-500">First Tattoo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t-4 border-gray-900 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-6 font-sans">
            <span className="font-cursive font-bold">Ready to See Your</span>
            <br />
            <span className="font-sans">Perfect Tattoo?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-medium">
            Join thousands who&lsquo;ve found their ideal ink with AI technology. No commitment, instant results.
          </p>
          <Link href="/dashboard" className="bg-gray-900 text-white hover:bg-gray-800 px-12 py-6 rounded-2xl font-black text-xl transition-colors flex items-center space-x-3 mx-auto shadow-xl w-fit">
            <span>Try TattooTryOn Free</span>
            <ArrowRight className="w-6 h-6" />
          </Link>
          <p className="text-sm text-gray-500 mt-4 font-medium">
            Free trial • No signup required • Instant preview
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8 relative z-10 border-t-2 border-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Camera className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-3xl font-cursive font-bold tracking-tight">TattooTryOn</span>
            </div>
            
            <div className="flex space-x-8 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
          
          <div className="border-t-2 border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2025 TattooTryOn. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
