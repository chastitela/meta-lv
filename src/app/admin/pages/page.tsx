'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { Pencil, Trash2, ArrowRight } from 'lucide-react';

interface Page {
  id: string;
  slug: string;
  title: string;
  description: string;
  sort_order: number;
}

export default function PagesList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [newPage, setNewPage] = useState({ slug: '', title: '', description: '' });
  const [editingPage, setEditingPage] = useState<Page | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error) setPages(data || []);
  }

  async function handleAddPage() {
    const { slug, title, description } = newPage;
    if (!slug || !title) return;

    await supabase.from('pages').insert([{ slug, title, description }]);
    setNewPage({ slug: '', title: '', description: '' });
    fetchPages();
  }

  async function handleUpdatePage() {
    if (!editingPage) return;

    const { id, title, description } = editingPage;
    await supabase.from('pages').update({ title, description }).eq('id', id);
    setEditingPage(null);
    fetchPages();
  }

  async function handleDeletePage(id: string) {
    const confirm = window.confirm('Удалить страницу и все её секции?');
    if (!confirm) return;

    await supabase.from('pages').delete().eq('id', id);
    fetchPages();
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-accent mb-6">Контур сайта</h1>

      {editingPage && (
        <div className="border border-border p-4 mb-8 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Редактировать страницу</h2>
          <div className="grid grid-cols-3 gap-4">
            <input
              placeholder="Заголовок"
              value={editingPage.title}
              onChange={(e) =>
                setEditingPage({ ...editingPage, title: e.target.value })
              }
              className="border border-border px-3 py-2 rounded"
            />
            <input
              placeholder="Описание"
              value={editingPage.description}
              onChange={(e) =>
                setEditingPage({ ...editingPage, description: e.target.value })
              }
              className="border border-border px-3 py-2 rounded"
            />
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleUpdatePage}
              className="bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition"
            >
              Сохранить
            </button>
            <button
              onClick={() => setEditingPage(null)}
              className="text-black/50 hover:text-black"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="border border-border p-4 mb-8 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Добавить страницу</h2>
        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="slug (например: main)"
            value={newPage.slug}
            onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
            className="border border-border px-3 py-2 rounded"
          />
          <input
            placeholder="Заголовок"
            value={newPage.title}
            onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
            className="border border-border px-3 py-2 rounded"
          />
          <input
            placeholder="Описание"
            value={newPage.description}
            onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
            className="border border-border px-3 py-2 rounded"
          />
        </div>
        <button
          onClick={handleAddPage}
          className="mt-4 bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition"
        >
          Добавить
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-border text-black/60 text-left">
            <tr>
              <th className="p-3">Slug</th>
              <th className="p-3">Заголовок</th>
              <th className="p-3">Описание</th>
              <th className="p-3">Действия</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t border-border">
                <td className="p-3 font-mono text-black/80">{page.slug}</td>
                <td className="p-3">{page.title}</td>
                <td className="p-3">{page.description}</td>
                <td className="p-3 space-x-3 flex items-center">
                  <Link
                    href={`/admin/pages/${page.slug}`}
                    className="hover:text-accent"
                  >
                    <ArrowRight size={16} />
                  </Link>
                  <button onClick={() => setEditingPage(page)}>
                    <Pencil size={16} className="text-black/60 hover:text-accent" />
                  </button>
                  <button onClick={() => handleDeletePage(page.id)}>
                    <Trash2 size={16} className="text-red-600 hover:text-black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
