import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Typography } from "../Typography";
import { Tabs } from "./Tabs";
import { getIconComponent } from "@/utils/utilityFunction";

type ColorPickerSize = "xs" | "sm" | "md" | "lg";
type ColorPickerVariant =
  | "bordered"
  | "ghost"
  | "primary"
  | "secondary"
  | "accent"
  | "info"
  | "success"
  | "warning"
  | "error";

interface ColorPickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  size?: ColorPickerSize;
  variant?: ColorPickerVariant;
  placeholder?: string;
  value?: string;
  onChange?: (color: string | null) => void;
  disabled?: boolean;
  showAlpha?: boolean;
  showPresets?: boolean;
  showEyeDropper?: boolean;
  presetColors?: string[];
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  error,
  helperText,
  size = "md",
  variant = "bordered",
  placeholder = "Select color...",
  value,
  onChange,
  disabled = false,
  showAlpha = false,
  showPresets = true,
  showEyeDropper = true,
  presetColors,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFormat, setActiveFormat] = useState("hex");
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [colorValue, setColorValue] = useState(100);
  const [alpha, setAlpha] = useState(100);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [isDraggingColor, setIsDraggingColor] = useState(false);
  const [isDraggingHue, setIsDraggingHue] = useState(false);
  const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueSliderRef = useRef<HTMLDivElement>(null);
  const alphaSliderRef = useRef<HTMLDivElement>(null);

  // Get theme-based colors from CSS variables
  const getThemeColors = useCallback(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    
    const themeColors = [
      style.getPropertyValue('--p') && `hsl(${style.getPropertyValue('--p')})`,
      style.getPropertyValue('--s') && `hsl(${style.getPropertyValue('--s')})`,
      style.getPropertyValue('--a') && `hsl(${style.getPropertyValue('--a')})`,
      style.getPropertyValue('--n') && `hsl(${style.getPropertyValue('--n')})`,
      style.getPropertyValue('--b1') && `hsl(${style.getPropertyValue('--b1')})`,
      style.getPropertyValue('--b2') && `hsl(${style.getPropertyValue('--b2')})`,
      style.getPropertyValue('--b3') && `hsl(${style.getPropertyValue('--b3')})`,
      style.getPropertyValue('--bc') && `hsl(${style.getPropertyValue('--bc')})`,
      style.getPropertyValue('--su') && `hsl(${style.getPropertyValue('--su')})`,
      style.getPropertyValue('--wa') && `hsl(${style.getPropertyValue('--wa')})`,
      style.getPropertyValue('--er') && `hsl(${style.getPropertyValue('--er')})`,
      style.getPropertyValue('--in') && `hsl(${style.getPropertyValue('--in')})`,
    ].filter(Boolean);

    // Add some extra common colors
    const commonColors = [
      '#FF0000', '#FF8000', '#FFFF00', '#80FF00', '#00FF00', '#00FF80',
      '#00FFFF', '#0080FF', '#0000FF', '#8000FF', '#FF00FF', '#FF0080',
      '#000000', '#404040', '#808080', '#C0C0C0', '#FFFFFF'
    ];

    return [...themeColors, ...commonColors];
  }, []);

  const defaultPresetColors = getThemeColors();

  // Convert HSL to RGB
  const hslToRgb = useCallback((h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }, []);

  // Convert hex to RGB
  const hexToRgb = useCallback((hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }, []);

  // Convert RGB to hex
  const rgbToHex = useCallback((r: number, g: number, b: number) => {
    return (
      "#" +
      ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
    );
  }, []);

  // HSV to RGB conversion
  const hsvToRgb = useCallback((h: number, s: number, v: number) => {
    s /= 100;
    v /= 100;
    let r = 0, g = 0, b = 0;
    let i = Math.floor(h / 60);
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: (r = v), (g = t), (b = p); break;
      case 1: (r = q), (g = v), (b = p); break;
      case 2: (r = p), (g = v), (b = t); break;
      case 3: (r = p), (g = q), (b = v); break;
      case 4: (r = t), (g = p), (b = v); break;
      case 5: (r = v), (g = p), (b = q); break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }, []);

  // RGB to HSV conversion
  const rgbToHsv = useCallback((r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    let d = max - min;
    s = max === 0 ? 0 : (d / max) * 100;
    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
      h = Math.round(h * 360);
    }
    v = Math.round(v * 100);
    s = Math.round(s);
    return [h, s, v];
  }, []);

  // Format color in all formats
  const getColorFormats = useCallback(
    (h: number, s: number, v: number, a: number = 100) => {
      const [r, g, b] = hsvToRgb(h, s, v);
      
      // Convert HSV to HSL for HSL format
      const hslL = v * (1 - s / 200);
      const hslS = hslL === 0 || hslL === 1 ? 0 : (v - hslL) / Math.min(hslL, 1 - hslL);

      return {
        hex: rgbToHex(r, g, b),
        rgb: showAlpha
          ? `rgba(${r}, ${g}, ${b}, ${(a / 100).toFixed(2)})`
          : `rgb(${r}, ${g}, ${b})`,
        hsl: showAlpha
          ? `hsla(${Math.round(h)}, ${Math.round(hslS * 100)}%, ${Math.round(hslL * 100)}%, ${(a / 100).toFixed(2)})`
          : `hsl(${Math.round(h)}, ${Math.round(hslS * 100)}%, ${Math.round(hslL * 100)}%)`,
        hsv: showAlpha
          ? `hsva(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%, ${(a / 100).toFixed(2)})`
          : `hsv(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(v)}%)`,
      };
    },
    [hsvToRgb, rgbToHex, showAlpha]
  );

  // Parse color from input
  const parseColor = useCallback(
    (colorString: string) => {
      if (!colorString) return null;

      // Hex color
      if (colorString.startsWith("#")) {
        const rgb = hexToRgb(colorString);
        if (rgb) {
          const [h, s, v] = rgbToHsv(rgb[0], rgb[1], rgb[2]);
          return { h, s, v, a: 100 };
        }
      }

      // RGB color
      const rgbMatch = colorString.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (rgbMatch) {
        const [, r, g, b, a] = rgbMatch;
        const [h, s, v] = rgbToHsv(parseInt(r), parseInt(g), parseInt(b));
        return { h, s, v, a: a ? parseFloat(a) * 100 : 100 };
      }

      // HSL color
      const hslMatch = colorString.match(
        /hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/
      );
      if (hslMatch) {
        const [, h, s, l, a] = hslMatch;
        const [r, g, b] = hslToRgb(parseInt(h), parseInt(s), parseInt(l));
        const [hh, ss, vv] = rgbToHsv(r, g, b);
        return { h: hh, s: ss, v: vv, a: a ? parseFloat(a) * 100 : 100 };
      }

      return null;
    },
    [hexToRgb, hslToRgb, rgbToHsv]
  );

  // Get current color in selected format
  const getCurrentColor = useCallback(() => {
    const formats = getColorFormats(hue, saturation, colorValue, alpha);
    return formats[activeFormat as keyof typeof formats];
  }, [hue, saturation, colorValue, alpha, activeFormat, getColorFormats]);


  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle mouse movement for smooth dragging
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingColor && colorAreaRef.current) {
        const rect = colorAreaRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const y = Math.max(0, Math.min(rect.height, event.clientY - rect.top));

        const newSaturation = (x / rect.width) * 100;
        const newValue = 100 - (y / rect.height) * 100;

        setSaturation(newSaturation);
        setColorValue(newValue);
      }

      if (isDraggingHue && hueSliderRef.current) {
        const rect = hueSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const newHue = (x / rect.width) * 360;
        setHue(newHue);
      }

      if (isDraggingAlpha && alphaSliderRef.current) {
        const rect = alphaSliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(rect.width, event.clientX - rect.left));
        const newAlpha = (x / rect.width) * 100;
        setAlpha(newAlpha);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingColor(false);
      setIsDraggingHue(false);
      setIsDraggingAlpha(false);
    };

    if (isDraggingColor || isDraggingHue || isDraggingAlpha) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDraggingColor, isDraggingHue, isDraggingAlpha]);

  // Update parent when any color value changes
  useEffect(() => {
    const currentColor = getCurrentColor();
    onChange?.(currentColor);
  }, [hue, saturation, colorValue, alpha, activeFormat, getCurrentColor, onChange]);

  // Handle color area mouse down
  const handleColorAreaMouseDown = (event: React.MouseEvent) => {
    setIsDraggingColor(true);
    if (!colorAreaRef.current) return;

    const rect = colorAreaRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newSaturation = (x / rect.width) * 100;
    const newValue = 100 - (y / rect.height) * 100;

    setSaturation(Math.max(0, Math.min(100, newSaturation)));
    setColorValue(Math.max(0, Math.min(100, newValue)));
  };

  // Handle hue slider mouse down
  const handleHueSliderMouseDown = (event: React.MouseEvent) => {
    setIsDraggingHue(true);
    if (!hueSliderRef.current) return;

    const rect = hueSliderRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newHue = (x / rect.width) * 360;

    setHue(Math.max(0, Math.min(360, newHue)));
  };

  // Handle alpha slider mouse down
  const handleAlphaSliderMouseDown = (event: React.MouseEvent) => {
    setIsDraggingAlpha(true);
    if (!alphaSliderRef.current) return;

    const rect = alphaSliderRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newAlpha = (x / rect.width) * 100;

    setAlpha(Math.max(0, Math.min(100, newAlpha)));
  };

  // Handle preset color click
  const handlePresetClick = (color: string) => {
    const parsed = parseColor(color);
    if (parsed) {
      setHue(parsed.h);
      setSaturation(parsed.s);
      setColorValue(parsed.v);
      setAlpha(parsed.a);
    }
    setIsOpen(false);
  };

  // Handle eye dropper
  const handleEyeDropper = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        handlePresetClick(result.sRGBHex);
      } catch (error) {}
    } else {
      alert("Eye Dropper API is not supported in this browser");
    }
  };

  // Handle clear
  const handleClear = () => {
    onChange?.(null);
    setIsOpen(false);
  };

  // Handle color selection and add to recent
  const handleColorSelect = () => {
    const colorString = getCurrentColor();

    // Add to recent colors
    setRecentColors((prev) => {
      const newRecent = [
        colorString,
        ...prev.filter((c) => c !== colorString),
      ].slice(0, 10);
      return newRecent;
    });

    setIsOpen(false);
  };

  const currentColor = getCurrentColor();
  const hasValue = !!value;
  const colorFormats = getColorFormats(hue, saturation, colorValue, alpha);

  const formatTabs = [
    { id: "hex", label: "HEX", content: "HEX" },
    { id: "rgb", label: "RGB", content: "RGB" },
    { id: "hsl", label: "HSL", content: "HSL" },
    { id: "hsv", label: "HSV", content: "HSV" },
  ];

  // For preview and input, always use RGBA
  const rgb = hsvToRgb(hue, saturation, colorValue);
  const rgbaColor = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${(alpha / 100).toFixed(2)})`;
  const pureColorRgb = hsvToRgb(hue, 100, 100);
  const pureColor = `rgb(${pureColorRgb[0]},${pureColorRgb[1]},${pureColorRgb[2]})`;

  const finalPresetColors = presetColors || defaultPresetColors;

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label">
          <Typography variant="body2" className="label-text">
            {label}
          </Typography>
        </label>
      )}

      <div ref={dropdownRef} className="relative">
        {/* Color Input */}
        <Input
          value={currentColor}
          placeholder={placeholder}
          size={size}
          variant={variant}
          error={error}
          disabled={disabled}
          className={`cursor-pointer ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onChange={(e) => {
            const parsed = parseColor(e.target.value);
            if (parsed) {
              setHue(parsed.h);
              setSaturation(parsed.s);
              setColorValue(parsed.v);
              setAlpha(parsed.a);
            }
          }}
          // startIcon={
          //   <div
          //     className="w-5 h-5 rounded border border-base-300"
          //     style={{ backgroundColor: rgbaColor }}
          //   />
          // }
          endIcon={getIconComponent(
            "Palette",
            16,
            "w-4 h-4 text-base-content/70"
          )}
        />

        {/* Color Picker Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg p-4 min-w-96">
            {/* Color Area */}
            <div className="mb-4">
              <div
                ref={colorAreaRef}
                className="w-full h-48 relative cursor-crosshair rounded border select-none"
                style={{
                  background: `
                    linear-gradient(to top, black, transparent),
                    linear-gradient(to right, white, ${pureColor})
                  `,
                }}
                onMouseDown={handleColorAreaMouseDown}
              >
                {/* Color picker cursor */}
                <div
                  className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
                  style={{
                    left: `${saturation}%`,
                    top: `${100 - colorValue}%`,
                    transform: "translate(-50%, -50%)",
                    boxShadow:
                      "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
                  }}
                />
              </div>
            </div>

            {/* Hue Slider */}
            <div className="mb-4">
              <Typography variant="caption" className="block mb-2">
                Hue
              </Typography>
              <div
                ref={hueSliderRef}
                className="w-full h-6 rounded cursor-pointer relative select-none"
                style={{
                  background:
                    "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                }}
                onMouseDown={handleHueSliderMouseDown}
              >
                <div
                  className="absolute top-0 w-4 h-6 bg-white border-2 border-gray-400 rounded shadow-md pointer-events-none"
                  style={{
                    left: `${(hue / 360) * 100}%`,
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            </div>

            {/* Alpha Slider */}
            {showAlpha && (
              <div className="mb-4">
                <Typography variant="caption" className="block mb-2">
                  Opacity: {Math.round(alpha)}%
                </Typography>
                <div
                  ref={alphaSliderRef}
                  className="w-full h-6 rounded cursor-pointer relative select-none"
                  style={{
                    background: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                      linear-gradient(45deg, transparent 75%, #ccc 75%), 
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                    backgroundSize: "8px 8px",
                    backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
                  }}
                  onMouseDown={handleAlphaSliderMouseDown}
                >
                  <div
                    className="w-full h-full rounded"
                    style={{
                      background: `linear-gradient(to right, rgba(${rgb[0]},${rgb[1]},${rgb[2]},0), rgba(${rgb[0]},${rgb[1]},${rgb[2]},1))`,
                    }}
                  />
                  <div
                    className="absolute top-0 w-4 h-6 bg-white border-2 border-gray-400 rounded shadow-md pointer-events-none"
                    style={{
                      left: `${alpha}%`,
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Color Format Tabs */}
            <div className="mb-4">
              <Tabs
                tabs={formatTabs}
                defaultTab={activeFormat}
                onChange={setActiveFormat}
                variant="border"
                size="sm"
              />

              {/* Color Value Inputs */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div>
                  <Typography variant="caption" className="block mb-1">
                    Preview
                  </Typography>
                  <div
                    className="w-full h-12 rounded border border-base-300"
                    style={{ backgroundColor: rgbaColor }}
                  />
                </div>
                <div>
                  <Typography variant="caption" className="block mb-1">
                    {formatTabs.find((tab) => tab.id === activeFormat)?.label} Value
                  </Typography>
                  <Input
                    value={colorFormats[activeFormat as keyof typeof colorFormats]}
                    onChange={(e) => {
                      const parsed = parseColor(e.target.value);
                      if (parsed) {
                        setHue(parsed.h);
                        setSaturation(parsed.s);
                        setColorValue(parsed.v);
                        setAlpha(parsed.a);
                      }
                    }}
                    size="sm"
                    className="font-mono text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Preset Colors */}
            {showPresets && (
              <div className="mb-4">
                <Typography variant="caption" className="block mb-2">
                  Theme & Preset Colors
                </Typography>
                <div className="grid grid-cols-16 gap-0.5">
                  {finalPresetColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-5 h-5 rounded border border-base-300/50 hover:scale-110 transition-transform hover:border-base-content/30"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Colors */}
            {recentColors.length > 0 && (
              <div className="mb-4">
                <Typography variant="caption" className="block mb-2">
                  Recent Colors
                </Typography>
                <div className="flex gap-0.5 flex-wrap">
                  {recentColors.map((color, index) => (
                    <button
                      key={index}
                      className="w-5 h-5 rounded border border-base-300/50 hover:scale-110 transition-transform hover:border-base-content/30"
                      style={{ backgroundColor: color }}
                      onClick={() => handlePresetClick(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-base-300">
              <div className="flex gap-2">
                {showEyeDropper && "EyeDropper" in window && (
                  <Button size="sm" variant="ghost" onClick={handleEyeDropper}>
                    {getIconComponent("Pipette", 16, "w-4 h-4 mr-1")}
                    Dropper
                  </Button>
                )}
                {hasValue && (
                  <Button size="sm" variant="ghost" onClick={handleClear}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={handleColorSelect}>
                  Select
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {(error || helperText) && (
        <label className="label">
          <Typography
            variant="caption"
            className={`label-text-alt ${error ? "text-error" : ""}`}
          >
            {error || helperText}
          </Typography>
        </label>
      )}
    </div>
  );
};
