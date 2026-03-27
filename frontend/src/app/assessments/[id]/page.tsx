"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { assessmentsApi, patientsApi } from "@/lib/api";
import { Symptoms } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function RiskGauge({ risk, label }: { risk: number; label: string }) {
  const percentage = Math.round(risk * 100);
  const color = risk < 0.3 ? "#22c55e" : risk < 0.6 ? "#eab308" : "#ef4444";

  const data = [
    { name: "Risk", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="text-center">
      <div className="h-32 w-32 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={50}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
            >
              <Cell fill={color} />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-2xl font-bold mt-2" style={{ color }}>
        {percentage}%
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function RiskComparisonChart({
  alzheimer,
  parkinson,
  als,
}: {
  alzheimer: number;
  parkinson: number;
  als: number;
}) {
  const data = [
    { name: "Alzheimer's", risk: alzheimer, fill: "#f59e0b" },
    { name: "Parkinson's", risk: parkinson, fill: "#3b82f6" },
    { name: "ALS", risk: als, fill: "#ef4444" },
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" domain={[0, 1]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
          <YAxis type="category" dataKey="name" width={80} />
          <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`} />
          <Bar dataKey="risk" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const assessmentId = Number(params.id);

  const { data: assessment, isLoading } = useQuery({
    queryKey: ["assessment", assessmentId],
    queryFn: () => assessmentsApi.get(assessmentId),
    enabled: !!assessmentId,
  });

  const { data: patient } = useQuery({
    queryKey: ["patient", assessment?.patient_id],
    queryFn: () => patientsApi.get(assessment!.patient_id),
    enabled: !!assessment?.patient_id,
  });

  const predictMutation = useMutation({
    mutationFn: () => assessmentsApi.predict(assessmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", assessmentId] });
    },
  });

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (!assessment) {
    return <div className="py-8 text-center text-muted-foreground">Assessment not found</div>;
  }

  const symptoms = (assessment.symptoms || {}) as Partial<Symptoms>;
  const activeSymptoms = Object.entries(symptoms)
    .filter(([key, value]) => key !== "additional_notes" && value === true)
    .map(([key]) => key.replace(/_/g, " "));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/assessments">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Assessment #{assessment.id}
          </h1>
          <p className="text-muted-foreground">
            {patient ? (
              <Link href={`/patients/${patient.id}`} className="hover:underline">
                {patient.name}
              </Link>
            ) : (
              `Patient #${assessment.patient_id}`
            )}{" "}
            - {format(new Date(assessment.created_at), "MMMM d, yyyy HH:mm")}
          </p>
        </div>
        <Badge
          className="text-sm"
          variant={
            assessment.status === "completed"
              ? "default"
              : assessment.status === "failed"
              ? "destructive"
              : "secondary"
          }
        >
          {assessment.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
          {assessment.status === "completed" && <CheckCircle className="mr-1 h-3 w-3" />}
          {assessment.status}
        </Badge>
      </div>

      {assessment.status === "pending" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Assessment Pending</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              This assessment has not been analyzed yet. Run AI prediction to get risk scores.
            </span>
            <Button
              onClick={() => predictMutation.mutate()}
              disabled={predictMutation.isPending}
            >
              <Brain className="mr-2 h-4 w-4" />
              {predictMutation.isPending ? "Analyzing..." : "Run AI Prediction"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Symptoms Reported</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSymptoms.length === 0 ? (
              <p className="text-muted-foreground">No symptoms reported</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeSymptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline" className="capitalize">
                    {symptom}
                  </Badge>
                ))}
              </div>
            )}
            {symptoms.additional_notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Additional Notes</p>
                  <p className="text-sm">{symptoms.additional_notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {assessment.status === "completed" && (
          <Card>
            <CardHeader>
              <CardTitle>Risk Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskComparisonChart
                alzheimer={assessment.alzheimer_risk || 0}
                parkinson={assessment.parkinson_risk || 0}
                als={assessment.als_risk || 0}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {assessment.status === "completed" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Disease Risk Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-3">
                <RiskGauge
                  risk={assessment.alzheimer_risk || 0}
                  label="Alzheimer's Disease"
                />
                <RiskGauge
                  risk={assessment.parkinson_risk || 0}
                  label="Parkinson's Disease"
                />
                <RiskGauge risk={assessment.als_risk || 0} label="ALS" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Level Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const maxRisk = Math.max(
                  assessment.alzheimer_risk || 0,
                  assessment.parkinson_risk || 0,
                  assessment.als_risk || 0
                );
                const riskLevel = maxRisk < 0.3 ? "low" : maxRisk < 0.6 ? "moderate" : "high";

                const recommendations =
                  riskLevel === "low"
                    ? [
                        "Continue routine health monitoring",
                        "Maintain healthy lifestyle habits",
                        "Schedule follow-up in 12 months",
                      ]
                    : riskLevel === "moderate"
                    ? [
                        "Recommend comprehensive neurological evaluation",
                        "Consider additional diagnostic imaging",
                        "Schedule follow-up in 3-6 months",
                        "Discuss family history and genetic factors",
                      ]
                    : [
                        "Urgent referral to neurology specialist",
                        "Comprehensive diagnostic workup recommended",
                        "Consider advanced imaging (PET, detailed MRI)",
                        "Schedule immediate follow-up within 2-4 weeks",
                      ];

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Overall Risk Level:</span>
                      <Badge
                        variant="outline"
                        className={
                          riskLevel === "low"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : riskLevel === "moderate"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }
                      >
                        {riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="font-medium mb-2">Recommendations:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
