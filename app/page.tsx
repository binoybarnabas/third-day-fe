"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/common/button";
import Link from "next/link";
import { AppRoutes } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/lib/api";
import { HERO_SLIDES } from "@/lib/dummyData"; 
import menCatImage from "@/attached_assets/generated_images/men's_fashion_category_image.png";
import womenCatImage from "@/attached_assets/generated_images/women's_fashion_category_image.png";
import accessCatImage from "@/attached_assets/generated_images/accessories_category_image.png";
import { ProductCard } from "@/components/ui/product-card";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/common/skeleton";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FirstTimePopup } from "@/components/ui/first-time-popup";

export default function Home() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: api.fetchProducts,
  });

  const featuredProducts = products.filter((p) => p.bestSeller).slice(0, 12);
  const newArrivals = products.filter((p) => p.newArrival).slice(0, 12);

  // --- CAROUSEL LOGIC ---
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // --- SCROLL LOGIC ---
  const trendingRef = useRef<HTMLDivElement>(null);
  const arrivalsRef = useRef<HTMLDivElement>(null);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      ref.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div>
      <FirstTimePopup />
      
      {/* HERO CAROUSEL SECTION */}
      <section className="relative h-[60vh] md:h-[90vh] w-full overflow-hidden bg-black">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.div
            key={currentSlide}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ 
              x: { type: "spring", stiffness: 40, damping: 20 },
              opacity: { duration: 0.5 } 
            }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={HERO_SLIDES[currentSlide].image}
              alt="Streetwear Banner"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 md:bg-black/30" />

            {/* TEXT CONTENT INSIDE THE SLIDING DIV */}
            <div className="absolute inset-0 flex items-center justify-center text-center">
              <div className="max-w-4xl px-6 md:px-4">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-7xl lg:text-8xl font-heading font-bold text-white mb-4 md:mb-6 uppercase tracking-tighter leading-none"
                >
                  {HERO_SLIDES[currentSlide].title}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto font-light leading-relaxed"
                >
                  {HERO_SLIDES[currentSlide].description}
                </motion.p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                  <Button
                    size="lg"
                    className="h-12 md:h-14 px-8 text-sm md:text-base uppercase tracking-widest font-bold rounded-none bg-white text-black hover:bg-transparent hover:text-white border-2 border-white transition-colors duration-300"
                    asChild
                  >
                    <Link href={HERO_SLIDES[currentSlide].buttonLeft.link}>{HERO_SLIDES[currentSlide].buttonLeft.label}</Link>
                  </Button>
                  <Button
                    size="lg"
                    className="h-12 md:h-14 px-8 text-sm md:text-base uppercase tracking-widest font-bold rounded-none bg-transparent text-white border-2 border-white hover:bg-white hover:text-black transition-colors duration-300"
                    asChild
                  >
                    <Link href={HERO_SLIDES[currentSlide].buttonRight.link}>{HERO_SLIDES[currentSlide].buttonRight.label}</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 transition-all duration-500 ${currentSlide === idx ? "w-12 bg-white" : "w-6 bg-white/40"}`}
            />
          ))}
        </div>
      </section>

      {/* Trending Now Slider */}
      <section className="container mx-auto px-4 py-16 border-t border-border relative ">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight">
            Trending Now
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-none hidden md:flex"
              onClick={() => scroll(trendingRef, "left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none hidden md:flex"
              onClick={() => scroll(trendingRef, "right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={trendingRef}
          className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[calc(50%-12px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
                >
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            : featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[calc(50%-12px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </section>

      {/* Banner Break */}
      <section className="bg-black text-white py-12 md:py-24">
  <div className="container mx-auto px-6 md:px-4 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-4 md:mb-6 leading-none">
        New Season Drop
      </h2>
      <p className="text-neutral-400 max-w-sm md:max-w-xl mx-auto mb-8 text-sm md:text-lg font-light leading-relaxed">
        Explore the latest additions to our collection. Limited quantities
        available for our exclusive seasonal release.
      </p>
      <Button 
        className="bg-white text-black hover:bg-neutral-200 h-12 md:h-14 px-8 md:px-10 text-sm md:text-base uppercase tracking-widest font-bold rounded-none transition-transform active:scale-95"
      >
        Explore Collection
      </Button>
    </motion.div>
  </div>
</section>

      {/* New Arrivals Slider */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold uppercase tracking-tight">
            New Arrivals
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-none hidden md:flex"
              onClick={() => scroll(arrivalsRef, "left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-none hidden md:flex"
              onClick={() => scroll(arrivalsRef, "right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={arrivalsRef}
          className="flex overflow-x-auto gap-6 no-scrollbar snap-x snap-mandatory scroll-smooth"
        >
          {isLoading
            ? [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="min-w-[calc(50%-12px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
                >
                  <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            : newArrivals.map((product) => (
                <div
                  key={product.id}
                  className="min-w-[calc(50%-12px)] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 pt-0 pb-16 md:pb-24 ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px] md:h-[500px] ">
          <Link
            href={AppRoutes.MEN}
            className="group relative overflow-hidden h-full md:col-span-1 rounded-2xl"
          >
            <Image
              src={menCatImage}
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8 ">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">
                Men
              </h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link
            href={AppRoutes.WOMEN}
            className="group relative overflow-hidden h-full md:col-span-1 rounded-2xl"
          >
            <Image
              src={womenCatImage}
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">
                Women
              </h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          <Link
            href={AppRoutes.ACCESSORIES}
            className="group relative overflow-hidden h-full md:col-span-1 rounded-2xl"
          >
            <Image
              src={accessCatImage}
              alt="Accessories"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute bottom-8 left-8">
              <h3 className="text-3xl font-heading font-bold text-white uppercase mb-2">
                Accessories
              </h3>
              <span className="text-white flex items-center gap-2 text-sm uppercase tracking-widest group-hover:underline decoration-2 underline-offset-4">
                Shop Now <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}