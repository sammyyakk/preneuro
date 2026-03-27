"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

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
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution by Disease</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis domain={[0, 1]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                />
                <Legend />
                <Bar dataKey="alzheimer" name="Alzheimer's" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="parkinson" name="Parkinson's" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="als" name="ALS" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
