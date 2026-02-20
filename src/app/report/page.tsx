'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Loader2, Camera, MapPin, Check, AlertTriangle, ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { z } from 'zod';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

const reportSchema = z.object({
  description: z.string().min(10, "Please provide more detail"),
  animalType: z.string().min(1, "Type is required"),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().refine((val) => val !== null, "Location is required"),
});

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
  const [privacy, setPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load Draft
  useEffect(() => {
    const saved = localStorage.getItem('report_draft');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            setDescription(data.description || '');
            setAnimalType(data.animalType || '');
            setConditionTags(data.conditionTags || []);
            setPrivacy(data.privacy || false);
            // File cannot be restored easily, so skip
        } catch (e) {
            console.error('Failed to load draft', e);
        }
    }
  }, []);

  // Save Draft
  useEffect(() => {
    const data = { description, animalType, conditionTags, privacy };
    localStorage.setItem('report_draft', JSON.stringify(data));
  }, [description, animalType, conditionTags, privacy]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
  };

  const toggleTag = (tag: string) => {
    setConditionTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng });
  };

  const validateStep = () => {
    if (step === 1) return !!file;
    if (step === 2) return !!animalType;
    if (step === 3) return !!location;
    return true;
  };

  const handleSubmit = async () => {
    if (!file || !location) return;

    const validation = reportSchema.safeParse({ description, animalType, location });
    if (!validation.success) {
       addToast({ type: 'error', title: 'Validation Error', message: validation.error.errors[0].message });
       return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('animalType', animalType);
    formData.append('tags', JSON.stringify(conditionTags));
    formData.append('lat', location.lat.toString());
    formData.append('lng', location.lng.toString());
    formData.append('privacy', privacy.toString());

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      await res.json();
      addToast({ type: 'success', title: 'Report Submitted', message: 'Thank you for your help!' });
      localStorage.removeItem('report_draft'); // Clear draft
      router.push('/');
    } catch (err) {
      console.error(err);
      addToast({ type: 'error', title: 'Submission Failed', message: 'Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
        const msg = step === 1 ? 'Photo Required' : step === 2 ? 'Type Required' : 'Location Required';
        addToast({ type: 'error', title: msg });
        return;
    }
    setStep(s => s + 1);
  };

  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="max-w-md mx-auto pb-32 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Report a Stray</h1>
        <p className="text-muted-foreground text-sm">Help us locate and rescue animals in need.</p>
      </div>

      {/* Steps Indicator */}
      <div className="flex justify-between items-center px-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              step >= i ? "bg-primary text-primary-foreground shadow-md scale-110" : "bg-muted text-muted-foreground"
            )}>
              {i}
            </div>
            {i < 3 && <div className={clsx("w-12 h-1 mx-2 rounded-full", step > i ? "bg-primary" : "bg-muted")} />}
          </div>
        ))}
      </div>

      {/* Step 1: Photo */}
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
          <Card className="border-dashed border-2 overflow-hidden bg-muted/20 hover:bg-muted/30 transition-colors border-primary/20">
            <div
              className="relative aspect-[4/3] flex flex-col items-center justify-center cursor-pointer"
              onClick={() => !preview && document.getElementById('file-upload')?.click()}
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
                <>
                  <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 rounded-full h-8 w-8 shadow-sm"
                    onClick={handleRemovePhoto}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                    <Camera className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Take a Photo</h3>
                    <p className="text-xs text-muted-foreground mt-1">Tap to open camera or gallery</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 items-start border border-blue-100 dark:border-blue-900/20">
            <AlertTriangle className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Safety First</p>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                Do not approach if the animal looks aggressive. Zoom in instead of getting too close.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="space-y-3">
            <Label>What is it?</Label>
            <div className="grid grid-cols-3 gap-3">
              {['Dog', 'Cat', 'Other'].map(type => (
                <button
                  key={type}
                  onClick={() => setAnimalType(type)}
                  className={clsx(
                    "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all hover:scale-[1.02]",
                    animalType === type ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-muted bg-card hover:border-primary/30"
                  )}
                >
                  <span className="text-lg font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Condition</Label>
            <div className="flex flex-wrap gap-2">
              {['Injured', 'Sick', 'Friendly', 'Scared', 'Aggressive', 'Puppy/Kitten', 'With Mother', 'Collar'].map(tag => (
                <Badge
                  key={tag}
                  variant={conditionTags.includes(tag) ? "default" : "outline"}
                  className={clsx(
                    "cursor-pointer px-3 py-1.5 text-sm transition-all hover:opacity-80 active:scale-95 select-none",
                    conditionTags.includes(tag) ? "shadow-sm" : "bg-background"
                  )}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Notes</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the situation, location details, or distinctive markings..."
              className="h-32 resize-none bg-card"
            />
          </div>
        </div>
      )}

      {/* Step 3: Location */}
      {step === 3 && (
        <div className="space-y-4 animate-in slide-in-from-right-8 fade-in duration-300">
           <div className="space-y-2">
             <Label className="flex items-center gap-2">
               <MapPin className="h-4 w-4" />
               Pin Exact Location
             </Label>
             <div className="h-[400px] w-full rounded-xl overflow-hidden border border-border relative z-0 shadow-sm bg-muted">
                <Map
                  onLocationSelect={handleMapClick}
                  selectedLocation={location}
                />
                 {!location && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur px-4 py-2 rounded-full shadow-lg z-[400] text-sm font-medium text-foreground pointer-events-none border border-border animate-bounce">
                      Tap map to pin location
                    </div>
                 )}
             </div>
             {location && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 p-3 rounded-lg dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30">
                  <Check className="h-4 w-4" />
                  Location pinned successfully
                </div>
             )}
           </div>

           <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-background rounded-full border border-border">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                 </div>
                 <div>
                    <p className="text-sm font-medium">Protect Location</p>
                    <p className="text-xs text-muted-foreground">Only show approximate area publicly</p>
                 </div>
              </div>
              <Switch checked={privacy} onCheckedChange={setPrivacy} />
           </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        {step > 1 && (
          <Button variant="outline" size="lg" onClick={prevStep} className="flex-1" disabled={loading}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        )}
        {step < 3 ? (
          <Button size="lg" onClick={nextStep} className={clsx("flex-1", step === 1 && "w-full")}>
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button size="lg" onClick={handleSubmit} className="flex-1" disabled={loading || !location}>
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
