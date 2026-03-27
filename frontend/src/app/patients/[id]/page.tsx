"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Calendar, Mail, Phone, User, Users } from "lucide-react";
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
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Patient not found.</p>
      </div>
    );
  }

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.date_of_birth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 animate-fade-in">
        <Link href="/patients">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">Patient #{patient.id}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{patient.name}</h1>
        </div>
        <Link href={`/assessments/new?patient=${patient.id}`}>
          <Button size="sm" className="gap-2">
            <Plus className="h-3.5 w-3.5" />
            New Assessment
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in" style={{ animationDelay: '80ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wider font-medium">Age / Gender</p>
                <p className="text-sm font-medium">{age} Years, <span className="capitalize">{patient.gender}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wider font-medium">Date of Birth</p>
                <p className="text-sm font-medium">{format(new Date(patient.date_of_birth), "MMMM d, yyyy")}</p>
              </div>
            </div>
            {patient.email && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wider font-medium">Email</p>
                  <p className="text-sm font-medium">{patient.email}</p>
                </div>
              </div>
            )}
            {patient.phone && (
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wider font-medium">Phone</p>
                  <p className="text-sm font-medium">{patient.phone}</p>
                </div>
              </div>
            )}
            {patient.notes && (
              <>
                <Separator />
                <div>
                  <p className="text-[0.625rem] text-muted-foreground uppercase tracking-wider font-medium mb-1">Notes</p>
                  <p className="text-sm">{patient.notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '160ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Assessment History</CardTitle>
          </CardHeader>
          <CardContent>
            {assessments?.items.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No assessments yet.
              </p>
            ) : (
              <div className="space-y-1.5">
                {assessments?.items.map((assessment) => (
                  <Link
                    key={assessment.id}
                    href={`/assessments/${assessment.id}`}
                    className="group flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-all duration-200"
                  >
                    <div>
                      <p className="text-sm font-medium">Assessment #{assessment.id}</p>
                      <p className="text-[0.6875rem] text-muted-foreground">
                        {format(new Date(assessment.created_at), "MMM d, yyyy HH:mm")}
                      </p>
                    </div>
                    <Badge
                      className="text-[0.625rem] capitalize"
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
