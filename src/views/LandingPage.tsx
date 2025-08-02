import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Users, 
  Database, 
  Zap, 
  Settings,
  Star,
  Github,
  ExternalLink,
  Palette,
  Eye,
  Infinity,
  Layout,
  Layers,
  Rainbow,
  Scroll
} from 'lucide-react';
import { themes } from '@/themes';

export default function InfinityDashboardLanding() {
  const [currentTheme, setCurrentTheme] = useState('valentine');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden" data-theme={currentTheme}>
      {/* Hero Section */}
      <HeroSection />

      {/* Scroll-Sensitive Theme Showcase */}
      <ScrollSensitiveThemeShowcase onThemeChange={setCurrentTheme} />

      {/* Features Overview */}
      <FeaturesSection />

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
                <div className="absolute inset-0 blur-2xl opacity-30">
                  <Infinity size={120} className="text-primary" />
                </div>
                <Infinity size={120} className="relative text-primary drop-shadow-2xl" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Unlimited themes
              </h1>
              <h2 className="text-2xl md:text-3xl text-base-content/80 font-light">
                with zero effort
              </h2>
            </div>
          </div>

          {/* Key Features Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "30+ Themes", 
              "Scroll-Driven", 
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
          <div className="max-w-4xl mx-auto space-y-6">
            <p className="text-base-content/80 mx-auto max-w-lg font-sans text-sm font-light">
              daisyUI adds a set of customizable color names to Tailwind CSS and these new colors use CSS variables for the values. Using daisyUI color names, you get Dark Mode and even more themes without adding a new class name.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a className="btn btn-wide btn-primary">
              See all themes
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-base-content/60">
              <Scroll className="w-5 h-5" />
              <span className="text-sm">Scroll to experience theme magic</span>
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

// Scroll-Sensitive Theme Showcase Component (DaisyUI Style)
const ScrollSensitiveThemeShowcase = ({ onThemeChange }: any) => {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrollMode, setIsScrollMode] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isThemeScrolling, setIsThemeScrolling] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Intersection Observer to detect if section is in viewport
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
        if (entry.isIntersecting) {
          setIsThemeScrolling(true);
          setCurrentThemeIndex(0);
          setScrollProgress(0);
        } else {
          setIsThemeScrolling(false);
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Handle scroll-based theme changing with scroll lock
  useEffect(() => {
    if (!isScrollMode || !isActive) return;

    let wheelTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      if (!isThemeScrolling) return;

      e.preventDefault();
      
      clearTimeout(wheelTimeout);
      
      const direction = e.deltaY > 0 ? 1 : -1;
      
      wheelTimeout = setTimeout(() => {
        setCurrentThemeIndex(prev => {
          const newIndex = Math.max(0, Math.min(themes.length - 1, prev + direction));
          
          // If we've reached the last theme and scrolling down, allow page scroll
          if (newIndex === themes.length - 1 && direction > 0) {
            setIsThemeScrolling(false);
            // Small delay to allow smooth transition
            setTimeout(() => {
              if (sectionRef.current) {
                sectionRef.current.scrollIntoView({ behavior: 'instant', block: 'end' });
              }
            }, 100);
          }
          
          // If we're at first theme and scrolling up, allow page scroll
          if (newIndex === 0 && direction < 0) {
            setIsThemeScrolling(false);
          }
          
          const progress = newIndex / (themes.length - 1);
          setScrollProgress(progress);
          onThemeChange(themes[newIndex].name);
          
          return newIndex;
        });
      }, 50);
    };

    // Prevent default scroll behavior when theme scrolling is active
    const handleScroll = (e: Event) => {
      if (isThemeScrolling) {
        e.preventDefault();
      }
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
      clearTimeout(wheelTimeout);
    };
  }, [isScrollMode, isActive, isThemeScrolling, onThemeChange]);

  const handleThemeSelect = (themeIndex: any) => {
    setCurrentThemeIndex(themeIndex);
    onThemeChange(themes[themeIndex].name);
  };

  return (
    <section 
      ref={sectionRef} 
      className={`min-h-screen bg-base-100 relative ${isThemeScrolling ? 'fixed inset-0 z-40' : ''}`}
    >
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-base-300 z-50">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Theme Scrolling Indicator */}
      {isThemeScrolling && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-base-100 border border-base-300 rounded-full px-4 py-2 shadow-xl">
            <div className="flex items-center gap-2 text-sm">
              <Scroll className="w-4 h-4 text-primary animate-pulse" />
              <span>Scroll to change themes ({currentThemeIndex + 1}/{themes.length})</span>
            </div>
          </div>
        </div>
      )}

      <div className={`${isThemeScrolling ? 'h-screen overflow-hidden flex items-center justify-center' : 'min-h-screen'}`}>
        <div className="col-start-1 row-start-1 flex items-center justify-center gap-6 p-6">
          <div className="border-base-200 flex w-full items-stretch justify-center gap-6 rounded-2xl border p-6 max-w-7xl">
            
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
                      <span className="text-primary-content font-bold">U</span>
                    </div>
                  </button>
                </div>
                <ul className="menu menu-sm menu-horizontal rounded-box">
                  <li>
                    <button>
                      <Layout className="h-5 w-5" />
                      Themes 
                      <span className="badge badge-sm">{themes.length}+</span>
                    </button>
                  </li>
                  <li>
                    <button>
                      Updates 
                      <span className="badge badge-sm badge-warning">NEW</span>
                    </button>
                  </li>
                  <li>
                    <button>
                      Stats 
                      <span className="badge badge-xs badge-info"></span>
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
                  <div className="flex h-full items-center justify-between gap-6">
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
            <div className="rounded-box bg-base-200 card h-full w-80 shrink-0">
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
                      <div className={`${color.class} rounded-btn aspect-square w-10 transition-all duration-500`}></div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
              Enterprise-grade dashboard with scroll-driven theming and advanced RBAC system.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-base-content/70 hover:text-primary">Scroll-Driven Themes</a></li>
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
            © 2024 Infinity Dashboard. Built with ❤️ using React, FastAPI, and scroll-driven magic.
          </p>
        </div>
      </div>
    </footer>
  );
};