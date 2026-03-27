"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { patientsApi, assessmentsApi } from "@/lib/api";
import { Symptoms } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Brain, Upload, ClipboardList } from "lucide-react";
import Link from "next/link";

const symptomsList = [
  { key: "memory_issues", label: "Memory Issues", description: "Difficulty remembering recent events or information" },
  { key: "tremors", label: "Tremors", description: "Involuntary shaking or trembling" },
  { key: "balance_problems", label: "Balance Problems", description: "Difficulty maintaining balance or coordination" },
  { key: "speech_difficulties", label: "Speech Difficulties", description: "Slurred speech or difficulty finding words" },
  { key: "muscle_weakness", label: "Muscle Weakness", description: "Progressive weakness in limbs" },
  { key: "cognitive_decline", label: "Cognitive Decline", description: "Difficulty with thinking, reasoning, or problem-solving" },
  { key: "mood_changes", label: "Mood Changes", description: "Depression, anxiety, or personality changes" },
  { key: "sleep_disturbances", label: "Sleep Disturbances", description: "Insomnia, excessive sleeping, or sleep disorders" },
] as const;

function NewAssessmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedPatient = searchParams.get("patient");

  const [selectedPatient, setSelectedPatient] = useState<string>(preselectedPatient || "");
  const [symptoms, setSymptoms] = useState<Partial<Symptoms>>({});
  const [notes, setNotes] = useState("");

  const handlePatientChange = (value: string | null) => {
    setSelectedPatient(value || "");
  };

  const { data: patients } = useQuery({
    queryKey: ["patients", "all"],
    queryFn: () => patientsApi.list(1, 100),
  });

  const createMutation = useMutation({
    mutationFn: assessmentsApi.create,
    onSuccess: (assessment) => {
      router.push(`/assessments/${assessment.id}`);
    },
  });

  const handleSymptomChange = (key: string, checked: boolean) => {
    setSymptoms((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    createMutation.mutate({
      patient_id: Number(selectedPatient),
      symptoms: {
        memory_issues: symptoms.memory_issues || false,
        tremors: symptoms.tremors || false,
        balance_problems: symptoms.balance_problems || false,
        speech_difficulties: symptoms.speech_difficulties || false,
        muscle_weakness: symptoms.muscle_weakness || false,
        cognitive_decline: symptoms.cognitive_decline || false,
        mood_changes: symptoms.mood_changes || false,
        sleep_disturbances: symptoms.sleep_disturbances || false,
        additional_notes: notes || undefined,
      },
      notes: notes || undefined,
    });
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center gap-4 animate-fade-in">
        <Link href="/assessments">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">New Assessment</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Create Assessment</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Create a new patient assessment for AI analysis.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="animate-fade-in" style={{ animationDelay: '80ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedPatient} onValueChange={handlePatientChange}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Select a patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.items.map((patient) => (
                  <SelectItem key={patient.id} value={String(patient.id)}>
                    {patient.name} (#{patient.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {patients?.items.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                No patients found.{" "}
                <Link href="/patients" className="text-foreground underline underline-offset-4 hover:text-foreground/80">
                  Add a patient first.
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '160ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Symptoms Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              {symptomsList.map((symptom) => (
                <div
                  key={symptom.key}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <Checkbox
                    id={symptom.key}
                    checked={symptoms[symptom.key as keyof Symptoms] as boolean || false}
                    onCheckedChange={(checked) =>
                      handleSymptomChange(symptom.key, checked as boolean)
                    }
                  />
                  <div className="space-y-0.5">
                    <Label htmlFor={symptom.key} className="text-sm font-medium cursor-pointer">
                      {symptom.label}
                    </Label>
                    <p className="text-[0.6875rem] text-muted-foreground leading-relaxed">
                      {symptom.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '240ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Upload Files (Optional)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border border-dashed border-border rounded-lg p-8 text-center hover:bg-muted/20 transition-colors">
              <Upload className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                File upload coming soon. In production, upload MRI, EEG, or clinical data here.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '320ms', animationFillMode: 'forwards', opacity: 0 }}>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add any additional clinical observations or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="text-sm"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'forwards', opacity: 0 }}>
          <Link href="/assessments">
            <Button variant="outline" size="sm">Cancel</Button>
          </Link>
          <Button
            type="submit"
            size="sm"
            disabled={!selectedPatient || createMutation.isPending}
            className="gap-2"
          >
            <Brain className="h-3.5 w-3.5" />
            {createMutation.isPending ? "Creating..." : "Create Assessment"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <Suspense fallback={<div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>}>
      <NewAssessmentContent />
    </Suspense>
  );
}
