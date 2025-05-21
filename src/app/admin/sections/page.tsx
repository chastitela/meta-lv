'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

interface Section {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  type?: string;
  visible?: boolean;
  bg?: string;
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editedSections, setEditedSections] = useState<Record<string, Partial<Section>>>({});

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    const { data, error } = await supabase
      .from('sections')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Ошибка при загрузке секций:', error.message);
    } else {
      setSections(data || []);
    }
  }

  function handleChange(id: string, field: keyof Section, value: string | boolean) {
    setEditedSections(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  }

  async function handleSave() {
    const updates = Object.entries(editedSections);
    for (const [id, changes] of updates) {
      await supabase.from('sections').update(changes).eq('id', id);
    }
    setEditedSections({});
    fetchSections();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-accent mb-6">Контур сайта</h1>
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-border text-black/60 text-left">
            <tr>
              <th className="p-3">Slug</th>
              <th className="p-3">Заголовок</th>
              <th className="p-3">Описание</th>
              <th className="p-3">Тип</th>
              <th className="p-3">Видимость</th>
              <th className="p-3">Фон</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id} className="border-t border-border">
                <td className="p-3 font-mono text-black/80">{section.slug}</td>
                <td className="p-3">
                  <input
                    type="text"
                    defaultValue={section.title}
                    onChange={(e) => handleChange(section.id, 'title', e.target.value)}
                    className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    defaultValue={section.description || ''}
                    onChange={(e) => handleChange(section.id, 'description', e.target.value)}
                    className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                  />
                </td>
                <td className="p-3">
                  <select
                    defaultValue={section.type || 'text'}
                    onChange={(e) => handleChange(section.id, 'type', e.target.value)}
                    className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                  >
                    <option value="text">text</option>
                    <option value="hero">hero</option>
                    <option value="image">image</option>
                    <option value="cta">cta</option>
                  </select>
                </td>
                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    defaultChecked={section.visible ?? true}
                    onChange={(e) => handleChange(section.id, 'visible', e.target.checked)}
                    className="w-5 h-5 accent-accent"
                  />
                </td>
                <td className="p-3">
                  <input
                    type="text"
                    defaultValue={section.bg || ''}
                    onChange={(e) => handleChange(section.id, 'bg', e.target.value)}
                    placeholder="#ffffff"
                    className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Object.keys(editedSections).length > 0 && (
        <button
          onClick={handleSave}
          className="mt-6 bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition"
        >
          Сохранить
        </button>
      )}
    </div>
  );
}
