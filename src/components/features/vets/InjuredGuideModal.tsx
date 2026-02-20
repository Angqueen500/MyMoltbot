import { Modal } from '@/components/ui/modal';
import { AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InjuredGuideModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What to do if injured">
      <div className="space-y-4">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg flex gap-3 text-red-800 dark:text-red-200 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>If the animal is in critical condition or aggressive, do not approach. Call professionals immediately.</p>
        </div>

        <ul className="space-y-3 text-sm list-disc pl-4 text-muted-foreground">
          <li><strong>Approach slowly:</strong> Speak in a calm, low voice. Avoid direct eye contact.</li>
          <li><strong>Protect yourself:</strong> Use a towel or blanket to cover the animal&apos;s head if you need to move them.</li>
          <li><strong>Transport safely:</strong> Use a carrier or a sturdy box with air holes.</li>
          <li><strong>Call ahead:</strong> Let the vet know you are coming with an emergency case.</li>
        </ul>

        <div className="pt-4">
           <Button className="w-full bg-red-600 hover:bg-red-700 text-white" asChild>
             <a href="tel:911">
               <Phone className="mr-2 h-4 w-4" /> Call Animal Control
             </a>
           </Button>
        </div>
      </div>
    </Modal>
  );
}
