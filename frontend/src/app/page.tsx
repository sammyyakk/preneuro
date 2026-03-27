"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentAssessments } from "@/components/dashboard/recent-assessments";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { Button } from "@/components/ui/button";
import { Plus, Users, Activity } from "lucide-react";
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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Welcome Back, Dr. Mehta
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s your patient overview and recent activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/patients">
            <Button variant="outline" size="sm" className="gap-2">
              <Users className="h-3.5 w-3.5" />
              Patients
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button size="sm" className="gap-2">
              <Plus className="h-3.5 w-3.5" />
              New Assessment
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

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}>
          <RecentAssessments assessments={assessments?.items || []} />
        </div>
        <div className="animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'forwards', opacity: 0 }}>
          <RiskChart data={chartData} />
        </div>
      </div>
    </div>
  );
}
