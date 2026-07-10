import {
  SquareTerminal,
  Users,
  GraduationCap,
  Globe,
  Network,
  PlayCircle,
  Mic,
  MousePointer2,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import DecryptedText from "@/components/DecryptedText";
import { useNavigate } from "react-router-dom";
import { JoinViaLink } from "@/components/JoinViaLink";



const collaborators = [
  {
    alt: "Developer working on complex code with a glowing neon keyboard",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYJ9-VB9BdFp5qBnq7sGw13Yftt0Aha2zi0dAse6wxHJdR7jp2_SXT4lwbFChSz182vbkRkF0Kg-jr4fqBb1VA6HSENq1wYJDuc9wD8cett5BFZl2KwDojwZ6nymaIWlDmbVK7ko3tnksQzQIgnhDYkBFAtiu7scSPQHlAm90IenV2ed8vXmqykXN5EAZOii0MSMl1D5Qk8QyRPV-NEfHx7jR1zHe31vpPntAPTGLG3jXzSEPX9POBgdUVvUX1piPmFuFYd_0KfJxm",
    ring: "border-primary",
  },
  {
    alt: "Programmer focused on multiple monitors in a dark high-tech room",
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZrmADOmNmYstW0SehCd0pOJwJqC3GPdrVEbhIaMTVMqmxubuxTM_Xo-RoJE0Ag2hEofZw9qgqAImXTKvjGcn0rQdScBwoTr7PilMjescHQT0Hq8fxeZsRPlnIauk2iqyUng9FJQexaFIAZLUHjdv5JmHIoc-N1ehaL-XbJLUl9qJ-SLHTU0xavtp8uBRRzO6Ur13uPdUHYHantzq0lmp9X63MgntEzniy5T-QsKyaqUzuePDRtEgASojNh0CccNqUqqabgax_dL1u",
    ring: "border-secondary",
  },
];

const codeLines = [
  { indent: 0, node: <><span className="text-tertiary">async function</span> <span className="text-primary-container">syncAlgorithm</span>(pool) {"{"}</> },
  { indent: 1, node: <span className="text-outline-variant">// Collaborating in real-time...</span> },
  { indent: 1, node: <><span className="text-secondary">const</span> result = <span className="text-tertiary">await</span> pool.<span className="text-primary-container">process</span>();</> },
];

const bentoFeatures = [
  {
    span: "md:col-span-4",
    bg: "bg-surface-container-high",
    icon: GraduationCap,
    iconColor: "text-secondary",
    title: "Group DSA Learning",
    body: "Perfect for collaborative problem-solving and peer reviews. Share optimized solutions instantly.",
  },
  {
    span: "md:col-span-4",
    bg: "bg-surface-container-high",
    icon: Globe,
    iconColor: "text-tertiary",
    title: "Multi-Language",
    body: "Switch between JavaScript, Python, C++, and more instantly with full syntax highlighting.",
  },
];

const pipelineItems = [
  {
    icon: PlayCircle,
    color: "text-primary-container",
    bg: "bg-primary-container/10",
    title: "Live Code Execution",
    body: "Run your code directly in the hive. Support for server-side environments coming Q3.",
  },
  {
    icon: Mic,
    color: "text-secondary",
    bg: "bg-secondary/10",
    title: "Integrated Audio",
    body: "Talk through complex logic without leaving the editor. High-fidelity low-latency voice lanes.",
  },
];

const navLinks = ["Home", "Documentation", "Features", "Community"];
const footerLinks = ["Documentation", "GitHub", "Community", "Privacy"];

const heroItem = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.08 + i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();
  const initial = shouldReduceMotion ? "show" : "hidden";
  const navigate = useNavigate();

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden">
      {/* Top App Bar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300">
        <div className="flex justify-between items-center px-6 py-3 rounded-full bg-white/[0.04] backdrop-blur-2xl backdrop-saturate-150 border border-white/10 ring-1 ring-black/40 shadow-[0_8px_30px_rgba(0,0,0,0.55),0_0_40px_rgba(0,255,163,0.06)]">
          <div className="flex items-center gap-3">
            <SquareTerminal className="text-[#00ffa3]" size={22} />
            <span className="text-2xl font-bold tracking-tighter text-[#00ffa3]  font-headline">
              DevHive
            </span>
          </div>
          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map((link, i) => (
              <a
                key={link}
                href="#"
                className={cn(
                  "font-headline tracking-tight transition-colors duration-300 hover:text-[#00ffa3]",
                  i === 0 ? "text-[#00ffa3] font-bold" : "text-neutral-400"
                )}
              >
                {link}
              </a>
            ))}
          </nav>
          <Button variant="default" size="sm" onClick={()=>navigate("/signup")}>
            Sign Up
          </Button>
        </div>
      </header>


      <main className="pt-24">
        {/* Hero */}
        <section className="relative min-h-[795px] flex flex-col items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,163,0.08),transparent_50%)]" />
          <div className="z-10 text-center max-w-4xl mx-auto">
            <motion.div
              custom={0}
              initial={initial}
              animate="show"
              variants={heroItem}
              className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-surface-container-high border border-outline-variant/20"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary-container animate-pulse" />
              <span className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                V2.0 Now Live
              </span>
            </motion.div>
            <motion.h1
              custom={1}
              initial={initial}
              animate="show"
              variants={heroItem}
              className="text-6xl md:text-8xl font-headline font-bold text-on-surface tracking-tighter mb-8 leading-[0.9]"
            >
              
              Code in <span className="text-primary-container ">Harmony</span>,
              <br />
              Learn in <span className="text-primary-container ">Sync.</span>
            </motion.h1>
            <motion.p
              custom={2}
              initial={initial}
              animate="show"
              variants={heroItem}
              className="text-xl md:text-2xl text-on-surface-variant font-body max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              
              DevHive is a live collaborative code editor designed for teams and students. Code
              together in real-time, master DSA with friends, and build faster.
            </motion.p>
            <motion.div
              custom={3}
              initial={initial}
              animate="show"
              variants={heroItem}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Button size="xl" onClick={() => navigate("/editor")}>Get Started</Button>

              {/* <Button variant="outline" size="xl">
                Join via Link
              </Button> */}
              <JoinViaLink/>


            </motion.div>
          </div>

          {/* Editor mockup */}
          <motion.div
            custom={4}
            initial={initial}
            animate="show"
            variants={heroItem}
            className="relative w-full max-w-6xl mt-24 mx-auto perspective-1000"
          >
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 shadow-2xl overflow-hidden translate-y-12">
              <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error/30" />
                  <div className="w-3 h-3 rounded-full bg-primary-container/30" />
                  <div className="w-3 h-3 rounded-full bg-secondary/30" />
                </div>
                <div className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
                  devhive-room-42.js
                </div>
                <div className="w-12" />
              </div>
              <div className="flex h-96">
                <div className="w-12 bg-surface-container text-outline text-[10px] py-4 text-center select-none font-mono">
                  {Array.from({ length: 11 }, (_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <div className="flex-1 p-6 font-mono text-sm leading-relaxed text-on-surface-variant">
                  {codeLines.map((line, i) => (
                    <div key={i} className={cn("mb-1", line.indent === 1 && "ml-4")}>
                      {line.node}
                    </div>
                  ))}
                  <div className="mb-1 ml-4 text-on-surface bg-primary-container/10 border-l-2 border-primary-container px-2 py-0.5 relative">
                    return result.sort((a, b) =&gt; a - b);
                    <span className="absolute -right-20 top-0 bg-secondary text-on-secondary px-2 py-0.5 text-[10px] rounded flex items-center gap-1 font-sans">
                      <MousePointer2 size={12} />
                      Sarah
                    </span>
                  </div>
                  <div className="mb-1">{"}"}</div>
                  <div className="mt-8">
                    <span className="text-outline-variant italic">// What's next?</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Bento grid features */}
        <section className="py-32 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
              Engineered for Performance.
            </h2>
            <div className="h-1 w-24 bg-primary-container mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large feature */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 relative overflow-hidden group border border-outline-variant/10">
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-container/10 blur-[100px] group-hover:bg-primary-container/20 transition-all" />
              <Users className="text-primary-container mb-6" size={36} />
              <h3 className="text-3xl font-headline font-bold mb-4">Live Multi-player Coding</h3>
              <p className="text-on-surface-variant text-lg max-w-md leading-relaxed">
                Write and debug together with sub-50ms latency. Our operational transformation
                engine ensures conflict-free edits even on high-latency connections.
              </p>
              <div className="mt-12 flex gap-4">
                {collaborators.map((c) => (
                  <img
                    key={c.src}
                    alt={c.alt}
                    className={cn("w-12 h-12 rounded-full border-2", c.ring)}
                    src={c.src}
                  />
                ))}
                <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-outline-variant flex items-center justify-center text-xs font-bold">
                  +12
                </div>
              </div>
            </div>

            {bentoFeatures.map((f) => (
              <div
                key={f.title}
                className={cn(f.span, f.bg, "rounded-xl p-8 border border-outline-variant/10")}
              >
                <f.icon className={cn(f.iconColor, "mb-6")} size={36} />
                <h3 className="text-2xl font-headline font-bold mb-4">{f.title}</h3>
                <p className="text-on-surface-variant leading-relaxed">{f.body}</p>
              </div>
            ))}

            {/* Room architecture */}
            <div className="md:col-span-8 bg-surface-container-low rounded-xl p-8 border border-outline-variant/10 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <Network className="text-primary-fixed mb-6" size={36} />
                <h3 className="text-3xl font-headline font-bold mb-4">Room Architecture</h3>
                <p className="text-on-surface-variant leading-relaxed">
                  Create private coding hives and share them with a simple link. Secure,
                  persistent, and organized.
                </p>
              </div>
              <div className="w-full md:w-48 h-32 bg-surface-container rounded-lg border border-outline-variant/20 flex items-center justify-center">
                <span className="text-primary-container font-mono text-sm">devhive.io/x8-k2p</span>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming / pipeline */}
        <section className="py-32 bg-surface-container-lowest overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-container/30 to-transparent" />
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm font-label uppercase tracking-[0.3em] text-primary-container mb-6">
                Pipeline
              </h2>
              <h3 className="text-5xl md:text-6xl font-headline font-bold mb-8">
                What's <span className="italic">Buzzing</span> Next
              </h3>
              <p className="text-on-surface-variant text-xl leading-relaxed mb-10">
                We're constantly expanding the hive. Here's what our engineers are currently
                shipping to production.
              </p>
              <div className="space-y-6">
                {pipelineItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-6 items-start p-6 rounded-xl bg-surface-container-low border border-outline-variant/10"
                  >
                    <div className={cn("w-12 h-12 rounded flex items-center justify-center shrink-0", item.bg)}>
                      <item.icon className={item.color} size={22} />
                    </div>
                    <div>
                      <h4 className="text-xl font-headline font-bold mb-2">{item.title}</h4>
                      <p className="text-on-surface-variant">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary-container/5 blur-3xl rounded-full" />
              <img
                alt="Futuristic server room with glowing green LED indicators and abstract light trails"
                className="rounded-2xl border border-outline-variant/20 shadow-2xl relative z-10"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALjy7XDuIgAClmQPZO58k90zWeMdD7qcGYcLrog65oh4mnEYguM8y7bz8GEMPCzkKfYpTQry2JXpY8B69X81-HYeEz3oZ9rx5ENCLjet4SQCgepE3f6PckPdGOhIa0-kfHn2I6GeyULVFS3X6o-51X41j0tzeulkgp5lXNH0EGc8kDmwrQ2DzLrZrJChOdXjHRVnbt9zfTdfWASBAndnpPEWglN3btwMo2nbU06C9VawbZ9lrg5Ssu8nDOG0yLc3nsSuO_MAoeq6Qs"
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 text-center bg-background">
          <h2 className="text-5xl md:text-7xl font-headline font-bold mb-8 tracking-tighter">
            Ready to enter the Hive?
          </h2>
          <p className="text-on-surface-variant text-xl max-w-2xl mx-auto mb-12">
            Join thousands of developers coding in harmony. Free for students and teams up to 5
            members.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="xl">Get Started Free</Button>
            <Button variant="outline" size="xl" className="bg-surface-container-highest hover:bg-surface-bright">
              View Demo
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 w-full py-12 border-t border-neutral-800/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="text-lg font-black text-neutral-100 font-headline uppercase tracking-widest">
              DevHive
            </span>
            <p className="text-neutral-500 text-sm font-body uppercase tracking-widest">
              © 2024 DevHive. Built for the Neon Architect.
            </p>
          </div>
          <div className="flex gap-8">
            {footerLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-neutral-500 text-sm uppercase tracking-widest hover:text-[#00ffa3] transition-all duration-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}