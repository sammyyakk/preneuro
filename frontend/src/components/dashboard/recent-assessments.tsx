"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Assessment } from "@/types";
import { format } from "date-fns";
import Link from "next/link";

interface RecentAssessmentsProps {
  assessments: Assessment[];
}

function getRiskBadge(risk: number | undefined) {
  if (risk === undefined) return null;
  if (risk < 0.3)
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Low
      </Badge>
    );
  if (risk < 0.6)
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Moderate
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
      High
    </Badge>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending</Badge>;
    case "processing":
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">Processing</Badge>;
    case "completed":
      return <Badge variant="outline" className="bg-green-50 text-green-700">Completed</Badge>;
    case "failed":
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function RecentAssessments({ assessments }: RecentAssessmentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
      </CardHeader>
      <CardContent>
        {assessments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No assessments yet.{" "}
            <Link href="/assessments" className="text-primary hover:underline">
              Create one
            </Link>
          </p>
        ) : (
          <div className="space-y-4">
            {assessments.slice(0, 5).map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessments/${assessment.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    Assessment #{assessment.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(assessment.created_at), "MMM d, yyyy HH:mm")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {assessment.status === "completed" && (
                    <>
                      {getRiskBadge(
                        Math.max(
                          assessment.alzheimer_risk || 0,
                          assessment.parkinson_risk || 0,
                          assessment.als_risk || 0
                        )
                      )}
                    </>
                  )}
                  {getStatusBadge(assessment.status)}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
