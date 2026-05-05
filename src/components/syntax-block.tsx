import { ReactNode } from "react";
import { SubSection, CodeBlock } from "@/components/tutorial-section";

interface SyntaxBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function SyntaxBlock({ title, description, children }: SyntaxBlockProps) {
  return (
    <SubSection title={title}>
      {description && (
        <p className="text-zinc-700 dark:text-zinc-300 mb-3">{description}</p>
      )}
      <CodeBlock>{children}</CodeBlock>
    </SubSection>
  );
}
