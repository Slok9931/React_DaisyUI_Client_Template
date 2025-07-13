import React from 'react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  current?: boolean;
  disabled?: boolean;
}

interface StepsProps {
  steps: Step[];
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  orientation = 'horizontal',
  className = '',
}) => {
  const stepsClasses = [
    'steps',
    orientation === 'vertical' && 'steps-vertical',
    className
  ].filter(Boolean).join(' ');

  return (
    <ul className={stepsClasses}>
      {steps.map((step) => {
        const stepClasses = [
          'step',
          step.completed && 'step-primary',
          step.current && 'step-primary',
        ].filter(Boolean).join(' ');

        return (
          <li key={step.id} className={stepClasses} data-content={step.completed ? '✓' : ''}>
            <div className="step-content">
              <div className="font-medium">{step.title}</div>
              {step.description && (
                <div className="text-sm opacity-70">{step.description}</div>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};