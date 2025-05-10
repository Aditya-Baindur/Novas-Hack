"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";


const AnimatedText = () => {
  const phrases = [
    "beautiful",
    "stunning",
    "elegant",
    "modern",
    "impressive"
  ];

  const [currentPhrase, setCurrentPhrase] = useState(0);
  const [currentColor, setCurrentColor] = useState("blue");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
      // Randomize color
      const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
      setCurrentColor(randomColor);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phrases[currentPhrase]}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        style={{
          color: currentColor,
          fontSize: "3rem" // Increase text size here
        }}
      >
        <title> {phrases[currentPhrase]}&nbsp;</title>
      </motion.span>
    </AnimatePresence>
  );
};



export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 min-h-[calc(100vh-7rem)] bg-gradient-to-b from-background to-background/50">
      <motion.div 
        className="inline-block max-w-xl text-center justify-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className={title()}>Someone make a </span>
        <AnimatedText />
        <span className={title({ color: "violet" })}>& Responsive UI here please</span>
      </motion.div>

      <motion.div 
        className="flex gap-3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={"/main"}
        >
          Home page
        </Link>
        <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link>
      </motion.div>

      <motion.div 
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </motion.div>
    </section>
  );
}