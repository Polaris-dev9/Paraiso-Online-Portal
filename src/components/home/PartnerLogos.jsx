import React from 'react';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const PartnerLogos = () => {
  const partners = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Parceiro ${i + 1}`,
  }));

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-blue-900">Nossos Parceiros</h2>
          <p className="text-gray-600 mt-2">Empresas que confiam e crescem com o Portal Paraíso Online.</p>
        </motion.div>
        <Carousel
          plugins={[Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {partners.map((partner) => (
              <CarouselItem key={partner.id} className="basis-1/3 sm:basis-1/4 md:basis-1/6 lg:basis-1/8">
                <div className="p-4">
                  <div className="flex items-center justify-center h-20">
                    <img class="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300" alt={partner.name}  src="https://images.unsplash.com/photo-1566304660263-c15041ac11c0" />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default PartnerLogos;