import { Card, CardHeader, CardFooter, Image, Button } from "@heroui/react";

export function TattooExamples() {
  return (
    <div className="w-full gap-6 grid grid-cols-12 grid-rows-5 px-8 sm:px-12 lg:px-16 xl:px-20 h-[1800px]">
      
      {/* Large Feature Card - AI Powered */}
      <Card isFooterBlurred className="col-span-12 md:col-span-6 lg:col-span-5 row-span-2 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-6 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-8 rounded-t-lg">
          <p className="text-lg text-white uppercase font-bold tracking-wide">AI Powered</p>
          <h4 className="text-white font-bold text-4xl">Realistic Preview</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Tattoo preview technology"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-preview-tech.jpg"
        />
        <CardFooter className="absolute bg-black/40 backdrop-blur-md bottom-0 border-t-1 border-white/20 z-10 justify-between p-8">
          <div>
            <p className="text-white text-xl font-bold">See exactly how it looks.</p>
            <p className="text-white/80 text-lg">Before you ink.</p>
          </div>
          <Button color="primary" radius="full" size="lg" className="font-bold text-lg px-8 py-4">
            Try Now
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dragon Sleeve */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-3 row-span-1 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-4 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-6 rounded-t-lg">
          <p className="text-sm text-white uppercase font-bold tracking-wide">Dragon Sleeve</p>
          <h4 className="text-white font-bold text-xl">Traditional Japanese</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Dragon tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-dragon.jpg"
        />
      </Card>
      
      {/* Rose Shoulder */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-4 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-6 rounded-t-lg">
          <p className="text-sm text-white uppercase font-bold tracking-wide">Rose Shoulder</p>
          <h4 className="text-white font-bold text-xl">Realistic Floral Design</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Rose tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-rose.jpg"
        />
      </Card>
      
      {/* Geometric */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-3 row-span-1 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-4 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-6 rounded-t-lg">
          <p className="text-sm text-white uppercase font-bold tracking-wide">Geometric</p>
          <h4 className="text-white font-bold text-xl">Minimalist Art</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Geometric tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-geometric.jpg"
        />
      </Card>
      
      {/* Script Text */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-4 row-span-1 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-4 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-6 rounded-t-lg">
          <p className="text-sm text-white uppercase font-bold tracking-wide">Script Text</p>
          <h4 className="text-white font-bold text-xl">Custom Lettering</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Script tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-script.jpg"
        />
      </Card>
      
      {/* Mandala - Tall */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-5 row-span-2 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-6 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-8 rounded-t-lg">
          <p className="text-lg text-white uppercase font-bold tracking-wide">Mandala</p>
          <h4 className="text-white font-bold text-3xl">Spiritual Design</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Mandala tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-mandala.jpg"
        />
      </Card>
      
      {/* Tribal Card - Tall */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-4 row-span-2 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-6 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-8 rounded-t-lg">
          <p className="text-lg text-white uppercase font-bold tracking-wide">Tribal</p>
          <h4 className="text-white font-bold text-3xl">Bold Patterns</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Tribal tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-tribal.jpg"
        />
      </Card>
      
      {/* Watercolor Card - Tall */}
      <Card className="col-span-12 md:col-span-6 lg:col-span-3 row-span-2 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
        <CardHeader className="absolute z-10 top-6 flex-col items-start bg-gradient-to-b from-black/70 to-transparent p-8 rounded-t-lg">
          <p className="text-lg text-white uppercase font-bold tracking-wide">Watercolor</p>
          <h4 className="text-white font-bold text-3xl">Artistic Splash</h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Watercolor tattoo example"
          className="z-0 w-full h-full object-cover"
          src="/images/tattoo-example-watercolor.jpg"
        />
      </Card>
      
    </div>
  );
}