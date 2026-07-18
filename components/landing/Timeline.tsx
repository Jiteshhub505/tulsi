"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Calendar, 
  Leaf, 
  Milestone, 
  Users, 
  BookOpen, 
  FlaskConical,
  HeartHandshake
} from "lucide-react";

interface TimelineItem {
  id: string;
  yearOrDate: string;
  title: string;
  subtitle?: string;
  description: string;
  type: "education" | "experience" | "milestone";
  icon: React.ReactNode;
  tags?: string[];
}

const journeyData: TimelineItem[] = [
  {
    id: "j-1",
    yearOrDate: "5000+ Years Ago",
    title: "Ancient Ayurvedic Foundation",
    description: "Our roots trace back to classical texts like Charaka Samhita and Sushruta Samhita. We honor these time-tested, foundational formulations in every modern blend.",
    type: "milestone",
    icon: <Leaf className="size-5" />,
    tags: ["Classical Wisdom", "Tradition"]
  },
  {
    id: "j-2",
    yearOrDate: "2015",
    title: "Founded with Vision",
    subtitle: "The Genesis of TulsiVeda",
    description: "A team of traditional Ayurvedic practitioners and modern research scientists came together with a clear goal: to make authentic Ayurveda accessible, clean, and practical for daily life.",
    type: "milestone",
    icon: <Milestone className="size-5" />,
    tags: ["Inception", "Pure Intent"]
  },
  {
    id: "j-3",
    yearOrDate: "2018",
    title: "State-of-the-Art Research Facility",
    subtitle: "Innovation Meets Tradition",
    description: "We established our dedicated manufacturing and formulation research center where traditional extraction processes are monitored using advanced HPLC chromatography.",
    type: "milestone",
    icon: <FlaskConical className="size-5" />,
    tags: ["R&D Center", "Quality Control"]
  },
  {
    id: "j-4",
    yearOrDate: "2021",
    title: "Clinical Trials & Safety Certification",
    subtitle: "Evidence-Based Ayurveda",
    description: "Launched rigorous double-blind clinical trials for our signature formulations (including Veda Shakti), securing national AYUSH certifications and safety approvals.",
    type: "milestone",
    icon: <Award className="size-5" />,
    tags: ["Clinical Validation", "AYUSH Certified"]
  },
  {
    id: "j-5",
    yearOrDate: "2024 - Present",
    title: "Trusted Nationwide",
    subtitle: "50,000+ Happy Lives Rejuvenated",
    description: "Expanding our footprint to deliver natural wellbeing across the country with 100+ pure botanical formulations and personalized wellness consultations.",
    type: "milestone",
    icon: <Users className="size-5" />,
    tags: ["Milestone", "Holistic Impact"]
  }
];

const credentialsData: TimelineItem[] = [
  {
    id: "c-1",
    yearOrDate: "2004 - 2009",
    title: "B.A.M.S (Bachelor of Ayurvedic Medicine & Surgery)",
    subtitle: "Delhi University - Dr. Prabhakar Sharma (Co-Founder)",
    description: "Five and a half years of intensive education in classical Sanskrit texts, Ayurvedic herbology, diagnosis (Nadi Pariksha), and modern pharmacology.",
    type: "education",
    icon: <GraduationCap className="size-5" />,
    tags: ["Academic Grounding", "Classical Training"]
  },
  {
    id: "c-2",
    yearOrDate: "2010 - 2013",
    title: "M.D. in Ayurveda (Herbology & Panchakarma)",
    subtitle: "IPGT & RA, Jamnagar - Dr. Prabhakar Sharma",
    description: "Specialized postgraduate studies focusing on formulation design, toxicology, and clinical application of Panchakarma detox therapies.",
    type: "education",
    icon: <BookOpen className="size-5" />,
    tags: ["Specialization", "Herbology Master"]
  },
  {
    id: "c-3",
    yearOrDate: "2013 - 2017",
    title: "Ph.D. in Phytochemistry & Drug Standardization",
    subtitle: "Dr. Anjali Mehta (Head of R&D & Formulation)",
    description: "Advanced research in identifying, isolating, and validating active bioactive markers (such as Withanolides in Ashwagandha) to ensure formula potency.",
    type: "education",
    icon: <FlaskConical className="size-5" />,
    tags: ["Phytochemical Research", "Doctorate"]
  },
  {
    id: "c-4",
    yearOrDate: "2017 - 2021",
    title: "Clinical Practice & Hospital Integration",
    subtitle: "AyurCare Research Hospital - Senior Consultant",
    description: "Managed complex lifestyle disorders, diabetes reversal, and chronic inflammation using custom botanical protocols, serving over 15,000 patients.",
    type: "experience",
    icon: <Briefcase className="size-5" />,
    tags: ["Clinical Practice", "Patient Care"]
  },
  {
    id: "c-5",
    yearOrDate: "2021 - Present",
    title: "Chief Formulation Specialist",
    subtitle: "TulsiVeda Laboratories",
    description: "Directing the proprietary research and batch-to-batch standardization of TulsiVeda capsules, tablets, and churnas. Bridging ancient text guidelines with safety audits.",
    type: "experience",
    icon: <HeartHandshake className="size-5" />,
    tags: ["Formulation Head", "Quality Standard"]
  }
];

