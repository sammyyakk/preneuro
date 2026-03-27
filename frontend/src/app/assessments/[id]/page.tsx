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
import { ArrowLeft, Brain, AlertTriangle, CheckCircle, Clock, ClipboardList } from "lucide-react";
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
  const color = risk < 0.3 ? "#10b981" : risk < 0.6 ? "#f59e0b" : "#f43f5e";

  const data = [
    { name: "Risk", value: percentage },
    { name: "Remaining", value: 100 - percentage },
  ];

  return (
    <div className="text-center">
      <div className="h-28 w-28 mx-auto">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={32}
              outerRadius={44}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              <Cell fill={color} />
              <Cell fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-2xl font-semibold mt-2 tracking-tight" style={{ color }}>
        {percentage}%
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
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
    { name: "Alzheimer's Disease", risk: alzheimer, fill: "#8b5cf6" },
    { name: "Parkinson's Disease", risk: parkinson, fill: "#3b82f6" },
    { name: "ALS", risk: als, fill: "#f43f5e" },
  ];

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
          <XAxis
            type="number"
            domain={[0, 1]}
            tickFormatter={(v) => `${(v * 100).toFixed(0)}%`}
            tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 14, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
            contentStyle={{
              backgroundColor: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "16px",
              padding: "8px 12px",
            }}
          />
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
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground mt-4">Loading...</p>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-sm text-muted-foreground">Assessment not found.</p>
      </div>
    );
  }

  const symptoms = (assessment.symptoms || {}) as Partial<Symptoms>;
  const activeSymptoms = Object.entries(symptoms)
    .filter(([key, value]) => key !== "additional_notes" && value === true)
    .map(([key]) => key.replace(/_/g, " "));

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 animate-fade-in">
        <Link href="/assessments">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">Assessment #{assessment.id}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Assessment #{assessment.id}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {patient ? (
              <Link href={`/patients/${patient.id}`} className="hover:underline underline-offset-4">
                {patient.name}
              </Link>
            ) : (
              `Patient #${assessment.patient_id}`
            )}{" "}
            — {format(new Date(assessment.created_at), "MMMM d, yyyy HH:mm")}
          </p>
        </div>
        <Badge
          className="text-[0.625rem] capitalize"
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
        <Alert className="animate-fade-in" style={{ animationDelay: '80ms', animationFillMode: 'forwards', opacity: 0 }}>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-sm font-medium">Assessment Pending</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span className="text-sm">
              This assessment has not been analyzed yet. Run AI prediction to get risk scores.
            </span>
            <Button
              size="sm"
              onClick={() => predictMutation.mutate()}
              disabled={predictMutation.isPending}
              className="gap-2 ml-4"
            >
              <Brain className="h-3.5 w-3.5" />
              {predictMutation.isPending ? "Analyzing..." : "Run AI Prediction"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className={`grid gap-6 items-start ${assessment.status === "completed" ? "md:grid-cols-2" : ""}`}>
        <Card className="animate-fade-in" style={{ animationDelay: '120ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Symptoms Reported</CardTitle>
          </CardHeader>
          <CardContent>
            {activeSymptoms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No symptoms reported.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {activeSymptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline" className="capitalize text-xs py-1 px-2.5">
                    {symptom}
                  </Badge>
                ))}
              </div>
            )}
            {symptoms.additional_notes && (
              <>
                <Separator className="my-4" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-medium">Additional Notes</p>
                  <p className="text-sm">{symptoms.additional_notes}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {assessment.status === "completed" && (
          <Card className="animate-fade-in" style={{ animationDelay: '160ms', animationFillMode: 'forwards', opacity: 0 }}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Risk Comparison</CardTitle>
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
          <Card className="animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards', opacity: 0 }}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Disease Risk Scores</CardTitle>
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

          <Card className="animate-fade-in" style={{ animationDelay: '240ms', animationFillMode: 'forwards', opacity: 0 }}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Risk Level Summary</CardTitle>
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
                        "Continue routine health monitoring.",
                        "Maintain healthy lifestyle habits.",
                        "Schedule follow-up in 12 months.",
                      ]
                    : riskLevel === "moderate"
                    ? [
                        "Recommend comprehensive neurological evaluation.",
                        "Consider additional diagnostic imaging.",
                        "Schedule follow-up in 3–6 months.",
                        "Discuss family history and genetic factors.",
                      ]
                    : [
                        "Urgent referral to neurology specialist.",
                        "Comprehensive diagnostic workup recommended.",
                        "Consider advanced imaging (PET, detailed MRI).",
                        "Schedule immediate follow-up within 2–4 weeks.",
                      ];

                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Overall Risk Level</span>
                      <Badge
                        variant="outline"
                        className={`text-[0.625rem] ${
                          riskLevel === "low"
                            ? "risk-low"
                            : riskLevel === "moderate"
                            ? "risk-moderate"
                            : "risk-high"
                        }`}
                      >
                        {riskLevel.toUpperCase()}
                      </Badge>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Recommendations</p>
                      <ul className="space-y-2">
                        {recommendations.map((rec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1 h-1 rounded-full bg-foreground/40 mt-2 flex-shrink-0" />
                            {rec}
                          </li>
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
