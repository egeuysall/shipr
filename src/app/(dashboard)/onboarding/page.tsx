"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { toast } from "sonner";
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
type ActiveStep = Exclude<Step, "complete">;
type BuilderGoal = "mvp" | "production" | "internal-tools";

const ONBOARDING_STEPS: ActiveStep[] = ["welcome", "profile", "preferences"];
const BUILDER_GOALS: {
  value: BuilderGoal;
  title: string;
  description: string;
}[] = [
  {
    value: "mvp",
    title: "Launch MVP",
    description: "Ship your first customer-ready version quickly.",
  },
  {
    value: "production",
    title: "Scale Production",
    description: "Harden flows for growth, billing, and reliability.",
  },
  {
    value: "internal-tools",
    title: "Internal SaaS Tools",
    description: "Build secure back-office tools for your team.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useUser();
  const onboardingStatus = useQuery(api.users.getOnboardingStatus);
  const updateStep = useMutation(api.users.updateOnboardingStep);
  const completeOnboarding = useMutation(api.users.completeOnboarding);

  const [currentStep, setCurrentStep] = useState<Step>("welcome");
  const [selectedGoal, setSelectedGoal] = useState<BuilderGoal | null>(null);
  const [confirmedChecklist, setConfirmedChecklist] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!onboardingStatus) return;
    setCurrentStep((onboardingStatus.currentStep as Step) ?? "welcome");
  }, [onboardingStatus]);

  const currentStepIndex = ONBOARDING_STEPS.indexOf(
    (currentStep === "complete" ? "preferences" : currentStep) as ActiveStep,
  );
  const progress = ((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100;

  async function handleNext() {
    if (currentStep === "complete") return;

    setIsSubmitting(true);
    try {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < ONBOARDING_STEPS.length) {
        const nextStep = ONBOARDING_STEPS[nextIndex];
        await updateStep({ step: nextStep });
        setCurrentStep(nextStep);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update onboarding step";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBack() {
    if (currentStep === "welcome" || currentStep === "complete") return;

    setIsSubmitting(true);
    try {
      const previousIndex = currentStepIndex - 1;
      if (previousIndex >= 0) {
        const previousStep = ONBOARDING_STEPS[previousIndex];
        await updateStep({ step: previousStep });
        setCurrentStep(previousStep);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not move to previous onboarding step";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      await completeOnboarding();
      toast.success("Onboarding completed");
      router.push("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not complete onboarding";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
              <p className="text-xs text-center text-muted-foreground">
                Onboarding is required once for all new accounts.
              </p>
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
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Primary goal</h4>
                <div className="grid gap-2">
                  {BUILDER_GOALS.map((goal) => {
                    const isSelected = selectedGoal === goal.value;
                    return (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setSelectedGoal(goal.value)}
                        className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <p className="text-sm font-medium">{goal.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {goal.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <h4 className="text-sm font-medium">Before you continue</h4>
                <label className="flex items-start gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={confirmedChecklist}
                    onChange={(event) =>
                      setConfirmedChecklist(event.currentTarget.checked)
                    }
                  />
                  <span>
                    I understand this starter is intended as a foundation and I
                    should configure auth, billing, and AI limits for
                    production.
                  </span>
                </label>
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
              Step {currentStepIndex + 1} of {ONBOARDING_STEPS.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {renderStep()}

        <div className="flex items-center justify-between gap-4">
          {currentStep === "welcome" ? (
            <div />
          ) : (
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={isSubmitting}
            >
              Back
            </Button>
          )}
          {currentStep === "preferences" ? (
            <Button
              onClick={handleComplete}
              disabled={isSubmitting || !selectedGoal || !confirmedChecklist}
            >
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
