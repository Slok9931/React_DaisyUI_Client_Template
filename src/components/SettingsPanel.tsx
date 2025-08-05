import React, { useState } from "react";
import { useTheme } from "@/hooks";
import { useTypographyStore, useAuthStore } from "@/store";
import { Button, Typography, useToast, Tooltip, Input } from "@/components";
import { User as UserIcon, RotateCcw, Edit, Save, X } from "lucide-react";

export const ThemeTab = () => {
  const { currentTheme, themes, changeTheme } = useTheme();
  const { addToast } = useToast();
  const themeListRef = React.useRef<HTMLDivElement>(null);

  const handleThemeSelect = (themeName: string) => {
    const currentScrollTop = themeListRef.current?.scrollTop || 0;
    changeTheme(themeName);
    addToast({ message: `Theme changed to ${themeName}`, variant: "info" });
    requestAnimationFrame(() => {
      if (themeListRef.current) {
        themeListRef.current.scrollTop = currentScrollTop;
      }
    });
  };

  const handleReset = () => {
    changeTheme('dark');
    addToast({ message: "Theme reset to dark", variant: "info" });
  };

  const ColorSwatch = ({ theme }: { theme: any }) => (
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Typography variant="h6" className="mb-4">
          Choose Theme
        </Typography>
        <div
          className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto"
          ref={themeListRef}
        >
          {themes.map((theme) => (
            <Tooltip key={theme.name} tip={theme.displayName} position="left">
              <div
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  currentTheme.name === theme.name
                    ? "border-primary bg-primary/10"
                    : "border-base-300 hover:border-primary/50"
                }`}
                onClick={() => handleThemeSelect(theme.name)}
                tabIndex={0}
                role="button"
                style={{ cursor: "pointer" }}
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
            </Tooltip>
          ))}
        </div>
        <div className="bg-base-200 p-4 rounded-lg mt-4">
          <Typography variant="body2" className="font-medium mb-2">
            Current Theme: {currentTheme.displayName}
          </Typography>
          <Typography variant="caption" className="text-base-content/60">
            {currentTheme.isDark ? "Dark" : "Light"} theme • Colors update
            instantly across the entire application
          </Typography>
        </div>
      </div>
      <div className="pt-4 border-t border-base-300 mt-4">
        <Button
          onClick={handleReset}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export const FontFamilyTab = () => {
  const { customization, fontFamilies, updateCustomization } = useTypographyStore();
  const { addToast } = useToast();
  const [tempCustomization, setTempCustomization] = useState(customization);

  const handleFontChange = (fontFamily: string) => {
    const newSettings = { ...tempCustomization, fontFamily };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
    addToast({ message: `Font changed to ${fontFamily}`, variant: "info" });
  };

  const handleReset = () => {
    const defaultFont = fontFamilies[0]?.value || 'Inter, sans-serif';
    handleFontChange(defaultFont);
    addToast({ message: "Font reset to default", variant: "info" });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <Typography variant="h6" className="mb-4">
          Choose Font Family
        </Typography>
        <div className="grid grid-cols-1 gap-2 max-h-[50vh] overflow-y-auto">
          {fontFamilies.map((font) => (
            <Tooltip key={font.name} tip={font.name} position="left">
              <div
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  customization.fontFamily === font.value
                    ? "border-primary bg-primary/10"
                    : "border-base-300 hover:border-primary/50"
                }`}
                onClick={() => handleFontChange(font.value)}
                tabIndex={0}
                role="button"
                style={{ cursor: "pointer" }}
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
            </Tooltip>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-base-300 mt-4">
        <Button
          onClick={handleReset}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export const TypographyTab = () => {
  const { customization, updateCustomization } = useTypographyStore();
  const { addToast } = useToast();
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
    <div>
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
        className="range range-primary range-sm cursor-pointer"
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

  const typographyTabRef = React.useRef<HTMLDivElement>(null);

  const handleSliderChange = (
    key: keyof typeof customization,
    value: number
  ) => {
    const newSettings = { ...tempCustomization, [key]: value };
    setTempCustomization(newSettings);
    updateCustomization(newSettings);
    addToast({ message: `${key} changed to ${value}`, variant: "info" });
  };

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

  const handleReset = () => {
    const defaultSettings = {
      fontScale: 1,
      fontWeightScale: 1,
      lineHeightScale: 1,
      letterSpacing: 0,
      wordSpacing: 0,
    };
    setTempCustomization({ ...tempCustomization, ...defaultSettings });
    updateCustomization({ ...tempCustomization, ...defaultSettings });
    addToast({ message: "Typography reset to default", variant: "info" });
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto"
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
      <div className="pt-4 border-t border-base-300 mt-4">
        <Button
          onClick={handleReset}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </Button>
      </div>
    </div>
  );
};

export const PreviewTab = () => (
  <div>
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
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    // firstName: user?.firstName || '',
    // lastName: user?.lastName || '',
    // bio: user?.bio || '',
    // phone: user?.phone || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // updateUser(formData);
    addToast({ message: "Profile changes saved!", variant: "success" });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      // firstName: user?.firstName || '',
      // lastName: user?.lastName || '',
      // bio: user?.bio || '',
      // phone: user?.phone || '',
    });
    addToast({ message: "Profile edit cancelled", variant: "info" });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 space-y-4">
          <Typography variant="h6" className="mb-4">
            Edit Profile
          </Typography>
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email"
              />
            </div>
            {/* <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="First name"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="Last name"
                />
              </div>
            </div>

            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full"
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div> */}
          </div>
        </div>
        <div className="pt-4 border-t border-base-300 mt-4">
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="btn btn-primary btn-sm flex-1 gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
            <Button
              onClick={handleCancel}
              className="btn btn-outline btn-sm flex-1 gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="flex flex-col items-center gap-4">
          <div className="avatar">
            <div className="w-20 rounded-full bg-base-200 flex items-center justify-center">
              <UserIcon className="w-16 h-16 text-base-content/60" />
            </div>
          </div>
          <div className="text-center">
            <Typography variant="body1" className="font-semibold">
              {user?.username}
            </Typography>
            <Typography variant="caption" className="text-base-content/60">
              {user?.email}
            </Typography>
          </div>
          <div className="w-full space-y-3 mt-4">
            {user?.username && (
              <div className="flex justify-between">
                <Typography variant="caption" className="text-base-content/60">
                  Username:
                </Typography>
                <Typography variant="caption">
                  {user.username}
                </Typography>
              </div>
            )}
            {/* {user?.phone && (
              <div className="flex justify-between">
                <Typography variant="caption" className="text-base-content/60">
                  Phone:
                </Typography>
                <Typography variant="caption">
                  {user.phone}
                </Typography>
              </div>
            )}
            
            {user?.bio && (
              <div>
                <Typography variant="caption" className="text-base-content/60 mb-1 block">
                  Bio:
                </Typography>
                <Typography variant="caption" className="text-left">
                  {user.bio}
                </Typography>
              </div>
            )} */}
          </div>
        </div>
      </div>
      <div className="pt-4 border-t border-base-300 mt-4">
        <Button
          onClick={() => {
            setIsEditing(true);
            addToast({ message: "Editing profile...", variant: "info" });
          }}
          className="btn btn-primary btn-sm w-full gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};