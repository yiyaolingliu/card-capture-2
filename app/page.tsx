"use client";

import { useState, useCallback } from "react";
import CardUploadForm from "@/components/CardUploadForm";
import ReviewForm from "@/components/ReviewForm";
import StatusMessage from "@/components/StatusMessage";
import Button from "@/components/ui/Button";
import type { AppStep, GeneratedCardFields, GenerateCardResponse } from "@/types/card";

export default function Home() {
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
  );
}
