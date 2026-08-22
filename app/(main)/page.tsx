import Hero from "@/components/landing/Hero";
import SingleProduct from "@/components/shopping/SingleProduct";
import Testimonial from "@/components/landing/Testimonial";
import Image from "next/image";
import Products from "@/components/landing/Products";
import TulsiCoinsBanner from "@/components/landing/TulsiCoinsBanner";
import Integrations from "@/components/landing/Integrations";
import Features from "@/components/landing/Features";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import HeroSlider from "../../components/landing/HeroSlider";
import HeroFIlterProducts from "@/components/landing/HeroFIlterProducts";
import WavyBanner from "@/components/landing/WavyBanner";
import PromoBanner from "@/components/landing/PromoBanner";
import { getLandingProducts } from "@/lib/products/getLandingProducts";

export const revalidate = 60; // ISR cache revalidation every 60s for ultra-fast production delivery

export default async function Home() {
  const products = await getLandingProducts();

  return (
    <div>
      <Hero />
      <WavyBanner />
      <Products initialProducts={products} />
      <TulsiCoinsBanner />
      <PromoBanner />
      <HeroFIlterProducts initialProducts={products} />
      <Features />
      <WhyChooseUs />
      <Testimonial />
    </div>
  );
}
