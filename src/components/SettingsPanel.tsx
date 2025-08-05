import React, { useState } from "react";
import { useTheme } from "@/hooks";
import { useTypographyStore, useAuthStore } from "@/store";
import { Typography } from "@/components";
import { User as UserIcon } from "lucide-react";

export const ThemeTab = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const handleThemeSelect = (themeName: string) => {
    const currentScrollTop = themeListRef.current?.scrollTop || 0;
    changeTheme(themeName);

    requestAnimationFrame(() => {
      if (themeListRef.current) {
        themeListRef.current.scrollTop = currentScrollTop;
      }
    });
  };

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

  return (
    <div className="">
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

export const FontFamilyTab = () => {
  const { customization, fontFamilies, updateCustomization } =
    useTypographyStore();

  const [tempCustomization, setTempCustomization] = useState(customization);

  const handleFontChange = (fontFamily: string) => {
    const newSettings = { ...tempCustomization, fontFamily };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
  };

  return (
    <div className="">
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
};

export const TypographyTab = () => {
  const { customization, updateCustomization } = useTypographyStore();

  const [tempCustomization, setTempCustomization] = useState(customization);

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
    <div className="max-h-[75vh] overflow-y-auto">
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

  const handleSliderChange = (
    key: keyof typeof customization,
    value: number
  ) => {
    const newSettings = { ...tempCustomization, [key]: value };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
  };

  const typographyTabRef = React.useRef<HTMLDivElement>(null);

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
      className=""
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
            onChange={(value) =>
              handleSliderChangeWithScroll("fontScale", value)
            }
            min={0.5}
            max={2}
            step={0.1}
            unit="×"
            description="Scales all font sizes proportionally"
          />

          <SliderControl
            label="Font Weight Scale"
            value={customization.fontWeightScale}
            onChange={(value) =>
              handleSliderChangeWithScroll("fontWeightScale", value)
            }
            min={0.5}
            max={1.5}
            step={0.1}
            unit="×"
            description="Adjusts the boldness of all text"
          />

          <SliderControl
            label="Line Height Scale"
            value={customization.lineHeightScale}
            onChange={(value) =>
              handleSliderChangeWithScroll("lineHeightScale", value)
            }
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
            onChange={(value) =>
              handleSliderChangeWithScroll("letterSpacing", value)
            }
            min={-0.05}
            max={0.1}
            step={0.01}
            unit="em"
            description="Space between individual letters"
          />

          <SliderControl
            label="Word Spacing"
            value={customization.wordSpacing}
            onChange={(value) =>
              handleSliderChangeWithScroll("wordSpacing", value)
            }
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

export const PreviewTab = () => (
  <div className="">
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
          This is a sample paragraph to demonstrate how your typography settings
          affect the readability and appearance of your content. The quick brown
          fox jumps over the lazy dog.
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
            <Typography variant="body2" className="text-secondary font-medium">
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

export const ProfileTab = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center gap-2">
        <div className="avatar">
          <div className="w-20 rounded-full bg-base-200 flex items-center justify-center">
            <UserIcon className="w-16 h-16 text-base-content/60" />
          </div>
        </div>
        <Typography variant="body1" className="font-semibold mt-2">
          {user?.username}
        </Typography>
        <Typography variant="caption" className="text-base-content/60">
          {user?.email}
        </Typography>
      </div>
    </div>
  );
};
