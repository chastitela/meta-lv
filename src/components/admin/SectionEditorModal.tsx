// SectionEditorModal.tsx — с Tiptap full rich-text редактором внутри

'use client';

import { useState, useCallback } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Save, UploadCloud } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/lib/supabaseClient';
import TiptapEditor from './TiptapEditor';

export default function SectionEditorModal({
  section,
  onSave,
  onClose,
}: {
  section: any;
  onSave: (updated: any) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({ ...section });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file || !section.id) {
      setError('Файл или ID секции не определены');
      return;
    }

    setUploading(true);
    setError(null);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `sections/${section.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('section-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      setError('Ошибка загрузки файла');
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('section-images').getPublicUrl(filePath);
    update('image_url', data.publicUrl);
    setUploading(false);
  }, [section.id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  function renderFields() {
    switch (section.type) {
      case 'text':
        return (
          <TiptapEditor
            content={form.content || ''}
            onChange={(html) => update('content', html)}
          />
        );
      case 'hero':
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <input
          value={form.headline || ''}
          onChange={(e) => update('headline', e.target.value)}
          placeholder="Заголовок"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.subheadline || ''}
          onChange={(e) => update('subheadline', e.target.value)}
          placeholder="Подзаголовок"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.button_text || ''}
          onChange={(e) => update('button_text', e.target.value)}
          placeholder="Текст кнопки"
          className="w-full p-2 border rounded"
        />
        <input
          value={form.button_link || ''}
          onChange={(e) => update('button_link', e.target.value)}
          placeholder="Ссылка кнопки"
          className="w-full p-2 border rounded"
        />

        <div className="space-y-2">
          <label className="block text-sm text-gray-600">Фоновое изображение:</label>
          <div
            {...getRootProps()}
            className="border border-dashed border-border p-4 text-center rounded cursor-pointer bg-white/5 hover:bg-white/10 transition"
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-400">Перетащи файл или кликни, чтобы выбрать</p>
          </div>
          {form.bg_image && (
            <div className="text-xs text-gray-500 break-all">{form.bg_image}</div>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-sm text-gray-600">Степень блюра: {form.bg_blur || 4}</label>
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            value={form.bg_blur || 4}
            onChange={(e) => update('bg_blur', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl shadow-xl border border-border">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: form.bg_image
              ? `url(${form.bg_image})`
              : 'linear-gradient(to bottom right, #0f172a, #1e293b)',
            filter: `blur(${form.bg_blur || 4}px)`,
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div className="relative z-10 px-6 py-12 text-center space-y-4 backdrop-blur-md bg-white/10 rounded-2xl">
          <h2 className="text-3xl font-bold text-white drop-shadow-sm">
            {form.headline || 'Заголовок по умолчанию'}
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            {form.subheadline || 'Описание или подзаголовок, который объясняет, зачем ты здесь.'}
          </p>
          {form.button_text && (
            <a
              href={form.button_link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-accent text-white font-semibold px-6 py-2 rounded-full hover:opacity-90 transition shadow-lg backdrop-blur-sm"
            >
              {form.button_text}
            </a>
          )}
        </div>
      </div>
    </div>
  );
      case 'image':
        return (
          <div className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed p-6 rounded cursor-pointer text-center transition ${
                isDragActive ? 'bg-blue-100' : 'bg-white'
              }`}
            >
              <input {...getInputProps()} />
              {uploading ? (
                <p>Загрузка...</p>
              ) : (
                <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
                  <UploadCloud className="w-5 h-5" />
                  <span>Перетащи файл сюда или кликни</span>
                </div>
              )}
            </div>
            {form.image_url && (
              <>
                <img
                  src={form.image_url}
                  alt="Превью"
                  className="max-w-full max-h-48 rounded border"
                />
                <div className="text-xs text-gray-500 break-all mt-1">{form.image_url}</div>
              </>
            )}
            <input
              value={form.caption || ''}
              onChange={(e) => update('caption', e.target.value)}
              placeholder="Подпись"
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        );
      default:
        return <p className="text-sm text-gray-500">Редактор для этого типа ещё не реализован.</p>;
    }
  }

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 space-y-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
          <Dialog.Title className="text-lg font-bold mb-2">
            Редактирование секции «{section.slug}»
          </Dialog.Title>

          {renderFields()}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => onSave(form)}
              className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded hover:opacity-90"
            >
              <Save className="w-4 h-4" /> Сохранить
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}