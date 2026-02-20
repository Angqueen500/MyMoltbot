import { AlertTriangle } from 'lucide-react';

export default function SafetyDisclaimer() {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-lg flex gap-3 text-sm">
      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 shrink-0" />
      <div className="space-y-1">
        <p className="font-medium text-amber-900 dark:text-amber-100">Safety Notice</p>
        <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
          Do not put yourself in danger. If the animal is aggressive or injured, contact professionals.
          Meet in public places if coordinating with others.
        </p>
      </div>
    </div>
  );
}
