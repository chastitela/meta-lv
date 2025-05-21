// TiptapEditor.tsx — с авторасширением под контент

'use client';

import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Undo,
  Redo,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

export default function TiptapEditor({
  content,
  onChange,
}: {
  content: string;
  onChange: (html: string) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
      if (contentRef.current) {
        contentRef.current.style.height = 'auto';
        contentRef.current.style.height = contentRef.current.scrollHeight + 'px';
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content]);

  if (!editor) return null;

  return (
    <div className="border rounded bg-white p-2 space-y-2">
      <div className="flex items-center gap-2 flex-wrap text-sm">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'text-accent' : 'text-gray-500 hover:text-black'}><Bold className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'text-accent' : 'text-gray-500 hover:text-black'}><Italic className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'text-accent' : 'text-gray-500 hover:text-black'}><UnderlineIcon className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'text-accent' : 'text-gray-500 hover:text-black'}><Heading className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'text-accent' : 'text-gray-500 hover:text-black'}><List className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'text-accent' : 'text-gray-500 hover:text-black'}><ListOrdered className="w-4 h-4" /></button>

        <button onClick={() => {
          const url = prompt('Вставь ссылку:');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }} className={editor.isActive('link') ? 'text-accent' : 'text-gray-500 hover:text-black'}><LinkIcon className="w-4 h-4" /></button>

        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'text-accent' : 'text-gray-500 hover:text-black'}><AlignLeft className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'text-accent' : 'text-gray-500 hover:text-black'}><AlignCenter className="w-4 h-4" /></button>
        <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'text-accent' : 'text-gray-500 hover:text-black'}><AlignRight className="w-4 h-4" /></button>

        <div className="ml-auto flex gap-2">
          <button onClick={() => editor.chain().focus().undo().run()} className="text-gray-400 hover:text-black"><Undo className="w-4 h-4" /></button>
          <button onClick={() => editor.chain().focus().redo().run()} className="text-gray-400 hover:text-black"><Redo className="w-4 h-4" /></button>
        </div>
      </div>

      <EditorContent
        ref={contentRef}
        editor={editor}
        className="outline-none focus:outline-none resize-none overflow-hidden w-full"
        style={{ minHeight: '120px' }}
      />
    </div>
  );
}