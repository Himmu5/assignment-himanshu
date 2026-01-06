'use client';

import { TemperatureUnit } from '@/types/weather';
import Button from './ui/Button';

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export default function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <Button
      variant="secondary"
      onClick={onToggle}
      aria-label={`Switch to ${unit === 'C' ? 'Fahrenheit' : 'Celsius'}`}
    >
      °{unit}
    </Button>
  );
}

