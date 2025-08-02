import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Database, 
  Zap, 
  Globe, 
  Lock,
  Settings,
  Code,
  BarChart3,
  CheckCircle,
  Star,
  Github,
  ExternalLink,
  Monitor,
  Smartphone,
  Palette,
  Type,
  Eye,
  MousePointer,
  Infinity
} from 'lucide-react';

// Mock theme data
const themes = [
  { name: 'light', displayName: 'Light Default', isDark: false },
  { name: 'dark', displayName: 'Dark Mode', isDark: true },
  { name: 'cupcake', displayName: 'Cupcake', isDark: false },
  { name: 'bumblebee', displayName: 'Bumblebee', isDark: false },
  { name: 'emerald', displayName: 'Emerald', isDark: false },
  { name: 'corporate', displayName: 'Corporate', isDark: false },
  { name: 'synthwave', displayName: 'Synthwave', isDark: true },
  { name: 'retro', displayName: 'Retro', isDark: false },
  { name: 'cyberpunk', displayName: 'Cyberpunk', isDark: true },
  { name: 'valentine', displayName: 'Valentine', isDark: false },
  { name: 'halloween', displayName: 'Halloween', isDark: true },
  { name: 'garden', displayName: 'Garden', isDark: false },
  { name: 'forest', displayName: 'Forest', isDark: true },
  { name: 'aqua', displayName: 'Aqua', isDark: true },
  { name: 'lofi', displayName: 'Lo-Fi', isDark: false },
  { name: 'pastel', displayName: 'Pastel', isDark: false },
  { name: 'fantasy', displayName: 'Fantasy', isDark: false },
  { name: 'wireframe', displayName: 'Wireframe', isDark: false },
  { name: 'black', displayName: 'Black', isDark: true },
  { name: 'luxury', displayName: 'Luxury', isDark: true },
  { name: 'dracula', displayName: 'Dracula', isDark: true },
  { name: 'cmyk', displayName: 'CMYK', isDark: false },
  { name: 'autumn', displayName: 'Autumn', isDark: false },
  { name: 'business', displayName: 'Business', isDark: false },
  { name: 'acid', displayName: 'Acid', isDark: false },
  { name: 'lemonade', displayName: 'Lemonade', isDark: false },
  { name: 'night', displayName: 'Night', isDark: true },
  { name: 'coffee', displayName: 'Coffee', isDark: true },
  { name: 'winter', displayName: 'Winter', isDark: false },
  { name: 'dim', displayName: 'Dim', isDark: true }
];

export default function InfinityDashboardLanding() {
  const [currentTheme, setCurrentTheme] = useState('light');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">

      {/* Hero Section */}
      <HeroSection />

      {/* Dynamic Theme Showcase */}
      <ThemeShowcaseSection onThemeChange={setCurrentTheme} />

      {/* Features Overview */}
      <FeaturesSection />

      {/* RBAC System Explanation */}
      <RBACSection />

      {/* Typography & UI Components */}
      <TypographySection />

      {/* Technology Stack */}
      <TechnologySection />

      {/* Getting Started */}
      <GettingStartedSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}

// Hero Section Component
const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        
        {/* Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon 
                points="30,4 52,16 52,36 30,48 8,36 8,16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-primary"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      <div className="hero-content text-center relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="space-y-12">
          {/* Logo and Brand */}
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-2xl opacity-30">
                  <Infinity size={120} className="text-primary" />
                </div>
                <Infinity size={120} className="relative text-primary drop-shadow-2xl" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Infinity Dashboard
              </h1>
              <h2 className="text-2xl md:text-3xl text-base-content/80 font-light">
                Dynamic • Customizable • Enterprise-Ready
              </h2>
            </div>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in animation-delay-200">
            {[
              "30+ Themes", 
              "Dynamic RBAC", 
              "Typography Control", 
              "Real-time Updates",
              "Enterprise Security",
              "Mobile Responsive"
            ].map((feature, index) => (
              <span key={index} className="badge badge-ghost badge-lg px-4 py-2 text-sm font-medium">
                {feature}
              </span>
            ))}
          </div>

          {/* Main Description */}
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in animation-delay-400">
            <h3 className="text-xl md:text-2xl text-base-content/90 leading-relaxed">
              A comprehensive React + FastAPI application featuring dynamic theming, 
              advanced typography controls, and enterprise-grade Role-Based Access Control (RBAC).
            </h3>
            
            <p className="text-lg text-base-content/70 max-w-3xl mx-auto">
              Built with modern technologies and best practices, Infinity Dashboard provides 
              everything you need for scalable, secure, and beautiful web applications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animation-delay-600">
            <button className="btn btn-primary btn-lg group">
              <span>Explore Dashboard</span>
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="btn btn-secondary btn-outline btn-lg">
              <Shield size={20} className="mr-2" />
              Sign In
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-in animation-delay-800">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-primary">30+</div>
              <div className="text-base-content/60">Themes</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-secondary">50+</div>
              <div className="text-base-content/60">Components</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-base-content/60">Responsive</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-info">∞</div>
              <div className="text-base-content/60">Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dynamic Theme Showcase Component
