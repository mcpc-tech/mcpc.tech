import { Language, useShikiHighlighter } from "react-shiki";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { IoCopyOutline } from "react-icons/io5";

export function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: Language;
}) {
  const [, copyToClipboard] = useCopyToClipboard();
  const highlightedCode = useShikiHighlighter(code, language, "github-light");
  const noLinebreakCode = JSON.stringify(JSON.parse(code));

  return (
    <div className="code-block relative bg-gray-50 rounded-lg p-4 overflow-x-auto max-h-[88dvh] border border-gray-200">
      {highlightedCode}
      <button
        className="copy-button absolute top-2 right-2"
        onClick={() => copyToClipboard(noLinebreakCode)}
      >
        <IoCopyOutline size={20} />
      </button>
    </div>
  );
}
