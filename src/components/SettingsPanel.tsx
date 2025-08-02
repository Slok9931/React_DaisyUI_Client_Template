import React, { useState } from "react";
import { useTheme } from "@/hooks";
import { useTypographyStore } from "@/store";
import { Typography, Button, Tabs } from "@/components";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<
  SettingsPanelProps & { side?: "left" | "right" }
> = ({ isOpen, onClose, side = "right" }) => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const {
    customization,
    fontFamilies,
    updateCustomization,
    resetCustomization,
  } = useTypographyStore();

  const [tempCustomization, setTempCustomization] = useState(customization);

  const handleSliderChange = (
    key: keyof typeof customization,
    value: number
  ) => {
    const newSettings = { ...tempCustomization, [key]: value };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
  };

  const handleFontChange = (fontFamily: string) => {
    const newSettings = { ...tempCustomization, fontFamily };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
  };

  const handleResetToDefault = () => {
    // Reset typography to default
    const defaultSettings = {
      fontFamily: "Inter, system-ui, sans-serif",
      fontScale: 1,
      fontWeightScale: 1,
      lineHeightScale: 1,
      letterSpacing: 0,
      wordSpacing: 0,
    };
    setTempCustomization(defaultSettings);
    updateCustomization(defaultSettings);
    resetCustomization();

    // Reset theme to dark
    changeTheme("dark");
  };

  const SliderControl = ({
    label,
    value,
    onChange,
    min,
    max,
    step = 0.1,
    unit = "",
    description,
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
          {value.toFixed(step < 1 ? 1 : 0)}
          {unit}
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
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
      {description && (
        <Typography variant="caption" className="text-base-content/60">
          {description}
        </Typography>
      )}
    </div>
  );

  // Color Swatch Component
  const ColorSwatch = ({ theme }: { theme: any }) => {
    return (
      <div
        className="flex items-center gap-1 p-3 rounded-lg border"
        data-theme={theme.name}
      >
        <div className="w-3 h-3 rounded-full bg-primary border border-base-content/20"></div>
        <div className="w-3 h-3 rounded-full bg-secondary border border-base-content/20"></div>
        <div className="w-3 h-3 rounded-full bg-accent border border-base-content/20"></div>
        <div className="w-3 h-3 rounded-full bg-neutral border border-base-content/20"></div>
      </div>
    );
  };

  const themeListRef = React.useRef<HTMLDivElement>(null);

  // Enhanced Theme Tab Component without auto-scroll
  const ThemeTab = () => {
    // Preserve scroll position when theme changes
    const handleThemeSelect = (themeName: string) => {
      const currentScrollTop = themeListRef.current?.scrollTop || 0;
      changeTheme(themeName);

      // Restore scroll position after theme change
      requestAnimationFrame(() => {
        if (themeListRef.current) {
          themeListRef.current.scrollTop = currentScrollTop;
        }
      });
    };

    return (
      <div className="space-y-6">
        <div>
          <Typography variant="h6" className="mb-4">
            Choose Theme
          </Typography>
          <div
            className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto"
            ref={themeListRef}
          >
            {themes.map((theme) => (
              <div
                key={theme.name}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  currentTheme.name === theme.name
                    ? "border-primary bg-primary/10"
                    : "border-base-300 hover:border-primary/50"
                }`}
                onClick={() => handleThemeSelect(theme.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 justify-between">
                      <Typography variant="body2" className="font-medium">
                        {theme.displayName}
                      </Typography>
                      <div className="w-fit">
                        <ColorSwatch theme={theme} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Theme Information */}
        <div className="bg-base-200 p-4 rounded-lg">
          <Typography variant="body2" className="font-medium mb-2">
            Current Theme: {currentTheme.displayName}
          </Typography>
          <Typography variant="caption" className="text-base-content/60">
            {currentTheme.isDark ? "Dark" : "Light"} theme • Colors update
            instantly across the entire application
          </Typography>
        </div>
      </div>
    );
  };

  // Font Family Tab Component
  const FontFamilyTab = () => (
    <div className="space-y-6">
      <div>
        <Typography variant="h6" className="mb-4">
          Choose Font Family
        </Typography>
        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
          {fontFamilies.map((font) => (
            <div
              key={font.name}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                customization.fontFamily === font.value
                  ? "border-primary bg-primary/10"
                  : "border-base-300 hover:border-primary/50"
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
                The quick brown fox jumps over the lazy dog
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const typographyTabRef = React.useRef<HTMLDivElement>(null);

  const TypographyTab = () => {
    const handleSliderChangeWithScroll = (
      key: keyof typeof customization,
      value: number
    ) => {
      const currentScrollTop = typographyTabRef.current?.scrollTop || 0;
      handleSliderChange(key, value);
      requestAnimationFrame(() => {
        if (typographyTabRef.current) {
          typographyTabRef.current.scrollTop = currentScrollTop;
        }
      });
    };

    return (
      <div
        className="space-y-6 max-h-[60vh] overflow-y-auto"
        ref={typographyTabRef}
      >
        <div>
          <Typography variant="h6" className="mb-4">
            Font Size & Weight
          </Typography>
          <div className="space-y-4">
            <SliderControl
              label="Font Size Scale"
              value={customization.fontScale}
              onChange={(value) => handleSliderChangeWithScroll("fontScale", value)}
              min={0.5}
              max={2}
              step={0.1}
              unit="×"
              description="Scales all font sizes proportionally"
            />

            <SliderControl
              label="Font Weight Scale"
              value={customization.fontWeightScale}
              onChange={(value) => handleSliderChangeWithScroll("fontWeightScale", value)}
              min={0.5}
              max={1.5}
              step={0.1}
              unit="×"
              description="Adjusts the boldness of all text"
            />

            <SliderControl
              label="Line Height Scale"
              value={customization.lineHeightScale}
              onChange={(value) => handleSliderChangeWithScroll("lineHeightScale", value)}
              min={0.8}
              max={1.8}
              step={0.1}
              unit="×"
              description="Controls space between lines"
            />
          </div>
        </div>

        <div className="divider"></div>

        <div>
          <Typography variant="h6" className="mb-4">
            Spacing
          </Typography>
          <div className="space-y-4">
            <SliderControl
              label="Letter Spacing"
              value={customization.letterSpacing}
              onChange={(value) => handleSliderChangeWithScroll("letterSpacing", value)}
              min={-0.05}
              max={0.1}
              step={0.01}
              unit="em"
              description="Space between individual letters"
            />

            <SliderControl
              label="Word Spacing"
              value={customization.wordSpacing}
              onChange={(value) => handleSliderChangeWithScroll("wordSpacing", value)}
              min={-0.1}
              max={0.5}
              step={0.01}
              unit="em"
              description="Space between words"
            />
          </div>
        </div>
      </div>
    );
  };

  // Preview Tab Component
  const PreviewTab = () => (
    <div className="space-y-6 max-h-[60vh] overflow-y-auto">
      <div>
        <Typography variant="h6" className="mb-4">
          Live Preview
        </Typography>
        <div className="space-y-4 p-4 bg-base-200 rounded-lg">
          <Typography variant="h1" className="text-primary">
            Infinity Dashboard
          </Typography>
          <Typography variant="h2" className="text-secondary">
            Welcome to the Future
          </Typography>
          <Typography variant="h3" className="text-accent">
            Customizable Typography
          </Typography>
          <Typography variant="h4" className="text-info">
            Real-time Changes
          </Typography>
          <Typography variant="h5" className="text-success">
            Perfect Readability
          </Typography>
          <Typography variant="h6" className="text-warning">
            Consistent Design
          </Typography>
          <Typography variant="body1" className="text-base-content">
            This is a sample paragraph to demonstrate how your typography
            settings affect the readability and appearance of your content. The
            quick brown fox jumps over the lazy dog.
          </Typography>
          <Typography variant="body2" className="text-base-content/80">
            Secondary text appears smaller and is perfect for supporting
            information, captions, and metadata.
          </Typography>
          <Typography variant="caption" className="text-base-content/60">
            Caption text is the smallest variant and is used for fine print and
            labels.
          </Typography>

          {/* Color Preview Section */}
          <div className="divider">Color Variations</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Typography variant="body2" className="text-primary font-medium">
                Primary Text
              </Typography>
              <Typography
                variant="body2"
                className="text-secondary font-medium"
              >
                Secondary Text
              </Typography>
              <Typography variant="body2" className="text-accent font-medium">
                Accent Text
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography variant="body2" className="text-info font-medium">
                Info Text
              </Typography>
              <Typography variant="body2" className="text-success font-medium">
                Success Text
              </Typography>
              <Typography variant="body2" className="text-warning font-medium">
                Warning Text
              </Typography>
            </div>
          </div>

          {/* Different States */}
          <div className="divider">Text States</div>
          <div className="space-y-2">
            <Typography variant="body2" className="text-error font-medium">
              Error Message Text
            </Typography>
            <Typography variant="body2" className="text-base-content/40">
              Disabled Text (40% opacity)
            </Typography>
            <Typography variant="body2" className="text-base-content/60">
              Muted Text (60% opacity)
            </Typography>
            <Typography variant="body2" className="text-base-content">
              Normal Text (100% opacity)
            </Typography>
          </div>

          {/* Interactive Elements Preview */}
          <div className="divider">Interactive Elements</div>
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary">Primary Badge</span>
            <span className="badge badge-secondary">Secondary Badge</span>
            <span className="badge badge-accent">Accent Badge</span>
            <span className="badge badge-info">Info Badge</span>
            <span className="badge badge-success">Success Badge</span>
            <span className="badge badge-warning">Warning Badge</span>
            <span className="badge badge-error">Error Badge</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Define tabs configuration
  const tabsConfig = [
    {
      id: "themes",
      label: "Themes",
      content: <ThemeTab />,
    },
    {
      id: "fonts",
      label: "Font Family",
      content: <FontFamilyTab />,
    },
    {
      id: "typography",
      label: "Typography",
      content: <TypographyTab />,
    },
    {
      id: "preview",
      label: "Preview",
      content: <PreviewTab />,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed top-0 ${
            side === "right" ? "right-0" : "left-0"
          } h-screen w-full md:w-[45%] bg-base-100 shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${
            isOpen
              ? "translate-x-0"
              : side === "right"
              ? "translate-x-full"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-base-300 h-16 flex-shrink-0">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <Typography variant="h5" className="font-semibold">
              Settings
            </Typography>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-64px)]">
          <div className="flex-1 overflow-y-auto p-4 min-h-0">
            <Tabs
              tabs={tabsConfig}
              defaultTab="themes"
              size="sm"
              className="mb-4"
            />
          </div>

          {/* Footer - Always visible */}
          <div className="p-4 border-t border-base-300 flex-shrink-0">
            <Button
              variant="primary"
              onClick={handleResetToDefault}
              className="w-full"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset All Settings
            </Button>
            <Typography
              variant="caption"
              className="text-base-content/60 text-center block mt-2"
            >
              Resets theme to Dark and typography to defaults
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};