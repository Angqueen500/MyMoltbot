'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, Camera, MapPin, Check, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import Image from 'next/image';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ReportPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [conditionTags, setConditionTags] = useState<string[]>([]);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const toggleTag = (tag: string) => {
    setConditionTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('animalType', animalType);
    formData.append('tags', JSON.stringify(conditionTags));
    if (location) {
      formData.append('lat', location.lat.toString());
      formData.append('lng', location.lng.toString());
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      await res.json();
      addToast({ type: 'success', title: 'Report Submitted', message: 'Thank you for your help!' });
      router.push('/');
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Submission Failed', message: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && !file) {
      addToast({ type: 'error', title: 'Photo Required', message: 'Please take a photo first.' });
      return;
    }
    if (step === 2 && !animalType) {
       addToast({ type: 'error', title: 'Type Required', message: 'Please select an animal type.' });
       return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-md mx-auto pb-32 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Report Stray</h1>
        <div className="text-sm text-muted-foreground">Step {step} of 3</div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-out"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Step 1: Photo */}
      {step === 1 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
          <Card className="border-dashed border-2 overflow-hidden bg-muted/30">
            <div
              className="relative aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              {preview ? (
                <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              ) : (
                <div className="text-center p-6">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                    <Camera className="h-8 w-8" />
                  </div>
                  <h3 className="font-semibold text-lg">Take a Photo</h3>
                  <p className="text-sm text-muted-foreground mt-1">Tap to open camera or gallery</p>
                </div>
              )}
            </div>
          </Card>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex gap-3 items-start text-sm text-blue-800 dark:text-blue-200">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <p>Make sure the animal is clearly visible. Do not put yourself in danger to take a photo.</p>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
          <div className="space-y-3">
            <label className="text-sm font-medium">Animal Type</label>
            <div className="grid grid-cols-3 gap-3">
              {['Dog', 'Cat', 'Other'].map(type => (
                <button
                  key={type}
                  onClick={() => setAnimalType(type)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
                    animalType === type ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-lg font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Condition (Select all that apply)</label>
            <div className="flex flex-wrap gap-2">
              {['Injured', 'Sick', 'Friendly', 'Aggressive', 'Puppy/Kitten', 'With Mother'].map(tag => (
                <Badge
                  key={tag}
                  variant={conditionTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1.5 text-sm"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Additional Details</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation..."
              className="h-32"
            />
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
           <div className="space-y-2">
             <label className="text-sm font-medium flex items-center gap-2">
               <MapPin className="h-4 w-4" />
               Pin Location
             </label>
             <div className="h-80 w-full rounded-xl overflow-hidden border border-border relative z-0 shadow-sm">
                <Map
                  onLocationSelect={handleMapClick}
                  selectedLocation={location}
                />
                 {!location && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 px-4 py-2 rounded-full shadow-lg z-[400] text-sm font-medium text-foreground pointer-events-none border border-border">
                      Tap map to pin location
                    </div>
                 )}
             </div>
             {location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 p-2 rounded-lg">
                  <Check className="h-4 w-4 text-green-500" />
                  Location pinned: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </div>
             )}
           </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border z-10 flex gap-3 max-w-md mx-auto md:relative md:border-0 md:bg-transparent md:p-0">
        {step > 1 && (
          <Button variant="outline" onClick={prevStep} className="flex-1" disabled={loading}>
            Back
          </Button>
        )}
        {step < 3 ? (
          <Button onClick={nextStep} className="flex-1">
            Next
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1" disabled={loading || !location}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
