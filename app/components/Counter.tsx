"use client";

import React from "react";

type CounterProps = {
  value: number;
  label: string;
};

export default function Counter({ value, label }: CounterProps) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-3xl font-bold">{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}
