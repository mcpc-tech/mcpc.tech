import { useEffect, useState } from "react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  const [mounted, setMounted] = useState(false);
  const [renderedContent, setRenderedContent] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Simple markdown to HTML conversion
    const convertMarkdown = (md: string) => {
      return md
        // Headers
        .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold text-foreground mb-6">$1</h1>')
        .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-foreground mb-4 mt-8">$1</h2>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-foreground mb-3 mt-6">$1</h3>')
        .replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold text-foreground mb-2 mt-4">$1</h4>')
        
        // Code blocks
        .replace(/```([\s\S]*?)```/g, '<pre class="bg-content2 rounded-lg p-4 mb-4 overflow-x-auto text-sm font-mono"><code>$1</code></pre>')
        
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="bg-content2 text-foreground px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
        
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
        
        // Italic
        .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
        
        // Links
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>')
        
        // Unordered lists
        .replace(/^- (.*$)/gm, '<li class="text-foreground-600">$1</li>')
        .replace(/(<li.*?>.*<\/li>)/gs, '<ul class="list-disc list-inside space-y-2 text-foreground-600 mb-4">$1</ul>')
        
        // Paragraphs
        .replace(/^(?!<[h1-6]|<pre|<ul|<code|<li)(.*$)/gm, '<p class="text-foreground-600 mb-4 leading-relaxed">$1</p>')
        
        // Clean up empty paragraphs and line breaks
        .replace(/<p class="[^"]*">\s*<\/p>/g, '')
        .replace(/\n/g, '');
    };

    setRenderedContent(convertMarkdown(content));
  }, [content]);

  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
};