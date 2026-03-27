"use client";

import { Assessment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Clock, ArrowRight, FileText } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function getRiskLevel(risk: number): { label: string; className: string } {
  if (risk < 0.3) return { label: "Low", className: "risk-low" };
  if (risk < 0.6) return { label: "Moderate", className: "risk-moderate" };
  return { label: "High", className: "risk-high" };
}

interface RecentAssessmentsProps {
  assessments: Assessment[];
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  const recentAssessments = assessments.slice(0, 5);

  return (
    <Card hover className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
            <FileText className="w-3.5 h-3.5 text-foreground" />
          </div>
          <CardTitle className="text-sm font-medium">Recent Assessments</CardTitle>
        </div>
        <Link href="/assessments">
          <Button variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
            View All
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium">No Assessments Yet</p>
            <p className="text-xs text-muted-foreground mt-1">Create your first assessment to get started.</p>
            <Link href="/assessments/new" className="mt-4">
              <Button size="sm">Create Assessment</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-1.5">
            {recentAssessments.map((assessment, index) => {
              const maxRisk = Math.max(
                assessment.alzheimer_risk || 0,
                assessment.parkinson_risk || 0,
                assessment.als_risk || 0
              );
              const riskInfo = getRiskLevel(maxRisk);

              return (
                <Link
                  key={assessment.id}
                  href={`/assessments/${assessment.id}`}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/60 transition-all duration-200"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-mono font-medium text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-200">
                      {assessment.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium group-hover:text-foreground transition-colors">
                        Assessment #{assessment.id}
                      </p>
                      <div className="flex items-center gap-1.5 text-[0.6875rem] text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(assessment.created_at), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {assessment.status === "completed" ? (
                      <Badge variant="outline" className={`${riskInfo.className} text-[0.625rem]`}>
                        {riskInfo.label} Risk
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[0.625rem] capitalize">
                        {assessment.status}
                      </Badge>
                    )}
                    <Eye className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
