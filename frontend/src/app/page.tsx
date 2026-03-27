"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentAssessments } from "@/components/dashboard/recent-assessments";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { Button } from "@/components/ui/button";
import { Plus, Users, Activity, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: patients } = useQuery({
    queryKey: ["patients"],
    queryFn: () => patientsApi.list(1, 100),
  });

  const { data: assessments } = useQuery({
    queryKey: ["assessments"],
    queryFn: () => assessmentsApi.list(1, 100),
  });

  const totalPatients = patients?.total || 0;
  const totalAssessments = assessments?.total || 0;
  const pendingAssessments =
    assessments?.items.filter((a) => a.status === "pending").length || 0;
  const completedAssessments =
    assessments?.items.filter((a) => a.status === "completed").length || 0;

  const chartData =
    assessments?.items
      .filter((a) => a.status === "completed")
      .slice(0, 10)
      .map((a) => ({
        name: `#${a.id}`,
        alzheimer: a.alzheimer_risk || 0,
        parkinson: a.parkinson_risk || 0,
        als: a.als_risk || 0,
      })) || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-primary animate-float" />
            <span className="text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back, <span className="gradient-text">Dr. Chen</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your patient overview and recent activity
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/patients">
            <Button variant="outline" size="lg" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">View </span>Patients
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New </span>Assessment
              <Sparkles className="w-3 h-3 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats
        totalPatients={totalPatients}
        totalAssessments={totalAssessments}
        pendingAssessments={pendingAssessments}
        completedAssessments={completedAssessments}
      />

      {/* Charts section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards', opacity: 0 }}>
          <RecentAssessments assessments={assessments?.items || []} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'forwards', opacity: 0 }}>
          <RiskChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
