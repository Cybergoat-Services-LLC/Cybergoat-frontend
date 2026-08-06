'use client';

import ReactMarkdown from 'react-markdown';
import MermaidDiagram from './MermaidDiagram';

export default function LessonBody({ body, diagramMermaid }: { body: string; diagramMermaid: string | null }) {
  return (
    <div className="text-sm leading-relaxed text-gray-300">
      <ReactMarkdown
        components={{
          h1: (props) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
          h2: (props) => <h4 className="text-base font-bold text-white mt-4 mb-2" {...props} />,
          h3: (props) => <h5 className="text-sm font-bold text-white mt-3 mb-1.5" {...props} />,
          p: (props) => <p className="mb-3" {...props} />,
          ul: (props) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
          ol: (props) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
          strong: (props) => <strong className="font-bold text-white" {...props} />,
          code: (props) => <code className="px-1 py-0.5 rounded bg-white/10 text-[#0DCAF0] text-xs" {...props} />,
          a: (props) => <a className="text-[#0DCAF0] underline" target="_blank" rel="noopener noreferrer" {...props} />,
        }}
      >
        {body}
      </ReactMarkdown>
      {diagramMermaid && <MermaidDiagram code={diagramMermaid} />}
    </div>
  );
}
