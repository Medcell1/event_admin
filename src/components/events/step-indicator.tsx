"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

const steps = [
  {
    title: "Paramètres de l'événement",
    href: ROUTES.DASHBOARD.EVENTS.CREATE.PARAMETERS, 
    step: 1,
  },
  {
    title: "Tickets",
    href: ROUTES.DASHBOARD.EVENTS.CREATE.TICKETS, 
    step: 2,
  },
  {
    title: "Aperçu et publier",
    href: ROUTES.DASHBOARD.EVENTS.CREATE.PREVIEW, 
    step: 3,
  },
];

const StepIndicator = () => {
  const pathname = usePathname();
  const currentStepIndex = steps.findIndex((step) => step.href === pathname);

  return (
    <div className="w-full px-4 py-6">
      <div className="max-w-4xl mx-auto relative">
        {/* Line that connects all steps */}
        <div className="absolute top-6 left-12 right-12 h-1 bg-gray-300 z-0">
          <div
            className={cn(
              "h-full bg-primary transition-all duration-300",
              currentStepIndex > 1 ? "w-full" : currentStepIndex === 1 ? "w-1/2" : "w-0"
            )}
          ></div>
        </div>
        
        <div className="flex justify-between items-start">
          {steps.map((step, index) => (
            <div 
              key={step.step} 
              className="flex flex-col items-center w-32 relative z-10"
            >
              <div className="h-12 flex items-center justify-center">
                <Link href={step.href}>
                  <div
                    className={cn(
                      "w-12 h-12 flex items-center justify-center rounded-full text-base font-semibold cursor-pointer transition-all duration-300",
                      index < currentStepIndex
                        ? "bg-primary text-white"
                        : index === currentStepIndex
                        ? "bg-primary text-white ring-4 ring-blue-200"
                        : "bg-gray-200 text-gray-600"
                    )}
                  >
                    {step.step}
                  </div>
                </Link>
              </div>

              <div className="mt-4 text-sm font-medium text-center w-full">
                {step.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;