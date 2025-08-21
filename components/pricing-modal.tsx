"use client";

import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  useDisclosure 
} from '@heroui/modal';
import { 
  Wand2, 
  Palette, 
  Layers
} from 'lucide-react';

import { PricingTable } from './pricing-table';

interface PricingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PricingModal({ isOpen, onOpenChange }: PricingModalProps) {
  const features = [
    {
      icon: Wand2,
      title: 'Tattoo Design Generation',
      description: 'Create custom tattoo designs with AI from text prompts',
      color: 'text-purple-500'
    },
    {
      icon: Layers,
      title: 'Tattoo Overlay',
      description: 'Apply tattoos to your photos to see how they look',
      color: 'text-blue-500'
    },
    {
      icon: Palette,
      title: 'Multiple Styles',
      description: 'Traditional, realism, tribal, minimalist, and more',
      color: 'text-green-500'
    }
  ];

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "p-0",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Pricing</h2>
                <p className="text-sm text-gray-600 font-normal">
                  Get AI-powered tattoo designs and simulations
                </p>
              </div>
            </ModalHeader>
            
            <ModalBody className="p-6">
              <PricingTable variant="modal" />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

// Hook for easy usage
export function usePricingModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  
  return {
    isOpen,
    onOpen,
    onOpenChange,
    PricingModal: (props: Omit<PricingModalProps, 'isOpen' | 'onOpenChange'>) => (
      <PricingModal {...props} isOpen={isOpen} onOpenChange={onOpenChange} />
    ),
  };
}