const ThemeShowcaseSection = ({ onThemeChange }: any) => {
  return (
    <section className="py-20 bg-base-200 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🎨 Dynamic Theme System
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Experience our revolutionary scroll-based theme switching. Scroll through this section 
            to see themes change in real-time!
          </p>
        </div>

        <ScrollThemeShowcase onThemeChange={onThemeChange} />

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <Palette className="w-12 h-12 text-primary mx-auto" />
              <h3 className="card-title justify-center">30+ Themes</h3>
              <p className="text-base-content/70">
                From dark corporate themes to vibrant creative palettes, choose from our extensive collection.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <Eye className="w-12 h-12 text-secondary mx-auto" />
              <h3 className="card-title justify-center">Real-time Preview</h3>
              <p className="text-base-content/70">
                See changes instantly across your entire application without page reloads.
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <Settings className="w-12 h-12 text-accent mx-auto" />
              <h3 className="card-title justify-center">Persistent Settings</h3>
              <p className="text-base-content/70">
                Your theme preferences are saved and synchronized across all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Scroll-based Theme Showcase Component
const ScrollThemeShowcase = ({ onThemeChange } : any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress within the component
      const scrollStart = rect.top;
      const scrollEnd = rect.bottom - windowHeight;
      
      if (scrollStart <= 0 && scrollEnd >= 0) {
        const progress = Math.abs(scrollStart) / (rect.height - windowHeight);
        const clampedProgress = Math.max(0, Math.min(progress, 1));
        setScrollProgress(clampedProgress);
        
        const themeIndex = Math.floor(clampedProgress * themes.length);
        const clampedIndex = Math.max(0, Math.min(themeIndex, themes.length - 1));
        
        if (clampedIndex !== currentThemeIndex) {
          setCurrentThemeIndex(clampedIndex);
          onThemeChange(themes[clampedIndex].name);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentThemeIndex, onThemeChange]);

  return (
    <div ref={containerRef} className="h-[300vh] relative">
      {/* Fixed Theme Showcase */}
      <div className="sticky top-20 mx-auto max-w-4xl z-10">
        <div className="card bg-base-100 shadow-2xl border border-base-300">
          <div className="card-body p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Theme Preview */}
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-primary mb-2">
                    {themes[currentThemeIndex]?.displayName}
                  </h3>
                  <span className={`badge ${themes[currentThemeIndex]?.isDark ? "badge-secondary" : "badge-primary"}`}>
                    {themes[currentThemeIndex]?.isDark ? "Dark Theme" : "Light Theme"}
                  </span>
                </div>

                {/* Color Palette */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-primary rounded-lg shadow-lg"></div>
                    <div className="text-center text-xs">Primary</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-secondary rounded-lg shadow-lg"></div>
                    <div className="text-center text-xs">Secondary</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-accent rounded-lg shadow-lg"></div>
                    <div className="text-center text-xs">Accent</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-neutral rounded-lg shadow-lg"></div>
                    <div className="text-center text-xs">Neutral</div>
                  </div>
                </div>

                {/* Sample Components */}
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button className="btn btn-primary btn-sm">Primary</button>
                    <button className="btn btn-secondary btn-sm">Secondary</button>
                    <button className="btn btn-accent btn-sm">Accent</button>
                  </div>
                  <progress className="progress progress-primary w-full" value="65" max="100"></progress>
                  <div className="flex gap-2">
                    <span className="badge badge-primary">Success</span>
                    <span className="badge badge-secondary">Warning</span>
                    <span className="badge badge-accent">Info</span>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator */}
              <div className="space-y-6">
                <div className="text-center">
                  <MousePointer className="w-8 h-8 text-primary mx-auto mb-2 animate-bounce" />
                  <p className="text-base-content/70">
                    Keep scrolling to see themes change automatically!
                  </p>
                </div>

                {/* Theme Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Theme Progress</span>
                    <span>{currentThemeIndex + 1} of {themes.length}</span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={scrollProgress * 100} 
                    max="100"
                  ></progress>
                </div>

                {/* Theme List */}
                <div className="max-h-40 overflow-y-auto space-y-1 bg-base-200 rounded-lg p-3">
                  {themes.map((theme, index) => (
                    <div 
                      key={theme.name}
                      className={`flex items-center justify-between p-2 rounded transition-colors ${
                        index === currentThemeIndex 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-base-300'
                      }`}
                    >
                      <span className="text-sm font-medium">
                        {theme.displayName}
                      </span>
                      {index === currentThemeIndex && (
                        <CheckCircle size={16} className="text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-base-content/60">
            💡 Tip: Use the settings button (top-right) to manually select themes and customize typography
          </p>
        </div>
      </div>
    </div>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "JWT authentication, password hashing, rate limiting, and comprehensive security headers.",
      highlights: ["JWT Tokens", "bcrypt Hashing", "Rate Limiting", "CORS Protection"]
    },
    {
      icon: Users,
      title: "Dynamic RBAC System",
      description: "Create roles and permissions on-demand without hardcoding. Full user lifecycle management.",
      highlights: ["Dynamic Roles", "Granular Permissions", "User Management", "Role Inheritance"]
    },
    {
      icon: Database,
      title: "Advanced Database",
      description: "PostgreSQL with SQLAlchemy ORM, migrations, connection pooling, and audit trails.",
      highlights: ["PostgreSQL", "Migrations", "Connection Pooling", "Audit Logs"]
    },
    {
      icon: Zap,
      title: "Performance Optimized",
      description: "Optimized Docker builds, caching, health checks, and production-ready configurations.",
      highlights: ["Docker Ready", "Health Checks", "Caching", "Monitoring"]
    },
    {
      icon: Globe,
      title: "API Excellence",
      description: "RESTful APIs with auto-documentation, validation, pagination, and comprehensive error handling.",
      highlights: ["Swagger UI", "Validation", "Pagination", "Error Handling"]
    },
    {
      icon: Code,
      title: "Developer Experience",
      description: "Hot reloading, comprehensive testing, CI/CD ready, and extensive documentation.",
      highlights: ["Hot Reload", "Testing", "CI/CD", "Documentation"]
    }
  ];

  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🚀 Comprehensive Feature Set
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Everything you need for building modern, scalable, and secure web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="card-body space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="card-title text-lg">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-base-content/70">
                  {feature.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {feature.highlights.map((highlight, hIndex) => (
                    <span key={hIndex} className="badge badge-ghost text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// RBAC System Explanation
const RBACSection = () => {
  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              🛡️ Dynamic RBAC System
            </h2>
            <p className="text-lg text-base-content/70">
              Our Role-Based Access Control system allows you to create roles and permissions 
              dynamically without hardcoding. Perfect for enterprise applications that need 
              flexible security models.
            </p>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Dynamic Role Creation</div>
                  <div className="text-sm text-base-content/60">
                    Create roles on-demand via API without code changes
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Granular Permissions</div>
                  <div className="text-sm text-base-content/60">
                    Fine-grained access control with resource:action format
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-success mt-1 flex-shrink-0" />
                <div>
                  <div className="font-medium">Role Hierarchies</div>
                  <div className="text-sm text-base-content/60">
                    Support for role inheritance and hierarchical permissions
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-primary">
              <ExternalLink size={16} className="mr-2" />
              View API Documentation
            </button>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Permission Matrix Example</h3>
              <div className="overflow-x-auto">
                <table className="table table-compact w-full">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>User:Read</th>
                      <th>User:Create</th>
                      <th>Role:Manage</th>
                      <th>System:Admin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-medium">Super Admin</td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                    </tr>
                    <tr>
                      <td className="font-medium">Admin</td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td className="font-medium">Manager</td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                    <tr>
                      <td className="font-medium">User</td>
                      <td><CheckCircle className="w-4 h-4 text-success" /></td>
                      <td>❌</td>
                      <td>❌</td>
                      <td>❌</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Typography Section
const TypographySection = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            ✍️ Advanced Typography System
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Complete control over fonts, sizing, spacing, and readability with real-time preview
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center space-y-3">
                  <Type className="w-8 h-8 text-primary mx-auto" />
                  <h3 className="card-title justify-center text-base">Font Families</h3>
                  <p className="text-sm text-base-content/70">
                    Inter, Poppins, Playfair, Fira Code and more
                  </p>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center space-y-3">
                  <Settings className="w-8 h-8 text-secondary mx-auto" />
                  <h3 className="card-title justify-center text-base">Live Controls</h3>
                  <p className="text-sm text-base-content/70">
                    Real-time font scaling and spacing adjustments
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Typography Features:</h3>
              <ul className="space-y-2">
                {[
                  "Dynamic font scaling (0.5x to 2x)",
                  "Adjustable line height and letter spacing", 
                  "Word spacing customization",
                  "Font weight scaling",
                  "Real-time preview across all components",
                  "Persistent settings across sessions"
                ].map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-success mt-1 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body space-y-6">
              <h3 className="card-title justify-center">Typography Preview</h3>
              
              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-primary mb-2">Heading 1</h1>
                  <p className="text-xs text-base-content/60">Perfect for page titles and main headers</p>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-secondary mb-2">Heading 2</h2>
                  <p className="text-xs text-base-content/60">Great for section headers and important content</p>
                </div>
                
                <div>
                  <p className="text-base mb-2">Body Text</p>
                  <p className="text-xs text-base-content/60">Standard paragraph text with optimal readability</p>
                </div>
                
                <div>
                  <p className="text-sm mb-2">Secondary Text</p>
                  <p className="text-xs text-base-content/60">Smaller text for supporting information</p>
                </div>

                <div className="divider"></div>

                <div className="text-center">
                  <p className="text-sm text-base-content/70">
                    🎨 Use the settings panel to customize typography in real-time!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Technology Section
const TechnologySection = () => {
  const technologies = {
    frontend: [
      { name: "React 18", description: "Modern React with hooks and concurrent features" },
      { name: "TypeScript", description: "Type-safe development experience" },
      { name: "Tailwind CSS", description: "Utility-first CSS framework" },
      { name: "DaisyUI", description: "Beautiful component library" },
      { name: "Zustand", description: "Lightweight state management" },
      { name: "React Router", description: "Client-side routing" }
    ],
    backend: [
      { name: "FastAPI", description: "Modern, fast Python web framework" },
      { name: "PostgreSQL", description: "Advanced open source database" },
      { name: "SQLAlchemy", description: "Python SQL toolkit and ORM" },
      { name: "Pydantic", description: "Data validation using type hints" },
      { name: "JWT", description: "Secure token-based authentication" },
      { name: "bcrypt", description: "Password hashing library" }
    ],
    devops: [
      { name: "Docker", description: "Containerization platform" },
      { name: "Docker Compose", description: "Multi-container orchestration" },
      { name: "pgAdmin", description: "Database management interface" },
      { name: "Alembic", description: "Database migration tool" },
      { name: "pytest", description: "Testing framework" },
      { name: "GitHub Actions", description: "CI/CD automation" }
    ]
  };

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            ⚡ Modern Technology Stack
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Built with cutting-edge technologies for performance, scalability, and developer experience
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-center mb-6">
                <Monitor className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="card-title justify-center">Frontend</h3>
              </div>
              <div className="space-y-3">
                {technologies.frontend.map((tech, index) => (
                  <div key={index} className="space-y-1">
                    <div className="font-medium text-sm">{tech.name}</div>
                    <div className="text-xs text-base-content/60">{tech.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-center mb-6">
                <Database className="w-12 h-12 text-secondary mx-auto mb-3" />
                <h3 className="card-title justify-center">Backend</h3>
              </div>
              <div className="space-y-3">
                {technologies.backend.map((tech, index) => (
                  <div key={index} className="space-y-1">
                    <div className="font-medium text-sm">{tech.name}</div>
                    <div className="text-xs text-base-content/60">{tech.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="text-center mb-6">
                <Code className="w-12 h-12 text-accent mx-auto mb-3" />
                <h3 className="card-title justify-center">DevOps</h3>
              </div>
              <div className="space-y-3">
                {technologies.devops.map((tech, index) => (
                  <div key={index} className="space-y-1">
                    <div className="font-medium text-sm">{tech.name}</div>
                    <div className="text-xs text-base-content/60">{tech.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Getting Started Section
const GettingStartedSection = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🚀 Get Started Today
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Ready to build something amazing? Choose your path and start exploring Infinity Dashboard
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card bg-base-100 shadow-xl text-center group hover:shadow-2xl transition-all duration-300">
            <div className="card-body space-y-4">
              <div className="avatar">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="card-title justify-center">Try the Demo</h3>
              <p className="text-base-content/70">
                Explore the dashboard with demo credentials and see all features in action
              </p>
              <div className="card-actions justify-center">
                <button className="btn btn-primary btn-block">
                  Demo Login
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl text-center group hover:shadow-2xl transition-all duration-300">
            <div className="card-body space-y-4">
              <div className="avatar">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
              </div>
              <h3 className="card-title justify-center">Create Account</h3>
              <p className="text-base-content/70">
                Register for a full account and customize your dashboard experience
              </p>
              <div className="card-actions justify-center">
                <button className="btn btn-secondary btn-block">
                  Sign Up Free
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl text-center group hover:shadow-2xl transition-all duration-300">
            <div className="card-body space-y-4">
              <div className="avatar">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
                  <Github className="w-8 h-8 text-accent" />
                </div>
              </div>
              <h3 className="card-title justify-center">View Source</h3>
              <p className="text-base-content/70">
                Check out the code, contribute, or use it as a template for your projects
              </p>
              <div className="card-actions justify-center">
                <button className="btn btn-accent btn-outline btn-block">
                  <Github size={16} className="mr-2" />
                  GitHub
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Start Code */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title justify-center mb-4">
                🐳 Quick Start with Docker
              </h3>
              <div className="mockup-code">
                <pre data-prefix="$"><code className="text-success"># Clone the repository</code></pre>
                <pre data-prefix="$"><code>git clone &lt;repository-url&gt;</code></pre>
                <pre data-prefix="$"><code>cd infinity-dashboard</code></pre>
                <pre data-prefix="$"><code className="text-success"># Start with Docker</code></pre>
                <pre data-prefix="$"><code>docker-compose up --build</code></pre>
                <pre data-prefix="$"><code className="text-success"># Access the application</code></pre>
                <pre data-prefix="$"><code className="text-primary">http://localhost:3000 - Frontend</code></pre>
                <pre data-prefix="$"><code className="text-primary">http://localhost:8000 - Backend API</code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Section
const FooterSection = () => {
  return (
    <footer className="bg-base-300 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Infinity size={32} />
              <h3 className="text-xl font-bold">Infinity</h3>
            </div>
            <p className="text-sm text-base-content/70">
              Enterprise-grade dashboard with dynamic theming and advanced RBAC system.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary">Dynamic Themes</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">RBAC System</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Typography Control</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">API Documentation</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/docs" className="text-base-content/70 hover:text-primary">API Docs</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">GitHub</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Documentation</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary">Examples</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Connect</h3>
            <div className="flex space-x-3">
              <a href="#" className="text-base-content/70 hover:text-primary">
                <Github size={20} />
              </a>
              <a href="#" className="text-base-content/70 hover:text-primary">
                <Star size={20} />
              </a>
              <a href="#" className="text-base-content/70 hover:text-primary">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="text-center">
          <p className="text-sm text-base-content/60">
            © 2024 Infinity Dashboard. Built with ❤️ using React, FastAPI, and modern web technologies.
          </p>
        </div>
      </div>
    </footer>
  );
};