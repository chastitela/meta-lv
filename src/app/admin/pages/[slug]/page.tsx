// Файл: /src/app/admin/pages/[slug]/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/supabaseClient';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, PlusCircle, Save, Pencil } from 'lucide-react';
import SectionEditorModal from '@/components/admin/SectionEditorModal';

interface Section {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
  page_id: string;
  type?: string;
  visible?: boolean;
  bg?: string;
  content?: string;
  headline?: string;
  subheadline?: string;
  button_text?: string;
  button_link?: string;
  image_url?: string;
  caption?: string;
}

function SortableRow({ section, children }: { section: Section; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-t border-border">
      <td className="p-3 cursor-move" {...attributes} {...listeners}>
        <GripVertical className="text-black/40" />
      </td>
      {children}
    </tr>
  );
}

export default function Page() {
  const params = useParams();
  const slug = params?.slug as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [editedSections, setEditedSections] = useState<Record<string, Partial<Section>>>({});
  const [pageId, setPageId] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetchPageAndSections();
  }, [slug]);

  async function fetchPageAndSections() {
    const { data: pageData } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single();

    if (!pageData) return;
    setPageId(pageData.id);

    const { data: sectionsData } = await supabase
      .from('sections')
      .select('*')
      .eq('page_id', pageData.id)
      .order('sort_order');

    setSections(sectionsData || []);
  }

  function handleChange(id: string, field: keyof Section, value: string | boolean) {
    setEditedSections(prev => ({
      ...prev,
      [id]: { ...prev[id], [field]: value }
    }));
  }

  async function handleSave() {
    for (const [id, changes] of Object.entries(editedSections)) {
      await supabase.from('sections').update(changes).eq('id', id);
    }
    setEditedSections({});
    fetchPageAndSections();
  }

  async function handleAddSection() {
    if (!pageId) return;
    const maxOrder = sections.reduce((acc, s) => Math.max(acc, s.sort_order), 0);
    const newSlug = `new-section-${Date.now()}`;

    await supabase.from('sections').insert({
      slug: newSlug,
      title: '',
      description: '',
      sort_order: maxOrder + 1,
      page_id: pageId,
      type: 'text',
      visible: true,
      bg: ''
    });
    fetchPageAndSections();
  }

  async function handleDeleteSection(id: string) {
    await supabase.from('sections').delete().eq('id', id);
    fetchPageAndSections();
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex(s => s.id === active.id);
    const newIndex = sections.findIndex(s => s.id === over.id);

    const newSections = arrayMove(sections, oldIndex, newIndex);
    setSections(newSections);

    for (let i = 0; i < newSections.length; i++) {
      await supabase.from('sections').update({ sort_order: i + 1 }).eq('id', newSections[i].id);
    }
  }

  async function handleEditorSave(updated: Section) {
    await supabase.from('sections').update(updated).eq('id', updated.id);
    setEditingSection(null);
    fetchPageAndSections();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-accent mb-6">Секции страницы «{slug}»</h1>

      <div className="border border-border rounded-lg overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <table className="w-full text-sm">
              <thead className="bg-border text-black/60 text-left">
                <tr>
                  <th className="p-3">⇅</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Заголовок</th>
                  <th className="p-3">Описание</th>
                  <th className="p-3">Тип</th>
                  <th className="p-3">Visible</th>
                  <th className="p-3">BG</th>
                  <th className="p-3">Действия</th>
                </tr>
              </thead>
              <tbody>
                {sections.map(section => (
                  <SortableRow key={section.id} section={section}>
                    <td className="p-3 font-mono text-black/80">{section.slug}</td>
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={section.title}
                        onChange={e => handleChange(section.id, 'title', e.target.value)}
                        className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={section.description || ''}
                        onChange={e => handleChange(section.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                      />
                    </td>
                    <td className="p-3">
                      <select
                        defaultValue={section.type || 'text'}
                        onChange={e => handleChange(section.id, 'type', e.target.value)}
                        className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                      >
                        <option value="text">text</option>
                        <option value="hero">hero</option>
                        <option value="image">image</option>
                      </select>
                    </td>
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        defaultChecked={section.visible ?? true}
                        onChange={e => handleChange(section.id, 'visible', e.target.checked)}
                        className="w-5 h-5 accent-accent"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        defaultValue={section.bg || ''}
                        onChange={e => handleChange(section.id, 'bg', e.target.value)}
                        placeholder="#ffffff"
                        className="w-full bg-transparent border-b border-border focus:outline-none focus:border-accent"
                      />
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button onClick={() => setEditingSection(section)}>
                        <Pencil className="w-4 h-4 text-blue-500 hover:text-blue-700" />
                      </button>
                      <button onClick={() => handleDeleteSection(section.id)}>
                        <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                      </button>
                    </td>
                  </SortableRow>
                ))}
              </tbody>
            </table>
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleAddSection}
          className="flex items-center gap-2 bg-white border border-border text-black px-6 py-2 rounded hover:bg-border transition"
        >
          <PlusCircle className="w-5 h-5" /> Добавить секцию
        </button>
        {Object.keys(editedSections).length > 0 && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition"
          >
            <Save className="w-5 h-5" /> Сохранить
          </button>
        )}
      </div>

      {editingSection && (
        <SectionEditorModal
          section={editingSection}
          onSave={handleEditorSave}
          onClose={() => setEditingSection(null)}
        />
      )}
    </div>
  );
}
