"use client";
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function HistoryDashboard({ attempts }: { attempts: any[] }) {
  
  // 1. Calculate Topic-wise Performance
  const topicStats = attempts.reduce((acc: any, curr: any) => {
    if (!acc[curr.topic]) {
      acc[curr.topic] = { totalAccuracy: 0, count: 0 };
    }
    acc[curr.topic].totalAccuracy += curr.accuracy;
    acc[curr.topic].count += 1;
    return acc;
  }, {});

  const performanceBreakdown = Object.keys(topicStats).map(topic => ({
    topic,
    avg: Math.round(topicStats[topic].totalAccuracy / topicStats[topic].count)
  })).sort((a, b) => b.avg - a.avg);

  // 2. Format data for the Progress Curve (Line Chart)
  const chartData = attempts.map(a => ({
    date: new Date(a.createdAt).toLocaleDateString(),
    accuracy: a.accuracy,
    topic: a.topic
  }));

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <h1 className="text-4xl font-black italic mb-8 uppercase tracking-tighter">Mission Control</h1>

      {/* --- TREND LINE GRAPH --- */}
      <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl mb-8">
        <h2 className="text-xl font-bold mb-4 text-zinc-400">Performance Curve</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                itemStyle={{ color: '#a78bfa' }}
              />
              <Area type="monotone" dataKey="accuracy" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* --- TOP TOPICS --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-green-500 font-bold mb-4 uppercase text-sm tracking-widest">Top Strengths</h2>
          {performanceBreakdown.slice(0, 3).map(item => (
            <div key={item.topic} className="flex justify-between items-center mb-4 bg-zinc-800/50 p-3 rounded-lg">
              <span className="font-medium">{item.topic}</span>
              <span className="text-2xl font-black">{item.avg}%</span>
            </div>
          ))}
        </div>

        {/* --- NEEDS IMPROVEMENT --- */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl">
          <h2 className="text-red-500 font-bold mb-4 uppercase text-sm tracking-widest">Weak Points</h2>
          {performanceBreakdown.reverse().slice(0, 3).map(item => (
            <div key={item.topic} className="flex justify-between items-center mb-4 bg-zinc-800/50 p-3 rounded-lg">
              <span className="font-medium">{item.topic}</span>
              <span className="text-2xl font-black">{item.avg}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}