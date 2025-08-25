import { useEffect, useState } from "react";

export const useMdxContent = (path: string) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load ${path}`);
        }
        return response.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading MDX content:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [path]);

  return { content, loading, error };
};