"use client";

export default function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-zinc-400 text-sm mt-2">{description}</p>
      )}
    </div>
  );
}
