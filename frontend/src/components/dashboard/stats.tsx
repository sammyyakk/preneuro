"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, AlertTriangle, CheckCircle, ArrowUpRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  delay: number;
}

export function StatCard({ title, value, description, icon: Icon, delay }: StatCardProps) {
  return (
    <Card
      className="card-hover animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-semibold tracking-tight number-flow">{value}</span>
            </div>
            {description && (
              <span className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                {description}
              </span>
            )}
          </div>
          <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
            <Icon className="w-4 h-4 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  totalPatients: number;
  totalAssessments: number;
  pendingAssessments: number;
  completedAssessments: number;
}

export function DashboardStats({
  totalPatients,
  totalAssessments,
  pendingAssessments,
  completedAssessments,
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Patients"
        value={totalPatients}
        description="Active"
        icon={Users}
        delay={0}
      />
      <StatCard
        title="Total Assessments"
        value={totalAssessments}
        description="All Time"
        icon={ClipboardList}
        delay={80}
      />
      <StatCard
        title="Pending Review"
        value={pendingAssessments}
        description="Awaiting"
        icon={AlertTriangle}
        delay={160}
      />
      <StatCard
        title="Completed"
        value={completedAssessments}
        description="Analyzed"
        icon={CheckCircle}
        delay={240}
      />
    </div>
  );
}
