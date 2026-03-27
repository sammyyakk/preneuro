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
import { Plus, Eye, ClipboardList, Sparkles, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function getRiskBadge(risk: number | undefined) {
  if (risk === undefined) return null;
  if (risk < 0.3)
    return (
      <Badge variant="outline" className="risk-low font-medium">
        Low ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  if (risk < 0.6)
    return (
      <Badge variant="outline" className="risk-moderate font-medium">
        Moderate ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  return (
    <Badge variant="outline" className="risk-high font-medium">
      High ({(risk * 100).toFixed(0)}%)
    </Badge>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return (
        <Badge variant="secondary" className="gap-1.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="secondary" className="gap-1.5 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          Processing
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="secondary" className="gap-1.5 risk-low">
          <CheckCircle2 className="w-3 h-3" />
          Completed
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="gap-1.5">
          <AlertCircle className="w-3 h-3" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
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
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Assessments</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Risk Assessments
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage patient neurodegenerative risk assessments
          </p>
        </div>
        <Link href="/assessments/new">
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            New Assessment
            <Sparkles className="w-3 h-3 opacity-70" />
          </Button>
        </Link>
      </div>

      <Card hover className="animate-fade-in" style={{ animationDelay: '100ms' }}>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-muted-foreground mt-4">Loading assessments...</p>
            </div>
          ) : assessments?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <ClipboardList className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <p className="text-lg font-medium">No assessments yet</p>
              <p className="text-muted-foreground mt-1 max-w-sm">
                Create your first assessment to start analyzing patient risk factors
              </p>
              <Link href="/assessments/new" className="mt-6">
                <Button size="lg" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Assessment
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="rounded-xl border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Patient</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold">Max Risk</TableHead>
                      <TableHead className="font-semibold w-[80px]">Actions</TableHead>
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
                          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards', opacity: 0 }}
                        >
                          <TableCell>
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-sm font-semibold text-primary">
                              #{assessment.id}
                            </span>
                          </TableCell>
                          <TableCell>
                            {patient ? (
                              <Link
                                href={`/patients/${patient.id}`}
                                className="flex items-center gap-3 hover:text-primary transition-colors"
                              >
                                <div className="w-8 h-8 rounded-full stat-gradient-2 flex items-center justify-center text-[10px] font-semibold text-white">
                                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <span className="font-medium">{patient.name}</span>
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">Patient #{assessment.patient_id}</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
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
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                              >
                                <Eye className="h-4 w-4" />
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
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
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
