"use client";

import { useState, useCallback } from "react";
import CardUploadForm from "@/components/CardUploadForm";
import ReviewForm from "@/components/ReviewForm";
import StatusMessage from "@/components/StatusMessage";
import PreviousSubmissions from "@/components/submissions/PreviousSubmissions";
import Button from "@/components/ui/Button";
import type { AppStep, GeneratedCardFields, GenerateCardResponse } from "@/types/card";

type Tab = "upload" | "submissions";

export default function Home() {
  const [tab, setTab] = useState<Tab>("upload");
  const [step, setStep] = useState<AppStep>("upload");
  const [reviewData, setReviewData] = useState<{
    rowId: string;
    imagePreviewUrl: string;
    milestoneMoments: string;
    remark: string;
    generatedFields: GeneratedCardFields;
  } | null>(null);

  const handleGenerated = useCallback(
    (data: GenerateCardResponse, imagePreviewUrl: string, milestoneMoments: string, remark: string) => {
      setReviewData({
        rowId: data.rowId,
        imagePreviewUrl,
        milestoneMoments,
        remark,
        generatedFields: data.fields,
      });
      setStep("reviewing");
    },
    []
  );

  const handleBack = useCallback(() => {
    setStep("upload");
  }, []);

  const handleSubmitSuccess = useCallback(() => {
    setStep("success");
  }, []);

  const handleUploadAnother = useCallback(() => {
    if (reviewData?.imagePreviewUrl) {
      URL.revokeObjectURL(reviewData.imagePreviewUrl);
    }
    setReviewData(null);
    setStep("upload");
  }, [reviewData]);

  return (
    <div className="space-y-6">
      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl bg-beige p-1 border border-border">
        <button
          onClick={() => setTab("upload")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "upload"
              ? "bg-cream text-dark shadow-sm"
              : "text-muted hover:text-dark"
          }`}
        >
          Upload Card
        </button>
        <button
          onClick={() => setTab("submissions")}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            tab === "submissions"
              ? "bg-cream text-dark shadow-sm"
              : "text-muted hover:text-dark"
          }`}
        >
          Previous Submissions
        </button>
      </div>

      {/* Upload tab */}
      {tab === "upload" && (
        <div className="rounded-2xl bg-cream border border-border p-6 sm:p-8 shadow-sm">
          {step === "upload" && <CardUploadForm onGenerated={handleGenerated} />}

          {step === "reviewing" && reviewData && (
            <ReviewForm
              rowId={reviewData.rowId}
              imagePreviewUrl={reviewData.imagePreviewUrl}
              milestoneMoments={reviewData.milestoneMoments}
              remark={reviewData.remark}
              generatedFields={reviewData.generatedFields}
              onSubmitSuccess={handleSubmitSuccess}
              onBack={handleBack}
            />
          )}

          {step === "success" && (
            <div className="text-center space-y-4 py-8">
              <StatusMessage type="success" message="Card information saved successfully!" />
              <p className="text-sm text-muted">Your reviewed contact details have been submitted to JamAI Base.</p>
              <Button onClick={handleUploadAnother}>Upload Another Card</Button>
            </div>
          )}
        </div>
      )}

      {/* Previous Submissions tab */}
      {tab === "submissions" && (
        <div className="rounded-2xl bg-cream border border-border p-6 sm:p-8 shadow-sm">
          <PreviousSubmissions />
        </div>
      )}
    </div>
  );
}
