"use client";
import { Activity, FileText, Server, ShieldCheck } from "lucide-react";
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
      {/* Glow effects */}
      <div className="glow glow-1 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] top-[-200px] left-[-200px] pointer-events-none z-0" />
      <div className="glow glow-2 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] top-1/2 right-[-200px] pointer-events-none z-0" />
      <div className="glow glow-3 absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.3)_0%,transparent_70%)] blur-[60px] bottom-[-200px] left-[30%] pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="flex justify-between items-center py-5 px-12 relative z-10">
        <div className="text-lg font-semibold tracking-wider">SIEMASSIST.</div>

        <div className="flex gap-8 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md">
          {["Home", "About", "Pricing", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-white hover:text-violet-300 transition"
            >
              {link}
            </a>
          ))}
        </div>

        <button className="border border-white/20 rounded-full px-5 py-2 text-sm hover:border-violet-300 hover:bg-white/10 transition">
          👤 Log in
        </button>
      </nav>

      {/* Floating icons */}
      <div className="absolute w-full h-full pointer-events-none">
        <div className="icon absolute top-[15%] left-[8%] animate-[float_6s_ease-in-out_infinite] w-10 h-10 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <ShieldCheck className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute top-[25%] left-[20%] animate-[float_6s_ease-in-out_1s_infinite] w-10 h-10 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Server className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute top-[12%] right-[25%] animate-[float_6s_ease-in-out_2s_infinite] w-10 h-10 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <Activity className="w-6 h-6 text-violet-300" />
        </div>
        <div className="icon absolute top-[30%] right-[12%] animate-[float_6s_ease-in-out_1.5s_infinite] w-10 h-10 flex items-center justify-center rounded-lg border border-violet-300/30 bg-violet-300/10">
          <FileText className="w-6 h-6 text-violet-300" />
        </div>
      </div>

      {/* Hero section */}
      <section className="text-center pt-20 pb-16 relative z-10 px-4">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
          Conversational SIEM Assistant
          <br /> for Security Investigations
        </h1>
        <p className="text-white/70 max-w-xl mx-auto mb-10 text-base">
          Use natural language to investigate security events and generate
          automated threat reports. Integrated with Elastic SIEM and Wazuh - no
          complex queries required.
        </p>

        <button className="group relative dark:bg-neutral-800 bg-neutral-200 rounded-full p-px overflow-hidden">
          {/* Gradient Border Layers */}
          <span className="absolute inset-0 rounded-full overflow-hidden">
            <span className="inset-0 absolute pointer-events-none select-none">
              <span
                className="block -translate-x-1/2 -translate-y-1/3 size-24 blur-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
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
                  "linear-gradient(135deg, rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
              }}
            />
          </span>

          {/* Button Content */}
          <span className="flex items-center justify-center gap-1 relative z-[1] dark:bg-neutral-950/90 bg-neutral-50/90 rounded-full py-2 px-4 pl-2 w-full">
            {/* Star Icon */}
            <span className="relative group-hover:scale-105 transition-transform group-hover:rotate-[360deg] duration-500">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="opacity-80 dark:opacity-100"
                style={{
                  animation:
                    "14s cubic-bezier(0.68, -0.55, 0.27, 1.55) 0s infinite alternate none running star-rotate",
                }}
              >
                <ellipse
                  cx="12"
                  cy="5"
                  rx="9"
                  ry="3"
                  fill="url(#paint0_linear_db)"
                  stroke="url(#paint1_linear_db)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 5V19A9 3 0 0 0 21 19V5"
                  fill="none"
                  stroke="url(#paint1_linear_db)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 12A9 3 0 0 0 21 12"
                  fill="none"
                  stroke="url(#paint1_linear_db)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <defs>
                  <linearGradient
                    id="paint0_linear_db"
                    x1="-0.5"
                    y1="9"
                    x2="15.5"
                    y2="-1.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7A69F9" />
                    <stop offset="0.575" stopColor="#F26378" />
                    <stop offset="1" stopColor="#F5833F" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_db"
                    x1="-0.5"
                    y1="9"
                    x2="15.5"
                    y2="-1.5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#7A69F9" />
                    <stop offset="0.575" stopColor="#F26378" />
                    <stop offset="1" stopColor="#F5833F" />
                  </linearGradient>
                </defs>
              </svg>

              <span
                className="rounded-full size-11 absolute opacity-0 dark:opacity-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-lg"
                style={{
                  animation:
                    "14s ease-in-out 0s infinite alternate none running star-shine",
                  background:
                    "linear-gradient(135deg, rgb(59, 196, 242), rgb(122, 105, 249), rgb(242, 99, 120), rgb(245, 131, 63))",
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

      {/* Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 md:px-12 pb-16 max-w-6xl mx-auto">
        {[
          {
            src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&h=800&fit=crop",
            artist: "Sarah Chen",
            rating: "4.9",
          },
          {
            src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=800&fit=crop",
            artist: "Alex Rivera",
            rating: "5.0",
          },
          {
            src: "https://images.unsplash.com/photo-1620503374956-c942862f0372?w=600&h=800&fit=crop",
            artist: "Maya Johnson",
            rating: "4.8",
          },
        ].map((art, i) => (
          <div
            key={i}
            className="art-card relative rounded-2xl overflow-hidden cursor-pointer transition transform bg-white/5 border border-white/10 h-[350px] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          >
            <img
              src={art.src}
              alt={art.artist}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 translate-y-full hover:translate-y-0 transition">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-violet-500" />
                <div className="font-semibold text-sm">{art.artist}</div>
                <div className="ml-auto flex items-center gap-1 text-sm">
                  ⭐ {art.rating}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


