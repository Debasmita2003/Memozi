import Link from "next/link";
export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/Notes.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Memozi
        </h1>

        <div className="mt-10 text-lg md:text-2xl text-gray-200 mb-10 max-w-2xl">
      <h1>Welcome to memozi</h1>
    </div>

        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl">
          A modern way to manage notes and bookmarks <br />
  with a clean, glass-inspired interface.
  
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
  href="/notes"
  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105 hover:shadow-lg transition-all duration-300 text-center text-white font-medium"
>
  Get Started
</Link>

          <Link
            href="/bookmarks"
            className="px-6 py-3 rounded-xl bg-white/20 backdrop-blur hover:bg-white/30 transition text-center"
          >
            View Bookmarks
          </Link>
          
        </div>
      </div>
    </div>
  );
}