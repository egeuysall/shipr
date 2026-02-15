"use client";

import posthog from "posthog-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

const faqItems = [
  {
    id: "item-1",
    question: "What is included out of the box?",
    answer:
      "Shipr includes Next.js, Convex, Clerk, full auth and database connections, a production dashboard, documentation-ready structure, secure file uploads with shareable links, and prewired analytics.",
  },
  {
    id: "item-2",
    question: "Does Shipr include analytics and product insights?",
    answer:
      "Yes. PostHog, Vercel Analytics, and Vercel Speed Insights are integrated so you can track behavior and performance from day one.",
  },
  {
    id: "item-3",
    question: "Can I build AI features quickly?",
    answer:
      "Yes. Shipr includes Vercel AI SDK support so you can implement chat, copilots, and AI workflows without wiring everything from scratch.",
  },
  {
    id: "item-4",
    question: "How are security and file uploads handled?",
    answer:
      "Shipr follows strong security defaults and includes file uploads with shareable links, so you can ship user-facing file flows safely and quickly.",
  },
  {
    id: "item-5",
    question: "Can I customize and scale after launch?",
    answer:
      "Absolutely. You get a clean, extensible codebase that is ready to customize for your product and scale as usage grows.",
  },
];

export default function FAQs() {
  return (
    <section className="bg-background @container py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="@xl:flex-row @xl:items-start @xl:gap-12 flex flex-col gap-8">
          <div className="@xl:sticky @xl:top-24 @xl:w-64 shrink-0">
            <h2 className="text-3xl font-bold">FAQs</h2>
            <p className="text-muted-foreground mt-3 text-sm">
              Everything you need to know before launch
            </p>
            <p className="text-muted-foreground @xl:block mt-6 hidden text-sm">
              Need more help?{" "}
              <Link
                href="mailto:hi@egeuysal.com"
                className="text-primary font-medium hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
          <div className="flex-1">
            <Accordion>
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-dashed"
                >
                  <AccordionTrigger
                    className="cursor-pointer py-4 text-sm font-medium hover:no-underline"
                    onClick={() =>
                      posthog.capture("faq_expanded", {
                        faq_question: item.question,
                        faq_id: item.id,
                      })
                    }
                  >
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground pb-2 text-sm">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-muted-foreground @xl:hidden mt-6 text-sm">
              Need more help?{" "}
              <Link
                href="mailto:hi@egeuysal.com"
                className="text-primary font-medium hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
