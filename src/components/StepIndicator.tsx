import React from 'react';

interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number; // 1-indexed
}

export default function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {Array.from({ length: totalSteps }).map((_, i) => {
        const stepNum = i + 1;
        let cls = 'step-dot';
        if (stepNum < currentStep) cls += ' completed';
        if (stepNum === currentStep) cls += ' active';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}
