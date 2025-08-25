import { useEffect, useState } from "react";

interface StreamdownRendererProps {
  content: string;
  className?: string;
}

export const StreamdownRenderer = ({ content, className = "" }: StreamdownRendererProps) => {
  const [Streamdown, setStreamdown] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import streamdown only on client side
    import("streamdown").then((module) => {
      setStreamdown(() => module.Streamdown);
    }).catch((error) => {
      console.error("Failed to load streamdown:", error);
    });
  }, []);

  if (!isClient) {
    // Server-side fallback - render as simple HTML
    return (
      <div 
        className={`prose prose-gray dark:prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
      />
    );
  }

  if (!Streamdown) {
    return (
      <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
        <div>Loading markdown renderer...</div>
      </div>
    );
  }

  return (
    <div className={`prose prose-gray dark:prose-invert max-w-none ${className}`}>
      <Streamdown parseIncompleteMarkdown={false}>
        {content}
      </Streamdown>
    </div>
  );
};