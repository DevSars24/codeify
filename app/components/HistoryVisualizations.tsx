"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface VisualizationProps {
  activityData: Array<{ name: string; accuracy: number; xp: number }>;
  langData: Array<{ name: string; value: number }>;
}

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981'];

export default function HistoryVisualizations({ activityData, langData }: VisualizationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Activity Chart */}
      <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6">Recent Performance Metrics</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="accuracy" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorAccuracy)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Language Distribution */}
      <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800 flex flex-col items-center justify-center">
        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-6 w-full text-left">Language Core</h3>
        <div className="h-[250px] w-full">
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={langData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {langData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-600 text-xs text-center">
              NO DATA AVAILABLE
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
