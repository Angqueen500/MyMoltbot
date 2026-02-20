'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertTriangle, Hand, Search, Info } from 'lucide-react';

export default function EducationPage() {
  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Safety & Education</h1>
        <p className="text-muted-foreground mt-2">How to safely help stray animals in your community.</p>
      </div>

      <div className="grid gap-6">
        {/* Approaching */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Hand className="h-6 w-6 text-blue-500" />
              Approaching a Stray
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              <strong>1. Observe first:</strong> Look for signs of aggression (growling, baring teeth, rigid body) or fear (cowering, tail tucked).
            </p>
            <p>
              <strong>2. Use calming signals:</strong> Avoid direct eye contact. Turn your body sideways. Don&apos;t tower over the animal; crouch down if safe.
            </p>
            <p>
              <strong>3. Let them come to you:</strong> Extend a hand slowly (palm down) or toss treats gently to lure them. Never chase.
            </p>
          </CardContent>
        </Card>

        {/* Injured */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Handling Injured Animals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p className="font-medium text-red-600 dark:text-red-400">
              Injured animals may bite out of pain or fear.
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li>Do not attempt to move them if they have spinal injuries unless necessary.</li>
              <li>Use a thick blanket or towel to cover their head/eyes to calm them and protect yourself.</li>
              <li>Call a vet or animal control immediately for guidance.</li>
            </ul>
          </CardContent>
        </Card>

        {/* Identification */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Search className="h-6 w-6 text-green-500" />
              Checking for ID
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            <p>
              If the animal is friendly and you can safely touch them:
            </p>
            <ul className="list-disc pl-4 space-y-2">
              <li><strong>Check for tags:</strong> Look for a phone number on the collar.</li>
              <li><strong>Scan for a microchip:</strong> Take the animal to any vet clinic or shelter; they will scan for free.</li>
              <li><strong>Ask neighbors:</strong> Often pets haven&apos;t gone far from home.</li>
            </ul>
          </CardContent>
        </Card>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5" />
            Common Questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>When should I call Animal Control?</AccordionTrigger>
              <AccordionContent>
                Call Animal Control if the animal is aggressive, sick/injured and you cannot transport it, or if it poses a traffic hazard. They are equipped to handle dangerous situations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I keep a stray I found?</AccordionTrigger>
              <AccordionContent>
                Legally, you must usually report the stray to the local shelter and hold it for a specific &quot;stray hold&quot; period (often 3-7 days) to give owners a chance to claim it. After that period, you may be able to adopt it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What if I can&apos;t catch it?</AccordionTrigger>
              <AccordionContent>
                Do not chase. Leave food and water in a safe spot. Take a photo and post it on this app and local social media groups. You can also contact local rescue groups for trap-neuter-return (TNR) assistance for feral cats.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
