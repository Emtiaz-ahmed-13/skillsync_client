import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export function FAQSection() {
  const faqs = [
    {
      question: "How does the milestone payment system work?",
      answer:
        "Our milestone payment system allows clients to deposit funds in escrow which are released to freelancers only when milestones are completed and approved. This ensures protection for both parties throughout the project lifecycle.",
    },
    {
      question: "What security measures do you have in place?",
      answer:
        "We use industry-standard encryption, secure authentication with JWT tokens, and PCI-compliant payment processing. All data is stored in secure cloud infrastructure with regular backups and monitoring.",
    },
    {
      question: "How do I find the right freelancer for my project?",
      answer:
        "Our platform includes advanced search and filtering capabilities, detailed freelancer profiles with portfolios and reviews, and project matching algorithms that suggest the best candidates based on your requirements.",
    },
    {
      question: "What happens if there's a dispute between parties?",
      answer:
        "We have a dedicated dispute resolution process where our team reviews the project scope, deliverables, and communications to make a fair determination. Funds remain in escrow until the dispute is resolved.",
    },
    {
      question: "Can I collaborate with team members on projects?",
      answer:
        "Yes, you can invite team members to projects with different permission levels. Our collaboration tools include real-time messaging, file sharing, task assignment, and progress tracking for seamless teamwork.",
    },
    {
      question: "How do I get started with a free trial?",
      answer:
        "Simply sign up for an account and you'll automatically get access to all Professional plan features for 14 days. No credit card is required to start your trial, and you can upgrade or downgrade at any time.",
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge className="mx-auto bg-muted text-foreground border-border">
            FAQ
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about the platform
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
