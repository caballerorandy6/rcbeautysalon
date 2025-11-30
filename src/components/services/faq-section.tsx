import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQ {
  id: string
  question: string
  answer: string
  order: number
}

interface FAQSectionProps {
  faqs: FAQ[]
}

export function FAQSection({ faqs }: FAQSectionProps) {
  if (faqs.length === 0) {
    return null // Don't show section if no FAQs
  }

  // Sort by order field
  const sortedFAQs = [...faqs].sort((a, b) => a.order - b.order)

  return (
    <section className="border-t border-primary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Frequently Asked{" "}
              <span className="from-primary to-accent bg-linear-to-r bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to know about this service
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {sortedFAQs.map((faq, index) => (
              <AccordionItem
                key={faq.id}
                value={`item-${index}`}
                className="border-primary/20 rounded-lg border px-6"
              >
                <AccordionTrigger className="text-left hover:text-primary hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
