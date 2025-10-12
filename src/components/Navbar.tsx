"use client";

import Link from "next/link";

export default function Navbar() {
  const links = [
    { name: "Home", path: "/" },
    { name: "Landing", path: "/landing" },
    { name: "Conversational Pane", path: "/conversationalPane" },
    { name: "Query Editor / Translator", path: "/queryeditortranslator" },
    { name: "Results Workspace", path: "/resultsinvestigatorworkspace" },
    { name: "Context Manager History", path: "/contextmanagerhistory" },
  ];

  return (
    <nav className="flex justify-between items-center py-5 px-12 relative z-10 bg-transparent">
      {/* Logo / Title */}
      <div className="text-lg font-semibold tracking-wider text-white">
        SIEMASSIST<span className="text-violet-400">.</span>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-6 bg-white/10 px-6 py-2 rounded-full backdrop-blur-md">
        {links.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className="text-sm text-white hover:text-violet-300 transition whitespace-nowrap"
          >
            {link.name}
          </Link>
        ))}
      </div>

      {/* Admin Button */}
      <Link
        href="/admin"
        className="border border-white/20 rounded-full px-5 py-2 text-sm text-white hover:border-violet-300 hover:bg-white/10 transition"
      >
        🔐 Admin Login
      </Link>
    </nav>
  );
}
