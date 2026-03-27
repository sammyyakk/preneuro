"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { BarChart3, Info } from "lucide-react";

interface RiskChartProps {
  data: {
    name: string;
    alzheimer: number;
    parkinson: number;
    als: number;
  }[];
}

export function RiskChart({ data }: RiskChartProps) {
  return (
    <Card hover className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
            <BarChart3 className="w-3.5 h-3.5 text-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">Risk Analysis</CardTitle>
        </div>
        <div className="flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
          <Info className="w-3 h-3" />
          Last 10 Assessments
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No Data Available</p>
            <p className="text-xs text-muted-foreground mt-1">Complete assessments to see risk analysis.</p>
          </div>
        ) : (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                />
                <Tooltip
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    padding: "8px 12px",
                    fontSize: "16px",
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 4, fontSize: "14px" }}
                  cursor={{ fill: "var(--muted)", opacity: 0.3 }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 16, fontSize: "14px" }}
                  iconType="circle"
                  iconSize={6}
                />
                <Bar
                  dataKey="alzheimer"
                  name="Alzheimer's"
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="parkinson"
                  name="Parkinson's"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
                <Bar
                  dataKey="als"
                  name="ALS"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
