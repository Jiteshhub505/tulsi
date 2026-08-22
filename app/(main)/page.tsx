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

export default function Home() {
  return (
    <div>
      <Hero />
      <WavyBanner />
      <Products />
      <TulsiCoinsBanner />
      <PromoBanner />
      <HeroFIlterProducts />
      <Features />
      <WhyChooseUs />
      <Testimonial />
    </div>
  );
}

