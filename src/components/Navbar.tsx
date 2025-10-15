"use client";

import Link from "next/link";

export default function Navbar() {
  const links = [
    { name: "Conversational Pane", path: "/conversationalPane" },
    { name: "Report", path: "/report" },
  ];

  return (
    <nav className="flex justify-between items-center py-5 px-12 relative z-10 bg-transparent">
      {/* Logo / Title */}
      <div className="text-lg font-semibold tracking-wider text-white">
        NIRIKSHA
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
     
    </nav>
  );
}
