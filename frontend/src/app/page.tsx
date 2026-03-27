"use client";

import { useQuery } from "@tanstack/react-query";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { DashboardStats } from "@/components/dashboard/stats";
import { RecentAssessments } from "@/components/dashboard/recent-assessments";
import { RiskChart } from "@/components/dashboard/risk-chart";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
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

  // Prepare chart data from completed assessments
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, Dr. Chen. Here&apos;s your overview.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/patients">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Patients
            </Button>
          </Link>
          <Link href="/assessments/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Assessment
            </Button>
          </Link>
        </div>
      </div>

      <DashboardStats
        totalPatients={totalPatients}
        totalAssessments={totalAssessments}
        pendingAssessments={pendingAssessments}
        completedAssessments={completedAssessments}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentAssessments assessments={assessments?.items || []} />
        <RiskChart data={chartData} />
      </div>
    </div>
  );
}
