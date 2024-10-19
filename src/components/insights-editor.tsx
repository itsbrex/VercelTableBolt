import { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getApiKey } from '@/lib/api-key-service';
import { AIIcon } from './ai-icon';

type InsightsEditorProps = {
  contact: {
    id: string;
    name: string;
    email: string;
    role: string;
    insights: string;
  };
  onSave: (updatedInsights: string) => void;
};

export function InsightsEditor({ contact, onSave }: InsightsEditorProps) {
  const [content, setContent] = useState(contact.insights || '');
  const { toast } = useToast();

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const handleSave = () => {
    onSave(content);
  };

  const handleAIAction = useCallback(async (action: string) => {
    const apiKey = await getApiKey();
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your OpenAI API key in the sidebar to use AI features.",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically make an API call to OpenAI
    // For this example, we'll just simulate the AI response
    let aiResponse = '';
    switch (action) {
      case 'continue':
        aiResponse = 'This is a continuation of the text...';
        break;
      case 'rephrase':
        aiResponse = 'This is a rephrased version of the selected text...';
        break;
      case 'summarize':
        aiResponse = 'This is a summary of the content...';
        break;
      case 'generate':
        aiResponse = `Here are some insights for ${contact.name}:\n\n- ${contact.name} is a ${contact.role}\n- Their email is ${contact.email}\n- They have shown great potential in...`;
        break;
    }

    if (editor) {
      if (action === 'generate') {
        editor.commands.setContent(aiResponse);
      } else {
        editor.commands.insertContent(aiResponse);
      }
    }

    toast({
      title: "AI Action Completed",
      description: `The ${action} action has been performed successfully.`,
    });
  }, [editor, contact, toast]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()}>
          Bold
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()}>
          Italic
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Bullet List
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Ordered List
        </Button>
        <Button onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
          Code Block
        </Button>
        <Button onClick={() => handleAIAction('continue')}>
          <AIIcon className="mr-2 h-4 w-4" />
          Continue Writing
        </Button>
        <Button onClick={() => handleAIAction('rephrase')}>
          <AIIcon className="mr-2 h-4 w-4" />
          Rephrase
        </Button>
        <Button onClick={() => handleAIAction('summarize')}>
          <AIIcon className="mr-2 h-4 w-4" />
          Summarize
        </Button>
        <Button onClick={() => handleAIAction('generate')}>
          <AIIcon className="mr-2 h-4 w-4" />
          Generate Insights
        </Button>
      </div>
      <EditorContent editor={editor} className="prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl max-w-none border p-4 rounded-md" />
      <Button onClick={handleSave}>Save Insights</Button>
    </div>
  );
}