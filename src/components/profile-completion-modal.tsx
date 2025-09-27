"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createClient } from "../../supabase/client";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: any;
}

export default function ProfileCompletionModal({
  isOpen,
  onClose,
  userData,
}: ProfileCompletionModalProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleCompleteProfile = () => {
    onClose();
    router.push("/submit-data");
  };

  // Check if user has sufficient data
  const hasUniversities =
    userData?.universities &&
    userData.universities.length > 0 &&
    userData.universities.some((u: any) => u.name && u.name.trim() !== "");

  const hasIndividualGrades = userData?.grades && userData.grades.length >= 6;
  const hasAverageGrades =
    (userData?.avg_grade_11 && userData.avg_grade_11.trim() !== "") ||
    (userData?.avg_grade_12 && userData.avg_grade_12.trim() !== "");

  const hasGrades = hasIndividualGrades || hasAverageGrades;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Complete Your Profile to View
          </DialogTitle>
          <DialogDescription className="text-center">
            Complete your profile to access advanced filtering options
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  hasUniversities ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span
                className={hasUniversities ? "text-green-700" : "text-gray-600"}
              >
                Add at least 1 Applied/Interested University
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div
                className={`w-3 h-3 rounded-full ${
                  hasGrades ? "bg-green-500" : "bg-gray-300"
                }`}
              />
              <span className={hasGrades ? "text-green-700" : "text-gray-600"}>
                Add grades (6+ individual grades preferred, or at least 1
                average grade)
              </span>
            </div>
          </div>

          <Button onClick={handleCompleteProfile} className="w-full" size="lg">
            Complete Your Profile
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
