import { ReactNode } from "react";
import { SQLRunner, type SQLRunnerProps } from "@/components/sql-runner";
import { SubSection } from "@/components/tutorial-section";

interface SqlExerciseProps extends SQLRunnerProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function SqlExercise({ title, description, children, ...runnerProps }: SqlExerciseProps) {
  return (
    <SubSection title={title}>
      {description && (
        <p className="text-zinc-700 dark:text-zinc-300 mb-3">{description}</p>
      )}
      <SQLRunner {...runnerProps} />
      {children}
    </SubSection>
  );
}
