'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { Heart, HandHeart, Gift } from 'lucide-react';
import { useState } from 'react';

export default function ActionButtons({ reportId }: { reportId: number }) {
  const [modalType, setModalType] = useState<'foster' | 'transport' | 'donate' | null>(null);
  const [form, setForm] = useState({ name: '', contact: '', message: '' });
  const { addToast } = useToast();

  const handleSubmit = async () => {
    try {
      const res = await fetch(`/api/reports/${reportId}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: modalType }),
      });
      if (!res.ok) throw new Error('Failed');
      addToast({ type: 'success', title: 'Offer Sent', message: 'Thank you for offering to help!' });
      setModalType(null);
      setForm({ name: '', contact: '', message: '' });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Please try again.' });
    }
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="flex flex-col h-auto py-3 gap-1" onClick={() => setModalType('foster')}>
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-xs">Foster</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 gap-1" onClick={() => setModalType('transport')}>
          <HandHeart className="h-5 w-5 text-blue-500" />
          <span className="text-xs">Transport</span>
        </Button>
        <Button variant="outline" className="flex flex-col h-auto py-3 gap-1" onClick={() => setModalType('donate')}>
          <Gift className="h-5 w-5 text-green-500" />
          <span className="text-xs">Donate</span>
        </Button>
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
