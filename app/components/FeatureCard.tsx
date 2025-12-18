"use client";

export default function FeatureCard({
  icon,
  title,
  description,
  highlight,
}: {
  icon: string;
  title: string;
  description?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 text-center border ${
        highlight
          ? "bg-purple-950/50 border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.5)]"
          : "bg-zinc-900 border-zinc-800"
      }`}
    >
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-zinc-400 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}
