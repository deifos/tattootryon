"use client";

import { useState, useRef, useEffect } from "react";
import Konva from "konva";
import { useCanvasComposer } from "@/hooks/useCanvasComposer";
import { useFalAI } from "@/hooks/useFalAI";
import { useImageLoader } from "@/hooks/useImageLoader";
import { useKeyboardEvents } from "@/hooks/useKeyboardEvents";
import { useStageSize } from "@/hooks/useStageSize";

// Components
import { CanvasControlButtons } from "./canvas-control-buttons";
import { GeneratedImageView } from "./generated-image-view";
import { LoadingView } from "./loading-view";
import { KonvaStage } from "./konva-stage";
import { EmptyState } from "./empty-state";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Upload, Palette, Zap, RotateCcw, Loader2, Download } from "lucide-react";
import { DownloadButton } from "@/components/ui/download-button";

interface KonvaPreviewCanvasProps {
  baseImage: string | null;
  tattooImage: string | null;
  bodyPart?: string;
  onApplyTattoo: () => void;
  isApplying: boolean;
  onError?: (error: string) => void;
  onGeneratedResult?: (imageUrl: string) => void;
  onTattooRemove?: () => void;
  userId?: string;
  onUploadDrawerOpen?: () => void;
  onTattooDrawerOpen?: () => void;
}

// Helper function to calculate appropriate scale for tattoo image
const calculateTattooScale = (
  tattooImg: HTMLImageElement,
  stageWidth: number,
  stageHeight: number
) => {
  const maxSize = Math.min(stageWidth, stageHeight) * 0.3;
  const tattooAspectRatio = tattooImg.width / tattooImg.height;
  let targetWidth = maxSize;
  let targetHeight = maxSize / tattooAspectRatio;

  if (targetHeight > maxSize) {
    targetHeight = maxSize;
    targetWidth = maxSize * tattooAspectRatio;
  }

  return Math.min(
    targetWidth / tattooImg.width,
    targetHeight / tattooImg.height
  );
};