export default function Timeline() {
  const [activeTab, setActiveTab] = useState<"journey" | "credentials">("journey");
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of the timeline container for vertical line filling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"]
  });

  // Animate line scale based on scroll
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const items = activeTab === "journey" ? journeyData : credentialsData;

  return (
    <section 
      ref={containerRef}
      className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-stone-50 via-emerald-50/20 to-amber-50/20 dark:from-stone-950 dark:via-stone-900/40 dark:to-stone-950"
    >
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-emerald-200/10 dark:bg-emerald-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-amber-200/10 dark:bg-amber-900/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/50 px-4 py-2 rounded-full mb-4 border border-emerald-200/50 dark:border-emerald-900/30"
          >
            <Leaf size={14} className="text-emerald-700 dark:text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
              Legacy & Expertise
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-stone-900 dark:text-stone-50 leading-tight mb-4"
          >
            Our Journey & <span className="text-emerald-700 dark:text-emerald-400">Credentials</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-stone-600 dark:text-stone-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed mb-8"
          >
            Explore the historical milestones of the TulsiVeda brand, or dive into the academic qualifications and clinical experience of our founding practitioners.
          </motion.p>

          {/* Toggle Tabs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="inline-flex p-1 bg-stone-105 dark:bg-stone-900 rounded-xl border border-stone-200/60 dark:border-stone-800 shadow-inner relative z-10"
          >
            <button
              onClick={() => setActiveTab("journey")}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "journey"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              Our Journey
            </button>
            <button
              onClick={() => setActiveTab("credentials")}
              className={`relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === "credentials"
                  ? "bg-emerald-700 text-white shadow-md"
                  : "text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200"
              }`}
            >
              Education & Experience
            </button>
          </motion.div>
        </div>

        {/* Timeline Tree Container */}
        <div className="relative min-h-[400px]">
          {/* Vertical central animated line (gray baseline) */}
          <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-stone-200 dark:bg-stone-800 rounded-full" />
          
          {/* Animated vertical green path filling up on scroll */}
          <motion.div 
            style={{ scaleY }}
            className="absolute left-4 md:left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-emerald-600 dark:bg-emerald-500 origin-top rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          />

          {/* Timeline Items */}
          <div className="space-y-16 relative">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => {
                const isLeft = index % 2 === 0;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className={`flex flex-col md:flex-row items-stretch md:items-center relative ${
                      isLeft ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Spacer / Date on opposite side for desktop */}
                    <div className={`hidden md:flex flex-1 justify-center ${
                      isLeft ? "text-left pl-12" : "text-right pr-12"
                    }`}>
                      <div className="inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-900/80 px-4 py-2 rounded-full border border-stone-200/50 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-bold text-sm shadow-sm hover:scale-105 transition-transform duration-300">
                        <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
                        {item.yearOrDate}
                      </div>
                    </div>

                    {/* Central Node Circle */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 md:top-auto flex items-center justify-center z-10">
                      <motion.div 
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 150, delay: 0.1 }}
                        className="w-10 h-10 rounded-full bg-emerald-600 dark:bg-emerald-500 border-4 border-white dark:border-stone-950 flex items-center justify-center text-white shadow-lg hover:scale-110 hover:shadow-emerald-500/20 transition-all duration-300"
                      >
                        {item.icon}
                      </motion.div>
                    </div>

                    {/* Content Card Side */}
                    <div className={`flex-1 pl-12 md:pl-0 ${
                      isLeft ? "md:pr-12" : "md:pl-12"
                    }`}>
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/50 dark:border-stone-800/80 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-xl hover:border-emerald-500/30 transition-all duration-300 relative group"
                      >
                        {/* Mobile date badge */}
                        <div className="inline-flex md:hidden items-center gap-1.5 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-xs font-semibold text-stone-600 dark:text-stone-300 mb-3 border border-stone-200/50 dark:border-stone-700">
                          <Calendar className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          {item.yearOrDate}
                        </div>

                        {/* Card decoration glow on hover */}
                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-emerald-600/0 via-emerald-600/0 to-emerald-600/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md ${
                              item.type === "education" 
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400"
                                : item.type === "experience"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            }`}>
                              {item.type}
                            </span>
                            
                            <h3 className="text-lg md:text-xl font-bold text-stone-900 dark:text-stone-50 mt-2 mb-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
                              {item.title}
                            </h3>
                            
                            {item.subtitle && (
                              <h4 className="text-xs md:text-sm font-semibold text-stone-500 dark:text-stone-400 mb-3">
                                {item.subtitle}
                              </h4>
                            )}
                            
                            <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed mb-4">
                              {item.description}
                            </p>

                            {item.tags && item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                                {item.tags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="text-[10px] font-medium bg-stone-105 dark:bg-stone-800 text-stone-600 dark:text-stone-400 px-2 py-0.5 rounded"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
