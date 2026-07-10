export default function GlassCard({ title, description, icon: Icon }) {
  return (
    <div className="group relative p-6 rounded-2xl 
      backdrop-blur-xl bg-white/10 border border-white/20 
      shadow-xl transition-all duration-300
      hover:scale-[1.02] hover:shadow-indigo-500/30">

      {/* Glow */}
      <div className="absolute inset-0 rounded-2xl opacity-0 
        group-hover:opacity-100 transition 
        bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl">
      </div>

      <div className="relative z-10">
        {Icon && <Icon className="w-8 h-8 text-indigo-400 mb-4" />}
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300 text-sm">{description}</p>
      </div>
    </div>
  );
}