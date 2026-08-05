import Link from "next/link";
import { NotebookPen, Folder } from "lucide-react";
export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/Notes.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-3 pt-32 pb-20 text-white">

        <h1 className="text-5xl md:text-6xl font-semibold mb-6">
          Memozi
        </h1>

        <h2 className="mt-10 text-2xl md:text-3xl font-semibold text-gray-100 mb-6">
          Welcome to Memozi
        </h2>

        <p className="text-[11px] md:text-xl text-gray-200 mb-6 max-w-lg leading-relaxed">
  Organize your thoughts, create beautiful notes and keep everything
  structured with Collections.
  A modern workspace designed to help you capture ideas effortlessly.
</p>

        <div className="flex flex-col sm:flex-row gap-4">

          <Link
  href="/notes"
  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-lg transition-all duration-300 text-center text-white font-medium flex items-center justify-center gap-2"
>
  <NotebookPen size={20} />
  My Notes
</Link>

          <Link
  href="/collections"
  className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 hover:scale-105 transition-all duration-300 text-center text-white font-medium flex items-center justify-center gap-2"
>
  <Folder size={20} />
  View Collections
</Link>

        </div>

      </div>
    </div>
  );
}