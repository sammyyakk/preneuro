"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Calendar, Mail, Phone, User } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = Number(params.id);

  const { data: patient, isLoading: patientLoading } = useQuery({
    queryKey: ["patient", patientId],
    queryFn: () => patientsApi.get(patientId),
    enabled: !!patientId,
  });

  const { data: assessments } = useQuery({
    queryKey: ["assessments", "patient", patientId],
    queryFn: () => assessmentsApi.list(1, 20, patientId),
    enabled: !!patientId,
  });

  if (patientLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (!patient) {
    return <div className="py-8 text-center text-muted-foreground">Patient not found</div>;
  }

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.date_of_birth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/patients">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-muted-foreground">Patient ID: #{patient.id}</p>
        </div>
        <Link href={`/assessments/new?patient=${patient.id}`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Assessment
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age / Gender</p>
                <p className="font-medium">{age} years, <span className="capitalize">{patient.gender}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{format(new Date(patient.date_of_birth), "MMMM d, yyyy")}</p>
              </div>
            </div>
            {patient.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{patient.email}</p>
                </div>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{patient.phone}</p>
                </div>
              </div>
            )}
            {patient.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notes</p>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments?.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No assessments yet
              </p>
            ) : (
              <div className="space-y-3">
                {assessments?.items.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/assessments/${assessment.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">Assessment #{assessment.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(assessment.created_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <Badge
                      variant={
                        assessment.status === "completed"
                          ? "default"
                          : assessment.status === "pending"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {assessment.status}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
