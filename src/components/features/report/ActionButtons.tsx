'use client';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Heart, Gift, Search, Truck } from 'lucide-react';
import { useState } from 'react';

export default function ActionButtons({ reportId }: { reportId: number }) {
  const [modalType, setModalType] = useState<'foster' | 'transport' | 'donate' | 'supplies' | 'search' | null>(null);
  const [form, setForm] = useState({ name: '', contact: '', message: '', availability: '' });
  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/help-offers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: modalType }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast({ type: 'success', title: 'Offer Sent', message: 'Thank you for offering to help!' });
      setModalType(null);
      setForm({ name: '', contact: '', message: '', availability: '' });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Please try again.' });
    }
  };

  const actions = [
    { type: 'foster', label: 'Foster', icon: Heart, color: 'text-red-500' },
    { type: 'transport', label: 'Transport', icon: Truck, color: 'text-blue-500' },
    { type: 'donate', label: 'Donate', icon: Gift, color: 'text-green-500' },
    { type: 'search', label: 'Search', icon: Search, color: 'text-amber-500' },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {actions.map(({ type, label, icon: Icon, color }) => (
          <Button
            key={type}
            variant="outline"
            className="flex flex-col h-auto py-3 gap-1 px-0"
            onClick={() => setModalType(type as any)}
          >
            <Icon className={`h-5 w-5 ${color}`} />
            <span className="text-[10px] font-medium">{label}</span>
          </Button>
        ))}
      </div>

      <Modal isOpen={!!modalType} onClose={() => setModalType(null)} title={`Offer to ${modalType}`}>
        <div className="space-y-4">
          <Input
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
          />
          <Input
            placeholder="Phone or Email"
            value={form.contact}
            onChange={(e) => setForm({...form, contact: e.target.value})}
          />
          <Input
            placeholder="Availability (e.g., weekends, evenings)"
            value={form.availability}
            onChange={(e) => setForm({...form, availability: e.target.value})}
          />
          <Textarea
            placeholder="Message (optional)..."
            value={form.message}
            onChange={(e) => setForm({...form, message: e.target.value})}
          />
          <Button className="w-full" onClick={handleSubmit} disabled={!form.name || !form.contact}>
            Send Offer
          </Button>
        </div>
      </Modal>
    </>
  );
}
