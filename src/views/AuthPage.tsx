import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Typography,
  Input,
  Button,
  Divider,
  Card,
  CardBody,
  InfinityLogo,
  useToast,
} from "@/components";
import { useAuthStore, useLoading } from "@/store";
import { useTheme } from "@/hooks";
import { themes } from "@/themes";
import { getIconComponent } from "@/utils";

export const AuthPages = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeTheme = useTheme((state) => state.changeTheme);
  const currentTheme = useTheme((state) => state.currentTheme);

  const themeOptions = [
    themes.find((t) => t.name === "dark"),
    themes.find((t) => t.name === "forest"),
    themes.find((t) => t.name === "coffee"),
    themes.find((t) => t.name === "bumblebee"),
  ].filter(Boolean);

  const handleTheme = (e: any, themeName: any) => {
    e.preventDefault();
    e.stopPropagation();
    changeTheme(themeName);
  };

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
    <div className="h-screen bg-base-200 flex items-center w-screen justify-center p-4 relative overflow-hidden overflow-x-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float-1"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float-2"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-3"></div>

        {/* Geometric Patterns */}
        <svg
          className="absolute inset-0 w-full h-full opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hexagons"
              width="60"
              height="52"
              patternUnits="userSpaceOnUse"
            >
              <polygon
                points="30,4 52,16 52,36 30,48 8,36 8,16"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary animate-pulse-slow"
              />
            </pattern>
            <pattern
              id="dots"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
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
              <pattern
                id="grid"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
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
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center items-start space-y-8 p-8">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <InfinityLogo size={64} />
            <div>
              <Typography
                variant="h1"
                className="text-4xl font-bold text-base-content font-courgette"
              >
                Infinity
              </Typography>
              <Typography variant="body1" className="text-base-content/60">
                Enterprise Dashboard
              </Typography>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-6 max-w-md">
            <Typography
              variant="h2"
              className="text-2xl font-semibold text-base-content"
            >
              Professional Dashboard Solution
            </Typography>

            <div className="space-y-4">
              {[
                {
                  icon: getIconComponent("Building2", 24, "text-primary"),
                  title: "Enterprise Ready",
                  desc: "Built for business scale",
                },
                {
                  icon: getIconComponent("Users", 24, "text-primary"),
                  title: "Team Collaboration",
                  desc: "Seamless team management",
                },
                {
                  icon: getIconComponent("Award", 24, "text-primary"),
                  title: "Premium Quality",
                  desc: "Industry-leading standards",
                },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-base-300 rounded-xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <div>
                    <Typography
                      variant="h3"
                      className="font-semibold text-base-content"
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-base-content/60 text-sm"
                    >
                      {feature.desc}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            {/* Theme Buttons - Fixed with proper event handling and z-index */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-base-300 relative z-50">
              <Typography
                variant="body2"
                className="col-span-2 text-base-content/80 font-medium mb-2"
              >
                Choose Theme:
              </Typography>
              {themeOptions.map((theme) => (
                <button
                  key={theme!.name}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 relative z-50 ${
                    currentTheme.name === theme!.name
                      ? "border-primary bg-primary/20 shadow-md"
                      : "border-base-300 hover:border-primary/50 hover:bg-base-100"
                  }`}
                  onClick={(e) => handleTheme(e, theme!.name)}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <Typography
                      variant="body2"
                      className="font-medium capitalize"
                    >
                      {theme!.displayName}
                    </Typography>
                    <div
                      className="flex gap-1 bg-transparent"
                      data-theme={theme!.name}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <div className="w-2 h-2 rounded-full bg-accent"></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-center">
              <Typography
                variant="caption"
                className="text-base-content/60 text-xs"
              >
                To explore all 30+ beautiful themes, please login to Infinity.
              </Typography>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Card */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <Card
              className={`
                transition-all duration-500 ease-out
                ${
                  isTransitioning
                    ? "scale-95 opacity-80"
                    : "scale-100 opacity-100"
                }
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
                      ${
                        isLogin
                          ? "translate-x-0 opacity-100 pointer-events-auto"
                          : "translate-x-8 opacity-0 pointer-events-none"
                      }
                    `}
                  >
                    <LoginForm onNavigate={handlePageTransition} />
                  </div>

                  {/* Register Form */}
                  <div
                    className={`
                      absolute inset-0 transition-all duration-500 ease-out
                      ${
                        !isLogin
                          ? "translate-x-0 opacity-100 pointer-events-auto"
                          : "-translate-x-8 opacity-0 pointer-events-none"
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
  const { showLoading } = useLoading();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await login(formData);
      if (isLoading) showLoading("Loading your dashboard...");
      localStorage.setItem('pageName', 'Dashboard');
      addToast({
        message: "Successfully signed in to Infinity!",
        variant: "success",
      });
      onNavigate("/infinity/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      addToast({
        message: "Authentication failed. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <Typography
          variant="h2"
          className="text-2xl font-bold text-base-content"
        >
          Sign In to <span className="font-courgette text-primary">Infinity</span>
        </Typography>
        <Typography variant="body1" className="text-base-content/60">
          Access your professional dashboard
        </Typography>
      </div>

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
                {showPassword ? getIconComponent("Eye", 20, "text-base-content/60 hover:text-primary transition-colors") : getIconComponent("EyeOff", 20, "text-base-content/60 hover:text-primary transition-colors")}
              </button>
            }
          />
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary hover:text-primary-focus font-medium"
            >
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
            <>
              Sign In
              {getIconComponent("ArrowRight", 18, "ml-2")}
            </>
        </Button>
      </form>

      <Divider>New to Infinity?</Divider>

      <Button
        variant="primary"
        outline
        size="lg"
        block
        onClick={() => onNavigate("/register")}
      >
        {getIconComponent("UserPlus", 18, "mr-2")}
        Create Account
      </Button>
      <div className="mt-4 p-4 bg-base-200 rounded-xl">
        <Typography
          variant="caption"
          className="text-base-content/60 text-xs text-center"
        >
          Username : <strong>superadmin</strong> | Password :{" "}
          <strong>superadmin123</strong>
        </Typography>
        <Typography
          variant="caption"
          className="text-base-content/60 text-xs text-center"
        >
          Username : <strong>admin</strong> | Password :{" "}
          <strong>admin123</strong>
        </Typography>
        <Typography
          variant="caption"
          className="text-base-content/60 text-xs text-center"
        >
          Username : <strong>user</strong> | Password : <strong>user123</strong>
        </Typography>
      </div>
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
        variant: "error",
      });
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      addToast({
        message: "Account created successfully! Welcome to Infinity.",
        variant: "success",
      });
      onNavigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      addToast({
        message: "Registration failed. Please try again.",
        variant: "error",
      });
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <Typography
          variant="h2"
          className="text-2xl font-bold text-base-content"
        >
          Join <span className="font-courgette text-primary">Infinity</span>
        </Typography>
        <Typography variant="body1" className="text-base-content/60">
          Create your professional dashboard account
        </Typography>
      </div>

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
              {showPassword ? getIconComponent("Eye", 20, "text-base-content/60 hover:text-primary transition-colors") : getIconComponent("EyeOff", 20, "text-base-content/60 hover:text-primary transition-colors")}
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
              {showConfirmPassword ? getIconComponent("Eye", 20, "text-base-content/60 hover:text-primary transition-colors") : getIconComponent("EyeOff", 20, "text-base-content/60 hover:text-primary transition-colors")}
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
              {getIconComponent("ArrowRight", 18, "ml-2")}
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
        {getIconComponent("Shield", 18, "mr-2")}
        Sign In
      </Button>
      <div className="mt-4 p-4 bg-transparent">
        <Typography
          variant="caption"
          className="text-base-content/60 text-xs text-center"
        >
          By creating an account, you agree to our{" "}
          <a href="/terms" className="text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </Typography>
      </div>
    </div>
  );
};

export default AuthPages;
