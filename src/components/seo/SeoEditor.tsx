// components/seo/SeoEditor.tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface SeoEditorProps {
  pageId: string;
  initialData: {
    seo_title: string;
    seo_description: string;
    seo_keywords: string;
    seo_image: string;
    seo_noindex: boolean;
  };
  onSaved?: () => void;
}

export default function SeoEditor({ pageId, initialData, onSaved }: SeoEditorProps) {
  const [open, setOpen] = useState(false);
  const [seoTitle, setSeoTitle] = useState(initialData.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData.seo_description || '');
  const [seoKeywords, setSeoKeywords] = useState(initialData.seo_keywords || '');
  const [seoImage, setSeoImage] = useState(initialData.seo_image || '');
  const [seoNoindex, setSeoNoindex] = useState(initialData.seo_noindex || false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('pages')
      .update({
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_keywords: seoKeywords,
        seo_image: seoImage,
        seo_noindex: seoNoindex,
      })
      .eq('id', pageId);
    setSaving(false);
    setOpen(false);
    toast.success('SEO обновлено');
    onSaved?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Редактировать SEO</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <div className="space-y-2">
          <Label>SEO Title</Label>
          <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>SEO Description</Label>
          <Input value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>SEO Keywords</Label>
          <Input value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>OG Image URL</Label>
          <Input value={seoImage} onChange={(e) => setSeoImage(e.target.value)} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Не индексировать (noindex)</Label>
          <Switch checked={seoNoindex} onCheckedChange={setSeoNoindex} />
        </div>

        {/* Превью SEO */}
        <div className="mt-6 bg-white/5 border border-border rounded-xl p-4 text-white space-y-1">
          <div className="text-base font-bold text-accent">{seoTitle || 'Предпросмотр заголовка'}</div>
          <div className="text-sm text-white/80">{seoDescription || 'Описание страницы в поиске или ссылке'}</div>
          {seoImage && (
            <div className="mt-2">
              <img src={seoImage} alt="OG Image Preview" className="rounded-lg border border-white/10 max-h-48 object-cover" />
            </div>
          )}
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? 'Сохраняем...' : 'Сохранить SEO'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
