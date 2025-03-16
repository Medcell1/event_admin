import StepIndicator from "@/components/events/step-indicator";
import { fonts } from "@/components/fonts";
import type React from "react";

export default function CreateEventLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="px-10 py-6 bg-white w-full rounded-lg flex flex-row justify-between items-center mb-5">
        <h1 className={`${fonts.poppins} text-2xl font-semibold`}>
          Create Event
        </h1>
      </div>
      <div className="min-h-screen bg-background">
        <StepIndicator />
        <div className="container max-w-5xl mx-auto py-8 px-4">
          {children}
        </div>
      </div>
    </>
  );
}