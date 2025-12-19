"use client";

export default function Dev() {
  const tracks = [
    {
      title: "HTML + CSS",
      desc: "Build layouts & responsive designs",
      levels: ["Easy UI", "Flex/Grid", "Landing Pages", "Advanced Layouts"],
    },
    {
      title: "JavaScript",
      desc: "Logic & DOM-based challenges",
      levels: ["Basics", "Events", "Async JS", "Interview Tasks"],
    },
    {
      title: "React / Next.js",
      desc: "Component-based development",
      levels: ["JSX & Props", "Hooks", "State Logic", "Real-World Apps"],
    },
  ];

  const comingSoon = () => {
    alert(
      "🚧 Feature Under Development\n\n" +
      "Our backend team is currently working on this feature.\n\n" +
      "It will be available soon.\n\n" +
      "For now, please practice using the Coding Playground.\n\n" +
      "Sorry for the inconvenience."
    );
  };
  

  return (
    <div className="min-h-screen bg-black text-white px-6 pt-24 pb-16">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
          Dev Practice Arena
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Practice Web Development with AI-guided challenges.  
          Choose your tech stack and level up.
        </p>
      </div>

      {/* TRACKS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {tracks.map((track, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:scale-[1.02] transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-cyan-400">
              {track.title}
            </h3>
            <p className="text-zinc-400 text-sm mb-4">{track.desc}</p>

            <ul className="space-y-2 mb-6">
              {track.levels.map((lvl, i) => (
                <li
                  key={i}
                  className="text-sm text-zinc-300 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  {lvl}
                </li>
              ))}
            </ul>

            <button
  onClick={comingSoon}
  className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-medium"
>
  Start Challenge
</button>

          </div>
        ))}
      </div>

      {/* FOOT NOTE */}
      <p className="text-center text-zinc-500 text-sm mt-16">
        AI feedback & code editor will be added in future updates 🚀
      </p>
    </div>
  );
}
