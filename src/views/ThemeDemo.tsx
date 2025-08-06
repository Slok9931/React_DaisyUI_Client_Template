import React from 'react';
import { Typography, ThemeSelector, InfinitySheet } from '@/components';

export const ThemeDemo: React.FC = () => {
  const [isSheetOpen, setSheetOpen] = React.useState(true);

  const handleSheetToggle = () => {
    if (isSheetOpen) {
      setSheetOpen(false);
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-8 relative">
      {/* Button to open/close the sheet */}
      <button
        className="btn btn-primary z-[10000] transition-all duration-300"
        onClick={handleSheetToggle}
      >
        {isSheetOpen ? "Close Sheet" : "Open Sheet"}
      </button>

      <InfinitySheet
        isOpen={isSheetOpen}
        onClose={() => setSheetOpen(false)}
        side="right"
        width={400}
        minWidth={240}
        maxWidth={window.innerWidth}
        maxHeight={window.innerHeight}
        sheetTitle="Settings"
        showResizeHandle={true}
        className="transition-all duration-300"
      >
        {/* Sheet Content */}
        <div>
          {/* Header */}
          <div className="navbar bg-base-100 shadow-lg rounded-lg mb-8">
            <div className="flex-1">
              <Typography variant="h4" component="span" className="text-primary">
                Theme & Typography Demo
              </Typography>
            </div>
            <div className="flex-none">
              <ThemeSelector />
            </div>
          </div>

          {/* Typography Examples */}
          <div className="card bg-base-100 shadow-xl mb-8">
            <div className="card-body">
              <Typography variant="h2" className="text-primary mb-6">
                Typography Examples
              </Typography>
              <div className="space-y-4">
                <Typography variant="h1">Heading 1 - Main Title</Typography>
                <Typography variant="h2">Heading 2 - Section Title</Typography>
                <Typography variant="h3">Heading 3 - Subsection Title</Typography>
                <Typography variant="h4">Heading 4 - Article Title</Typography>
                <Typography variant="h5">Heading 5 - Paragraph Title</Typography>
                <Typography variant="h6">Heading 6 - Small Title</Typography>
                <div className="divider"></div>
                <Typography variant="body1">
                  Body 1 - This is the primary body text style used for most content. 
                  It provides excellent readability and is suitable for longer paragraphs of text.
                </Typography>
                <Typography variant="body2">
                  Body 2 - This is a smaller body text style, often used for secondary information 
                  or in contexts where space is limited.
                </Typography>
                <Typography variant="caption" className="text-base-content/70">
                  Caption - Used for image captions, footnotes, and small supplementary text.
                </Typography>
              </div>
            </div>
          </div>

          {/* Theme Colors Preview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <Typography variant="h2" className="text-primary mb-6">
                Theme Colors
              </Typography>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-primary rounded-lg"></div>
                  <Typography variant="caption">Primary</Typography>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-secondary rounded-lg"></div>
                  <Typography variant="caption">Secondary</Typography>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-accent rounded-lg"></div>
                  <Typography variant="caption">Accent</Typography>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-16 h-16 bg-neutral rounded-lg"></div>
                  <Typography variant="caption">Neutral</Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </InfinitySheet>
    </div>
  );
};