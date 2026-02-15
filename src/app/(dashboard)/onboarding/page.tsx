"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  UserIcon,
  Tick02Icon,
  CheckmarkSquare02Icon,
} from "@hugeicons/core-free-icons";
import { Logo } from "@/components/logo";

type Step = "welcome" | "profile" | "preferences" | "complete";

const STEPS: Step[] = ["welcome", "profile", "preferences", "complete"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const onboardingStatus = useQuery(api.users.getOnboardingStatus);
  const updateStep = useMutation(api.users.updateOnboardingStep);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [currentStep, setCurrentStep] = useState<Step>(
    (onboardingStatus?.currentStep as Step) ?? "welcome",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  async function handleNext() {
    setIsSubmitting(true);
    try {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < STEPS.length) {
        const nextStep = STEPS[nextIndex];
        await updateStep({ step: nextStep });
        setCurrentStep(nextStep);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSkip() {
    await completeOnboarding();
    router.push("/dashboard");
  }

  function renderStep() {
    switch (currentStep) {
      case "welcome":
        return (
          <Card className="border-none shadow-none">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Logo className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Welcome to Shipr</CardTitle>
                <CardDescription className="text-base">
                  Let&apos;s get you set up in just a few steps
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="h-4 w-4"
                    />
                  </div>
                  <span>Set up your profile</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="h-4 w-4"
                    />
                  </div>
                  <span>Customize your preferences</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <HugeiconsIcon
                      icon={Tick02Icon}
                      strokeWidth={2}
                      className="h-4 w-4"
                    />
                  </div>
                  <span>Start building</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case "profile":
        return (
          <Card className="border-none shadow-none">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon
                  icon={UserIcon}
                  strokeWidth={2}
                  className="h-8 w-8"
                />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Your Profile</CardTitle>
                <CardDescription className="text-base">
                  Everything looks good, {user?.firstName}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Name</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.fullName}
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="h-5 w-5 text-green-600"
                  />
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                  <HugeiconsIcon
                    icon={Tick02Icon}
                    strokeWidth={2}
                    className="h-5 w-5 text-green-600"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                You can update these later in your settings
              </p>
            </CardContent>
          </Card>
        );

      case "preferences":
        return (
          <Card className="border-none shadow-none">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <HugeiconsIcon
                  icon={CheckmarkSquare02Icon}
                  strokeWidth={2}
                  className="h-8 w-8"
                />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">You&apos;re All Set</CardTitle>
                <CardDescription className="text-base">
                  Ready to start using Shipr
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <h4 className="text-sm font-medium">What&apos;s next?</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-current" />
                    Explore your dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-current" />
                    Check out the docs
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-current" />
                    Invite team members
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        );

      case "complete":
        return null;
    }
  }

  if (!user || !onboardingStatus) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStepIndex + 1} of {STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {renderStep()}

        <div className="flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={handleSkip} disabled={isSubmitting}>
            Skip for now
          </Button>
          {currentStep === "preferences" ? (
            <Button onClick={handleComplete} disabled={isSubmitting}>
              {isSubmitting ? "Finishing..." : "Get Started"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Continue"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
