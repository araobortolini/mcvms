"use client";
import { Sidebar } from "./sidebar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full">
      <span className="font-bold text-indigo-600">Plus-PDV</span>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2">
        {isOpen ? <X /> : <Menu />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="p-4 flex justify-end">
            <button onClick={() => setIsOpen(false)}><X className="w-6 h-6" /></button>
          </div>
          <div className="h-full" onClick={() => setIsOpen(false)}>
            <Sidebar />
          </div>
        </div>
      )}
    </div>
  );
}