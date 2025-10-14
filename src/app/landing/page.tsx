

"use client";
import Navbar from "@/components/Navbar";
import { Activity, FileText, Server, ShieldCheck, MessageCircle, Brain, Database, Zap } from "lucide-react";
import React, { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    // Card click animation
    const artCards = document.querySelectorAll<HTMLElement>(".art-card");
    artCards.forEach((card) => {
      card.addEventListener("click", () => {
        card.style.transform = "scale(0.95)";
        setTimeout(() => {
          card.style.transform = "";
        }, 200);
      });
    });

    // Cursor glow effect
    const glow1 = document.querySelector<HTMLElement>(".glow-1");
    const glow2 = document.querySelector<HTMLElement>(".glow-2");

    const moveHandler = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (glow1 && glow2) {
        glow1.style.transform = `translate(${x * 50}px, ${y * 50}px)`;
        glow2.style.transform = `translate(${-x * 50}px, ${-y * 50}px)`;
      }
    };

    document.addEventListener("mousemove", moveHandler);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousemove", moveHandler);
      artCards.forEach((card) => {
        card.replaceWith(card.cloneNode(true)); // removes attached click handlers
      });
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white bg-gradient-to-br from-[#0f0518] via-[#1a0b2e] to-[#2d1850] font-sans">
      {/* Background Circles for Icons */}
      <div className="absolute w-full h-full pointer-events-none">
        {/* Large Circle 1 */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-violet-300/20 pointer-events-none" />
        
        {/* Large Circle 2 */}
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 rounded-full border border-violet-300/20 pointer-events-none" />
      </div>

      {/* Glow effects */}
      <div className="glow glow-1 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] top-[-200px] left-[-200px] pointer-events-none z-0" />
      <div className="glow glow-2 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] top-1/2 right-[-200px] pointer-events-none z-0" />
      <div className="glow glow-3 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] bottom-[-200px] left-[30%] pointer-events-none z-0" />

      {/* Navbar */}
      <Navbar />

      {/* Floating icons arranged on circle edges */}
      <div className="absolute w-full h-full pointer-events-none">
        {/* Icons on first circle */}
        <div className="icon absolute top-[15%] left-[15%] animate-[float_6s_ease-in-out_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <ShieldCheck className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute top-[30%] left-[8%] animate-[float_6s_ease-in-out_2s_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Brain className="w-6 h-6 text-violet-300" />
        </div>
        
        {/* Icons on second circle */}
        <div className="icon absolute bottom-[25%] right-[15%] animate-[float_6s_ease-in-out_1.5s_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <MessageCircle className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute bottom-[35%] right-[8%] animate-[float_6s_ease-in-out_1s_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Database className="w-6 h-6 text-violet-300" />
        </div>
        
        {/* Additional icons */}
        <div className="icon absolute top-[20%] right-[20%] animate-[float_6s_ease-in-out_2.5s_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Server className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute bottom-[30%] left-[20%] animate-[float_6s_ease-in-out_0.5s_infinite] w-12 h-12 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Zap className="w-6 h-6 text-violet-300" />
        </div>
      </div>

      {/* Hero section */}
      <section className="text-center pt-20 pb-16 relative z-10 px-4">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-5 bg-gradient-to-r from-white via-purple-200 to-cyan-400 bg-clip-text text-transparent">
          Conversational SIEM Assistant
          <br />for Security Investigations
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto mb-10 text-base">
          Use natural language to investigate security events and generate automated threat reports. 
          Integrated with Elastic SIEM and Wazuh - no complex queries required.
        </p>

        <button className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden">
          {/* Gradient Border Layers */}
          <span className="absolute inset-0 rounded-full overflow-hidden">
            <span className="inset-0 absolute pointer-events-none select-none">
              <span
                className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(122, 105, 249), rgb(99, 242, 182), rgb(63, 131, 245))",
                }}
              />
            </span>
          </span>

          <span
            className="inset-0 absolute pointer-events-none select-none"
            style={{
              animation:
                "10s ease-in-out 0s infinite alternate none running border-glow-translate",
            }}
          >
            <span
              className="block z-0 h-full w-12 blur-xl -translate-x-1/2 rounded-full"
              style={{
                animation:
                  "10s ease-in-out 0s infinite alternate none running border-glow-scale",
                background:
                  "linear-gradient(135deg, rgb(122, 105, 249), rgb(99, 242, 182), rgb(63, 131, 245))",
              }}
            />
          </span>

          {/* Button Content */}
          <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
            {/* Shield Icon */}
            <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
              <ShieldCheck className="w-6 h-6 opacity-80 dark:opacity-100" />
              <span
                className="rounded-full size-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
                style={{
                  animation:
                    "14s ease-in-out 0s infinite alternate none running star-shine",
                  background:
                    "linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(99, 242, 182), rgb(63, 131, 245))",
                }}
              />
            </span>

            {/* Text */}
            <span className="bg-gradient-to-b ml-1.5 dark:from-white dark:to-white/50 from-neutral-950 to-neutral-950/50 bg-clip-text  text-transparent group-hover:scale-105 transition transform-gpu text-lg">
              Start Investigation
            </span>
          </span>
        </button>
      </section>

      {/* Gallery with tilted effect */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 pb-16 max-w-6xl mx-auto relative">
        {[
          {
            src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=800&fit=crop",
            title: "Threat Dashboard",
            description: "Real-time security monitoring",
            tilt: "rotate-2",
            borderTop: "border-t-[8px]",
          },
          {
            src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=800&fit=crop",
            title: "Incident Analysis",
            description: "Automated threat investigation",
            tilt: "-rotate-1",
            borderTop: "border-t-[12px]",
          },
          {
            src: "https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=600&h=800&fit=crop",
            title: "Security Reports",
            description: "Natural language reporting",
            tilt: "rotate-3",
            borderTop: "border-t-[6px]",
          },
        ].map((art, i) => (
          <div
            key={i}
            className={`art-card relative rounded-2xl overflow-hidden cursor-pointer transition transform bg-white/5 border border-white/10 h-[380px] hover:-translate-y-3 hover:shadow-[0_25px_50px_rgba(0,0,0,0.6)] ${art.tilt} ${art.borderTop} border-b-4 border-cyan-500/30`}
            style={{
              transform: `${art.tilt.replace('rotate', '')} translateZ(0)`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
            <img
              src={art.src}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <h3 className="font-bold text-lg mb-2 text-white">{art.title}</h3>
              <p className="text-white/80 text-sm mb-3">{art.description}</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs text-cyan-300 font-medium">ISRO Certified</span>
              </div>
            </div>
            
            {/* Top boundary effect */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-cyan-500/20 to-transparent z-10" />
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-20">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
          Powered by Advanced NLP
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageCircle, title: "Natural Language Queries", desc: "Ask questions in plain English" },
            { icon: Brain, title: "AI-Powered Analysis", desc: "Context-aware threat detection" },
            { icon: Database, title: "Multi-SIEM Support", desc: "Elastic & Wazuh integration" },
            { icon: FileText, title: "Automated Reporting", desc: "Generate comprehensive reports" },
          ].map((feature, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-6 border border-white/10 hover:border-cyan-500/30 transition group">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <feature.icon className="w-6 h-6 text-cyan-300" />
              </div>
              <h3 className="font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
