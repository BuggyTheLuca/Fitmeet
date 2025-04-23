import React from "react";

type ProgressBarProps = {
    currentValue: number;
    maxValue: number;
};

export function ProgressBar({ currentValue, maxValue }: ProgressBarProps) {
  const progress = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <div className="flex flex-col">
        <div className="flex justify-between">
            <p>Pontos para o próximo nível</p>
            <h1>{currentValue} / {maxValue} pts</h1>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 relative">
            <div
                className="bg-green-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    </div>
  );
}