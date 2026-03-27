"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, ClipboardList, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  gradient: string;
  delay: number;
}

export function StatCard({ title, value, description, icon: Icon, gradient, delay }: StatCardProps) {
  return (
    <Card 
      className={`
        card-hover overflow-hidden border-0 shadow-lg
        animate-fade-in opacity-0
      `}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Gradient icon section */}
          <div className={`${gradient} p-4 flex items-center justify-center`}>
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          {/* Content section */}
          <div className="flex-1 p-4 flex flex-col justify-center">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold tracking-tight number-flow">{value}</span>
              {description && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  {description}
                </span>
              )}
            </div>
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
        gradient="stat-gradient-1"
        delay={0}
      />
      <StatCard
        title="Total Assessments"
        value={totalAssessments}
        description="All time"
        icon={ClipboardList}
        gradient="stat-gradient-2"
        delay={100}
      />
      <StatCard
        title="Pending Review"
        value={pendingAssessments}
        description="Awaiting"
        icon={AlertTriangle}
        gradient="stat-gradient-3"
        delay={200}
      />
      <StatCard
        title="Completed"
        value={completedAssessments}
        description="Analyzed"
        icon={CheckCircle}
        gradient="stat-gradient-4"
        delay={300}
      />
    </div>
  );
}
