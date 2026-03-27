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
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <CardTitle>Recent Assessments</CardTitle>
        </div>
        <Link href="/assessments">
          <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
            View all
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {recentAssessments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground font-medium">No assessments yet</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Create your first assessment to get started</p>
            <Link href="/assessments/new" className="mt-4">
              <Button size="sm">Create Assessment</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
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
                  className="group flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all duration-200 hover:scale-[1.01]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      #{assessment.id}
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">
                        Assessment #{assessment.id}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(assessment.created_at), "MMM d, h:mm a")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {assessment.status === "completed" ? (
                      <Badge variant="outline" className={`${riskInfo.className} text-xs`}>
                        {riskInfo.label} Risk
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        {assessment.status}
                      </Badge>
                    )}
                    <Eye className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