export function KonvaPreviewCanvas({
  baseImage,
  tattooImage,
  bodyPart,
  isApplying,
  onError,
  onGeneratedResult,
  onTattooRemove,
  userId,
  onUploadDrawerOpen,
  onTattooDrawerOpen,
}: KonvaPreviewCanvasProps) {
  // State
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tattooScale, setTattooScale] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Refs
  const stageRef = useRef<Konva.Stage>(null);
  const tattooRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks
  const baseImageLoader = useImageLoader({ onError });
  const tattooImageLoader = useImageLoader({ onError });
  const { stageSize, calculateInitialSize } = useStageSize({
    containerRef,
    baseImage: baseImageLoader.imageObj,
  });

  // Hooks for canvas composition and FAL AI
  const { composeImages } = useCanvasComposer();
  const { generateTattoo, isGenerating } = useFalAI({
    onSuccess: (imageUrl) => {
      setGeneratedImage(imageUrl);
      onGeneratedResult?.(imageUrl);
      // Clear the tattoo from preview since it's now applied to the generated image
      onTattooRemove?.();
    },
    onError: (error) => {
      onError?.(error);
    },
    userId,
    baseImageUrl: baseImage || undefined,
    tattooImageUrl: tattooImage || undefined,
    bodyPart,
  });

  // Keyboard events
  useKeyboardEvents({
    onDelete: () => {
      if (selectedId === "tattoo") {
        onTattooRemove?.();
      }
    },
    enabled: selectedId === "tattoo",
  });

  // Load base image when it changes
  useEffect(() => {
    if (baseImage) {
      setGeneratedImage(null);
      baseImageLoader.loadImage(baseImage).then((img) => {
        if (img) {
          calculateInitialSize(img);
        }
      });
    } else {
      baseImageLoader.clearImage();
      setGeneratedImage(null);
    }
  }, [baseImage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Don't change stage size for generated images - keep original base image dimensions
  // This preserves consistent preview size regardless of generated image size

  // Load tattoo image when it changes
  useEffect(() => {
    if (tattooImage) {
      tattooImageLoader.loadImage(tattooImage).then((img) => {
        if (img && stageSize.width && stageSize.height) {
          const scale = calculateTattooScale(
            img,
            stageSize.width,
            stageSize.height
          );
          setTattooScale(scale);
          // Auto-select the tattoo when it loads
          setTimeout(() => setSelectedId("tattoo"), 50);
        }
      });
    } else {
      tattooImageLoader.clearImage();
      setSelectedId(null);
    }
  }, [tattooImage, stageSize.width, stageSize.height]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update tattoo scale when stage size changes
  useEffect(() => {
    if (tattooImageLoader.imageObj && stageSize.width && stageSize.height) {
      const scale = calculateTattooScale(
        tattooImageLoader.imageObj,
        stageSize.width,
        stageSize.height
      );
      setTattooScale(scale);
    }
  }, [tattooImageLoader.imageObj, stageSize]);

  // More robust transformer attachment with mobile-specific handling
  useEffect(() => {
    let isAttaching = false;
    
    const attachTransformer = () => {
      if (isAttaching) return;
      isAttaching = true;
      
      try {
        if (
          selectedId === "tattoo" &&
          tattooRef.current &&
          transformerRef.current &&
          tattooImageLoader.imageObj
        ) {
          // Ensure tattoo node is properly attached to layer
          const layer = tattooRef.current.getLayer();
          if (layer) {
            transformerRef.current.nodes([tattooRef.current]);
            transformerRef.current.forceUpdate();
            layer.batchDraw();
          }
        } else if (transformerRef.current) {
          // Clear transformer when no selection
          transformerRef.current.nodes([]);
          transformerRef.current.getLayer()?.batchDraw();
        }
      } catch (error) {
        console.warn("Failed to attach transformer:", error);
      } finally {
        isAttaching = false;
      }
    };

    // Multiple attempts for mobile stability
    attachTransformer();
    const timeoutId1 = setTimeout(attachTransformer, 50);
    const timeoutId2 = setTimeout(attachTransformer, 150);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, [selectedId, tattooImageLoader.imageObj]);

  // Enhanced mobile stability with scroll and resize handling
  useEffect(() => {
    let reattachTimeout: NodeJS.Timeout;
    let scrollTimeout: NodeJS.Timeout;
    let isReattaching = false;
    
    const reattachTransformer = () => {
      if (isReattaching || selectedId !== "tattoo") return;
      isReattaching = true;
      
      clearTimeout(reattachTimeout);
      reattachTimeout = setTimeout(() => {
        try {
          if (transformerRef.current && tattooRef.current) {
            const layer = tattooRef.current.getLayer();
            if (layer) {
              transformerRef.current.nodes([tattooRef.current]);
              transformerRef.current.forceUpdate();
              layer.batchDraw();
            }
          }
        } catch (error) {
          console.warn("Reattach transformer failed:", error);
        } finally {
          isReattaching = false;
        }
      }, 100);
    };

    // Handle visibility changes (tab switching, backgrounding)
    const handleVisibilityChange = () => {
      if (selectedId === "tattoo" && !document.hidden) {
        reattachTransformer();
      }
    };

    // Handle scroll events that might affect canvas
    const handleScroll = () => {
      if (selectedId === "tattoo") {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          reattachTransformer();
        }, 150);
      }
    };

    // Handle window resize
    const handleResize = () => {
      if (selectedId === "tattoo") {
        setTimeout(reattachTransformer, 200);
      }
    };

    // Handle orientation change on mobile
    const handleOrientationChange = () => {
      if (selectedId === "tattoo") {
        setTimeout(reattachTransformer, 300);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(reattachTimeout);
      clearTimeout(scrollTimeout);
    };
  }, [selectedId]);

  // Handle stage click (deselect)
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  // Handle tattoo selection
  const handleTattooSelect = () => {
    setSelectedId("tattoo");
  };

  // Handle tattoo drag move
  const handleTattooDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Prevent page scroll during drag on mobile
    e.evt.preventDefault();
    
    const node = e.target as Konva.Image;
    if (node) {
      // Position is automatically updated by Konva
      node.getLayer()?.batchDraw();
    }
  };

  // Handle tattoo drag end with enhanced mobile support
  const handleTattooDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Ensure the tattoo stays selected after dragging
    const node = e.target as Konva.Image;
    if (node) {
      setSelectedId("tattoo");
      node.getLayer()?.batchDraw();
      
      // Enhanced re-attachment with multiple attempts for mobile
      let attempts = 0;
      const maxAttempts = 3;
      
      const attemptReattach = () => {
        attempts++;
        if (attempts > maxAttempts) return;
        
        setTimeout(() => {
          if (transformerRef.current && tattooRef.current) {
            try {
              const layer = tattooRef.current.getLayer();
              if (layer) {
                transformerRef.current.nodes([tattooRef.current]);
                transformerRef.current.forceUpdate();
                layer.batchDraw();
                
                // Verify attachment worked
                const attachedNodes = transformerRef.current.nodes();
                if (attachedNodes.length === 0 && attempts < maxAttempts) {
                  attemptReattach();
                }
              }
            } catch (error) {
              console.warn(`Reattach attempt ${attempts} failed:`, error);
              if (attempts < maxAttempts) {
                attemptReattach();
              }
            }
          }
        }, attempts * 50); // Increasing delay for each attempt
      };
      
      attemptReattach();
    }
  };

  // Apply tattoo using AI
  const handleApplyTattoo = async () => {
    if ((!baseImage && !generatedImage) || !tattooImage) {
      onError?.("Please upload both a base image and a tattoo design");
      return;
    }

    try {
      // Check if stage is available
      if (!stageRef.current) {
        throw new Error("Canvas stage not available");
      }

      // Compose the canvas images into a single image
      const composition = await composeImages(
        stageRef as React.RefObject<Konva.Stage>
      );

      // Generate the tattoo application using FAL AI
      const prompt = bodyPart
        ? `Apply this tattoo to the ${bodyPart}`
        : "Apply this tattoo to the person";
      await generateTattoo(composition.dataUrl, prompt);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to apply tattoo. Please try again.";
      onError?.(errorMessage);
    }
  };

  // Reset canvas
  const resetCanvas = () => {
    setSelectedId(null);
    setGeneratedImage(null);

    // Reset tattoo position and scale
    if (tattooRef.current && tattooImageLoader.imageObj) {
      tattooRef.current.position({
        x: stageSize.width / 2,
        y: stageSize.height / 2,
      });
      const scale = calculateTattooScale(
        tattooImageLoader.imageObj,
        stageSize.width,
        stageSize.height
      );
      tattooRef.current.scale({ x: scale, y: scale });
      tattooRef.current.rotation(0);
      tattooRef.current.getLayer()?.batchDraw();
    }
  };

  // Export canvas image
  const exportImage = () => {
    if (!stageRef.current) {
      onError?.("Canvas not available for export");
      return;
    }

    try {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });

      // Create download link
      const link = document.createElement("a");
      link.download = "tattoo-canvas.png";
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Failed to export canvas image:", error);
      onError?.("Failed to export canvas image");
    }
  };

  // Handle back to editor
  const handleBackToEditor = () => {
    setGeneratedImage(null);
    
    // Stage size remains the same - no need to recalculate
    // This maintains consistent canvas dimensions
    
    // Re-select tattoo when returning to editor with a small delay
    setTimeout(() => {
      if (tattooImageLoader.imageObj) {
        setSelectedId("tattoo");
      }
    }, 100);
  };

  return (
    <Card className="h-full">
      <CardHeader>Preview Canvas</CardHeader>
      <CardBody>
        <div
          ref={containerRef}
          className="relative w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center"
          style={{ 
            minHeight: "500px",
            touchAction: "pan-x pan-y pinch-zoom",
            WebkitOverflowScrolling: "touch"
          }}
        >
          {/* Mobile Upload Buttons - TOP of canvas */}
          {onUploadDrawerOpen && onTattooDrawerOpen && (
            <div className="absolute top-4 left-4 right-4 flex gap-2 lg:hidden z-50">
              <Button
                color="primary"
                variant="shadow"
                startContent={<Upload className="w-4 h-4" />}
                className="flex-1"
                onPress={onUploadDrawerOpen}
                disabled={isApplying}
                size="sm"
              >
                Upload Body
              </Button>
              <Button
                color="secondary"
                variant="shadow"
                startContent={<Palette className="w-4 h-4" />}
                className="flex-1"
                onPress={onTattooDrawerOpen}
                disabled={isApplying}
                size="sm"
              >
                Upload/Gen. Tattoo
              </Button>
            </div>
          )}
          {baseImageLoader.isLoading ||
          tattooImageLoader.isLoading ||
          (stageSize.width === 0 && (baseImage || generatedImage)) ? (
            <LoadingView />
          ) : generatedImage && !tattooImage ? (
            <GeneratedImageView
              generatedImage={generatedImage}
              onBackToEditor={handleBackToEditor}
              maxWidth={stageSize.width}
              maxHeight={stageSize.height}
            />
          ) : baseImage || generatedImage ? (
            <KonvaStage
              ref={stageRef}
              stageSize={stageSize}
              baseImageObj={baseImageLoader.imageObj}
              tattooImageObj={tattooImageLoader.imageObj}
              tattooScale={tattooScale}
              selectedId={selectedId}
              isGenerating={isGenerating}
              onStageClick={handleStageClick}
              onTattooSelect={handleTattooSelect}
              onTattooDragMove={handleTattooDragMove}
              onTattooDragEnd={handleTattooDragEnd}
              transformerRef={transformerRef}
              tattooRef={tattooRef}
              generatedImage={generatedImage}
            />
          ) : (
            <EmptyState />
          )}

          {/* Mobile Control Buttons - BOTTOM of canvas */}
          {onUploadDrawerOpen && onTattooDrawerOpen && (
            <div className="absolute bottom-4 left-4 right-4 lg:hidden">
              {/* Generate button - only show when both base and tattoo exist */}
              {(baseImage || generatedImage) && tattooImage && (
                <div className="flex gap-2 mb-2">
                  <Button
                    onPress={handleApplyTattoo}
                    disabled={isApplying || isGenerating}
                    className="flex-1"
                    color="primary"
                    variant="shadow"
                    size="sm"
                  >
                    {isApplying || isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              )}
              
              {/* Reset and Download buttons - stacked vertically */}
              <div className="space-y-2">
                <Button
                  variant="shadow"
                  onPress={resetCanvas}
                  className="w-full"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2"  />
                  Reset
                </Button>
                {generatedImage && (
                  <DownloadButton
                    src={generatedImage}
                    filename="generated-tattoo-result.png"
                    variant="solid"
                    size="sm"
                    className="w-full"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </DownloadButton>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Control Buttons - Hidden on mobile since they're now inside canvas */}
        <div className="mt-4  justify-center hidden lg:flex">
          <CanvasControlButtons
            baseImage={baseImage}
            tattooImage={tattooImage}
            generatedImage={generatedImage}
            isApplying={isApplying}
            isGenerating={isGenerating}
            onApplyTattoo={handleApplyTattoo}
            onReset={resetCanvas}
            onExportCanvas={exportImage}
          />
        </div>
        {(baseImage || generatedImage) && tattooImage && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500">
              Click on the tattoo to select it, then drag to move or use the
              handles to resize and rotate. Images with multiple tattoos will
              probably not remove all tattoos.
              {generatedImage && " You can add tattoos to generated images."}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
