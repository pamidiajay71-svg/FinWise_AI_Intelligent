export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Floating orbs */}
      <div className="absolute top-[-10%] left-[-5%] h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[120px] animate-pulse-glow" />
      <div
        className="absolute top-[30%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/15 blur-[130px] animate-pulse-glow"
        style={{ animationDelay: '2s' }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] h-[450px] w-[450px] rounded-full bg-cyan-500/15 blur-[100px] animate-pulse-glow"
        style={{ animationDelay: '4s' }}
      />
      <div
        className="absolute top-[60%] left-[10%] h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px] animate-pulse-glow"
        style={{ animationDelay: '1s' }}
      />

      {/* Floating shapes */}
      <div className="absolute top-[15%] left-[10%] h-16 w-16 rounded-2xl border border-primary/20 rotate-12 animate-float opacity-40" />
      <div
        className="absolute top-[40%] right-[15%] h-20 w-20 rounded-full border border-cyan-500/20 animate-float-slow opacity-30"
      />
      <div
        className="absolute bottom-[20%] left-[30%] h-12 w-12 rounded-lg border border-violet-500/20 -rotate-12 animate-float opacity-40"
        style={{ animationDelay: '3s' }}
      />
    </div>
  );
}
