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
import { MobileCanvasButtons } from "./mobile-canvas-buttons";

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
  // State with stable references to prevent canvas refresh
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tattooScale, setTattooScale] = useState(1);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isCanvasStable, setIsCanvasStable] = useState(true);
  
  // Store tattoo transform state to preserve position during re-renders
  const [tattooTransform, setTattooTransform] = useState({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });

  // Refs
  const stageRef = useRef<Konva.Stage>(null);
  const tattooRef = useRef<Konva.Image>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom hooks with stable stage size
  const baseImageLoader = useImageLoader({ onError });
  const tattooImageLoader = useImageLoader({ onError });
  const { stageSize, calculateInitialSize } = useStageSize({
    containerRef,
    baseImage: baseImageLoader.imageObj,
  });
  
  // Store initial stage size to prevent scroll-induced changes
  const [initialStageSize, setInitialStageSize] = useState({ width: 0, height: 0 });

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

  // Load base image when it changes with stable size tracking
  useEffect(() => {
    if (baseImage) {
      setIsCanvasStable(false);
      setGeneratedImage(null);
      baseImageLoader.loadImage(baseImage).then((img) => {
        if (img) {
          calculateInitialSize(img);
          // Lock in the stage size when image first loads
          if (stageSize.width > 0 && stageSize.height > 0) {
            setInitialStageSize(stageSize);
          }
          // Stabilize canvas after image loads
          setTimeout(() => setIsCanvasStable(true), 200);
        }
      });
    } else {
      baseImageLoader.clearImage();
      setGeneratedImage(null);
      setInitialStageSize({ width: 0, height: 0 });
      setIsCanvasStable(true);
    }
  }, [baseImage]); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Update initial stage size when stage size changes (only once per image)
  useEffect(() => {
    if (stageSize.width > 0 && stageSize.height > 0 && initialStageSize.width === 0) {
      setInitialStageSize(stageSize);
    }
  }, [stageSize, initialStageSize.width]);

  // Don't change stage size for generated images - keep original base image dimensions
  // This preserves consistent preview size regardless of generated image size

  // Load tattoo image when it changes with stable selection
  useEffect(() => {
    if (tattooImage) {
      setIsCanvasStable(false);
      tattooImageLoader.loadImage(tattooImage).then((img) => {
        if (img && stageSize.width && stageSize.height) {
          const scale = calculateTattooScale(
            img,
            stageSize.width,
            stageSize.height
          );
          setTattooScale(scale);
          // Initialize tattoo position to center if not set
          setTattooTransform(prev => ({
            ...prev,
            x: prev.x || stageSize.width / 2,
            y: prev.y || stageSize.height / 2,
            scaleX: scale,
            scaleY: scale,
          }));
          // Auto-select the tattoo when it loads with stability check
          setTimeout(() => {
            setSelectedId("tattoo");
            setIsCanvasStable(true);
          }, 100);
        }
      });
    } else {
      tattooImageLoader.clearImage();
      setSelectedId(null);
      setIsCanvasStable(true);
      // Reset transform when tattoo is removed
      setTattooTransform({
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotation: 0,
      });
    }
  }, [tattooImage]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update tattoo scale when stage size changes (use stable size)
  useEffect(() => {
    const activeStageSize = initialStageSize.width > 0 ? initialStageSize : stageSize;
    if (tattooImageLoader.imageObj && activeStageSize.width && activeStageSize.height) {
      const scale = calculateTattooScale(
        tattooImageLoader.imageObj,
        activeStageSize.width,
        activeStageSize.height
      );
      setTattooScale(scale);
    }
  }, [tattooImageLoader.imageObj, initialStageSize, stageSize]);

  // Stable transformer attachment that respects canvas stability
  useEffect(() => {
    if (!isCanvasStable) return; // Don't attach during unstable periods
    
    let isAttaching = false;
    
    const attachTransformer = () => {
      if (isAttaching || !isCanvasStable) return;
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
            // Force update for Brave browser compatibility
            transformerRef.current.nodes([tattooRef.current]);
            transformerRef.current.getLayer()?.batchDraw();
            
            // Additional force update for mobile browsers
            requestAnimationFrame(() => {
              if (transformerRef.current && tattooRef.current) {
                transformerRef.current.forceUpdate();
                layer.batchDraw();
              }
            });
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

    // Multiple attempts for mobile stability, only when canvas is stable
    attachTransformer();
    const timeoutId1 = setTimeout(attachTransformer, 50);
    const timeoutId2 = setTimeout(attachTransformer, 150);
    const timeoutId3 = setTimeout(attachTransformer, 300);
    
    return () => {
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
      clearTimeout(timeoutId3);
    };
  }, [selectedId, tattooImageLoader.imageObj, isCanvasStable]);

  // Minimal event handling to prevent canvas refresh
  useEffect(() => {
    let reattachTimeout: NodeJS.Timeout;
    let isReattaching = false;
    
    const reattachTransformer = () => {
      if (isReattaching || selectedId !== "tattoo" || !isCanvasStable) return;
      isReattaching = true;
      
      clearTimeout(reattachTimeout);
      reattachTimeout = setTimeout(() => {
        try {
          if (transformerRef.current && tattooRef.current && isCanvasStable) {
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

    // Only handle visibility changes - remove scroll and resize listeners
    const handleVisibilityChange = () => {
      if (selectedId === "tattoo" && !document.hidden && isCanvasStable) {
        reattachTransformer();
      }
    };

    if (isCanvasStable) {
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(reattachTimeout);
    };
  }, [selectedId, isCanvasStable]);

  // Handle stage click (deselect) with stability preservation
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage() && isCanvasStable) {
      setSelectedId(null);
    }
  };

  // Handle tattoo selection with stability check
  const handleTattooSelect = () => {
    if (isCanvasStable) {
      setSelectedId("tattoo");
      // Force transformer update for mobile browsers
      setTimeout(() => {
        if (transformerRef.current && tattooRef.current) {
          transformerRef.current.nodes([tattooRef.current]);
          transformerRef.current.forceUpdate();
          transformerRef.current.getLayer()?.batchDraw();
        }
      }, 10);
    }
  };

  // Handle tattoo drag move
  const handleTattooDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Prevent page scroll during drag on mobile
    e.evt.preventDefault();
    
    const node = e.target as Konva.Image;
    if (node) {
      // Store current position
      setTattooTransform(prev => ({
        ...prev,
        x: node.x(),
        y: node.y(),
      }));
      // Position is automatically updated by Konva
      node.getLayer()?.batchDraw();
    }
  };

  // Handle tattoo drag end with enhanced mobile support
  const handleTattooDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    // Ensure the tattoo stays selected after dragging
    const node = e.target as Konva.Image;
    if (node) {
      // Store final transform state
      setTattooTransform({
        x: node.x(),
        y: node.y(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
        rotation: node.rotation(),
      });
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
      const scale = calculateTattooScale(
        tattooImageLoader.imageObj,
        stageSize.width,
        stageSize.height
      );
      const resetTransform = {
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        scaleX: scale,
        scaleY: scale,
        rotation: 0,
      };
      setTattooTransform(resetTransform);
      tattooRef.current.position({
        x: resetTransform.x,
        y: resetTransform.y,
      });
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
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>Preview Canvas</CardHeader>
        <CardBody>
          <div
            ref={containerRef}
            className="relative w-full bg-gray-100 rounded-lg overflow-hidden flex justify-center items-center"
            style={{ 
              minHeight: "500px",
              touchAction: "none",
              WebkitOverflowScrolling: "touch",
              userSelect: "none",
              WebkitUserSelect: "none"
            }}
          >
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
              stageSize={initialStageSize.width > 0 ? initialStageSize : stageSize}
              baseImageObj={baseImageLoader.imageObj}
              tattooImageObj={tattooImageLoader.imageObj}
              tattooScale={tattooScale}
              tattooTransform={tattooTransform}
              selectedId={selectedId}
              isGenerating={isGenerating}
              onStageClick={handleStageClick}
              onTattooSelect={handleTattooSelect}
              onTattooDragMove={handleTattooDragMove}
              onTattooDragEnd={handleTattooDragEnd}
              onTransformEnd={(transform) => setTattooTransform(transform)}
              transformerRef={transformerRef}
              tattooRef={tattooRef}
              generatedImage={generatedImage}
            />
          ) : (
            <EmptyState />
          )}

          </div>

          {/* Control Buttons - Hidden on mobile since they're now outside canvas */}
          <div className="mt-4 justify-center hidden lg:flex">
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
          {/* Mobile Canvas Buttons - Below canvas on mobile */}
          <MobileCanvasButtons
            baseImage={baseImage}
            tattooImage={tattooImage}
            generatedImage={generatedImage}
            isApplying={isApplying}
            isGenerating={isGenerating}
            onUploadDrawerOpen={onUploadDrawerOpen}
            onTattooDrawerOpen={onTattooDrawerOpen}
            onApplyTattoo={handleApplyTattoo}
            onReset={resetCanvas}
          />
          
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
    </div>
  );
}
