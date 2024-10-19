import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function TipTapEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your markdown here...</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      },
    },
  });

  return <EditorContent editor={editor} />;
}