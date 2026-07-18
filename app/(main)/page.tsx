import Hero from "@/components/landing/Hero";
import SingleProduct from "@/components/shopping/SingleProduct";
import Testimonial from "@/components/landing/Testimonial";
import Image from "next/image";
import Products from "@/components/landing/Products";
import Integrations from "@/components/landing/Integrations";
import Features from "@/components/landing/Features";
import Categories from "@/components/landing/Categories";
import HeroSlider from "../../components/landing/HeroSlider";
import HeroFIlterProducts from "@/components/landing/HeroFIlterProducts";
import WavyBanner from "@/components/landing/WavyBanner";
import PromoBanner from "@/components/landing/PromoBanner";
import SpecialOffers from "@/components/landing/SpecialOffers";

export default function Home() {
  return (
    <div>
      <Hero />
      <WavyBanner />
      <Categories />
      <SpecialOffers />
      <Products />
      <PromoBanner />
      <Features />
      <Testimonial />
    </div>
  );
}
