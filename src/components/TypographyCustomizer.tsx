import React, { useState, useEffect } from 'react';
import { useTypographyStore } from '@/store';
import { Typography, Button, Tabs } from '@/components';

interface TypographyCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TypographyCustomizer: React.FC<TypographyCustomizerProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    customization,
    fontFamilies,
    updateCustomization,
  } = useTypographyStore();

  const [tempCustomization, setTempCustomization] = useState(customization);
  const [originalCustomization, setOriginalCustomization] = useState(customization);

  // Initialize temp settings when component opens
  useEffect(() => {
    if (isOpen) {
      setTempCustomization(customization);
      setOriginalCustomization(customization);
    }
  }, [isOpen, customization]);

  const applyTempSettings = (settings: typeof customization) => {
    // Apply settings to CSS custom properties temporarily
    const root = document.documentElement;
    root.style.setProperty('--font-family-primary', settings.fontFamily);
    root.style.setProperty('--font-scale', settings.fontScale.toString());
    root.style.setProperty('--font-weight-scale', settings.fontWeightScale.toString());
    root.style.setProperty('--line-height-scale', settings.lineHeightScale.toString());
    root.style.setProperty('--letter-spacing', settings.letterSpacing === 0 ? 'normal' : `${settings.letterSpacing}em`);
    root.style.setProperty('--word-spacing', settings.wordSpacing === 0 ? 'normal' : `${settings.wordSpacing}em`);
  };

  const revertToOriginalSettings = () => {
    // Revert CSS custom properties to original values
    const root = document.documentElement;
    root.style.setProperty('--font-family-primary', originalCustomization.fontFamily);
    root.style.setProperty('--font-scale', originalCustomization.fontScale.toString());
    root.style.setProperty('--font-weight-scale', originalCustomization.fontWeightScale.toString());
    root.style.setProperty('--line-height-scale', originalCustomization.lineHeightScale.toString());
    root.style.setProperty('--letter-spacing', originalCustomization.letterSpacing === 0 ? 'normal' : `${originalCustomization.letterSpacing}em`);
    root.style.setProperty('--word-spacing', originalCustomization.wordSpacing === 0 ? 'normal' : `${originalCustomization.wordSpacing}em`);
  };

  const handleSliderChange = (key: keyof typeof customization, value: number) => {
    const newSettings = { ...tempCustomization, [key]: value };
    setTempCustomization(newSettings);
    applyTempSettings(newSettings);
  };

  const handleFontChange = (fontFamily: string) => {
    const newSettings = { ...tempCustomization, fontFamily };
    setTempCustomization(newSettings);
    applyTempSettings(newSettings);
  };

  const handleApplyChanges = () => {
    // Apply the temporary settings permanently to the store
    updateCustomization(tempCustomization);
    onClose();
  };

  const handleCancel = () => {
    // Revert to original settings and close
    revertToOriginalSettings();
    onClose();
  };

  const handleResetToDefault = () => {
    const defaultSettings = {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontScale: 1,
      fontWeightScale: 1,
      lineHeightScale: 1,
      letterSpacing: 0,
      wordSpacing: 0,
    };
    setTempCustomization(defaultSettings);
    applyTempSettings(defaultSettings);
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min, 
    max, 
    step = 0.1,
    unit = '',
    description 
  }: {
    label: string;
    value: number;
    onChange: (value: number) => void;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    description?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Typography variant="body2" className="font-medium">
          {label}
        </Typography>
        <Typography variant="caption" className="text-primary">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </Typography>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range range-primary range-sm"
      />
      <div className="flex justify-between text-xs text-base-content/60">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
      {description && (
        <Typography variant="caption" className="text-base-content/60">
          {description}
        </Typography>
      )}
    </div>
  );

  const FontFamilyTab = () => (
    <div className="space-y-6">
      <div>
        <Typography variant="h6" className="mb-3">Choose Font Family</Typography>
        <div className="grid grid-cols-1 gap-2">
          {fontFamilies.map((font) => (
            <div
              key={font.name}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                tempCustomization.fontFamily === font.value
                  ? 'border-primary bg-primary/10'
                  : 'border-base-300 hover:border-primary/50'
              }`}
              onClick={() => handleFontChange(font.value)}
            >
              <div className="flex justify-between items-center mb-2">
                <Typography variant="body2" className="font-medium">
                  {font.name}
                </Typography>
                <Typography variant="caption" className="opacity-60">
                  {font.preview}
                </Typography>
              </div>
              <div 
                className="text-sm text-base-content/80"
                style={{ fontFamily: font.value }}
              >
                The quick brown fox jumps over the lazy dog 0123456789
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SizingTab = () => (
    <div className="space-y-6">
      <SliderControl
        label="Font Size Scale"
        value={tempCustomization.fontScale}
        onChange={(value) => handleSliderChange('fontScale', value)}
        min={0.5}
        max={2}
        step={0.1}
        unit="×"
        description="Scales all font sizes proportionally"
      />
      
      <SliderControl
        label="Font Weight Scale"
        value={tempCustomization.fontWeightScale}
        onChange={(value) => handleSliderChange('fontWeightScale', value)}
        min={0.5}
        max={1.5}
        step={0.1}
        unit="×"
        description="Adjusts the boldness of all text"
      />

      <SliderControl
        label="Line Height Scale"
        value={tempCustomization.lineHeightScale}
        onChange={(value) => handleSliderChange('lineHeightScale', value)}
        min={0.8}
        max={1.8}
        step={0.1}
        unit="×"
        description="Controls space between lines"
      />
    </div>
  );

  const SpacingTab = () => (
    <div className="space-y-6">
      <SliderControl
        label="Letter Spacing"
        value={tempCustomization.letterSpacing}
        onChange={(value) => handleSliderChange('letterSpacing', value)}
        min={-0.05}
        max={0.1}
        step={0.01}
        unit="em"
        description="Space between individual letters"
      />

      <SliderControl
        label="Word Spacing"
        value={tempCustomization.wordSpacing}
        onChange={(value) => handleSliderChange('wordSpacing', value)}
        min={-0.1}
        max={0.5}
        step={0.01}
        unit="em"
        description="Space between words"
      />
    </div>
  );

  const PreviewText = () => (
    <div className="space-y-4 p-4 bg-base-200 rounded-lg">
      <Typography variant="h6" className="mb-4">Live Preview</Typography>
      <Typography variant="h1">Infinity Dashboard</Typography>
      <Typography variant="h2">Welcome to the Future</Typography>
      <Typography variant="h3">Customizable Typography</Typography>
      <Typography variant="h4">Real-time Changes</Typography>
      <Typography variant="h5">Perfect Readability</Typography>
      <Typography variant="h6">Consistent Design</Typography>
      <Typography variant="body1">
        This is a sample paragraph to demonstrate how your typography settings 
        affect the readability and appearance of your content. The quick brown 
        fox jumps over the lazy dog. Lorem ipsum dolor sit amet, consectetur 
        adipiscing elit.
      </Typography>
      <Typography variant="body2">
        Secondary text appears smaller and is perfect for supporting information, 
        captions, and metadata. It maintains perfect readability while being 
        visually distinct.
      </Typography>
      <Typography variant="caption">
        Caption text is the smallest variant and is used for fine print, labels, 
        and supplementary information.
      </Typography>
    </div>
  );

  // Define tabs configuration
  const tabsConfig = [
    {
      id: 'font',
      label: 'Font Family',
      content: <FontFamilyTab />
    },
    {
      id: 'sizing',
      label: 'Sizing & Weight',
      content: <SizingTab />
    },
    {
      id: 'spacing',
      label: 'Spacing',
      content: <SpacingTab />
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <Typography variant="h4">Typography Customization</Typography>
          <button
            onClick={handleCancel}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Controls */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-base-300">
            {/* Tabs Component */}
            <Tabs
              tabs={tabsConfig}
              defaultTab="font"
              size="md"
              className="mb-6"
            />

            {/* Control Buttons */}
            <div className="mt-16 pt-6 border-t border-base-300 space-y-3">
              <Button
                variant="primary"
                onClick={handleResetToDefault}
                className="w-full"
              >
                Reset to Default
              </Button>
              <div className="text-xs text-base-content/60 text-center">
                Changes are applied temporarily for preview
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="w-1/2 p-6 overflow-y-auto flex justify-between flex-col">
            <PreviewText />
            <div className="flex gap-2 mt-5 justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleApplyChanges}>
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};