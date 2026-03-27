"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { assessmentsApi, patientsApi } from "@/lib/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Eye, ClipboardList, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function getRiskBadge(risk: number | undefined) {
  if (risk === undefined) return null;
  if (risk < 0.3)
    return (
      <Badge variant="outline" className="risk-low text-[0.625rem] font-medium">
        Low ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  if (risk < 0.6)
    return (
      <Badge variant="outline" className="risk-moderate text-[0.625rem] font-medium">
        Moderate ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  return (
    <Badge variant="outline" className="risk-high text-[0.625rem] font-medium">
      High ({(risk * 100).toFixed(0)}%)
    </Badge>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1.5 text-[0.625rem] bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1.5 text-[0.625rem] bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/30 dark:text-sky-400 dark:border-sky-800">
          <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" className="gap-1.5 text-[0.625rem] risk-low">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1.5 text-[0.625rem]">
          <AlertCircle className="w-3 h-3" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary" className="text-[0.625rem] capitalize">{status}</Badge>;
  }
}

export default function AssessmentsPage() {
  const [page, setPage] = useState(1);

  const { data: assessments, isLoading } = useQuery({
    queryKey: ["assessments", page],
    queryFn: () => assessmentsApi.list(page, 10),
  });

  const { data: patients } = useQuery({
    queryKey: ["patients", "all"],
    queryFn: () => patientsApi.list(1, 100),
  });

  const patientMap = new Map(patients?.items.map((p) => [p.id, p]) || []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">Assessments</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Risk Assessments
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage patient neurodegenerative risk assessments.
          </p>
        </div>
        <Link href="/assessments/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" />
            New Assessment
          </Button>
        </Link>
      </div>

      <Card hover className="animate-fade-in" style={{ animationDelay: '80ms' }}>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground mt-4">Loading assessments...</p>
            </div>
          ) : assessments?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center mb-3">
                <ClipboardList className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No Assessments Yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                Create your first assessment to start analyzing patient risk factors.
              </p>
              <Link href="/assessments/new" className="mt-4">
                <Button size="sm" className="gap-2">
                  <Plus className="w-3.5 h-3.5" />
                  Create Assessment
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">ID</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Patient</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Date</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Max Risk</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider w-[80px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assessments?.items.map((assessment, index) => {
                      const patient = patientMap.get(assessment.patient_id);
                      const maxRisk = Math.max(
                        assessment.alzheimer_risk || 0,
                        assessment.parkinson_risk || 0,
                        assessment.als_risk || 0
                      );
                      return (
                        <TableRow
                          key={assessment.id}
                          className="group hover:bg-muted/50 transition-colors animate-fade-in"
                          style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards', opacity: 0 }}
                        >
                          <TableCell>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-muted text-xs font-mono font-medium text-foreground">
                              {assessment.id}
                            </span>
                          </TableCell>
                          <TableCell>
                            {patient ? (
                              <Link
                                href={`/patients/${patient.id}`}
                                className="flex items-center gap-2.5 hover:text-foreground transition-colors"
                              >
                                <div className="w-7 h-7 rounded-md bg-foreground/80 flex items-center justify-center text-[9px] font-semibold text-background">
                                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <span className="text-sm font-medium">{patient.name}</span>
                              </Link>
                            ) : (
                              <span className="text-sm text-muted-foreground">Patient #{assessment.patient_id}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              {format(new Date(assessment.created_at), "MMM d, yyyy")}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                          <TableCell>
                            {assessment.status === "completed"
                              ? getRiskBadge(maxRisk)
                              : <span className="text-muted-foreground">—</span>}
                          </TableCell>
                          <TableCell>
                            <Link href={`/assessments/${assessment.id}`}>
                              <Button
                                variant="ghost"
                                size="icon-sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {assessments && assessments.total > 10 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{(page - 1) * 10 + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(page * 10, assessments.total)}</span> of{" "}
                    <span className="font-medium text-foreground">{assessments.total}</span> assessments
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page * 10 >= assessments.total}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
