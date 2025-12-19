"use client";

export default function Dsa() {
  const levels = [
    {
      level: "Level 1",
      title: "Easy AI",
      desc: "Basic problems to build confidence",
      topics: ["Arrays", "Strings", "Basic Math"],
      color: "border-green-500 text-green-400",
    },
    {
      level: "Level 2",
      title: "Medium AI",
      desc: "Logic + pattern recognition",
      topics: ["Stacks", "Queues", "Linked List"],
      color: "border-yellow-500 text-yellow-400",
    },
    {
      level: "Level 3",
      title: "Hard AI",
      desc: "Interview-level DSA questions",
      topics: ["Trees", "Graphs", "Recursion"],
      color: "border-orange-500 text-orange-400",
    },
    {
      level: "Level 4",
      title: "Elite AI",
      desc: "Advanced & competitive programming",
      topics: ["DP", "Greedy", "Binary Search"],
      color: "border-red-500 text-red-400",
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
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
          DSA Practice Arena
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Practice Data Structures & Algorithms with AI challengers.  
          Compete, learn, and level up step-by-step.
        </p>
      </div>

      {/* LEVELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {levels.map((lvl, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border ${lvl.color} bg-zinc-900/40 p-6 hover:scale-[1.02] transition`}
          >
            <h3 className="text-xl font-semibold mb-1">
              {lvl.level} — {lvl.title}
            </h3>
            <p className="text-zinc-400 text-sm mb-4">{lvl.desc}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {lvl.topics.map((t, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1 rounded-full bg-zinc-800 text-zinc-300"
                >
                  {t}
                </span>
              ))}
            </div>
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
        AI challenges are simulated for demo purposes · Backend coming soon 🚀
      </p>
    </div>
  );
}
