import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Users, 
  Database,
  Settings,
  Star,
  Github,
  ExternalLink,
  Palette,
  Eye,
  Layout,
  Layers,
  Rainbow,
  Scroll,
  User,
  FileText,
  CheckCircle,
  Code,
  Activity,
  BookOpen,
  Download,
  Play,
  Brush,
  Smartphone,
  TabletSmartphone,
  Laptop,
  MousePointer,
  Type,
  Grid,
  Component
} from 'lucide-react';
import { themes } from '@/themes';
import { InfinityLogo } from '@/components';

export function InfinityDashboardLanding() {
  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden relative">
      {/* <div className="h-screen overflow-y-auto"> */}
        <HeroSection />
        <DashboardFeaturesSection />
        <ScrollSensitiveThemeShowcase />
        <UIComponentsSection />
        <AdminFeaturesSection />
        <ResponsiveDesignSection />
        <CustomizationSection />
        <GettingStartedSection />
        <FooterSection />
      {/* </div> */}
    </div>
  );
}

// Enhanced Hero Section for Dashboard
const HeroSection = () => {
  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        
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
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <InfinityLogo size={120} />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-courgette py-2 pt-4">
                Infinity
              </h1>
              <h2 className="text-xl md:text-2xl text-base-content/80 font-light">
                Dynamic theming admin panel with 30+ themes & comprehensive UI library
              </h2>
            </div>
          </div>

          {/* Key Value Props */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "🎨 30+ Beautiful Themes",
              "🌗 Light & Dark Modes", 
              "⚡ Real-time Theme Switching",
              "📱 Fully Responsive",
              "🧩 50+ UI Components",
              "🎛️ Advanced Settings Panel",
              "🔧 Customizable Typography",
              "✨ Smooth Animations"
            ].map((feature, index) => (
              <span key={index} className="badge badge-ghost badge-lg px-4 py-2 text-sm font-medium">
                {feature}
              </span>
            ))}
          </div>

          {/* Main Description */}
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-lg text-base-content/80 mx-auto max-w-3xl">
              A powerful admin dashboard built with <strong>React</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong> featuring dynamic theming, comprehensive UI components, and an intuitive settings panel.
            </p>
            <p className="text-base-content/70 mx-auto max-w-2xl">
              Experience seamless theme switching, responsive design, and a complete component library - everything you need for modern web applications.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/infinity/dashboard" className="btn btn-primary btn-lg gap-2">
              <Play className="w-5 h-5" />
              Try Dashboard
            </a>
            <a className="btn btn-outline btn-lg gap-2">
              <Github className="w-5 h-5" />
              View Source
            </a>
            <a className="btn btn-ghost btn-lg gap-2">
              <BookOpen className="w-5 h-5" />
              Components Docs
            </a>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">30+</div>
              <div className="text-sm text-base-content/70">Themes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">50+</div>
              <div className="text-sm text-base-content/70">UI Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">100%</div>
              <div className="text-sm text-base-content/70">Responsive</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-info">TypeScript</div>
              <div className="text-sm text-base-content/70">Ready</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-base-content/60">
              <Scroll className="w-5 h-5" />
              <span className="text-sm">Scroll to experience live theme switching</span>
            </div>
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-base-content/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-base-content/60 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Keep your existing ScrollSensitiveThemeShowcase component exactly as is
const ScrollSensitiveThemeShowcase = ({ onThemeChange }: any) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isThemeScrolling, setIsThemeScrolling] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const scrollDeltaRef = useRef(0);

  // Intersection Observer to detect if section is fully in viewport
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        // Only activate when the entire component is fully visible
        setIsActive(entry.intersectionRatio >= 0.95);
        if (entry.intersectionRatio >= 0.95) {
          setIsThemeScrolling(true);
          setCurrentThemeIndex(0);
        } else {
          setIsThemeScrolling(false);
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95, 1.0] }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Handle scroll-based theme changing with scroll lock
  useEffect(() => {
    if (!isActive) return;

    const DELTA_PER_THEME = 80; // Adjust this value for sensitivity (higher = slower)

    const handleWheel = (e: WheelEvent) => {
      if (!isThemeScrolling) return;

      e.preventDefault();

      scrollDeltaRef.current += e.deltaY;

      // Forward scroll (down) - move to next theme
      while (scrollDeltaRef.current >= DELTA_PER_THEME) {
        setCurrentThemeIndex(prev => {
          const newIndex = prev + 1;
          
          // If we've reached beyond the last theme, exit theme scrolling
          if (newIndex >= themes.length) {
            setIsThemeScrolling(false);
            document.body.style.overflow = 'auto';
            return prev; // Keep the last theme
          }
          return newIndex;
        });
        scrollDeltaRef.current -= DELTA_PER_THEME;
      }

      // Backward scroll (up) - move to previous theme
      while (scrollDeltaRef.current <= -DELTA_PER_THEME) {
        setCurrentThemeIndex(prev => {
          const newIndex = prev - 1;
          
          // If we've gone before the first theme, exit theme scrolling
          if (newIndex < 0) {
            setIsThemeScrolling(false);
            document.body.style.overflow = 'auto';
            return prev; // Keep the first theme
          }
          return newIndex;
        });
        scrollDeltaRef.current += DELTA_PER_THEME;
      }
    };

    const handleScroll = (e: Event) => {
      if (isThemeScrolling) e.preventDefault();
    };

    if (isThemeScrolling) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('wheel', handleWheel, { passive: false });
      window.addEventListener('scroll', handleScroll, { passive: false });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      scrollDeltaRef.current = 0;
    };
  }, [isActive, isThemeScrolling, currentThemeIndex, onThemeChange]);

  return (
    <section
      ref={sectionRef}
      data-theme={themes[currentThemeIndex].name}
      className={`min-h-screen bg-base-100 relative ${isThemeScrolling ? 'fixed inset-0 z-40' : ''}`}
    >
      <div className={`${isThemeScrolling ? 'overflow-hidden flex items-center justify-center' : 'min-h-screen'}`}>
        <div className="col-start-1 row-start-1 flex items-center justify-center gap-6">
          <div className="border-base-200 flex w-full items-stretch justify-center mt-24 gap-6 rounded-2xl border p-6 max-w-7xl">
            
            {/* Left Sidebar - Menu */}
            <div className="hidden flex-col gap-6 xl:flex">
              <div className="flex gap-6">
                {/* Icon Menu */}
                <div className="rounded-box bg-base-200 h-full">
                  <ul className="menu">
                    <li className="menu-title">
                      <Layers className="w-5 h-5" />
                    </li>
                    <li><button className="active"><Layout className="w-5 h-5" /></button></li>
                    <li><button><Shield className="w-5 h-5" /></button></li>
                    <li><button><Users className="w-5 h-5" /></button></li>
                    <li><button><Database className="w-5 h-5" /></button></li>
                    <li><button><Settings className="w-5 h-5" /></button></li>
                  </ul>
                </div>

                {/* Main Menu */}
                <div className="rounded-box bg-base-200 h-full w-60 shrink-0">
                  <ul className="menu w-full">
                    <li className="menu-title">Theme Control</li>
                    <li><button className="active"><Layout className="w-5 h-5" /> Dashboard</button></li>
                    <li><button><Palette className="w-5 h-5" /> Themes</button></li>
                    <li><button><Eye className="w-5 h-5" /> Preview</button></li>
                    <li><button><Settings className="w-5 h-5" /> Settings</button></li>
                    <li>
                      <button>
                        <Rainbow className="w-5 h-5" /> 
                        Colors 
                        <span className="badge badge-info">{themes.length}</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Button Grid */}
              <div className="rounded-box bg-base-200 grid grow grid-cols-2 gap-4 p-6">
                <button className="btn btn-neutral">Neutral</button>
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
              </div>
            </div>

            {/* Center Content */}
            <div className="flex grow flex-col gap-6">
              {/* Top Navigation */}
              <div className="navbar bg-base-200 rounded-box">
                <div className="grow">
                  <button className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-content flex items-center justify-center mt-2 font-bold"><User className="w-5 h-5" /></span>
                    </div>
                  </button>
                </div>
                <ul className="menu menu-sm menu-horizontal rounded-box">
                  <li>
                    <button>
                      <Layout className="h-5 w-5" />
                      Themes 
                      <span className="badge badge-sm hidden md:flex">{themes.length}+</span>
                    </button>
                  </li>
                  <li>
                    <button>
                      Updates 
                      <span className="badge badge-sm badge-warning hidden md:flex">NEW</span>
                    </button>
                  </li>
                  <li>
                    <button>
                      Stats 
                      <span className="badge badge-xs badge-info hidden md:flex"></span>
                    </button>
                  </li>
                </ul>
              </div>

              {/* Main Content Area */}
              <div className="rounded-box flex grow flex-col px-6 pt-12 pb-8 text-center">
                <div className="font-title text-[clamp(1.5rem,6vw,3rem)] leading-none font-black">
                  {themes[currentThemeIndex]?.displayName} Theme
                </div>
                <p className="font-title font-light md:text-3xl lg:text-4xl">
                  Theme {currentThemeIndex + 1} of {themes.length}
                </p>
                <div className="h-4"></div>
                <p className="text-base-content/80 mx-auto max-w-lg font-sans text-sm font-light">
                  {isThemeScrolling 
                    ? "Scroll your mouse wheel to cycle through themes. The page won't scroll until you finish viewing all themes."
                    : "Theme switching complete! Regular scrolling is now enabled."
                  }
                </p>
                <div className="h-4"></div>
                <div>
                  <div className="btn btn-wide btn-primary">
                    Current: {themes[currentThemeIndex]?.displayName}
                  </div>
                </div>
              </div>

              {/* Form Elements Showcase */}
              <div className="card bg-base-200">
                <div className="card-body">
                  <div className="flex h-full items-center justify-center flex-wrap gap-6">
                    <input type="checkbox" className="toggle pointer-events-none" defaultChecked />
                    <input type="checkbox" className="toggle toggle-primary pointer-events-none" defaultChecked />
                    <input type="checkbox" className="toggle toggle-secondary pointer-events-none" defaultChecked />
                    <input type="checkbox" className="toggle toggle-accent pointer-events-none" defaultChecked />
                    <input type="checkbox" className="checkbox pointer-events-none" defaultChecked />
                    <input type="checkbox" className="checkbox checkbox-primary pointer-events-none" defaultChecked />
                    <input type="checkbox" className="checkbox checkbox-secondary pointer-events-none" defaultChecked />
                    <input type="checkbox" className="checkbox checkbox-accent pointer-events-none" defaultChecked />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Color Palette */}
            <div className="hidden xl:flex rounded-box bg-base-200 card h-full w-80 shrink-0">
              <div className="card-body">
                <div className="card-title mb-4 text-sm">Semantic colors</div>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'primary', class: 'bg-primary' },
                    { name: 'secondary', class: 'bg-secondary' },
                    { name: 'accent', class: 'bg-accent' },
                    { name: 'neutral', class: 'bg-neutral' },
                    { name: 'primary content', class: 'bg-primary-content' },
                    { name: 'secondary content', class: 'bg-secondary-content' },
                    { name: 'accent content', class: 'bg-accent-content' },
                    { name: 'neutral content', class: 'bg-neutral-content' },
                    { name: 'base 100', class: 'bg-base-100' },
                    { name: 'base 200', class: 'bg-base-200' },
                    { name: 'base 300', class: 'bg-base-300' },
                    { name: 'base content', class: 'bg-base-content' },
                    { name: 'info', class: 'bg-info' },
                    { name: 'success', class: 'bg-success' },
                    { name: 'warning', class: 'bg-warning' },
                    { name: 'error', class: 'bg-error' },
                    { name: 'info content', class: 'bg-info-content' },
                    { name: 'success content', class: 'bg-success-content' },
                    { name: 'warning content', class: 'bg-warning-content' },
                    { name: 'error content', class: 'bg-error-content' }
                  ].map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div className={`${color.class} aspect-square w-10 transition-all duration-500`}></div>
                      <div className="text-base-content/60 text-center text-[.6rem]">
                        {color.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="btn btn-block">
                    Learn more about colors
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dashboard Features Section
const DashboardFeaturesSection = () => {
  const features = [
    {
      icon: Palette,
      title: "Dynamic Theming",
      description: "Switch between 30+ beautiful themes with real-time preview and instant application.",
      highlights: ["Live Preview", "30+ Themes", "Light & Dark", "Instant Switch"],
      color: "text-purple-500"
    },
    {
      icon: Settings,
      title: "Advanced Settings Panel", 
      description: "Comprehensive settings panel with theme customization, typography controls, and preferences.",
      highlights: ["Theme Selector", "Font Controls", "Live Preview", "Export Settings"],
      color: "text-blue-500"
    },
    {
      icon: Layout,
      title: "Responsive Layout",
      description: "Fully responsive dashboard that works perfectly on desktop, tablet, and mobile devices.",
      highlights: ["Mobile First", "Adaptive Design", "Touch Friendly", "Cross Browser"],
      color: "text-green-500"
    },
    {
      icon: Component,
      title: "Component Library",
      description: "50+ pre-built UI components with TypeScript support and comprehensive documentation.",
      highlights: ["50+ Components", "TypeScript", "Documented", "Customizable"],
      color: "text-orange-500"
    }
  ];

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🎨 Dashboard Features
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            A modern admin dashboard with powerful theming capabilities and comprehensive UI components
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="card-body space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
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

// UI Components Section
const UIComponentsSection = () => {
  const componentCategories = [
    {
      title: "Form Components",
      icon: FileText,
      components: ["Button", "Input", "Select", "Textarea", "Checkbox", "Radio", "Toggle", "Range", "Rating", "File Input"],
      description: "Complete form controls with validation"
    },
    {
      title: "Layout Components",
      icon: Layout,
      components: ["Card", "Modal", "Drawer", "Collapse", "Tabs", "Accordion", "Divider", "Hero", "Stats"],
      description: "Structure your content beautifully"
    },
    {
      title: "Navigation Components",
      icon: MousePointer,
      components: ["Menu", "Navbar", "Sidebar", "Breadcrumbs", "Pagination", "Steps", "Dropdown"],
      description: "Guide users through your application"
    },
    {
      title: "Data Display",
      icon: Grid,
      components: ["Alert", "Badge", "Avatar", "Tooltip", "Progress", "Loading", "Countdown", "Table"],
      description: "Present information effectively"
    },
    {
      title: "Feedback Components",
      icon: Activity,
      components: ["Toast", "Skeleton", "Progress Bar", "Spinner", "Alert Dialog", "Confirmation"],
      description: "Communicate status and actions"
    },
    {
      title: "Typography & Text",
      icon: Type,
      components: ["Typography", "Text Styles", "Headings", "Labels", "Captions", "Code Blocks"],
      description: "Beautiful text presentation"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Component className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            🧩 Comprehensive UI Library
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            50+ carefully designed components built with TypeScript, fully documented, and ready to use
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {componentCategories.map((category, index) => (
            <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="card-title text-lg">{category.title}</h3>
                </div>
                
                <p className="text-base-content/70 mb-4 text-sm">{category.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {category.components.slice(0, 6).map((component, idx) => (
                    <span key={idx} className="badge badge-ghost text-xs">
                      {component}
                    </span>
                  ))}
                  {category.components.length > 6 && (
                    <span className="badge badge-primary text-xs">
                      +{category.components.length - 6} more
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs text-base-content/60">
                  <span>{category.components.length} components</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-success" />
                    TypeScript
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-primary gap-2">
              <BookOpen className="w-4 h-4" />
              Component Documentation
            </button>
            <button className="btn btn-outline gap-2">
              <Code className="w-4 h-4" />
              View Source Code
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Admin Features Section
const AdminFeaturesSection = () => {
  const adminFeatures = [
    {
      title: "User Management",
      icon: Users,
      description: "Complete user administration with roles and permissions",
      features: ["User List", "Role Assignment", "Permission Control", "Bulk Actions"]
    },
    {
      title: "Dashboard Analytics",
      icon: Activity,
      description: "Real-time analytics and monitoring dashboard",
      features: ["Live Charts", "Performance Metrics", "User Statistics", "System Health"]
    },
    {
      title: "Settings Management",
      icon: Settings,
      description: "Comprehensive application settings and configuration",
      features: ["Theme Settings", "System Config", "User Preferences", "API Settings"]
    },
    {
      title: "Content Management",
      icon: FileText,
      description: "Manage application content and resources",
      features: ["File Upload", "Media Library", "Content Editor", "Version Control"]
    }
  ];

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Shield className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            🛡️ Admin Panel Features
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Powerful administration tools built for modern web applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {adminFeatures.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                  <h3 className="card-title text-lg">{feature.title}</h3>
                </div>
                <p className="text-base-content/70 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Responsive Design Section
const ResponsiveDesignSection = () => {
  return (
    <section className="py-20 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            📱 Responsive Design
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Perfect experience across all devices - desktop, tablet, and mobile
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
                <p className="text-base-content/70">Designed with mobile devices in mind, ensuring perfect usability on small screens.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <TabletSmartphone className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Tablet Optimized</h3>
                <p className="text-base-content/70">Adaptive layouts that make full use of tablet screen real estate.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Laptop className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Desktop Ready</h3>
                <p className="text-base-content/70">Full-featured desktop experience with advanced layouts and interactions.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center lg:col-span-2">
            <div className="relative">
              {/* Desktop */}
              <div className="bg-base-200 p-6 rounded-lg shadow-xl">
                <div className="bg-base-100 rounded border h-48 w-64 md:h-64 md:w-80 relative overflow-hidden">
                  <div className="h-8 bg-primary/20 flex items-center px-3 gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-error"></div>
                      <div className="w-2 h-2 rounded-full bg-warning"></div>
                      <div className="w-2 h-2 rounded-full bg-success"></div>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-primary/30 rounded w-3/4"></div>
                    <div className="h-3 bg-base-200 rounded w-1/2"></div>
                    <div className="h-3 bg-base-200 rounded w-2/3"></div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      <div className="h-12 bg-secondary/30 rounded"></div>
                      <div className="h-12 bg-accent/30 rounded"></div>
                      <div className="h-12 bg-info/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet */}
              <div className="absolute -bottom-4 -right-4 bg-base-200 p-4 rounded-lg shadow-lg">
                <div className="bg-base-100 rounded border h-24 w-16 md:h-32 md:w-24 relative overflow-hidden">
                  <div className="p-2 space-y-1">
                    <div className="h-2 bg-primary/30 rounded w-3/4"></div>
                    <div className="h-1 bg-base-200 rounded w-1/2"></div>
                    <div className="h-1 bg-base-200 rounded w-2/3"></div>
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <div className="h-6 bg-secondary/30 rounded"></div>
                      <div className="h-6 bg-accent/30 rounded"></div>
                      <div className="h-6 bg-info/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile */}
              <div className="absolute -bottom-8 -left-4 bg-base-200 p-3 rounded-lg shadow-lg">
                <div className="bg-base-100 rounded border h-18 w-12 md:h-24 md:w-14 relative overflow-hidden">
                  <div className="p-1 space-y-1">
                    <div className="h-1 bg-primary/30 rounded w-3/4"></div>
                    <div className="h-1 bg-base-200 rounded w-1/2"></div>
                    <div className="space-y-1 mt-1">
                      <div className="h-3 bg-secondary/30 rounded"></div>
                      <div className="h-3 bg-accent/30 rounded"></div>
                      <div className="h-3 bg-info/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Customization Section
const CustomizationSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 to-info/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Brush className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            🎛️ Advanced Customization
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Fine-tune every aspect of your dashboard with our powerful customization tools
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Type className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Typography Control</h3>
                  <p className="text-base-content/70">Customize font families, sizes, weights, and spacing with real-time preview.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Palette className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Color Customization</h3>
                  <p className="text-base-content/70">Modify theme colors, create custom palettes, and preview changes instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Layout Settings</h3>
                  <p className="text-base-content/70">Adjust sidebar behavior, navigation styles, and component spacing.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="btn btn-primary gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </button>
              <button className="btn btn-outline gap-2">
                <Download className="w-4 h-4" />
                Export Settings
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title mb-4">Settings Panel Features</h3>
              <div className="space-y-4">
                {[
                  { feature: "Theme Selector", description: "Choose from 30+ themes" },
                  { feature: "Font Family", description: "10+ font options available" },
                  { feature: "Typography Scale", description: "Adjust text sizes globally" },
                  { feature: "Color Swatches", description: "Real-time color preview" },
                  { feature: "Export/Import", description: "Save and share settings" },
                  { feature: "Reset Options", description: "Quick reset to defaults" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                    <div>
                      <span className="font-medium text-sm">{item.feature}</span>
                      <p className="text-xs text-base-content/60">{item.description}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-success" />
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
  const steps = [
    {
      step: "1",
      title: "Clone Repository",
      description: "Get the dashboard source code",
      code: "\tgit clone <repository-url>\n\tcd infinity-dashboard"
    },
    {
      step: "2", 
      title: "Install Dependencies",
      description: "Set up the development environment",
      code: "\tnpm install\n\t# or yarn install"
    },
    {
      step: "3",
      title: "Start Development",
      description: "Launch the development server",
      code: "\tnpm run dev\n\t# or yarn dev"
    },
    {
      step: "4",
      title: "Customize & Build",
      description: "Make it yours and deploy",
      code: "\tnpm run build\n\tnpm run deploy"
    }
  ];

  return (
    <section className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            🚀 Get Started Today
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Set up your dashboard in minutes and start building amazing applications
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-content font-bold">
                    {step.step}
                  </div>
                  <h3 className="card-title text-lg">{step.title}</h3>
                </div>
                <p className="text-base-content/70 mb-4">{step.description}</p>
                <div className="mockup-code">
                  <pre className="text-xs"><code>{step.code}</code></pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn btn-primary btn-lg gap-2">
              <Play className="w-5 h-5" />
              Try Dashboard
            </button>
            <button className="btn btn-outline btn-lg gap-2">
              <Github className="w-5 h-5" />
              View Source
            </button>
            <button className="btn btn-ghost btn-lg gap-2">
              <BookOpen className="w-5 h-5" />
              Documentation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Enhanced Footer Section for Dashboard
const FooterSection = () => {
  return (
    <footer className="bg-base-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <InfinityLogo size={32} />
              <h3 className="text-2xl font-bold font-courgette">Infinity</h3>
            </div>
            <p className="text-base-content/70 max-w-md">
              A modern, dynamic theming admin dashboard with 30+ themes, comprehensive UI components, and advanced customization options.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="btn btn-ghost btn-sm">
                <Github size={20} />
              </a>
              <a href="#" className="btn btn-ghost btn-sm">
                <Star size={20} />
              </a>
              <a href="#" className="btn btn-ghost btn-sm">
                <ExternalLink size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">30+ Themes</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Settings Panel</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">UI Components</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Responsive Design</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">TypeScript Support</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Components</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Form Elements</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Layout Components</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Navigation</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Data Display</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Feedback Components</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Tech Stack</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">React 18</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">TypeScript</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Tailwind CSS</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">DaisyUI</a></li>
              <li><a href="#" className="text-base-content/70 hover:text-primary transition-colors">Vite</a></li>
            </ul>
          </div>
        </div>

        <div className="divider my-8"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-base-content/60">
            © 2025 <span className="font-courgette">Infinity</span>. Built with ❤️ using React, TypeScript, and modern development practices.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-sm text-base-content/60">Made with</span>
            <div className="flex items-center gap-2">
              <span className="badge badge-primary badge-sm">React</span>
              <span className="badge badge-secondary badge-sm">TypeScript</span>
              <span className="badge badge-accent badge-sm">Tailwind</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};