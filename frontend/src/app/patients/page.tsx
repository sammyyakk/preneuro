"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientsApi } from "@/lib/api";
import { Patient, PatientCreate, Gender } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Search, Trash2, Eye, Users, UserPlus } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

function CreatePatientDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: PatientCreate) => patientsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setOpen(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createMutation.mutate({
      name: formData.get("name") as string,
      date_of_birth: formData.get("date_of_birth") as string,
      gender: formData.get("gender") as Gender,
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      notes: (formData.get("notes") as string) || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <UserPlus className="h-3.5 w-3.5" />
            Add Patient
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 text-background" />
            </div>
            Add New Patient
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="grid gap-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-medium">Full Name *</Label>
              <Input id="name" name="name" placeholder="John Doe" required className="h-10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_of_birth" className="text-xs font-medium">Date of Birth *</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" required className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-xs font-medium">Gender *</Label>
                <Select name="gender" required>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                <Input id="email" name="email" type="email" placeholder="john@example.com" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-medium">Phone</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs font-medium">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} placeholder="Any additional information..." className="resize-none" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending} className="min-w-[100px]">
              {createMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create Patient"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PatientRow({ patient, index }: { patient: Patient; index: number }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => patientsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
    },
  });

  const age = Math.floor(
    (new Date().getTime() - new Date(patient.date_of_birth).getTime()) /
      (365.25 * 24 * 60 * 60 * 1000)
  );

  return (
    <TableRow
      className="group hover:bg-muted/50 transition-colors animate-fade-in"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards', opacity: 0 }}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-foreground flex items-center justify-center text-[0.625rem] font-semibold text-background">
            {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-sm font-medium">{patient.name}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">{age} Years</TableCell>
      <TableCell className="text-sm capitalize text-muted-foreground">{patient.gender}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{patient.email || "—"}</TableCell>
      <TableCell className="text-sm text-muted-foreground">{format(new Date(patient.created_at), "MMM d, yyyy")}</TableCell>
      <TableCell>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/patients/${patient.id}`}>
            <Button variant="ghost" size="icon-sm" className="hover:bg-muted">
              <Eye className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => deleteMutation.mutate(patient.id)}
            disabled={deleteMutation.isPending}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["patients", page, search],
    queryFn: () => patientsApi.list(page, 10, search || undefined),
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="mono">Patients</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Patient Records
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all patient information.
          </p>
        </div>
        <CreatePatientDialog />
      </div>

      <Card hover className="animate-fade-in" style={{ animationDelay: '80ms' }}>
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search patients by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-sm bg-muted/30 border-0 focus:bg-background focus:ring-1 focus:ring-foreground/10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-muted-foreground/20 border-t-foreground rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground mt-4">Loading patients...</p>
            </div>
          ) : data?.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">No Patients Found</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                {search ? "Try a different search term." : "Add your first patient to get started."}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Name</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Age</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Gender</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Email</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider">Created</TableHead>
                      <TableHead className="text-xs font-semibold uppercase tracking-wider w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.items.map((patient, index) => (
                      <PatientRow key={patient.id} patient={patient} index={index} />
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data && data.total > 10 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Showing <span className="font-medium text-foreground">{(page - 1) * 10 + 1}</span> to{" "}
                    <span className="font-medium text-foreground">{Math.min(page * 10, data.total)}</span> of{" "}
                    <span className="font-medium text-foreground">{data.total}</span> patients
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
                      disabled={page * 10 >= data.total}
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
