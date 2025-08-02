import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  UserPlus,
  Building2,
  Users,
  Award,
  Shield,
} from "lucide-react";
import { 
  Typography, 
  Input, 
  Button, 
  Alert,
  Divider,
  Card,
  CardBody,
  SettingsButton,
  InfinityLogo,
  useToast
} from "@/components";
import { useAuthStore } from "@/store";

const useLoadingWithTimeout = (_: any) => ({
  showLoadingWithTimeout: async (fn: any, _: any) => {
    await fn();
  },
});

export const AuthPages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handlePageTransition = (targetPath: any) => {
    if (location.pathname === targetPath) return;

    setIsTransitioning(true);
    setTimeout(() => {
      navigate(targetPath);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* --- Infinity Splash Background --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float-2"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-3"></div>
        
        {/* Geometric Patterns */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
              <polygon 
                points="30,4 52,16 52,36 30,48 8,36 8,16" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.5"
                className="text-primary animate-pulse-slow"
              />
            </pattern>
            <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle 
                cx="10" 
                cy="10" 
                r="1" 
                fill="currentColor" 
                className="text-secondary"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>

        {/* Animated Lines */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-gradient-to-r from-transparent via-primary/20 to-transparent h-px"
              style={{
                top: `${10 + i * 7}%`,
                left: `-50%`,
                right: `-50%`,
                transform: `rotate(${i * 15}deg)`,
                animation: `slide-line ${3 + i * 0.2}s infinite linear`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float-particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        {/* Subtle Grid Overlay */}
        <div className="absolute inset-0 opacity-3">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path 
                  d="M 40 0 L 0 0 0 40" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="0.5" 
                  className="text-base-content"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Settings Button */}
      <div className="absolute top-6 right-6 z-30">
        <SettingsButton side="right" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8 p-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <InfinityLogo size={64} />
            <div>
              <Typography variant="h1" className="text-4xl font-bold text-base-content">
                Infinity
              </Typography>
              <Typography variant="body1" className="text-base-content/60">
                Enterprise Dashboard
              </Typography>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-md">
            <Typography variant="h2" className="text-2xl font-semibold text-base-content">
              Professional Dashboard Solution
            </Typography>
            
            <div className="space-y-4">
              {[
                { icon: Building2, title: "Enterprise Ready", desc: "Built for business scale" },
                { icon: Users, title: "Team Collaboration", desc: "Seamless team management" },
                { icon: Award, title: "Premium Quality", desc: "Industry-leading standards" },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <Typography variant="h3" className="font-semibold text-base-content">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="text-base-content/60 text-sm">
                      {feature.desc}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-base-300">
              {[
                { number: "50K+", label: "Active Users" },
                { number: "99.9%", label: "Uptime" },
                { number: "24/7", label: "Support" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <Typography variant="h2" className="text-2xl font-bold text-primary">
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" className="text-base-content/60 text-xs">
                    {stat.label}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <Card
              className={`
                transition-all duration-500 ease-out
                ${isTransitioning ? 'scale-95 opacity-80' : 'scale-100 opacity-100'}
              `}
              bordered
            >
              <CardBody className="p-8">
                {/* Mobile Logo */}
                <div className="lg:hidden flex justify-center mb-6">
                  <InfinityLogo size={80} />
                </div>

                {/* Form Transition Container */}
                <div className="relative min-h-[550px]">
                  {/* Login Form */}
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500 ease-out
                      ${isLogin
                        ? 'translate-x-0 opacity-100 pointer-events-auto'
                        : 'translate-x-8 opacity-0 pointer-events-none'
                      }
                    `}
                  >
                    <LoginForm onNavigate={handlePageTransition} />
                  </div>

                  {/* Register Form */}
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500 ease-out
                      ${!isLogin
                        ? 'translate-x-0 opacity-100 pointer-events-auto'
                        : '-translate-x-8 opacity-0 pointer-events-none'
                      }
                    `}
                  >
                    <RegisterForm onNavigate={handlePageTransition} />
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onNavigate }: any) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToast();
  const { showLoadingWithTimeout } = useLoadingWithTimeout({
    minDuration: 2000,
    defaultText: "Signing you in...",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await showLoadingWithTimeout(async () => {
        await login(formData);
        addToast({
          message: "Successfully signed in to Infinity!",
          variant: "success"
        });
      }, "Authenticating...");
    } catch (err) {
      console.error("Login failed:", err);
      addToast({
        message: "Authentication failed. Please try again.",
        variant: "error"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <Typography variant="h2" className="text-2xl font-bold text-base-content">
          Sign In to Infinity
        </Typography>
        <Typography variant="body1" className="text-base-content/60">
          Access your professional dashboard
        </Typography>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={clearError}>
          Authentication failed. Please try again.
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          required
          disabled={isLoading}
          autoComplete="username"
        />

        <div className="space-y-2">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            required
            disabled={isLoading}
            autoComplete="current-password"
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-base-content/60 hover:text-primary transition-colors"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            }
          />
          <div className="flex justify-end">
            <button type="button" className="text-sm text-primary hover:text-primary-focus font-medium">
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? (
            "Signing In..."
          ) : (
            <>
              Sign In
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </form>

      <Divider>New to INFINITY?</Divider>

      <Button
        variant="primary"
        outline
        size="lg"
        block
        onClick={() => onNavigate("/register")}
      >
        <UserPlus size={18} className="mr-2" />
        Create Account
      </Button>
    </div>
  );
};

const RegisterForm = ({ onNavigate }: any) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error, clearError } = useAuthStore();
  const { addToast } = useToast();
  const { showLoadingWithTimeout } = useLoadingWithTimeout({
    minDuration: 2000,
    defaultText: "Creating your account...",
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      addToast({
        message: "Passwords do not match",
        variant: "error"
      });
      return;
    }

    try {
      await showLoadingWithTimeout(async () => {
        const { confirmPassword, ...registrationData } = formData;
        await register(registrationData);
        addToast({
          message: "Account created successfully! Welcome to Infinity.",
          variant: "success"
        });
      }, "Setting up your account...");
      onNavigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      addToast({
        message: "Registration failed. Please try again.",
        variant: "error"
      });
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <Typography variant="h2" className="text-2xl font-bold text-base-content">
          Join Infinity
        </Typography>
        <Typography variant="body1" className="text-base-content/60">
          Create your professional dashboard account
        </Typography>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={clearError}>
          Registration failed. Please try again.
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Choose a username"
          required
          disabled={isLoading}
          autoComplete="username"
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Create a password"
          required
          disabled={isLoading}
          autoComplete="new-password"
          endIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-base-content/60 hover:text-primary transition-colors"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          }
        />

        <Input
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="Confirm your password"
          required
          disabled={isLoading}
          autoComplete="new-password"
          error={showPasswordError ? "Passwords do not match" : undefined}
          endIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-base-content/60 hover:text-primary transition-colors"
              disabled={isLoading}
              tabIndex={-1}
            >
              {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          block
          loading={isLoading}
          disabled={Boolean(isLoading || showPasswordError)}
        >
          {isLoading ? (
            "Creating Account..."
          ) : (
            <>
              Create Infinity Account
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      </form>

      <Divider>Already have an account?</Divider>

      <Button
        variant="primary"
        outline
        size="lg"
        block
        onClick={() => onNavigate("/login")}
      >
        <Shield size={18} className="mr-2" />
        Sign In
      </Button>
    </div>
  );
};

export default AuthPages;