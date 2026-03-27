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
import { Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function getRiskBadge(risk: number | undefined) {
  if (risk === undefined) return null;
  if (risk < 0.3)
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Low ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  if (risk < 0.6)
    return (
      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
        Moderate ({(risk * 100).toFixed(0)}%)
      </Badge>
    );
  return (
    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
      High ({(risk * 100).toFixed(0)}%)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="text-muted-foreground">
            View and manage patient assessments
          </p>
        </div>
        <Link href="/assessments/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader />
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : assessments?.items.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No assessments yet. Create your first assessment to get started.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Max Risk</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments?.items.map((assessment) => {
                    const patient = patientMap.get(assessment.patient_id);
                    const maxRisk = Math.max(
                      assessment.alzheimer_risk || 0,
                      assessment.parkinson_risk || 0,
                      assessment.als_risk || 0
                    );
                    return (
                      <TableRow key={assessment.id}>
                        <TableCell className="font-medium">#{assessment.id}</TableCell>
                        <TableCell>
                          {patient ? (
                            <Link
                              href={`/patients/${patient.id}`}
                              className="hover:underline"
                            >
                              {patient.name}
                            </Link>
                          ) : (
                            `Patient #${assessment.patient_id}`
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(assessment.created_at), "MMM d, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                        <TableCell>
                          {assessment.status === "completed"
                            ? getRiskBadge(maxRisk)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Link href={`/assessments/${assessment.id}`}>
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {assessments && assessments.total > 10 && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1} to {Math.min(page * 10, assessments.total)} of{" "}
                    {assessments.total}
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
