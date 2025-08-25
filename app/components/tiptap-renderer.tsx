import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import { useEffect } from 'react';

interface TiptapRendererProps {
  content: string;
  className?: string;
}

export const TiptapRenderer = ({ content, className = "" }: TiptapRendererProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
    ],
    content: '',
    editable: false,
    editorProps: {
      attributes: {
        class: `prose prose-gray dark:prose-invert max-w-none ${className}`,
      },
    },
  });

  useEffect(() => {
    if (editor && content) {
      // Parse markdown-style content for basic display
      // This is a simple implementation - for full markdown support,
      // you'd need a markdown parser like markdown-it
      const htmlContent = content
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/gim, '<em>$1</em>')
        .replace(/`(.*?)`/gim, '<code>$1</code>')
        .replace(/\n/gim, '<br/>');
      
      editor.commands.setContent(htmlContent);
    }
  }, [editor, content]);

  if (!editor) {
    return (
      <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
        <div>Loading content...</div>
      </div>
    );
  }

  return <EditorContent editor={editor} />;
};