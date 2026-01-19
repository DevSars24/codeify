"use client";
import React, { useMemo } from 'react';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

export default function HistoryDashboard({ attempts }: { attempts: any[] }) {
  
  // 1. DYNAMIC DSA ANALYSIS: Processes every topic in your database
  const dsaAnalysis = useMemo(() => {
    const stats = attempts.reduce((acc: any, curr: any) => {
      const topic = curr.topic.trim();
      if (!acc[topic]) {
        acc[topic] = { totalAcc: 0, count: 0, best: 0, worst: 100 };
      }
      acc[topic].totalAcc += curr.accuracy;
      acc[topic].count += 1;
      acc[topic].best = Math.max(acc[topic].best, curr.accuracy);
      acc[topic].worst = Math.min(acc[topic].worst, curr.accuracy);
      return acc;
    }, {});

    return Object.keys(stats).map(topic => ({
      name: topic,
      avg: Math.round(stats[topic].totalAcc / stats[topic].count),
      attempts: stats[topic].count,
      peak: stats[topic].best
    })).sort((a, b) => b.avg - a.avg);
  }, [attempts]);

  // 2. STRATEGIC INSIGHTS
  const strengths = dsaAnalysis.filter(t => t.avg >= 70);
  const weaknesses = dsaAnalysis.filter(t => t.avg < 70);
  const mostPracticed = [...dsaAnalysis].sort((a, b) => b.attempts - a.attempts)[0];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 pt-24 selection:bg-purple-500/30">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="mb-10">
          <h1 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-2">
            DSA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Analytics</span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-zinc-800"></span>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.4em]">Core Competency Mapping</p>
          </div>
        </header>

        {/* --- DYNAMIC TOPIC FOCUS CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FocusCard 
            title="Primary Focus" 
            topic={mostPracticed?.name || "N/A"} 
            desc={`${mostPracticed?.attempts || 0} Total Sessions`}
            border="border-blue-500/20"
          />
          <FocusCard 
            title="Highest Proficiency" 
            topic={dsaAnalysis[0]?.name || "N/A"} 
            desc={`Peak Accuracy: ${dsaAnalysis[0]?.peak || 0}%`}
            border="border-emerald-500/20"
          />
          <FocusCard 
            title="Critical Weakness" 
            topic={dsaAnalysis[dsaAnalysis.length - 1]?.name || "N/A"} 
            desc={`Avg Accuracy: ${dsaAnalysis[dsaAnalysis.length - 1]?.avg || 0}%`}
            border="border-red-500/20"
          />
        </div>

        {/* --- PERFORMANCE CURVE --- */}
        <div className="bg-zinc-900/20 backdrop-blur-xl border border-white/5 p-8 rounded-[2rem] mb-10">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-xl font-bold">Growth Velocity</h2>
              <p className="text-zinc-500 text-xs">Tracking accuracy across all DSA domains</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attempts}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" stroke="#18181b" vertical={false} />
                <XAxis dataKey="topic" hide />
                <YAxis stroke="#3f3f46" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Area 
                  type="stepAfter" 
                  dataKey="accuracy" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  fill="url(#chartGradient)"
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* --- TOPIC BREAKDOWN GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* STRENGTHS LIST */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Mastered Domains</h3>
            </div>
            <div className="space-y-3">
              {strengths.length > 0 ? strengths.map(item => (
                <TopicRow key={item.name} item={item} color="text-emerald-400" />
              )) : <p className="text-zinc-600 italic text-sm">No topics mastered yet. Keep grinding.</p>}
            </div>
          </section>

          {/* WEAKNESSES LIST */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-red-500">Target for Improvement</h3>
            </div>
            <div className="space-y-3">
              {weaknesses.length > 0 ? weaknesses.map(item => (
                <TopicRow key={item.name} item={item} color="text-red-400" />
              )) : <p className="text-zinc-600 italic text-sm">Zero weak points detected. Exceptional work.</p>}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Sub-component for the Focus Cards
function FocusCard({ title, topic, desc, border }: any) {
  return (
    <div className={`bg-zinc-900/40 backdrop-blur-md border ${border} p-6 rounded-2xl transition-all hover:scale-[1.02]`}>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{title}</p>
      <h4 className="text-2xl font-black truncate">{topic}</h4>
      <p className="text-xs text-zinc-500 mt-1 font-mono">{desc}</p>
    </div>
  );
}

// Sub-component for Topic Rows
function TopicRow({ item, color }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-zinc-900/20 border border-white/5 rounded-xl hover:bg-zinc-900/60 transition group">
      <div>
        <span className="font-bold text-lg group-hover:translate-x-1 transition-transform inline-block capitalize">{item.name}</span>
        <div className="text-[10px] text-zinc-500 uppercase tracking-tighter">{item.attempts} Attempts Total</div>
      </div>
      <div className="text-right">
        <div className={`text-2xl font-black ${color}`}>{item.avg}%</div>
        <div className="h-1 w-24 bg-zinc-800 rounded-full mt-1 overflow-hidden">
          <div className={`h-full bg-current ${color}`} style={{ width: `${item.avg}%` }} />
        </div>
      </div>
    </div>
  );
}