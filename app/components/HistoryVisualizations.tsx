"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

interface VisualizationProps {
  activityData: Array<{ name: string; accuracy: number; xp: number }>;
  langData: Array<{ name: string; value: number }>;
}

const COLORS = ["var(--foreground)", "var(--muted-foreground)", "var(--border)", "var(--input)"];

export default function HistoryVisualizations({ activityData, langData }: VisualizationProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 surface-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Recent performance</h3>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" hide />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: "#000000", borderColor: "rgba(255,255,255,0.15)", borderRadius: "6px" }} />
              <Area type="monotone" dataKey="accuracy" stroke="#ffffff" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="surface-card p-6 flex flex-col">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">Languages used</h3>
        <div className="h-[250px] w-full flex-1">
          {langData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={langData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                  {langData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "6px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data yet</div>
          )}
        </div>
      </div>
    </div>
  );
}
