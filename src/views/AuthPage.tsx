import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Shield,
  Zap,
  Users,
  UserPlus,
  Rocket,
  Award,
  Globe,
} from "lucide-react";
import { Typography } from "@/components";
import { useAuthStore } from "@/store";
import { SettingsButton } from "@/components";

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
      }, 100);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-base-200 flex relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-r transition-all duration-700 ease-in-out ${
          isLogin
            ? "from-primary/10 to-transparent"
            : "from-transparent to-secondary/10"
        }`}
      />

      <div
        className={`relative w-full lg:w-1/2 transition-all duration-700 ease-in-out ${
          isTransitioning
            ? isLogin
              ? "-translate-x-4 opacity-90"
              : "translate-x-4 opacity-90"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isLogin ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          } bg-gradient-to-br from-primary to-primary-focus overflow-hidden`}
        >
          <LoginBranding />
        </div>

        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            !isLogin
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <RegisterForm onNavigate={handlePageTransition} />
        </div>
      </div>

      <div
        className={`relative hidden lg:flex lg:w-1/2 transition-all duration-700 ease-in-out ${
          isTransitioning
            ? isLogin
              ? "translate-x-4 opacity-90"
              : "-translate-x-4 opacity-90"
            : "translate-x-0 opacity-100"
        }`}
      >
        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            isLogin
              ? "translate-x-0 opacity-100 pointer-events-auto"
              : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <LoginForm onNavigate={handlePageTransition} />
        </div>

        <div
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            !isLogin
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0"
          } bg-gradient-to-bl from-secondary to-secondary-focus overflow-hidden`}
        >
          <RegisterBranding />
        </div>
      </div>
    </div>
  );
};

const LoginForm = ({ onNavigate }: any) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, clearError } = useAuthStore();
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
      }, "Authenticating...");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 lg:p-12 h-full">
      <div className="w-full max-w-md relative">
        {/* Settings Button at top right of form card */}
        <div className="absolute -top-36 -right-32 z-20">
          <SettingsButton side="right" />
        </div>

        <div className="mb-8 text-center lg:text-left">
          <Typography
            variant="h2"
            className="text-3xl font-bold text-base-content mb-2"
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-base-content/70">
            Sign in to your account to continue
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Username</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="input input-bordered w-full h-12 focus:input-primary"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="input input-bordered w-full h-12 pr-12 focus:input-primary"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/60 hover:text-base-content transition-colors"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            <div className="label">
              <span className="label-text-alt"></span>
              <button
                type="button"
                className="label-text-alt link link-primary"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <div className="form-control">
            <button
              type="submit"
              className={`btn btn-primary h-12 text-base ${
                isLoading ? "loading" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="divider my-8">OR</div>

        <div className="text-center">
          <Typography variant="body2" className="text-base-content/70">
            Don't have an account?{" "}
            <button
              onClick={() => onNavigate("/register")}
              className="link link-primary font-semibold hover:underline transition-all duration-200 hover:scale-105"
            >
              Create one now
            </button>
          </Typography>
        </div>
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
    if (formData.password !== formData.confirmPassword) return;

    try {
      await showLoadingWithTimeout(async () => {
        const { confirmPassword, ...registrationData } = formData;
        await register(registrationData);
      }, "Setting up your account...");
      onNavigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  const passwordsMatch = formData.password === formData.confirmPassword;
  const showPasswordError = formData.confirmPassword && !passwordsMatch;

  return (
    <div className="flex items-center justify-center p-4 lg:p-12 h-full">
      <div className="w-full max-w-md relative">
        {/* Settings Button at top right of form card */}
        <div className="absolute -top-18 -left-32 z-20">
          <SettingsButton side="left" />
        </div>

        <div className="mb-8 text-center lg:text-left">
          <Typography
            variant="h2"
            className="text-3xl font-bold text-base-content mb-2"
          >
            Join Us Today
          </Typography>
          <Typography variant="body1" className="text-base-content/70">
            Create your account and start your journey
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Username *</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className="input input-bordered w-full h-12 focus:input-secondary"
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Email *</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="input input-bordered w-full h-12 focus:input-secondary"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Password *</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="input input-bordered w-full h-12 pr-12 focus:input-secondary"
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/60 hover:text-base-content transition-colors"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Confirm Password *</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`input input-bordered w-full h-12 pr-12 focus:input-secondary ${
                  showPasswordError ? "input-error" : ""
                }`}
                required
                disabled={isLoading}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-base-content/60 hover:text-base-content transition-colors"
                disabled={isLoading}
                tabIndex={-1}
              >
                {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
            {showPasswordError && (
              <label className="label">
                <span className="label-text-alt text-error">
                  Passwords do not match
                </span>
              </label>
            )}
          </div>

          <div className="form-control">
            <button
              type="submit"
              className={`btn btn-secondary h-12 text-base ${
                isLoading ? "loading" : ""
              }`}
              disabled={Boolean(isLoading || showPasswordError)}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div className="divider my-8">OR</div>

        <div className="text-center">
          <Typography variant="body2" className="text-base-content/70">
            Already have an account?{" "}
            <button
              onClick={() => onNavigate("/login")}
              className="link link-secondary font-semibold hover:underline transition-all duration-200 hover:scale-105"
            >
              Sign in here
            </button>
          </Typography>
        </div>
      </div>
    </div>
  );
};

const LoginBranding = () => (
  <>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
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
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col justify-center items-center text-primary-content p-12">
      {/* Logo/Brand */}
      <div className="mb-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-primary-content/20 rounded-full flex items-center justify-center backdrop-blur-sm transform transition-transform duration-500 hover:scale-110">
          <Shield size={48} className="text-primary-content" />
        </div>
        <Typography
          variant="h1"
          className="text-4xl font-bold mb-2 transform transition-all duration-500 hover:scale-105"
        >
          YourBrand
        </Typography>
        <Typography variant="body1" className="text-xl opacity-90">
          Secure • Reliable • Innovative
        </Typography>
      </div>

      {/* Features */}
      <div className="space-y-6 max-w-md">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            desc: "Experience blazing fast performance with our optimized platform",
          },
          {
            icon: Shield,
            title: "Enterprise Security",
            desc: "Your data is protected with bank-level security measures",
          },
          {
            icon: Users,
            title: "Team Collaboration",
            desc: "Work seamlessly with your team from anywhere in the world",
          },
        ].map((feature, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 transform transition-all duration-500 hover:translate-x-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-10 h-10 bg-primary-content/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <feature.icon size={20} className="text-primary-content" />
            </div>
            <div>
              <Typography variant="h3" className="text-lg font-semibold mb-1">
                {feature.title}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                {feature.desc}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Quote/Testimonial */}
      <div className="mt-12 text-center max-w-lg transform transition-all duration-500 hover:scale-105">
        <Typography variant="body1" className="text-lg italic opacity-90 mb-4">
          "This platform has transformed how we work. The security and ease of
          use is unmatched."
        </Typography>
        <Typography variant="body2" className="opacity-80">
          — Sarah Johnson, Tech Lead
        </Typography>
      </div>
    </div>
  </>
);

const RegisterBranding = () => (
  <>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="hexagon"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <polygon
              points="30,5 50,15 50,35 30,45 10,35 10,15"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexagon)" />
      </svg>
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col justify-center items-center text-secondary-content p-12">
      {/* Logo/Brand */}
      <div className="mb-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-secondary-content/20 rounded-full flex items-center justify-center backdrop-blur-sm transform transition-transform duration-500 hover:scale-110">
          <UserPlus size={48} className="text-secondary-content" />
        </div>
        <Typography
          variant="h1"
          className="text-4xl font-bold mb-2 transform transition-all duration-500 hover:scale-105"
        >
          Start Your Journey
        </Typography>
        <Typography variant="body1" className="text-xl opacity-90">
          Join thousands of satisfied users
        </Typography>
      </div>

      {/* Benefits */}
      <div className="space-y-6 max-w-md">
        {[
          {
            icon: Rocket,
            title: "Quick Setup",
            desc: "Get started in minutes with our streamlined onboarding process",
          },
          {
            icon: Award,
            title: "Premium Features",
            desc: "Access all premium features with your free account",
          },
          {
            icon: Globe,
            title: "Global Community",
            desc: "Connect with users from around the world in our community",
          },
        ].map((benefit, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 transform transition-all duration-500 hover:translate-x-2"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-10 h-10 bg-secondary-content/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <benefit.icon size={20} className="text-secondary-content" />
            </div>
            <div>
              <Typography variant="h3" className="text-lg font-semibold mb-1">
                {benefit.title}
              </Typography>
              <Typography variant="body2" className="opacity-80">
                {benefit.desc}
              </Typography>
            </div>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
        {[
          { number: "10K+", label: "Active Users" },
          { number: "99%", label: "Satisfaction" },
          { number: "24/7", label: "Support" },
        ].map((stat, index) => (
          <div
            key={index}
            className="transform transition-all duration-500 hover:scale-110"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {index > 0 && (
              <div className="w-px h-8 bg-secondary-content/30 mx-auto mb-2"></div>
            )}
            <Typography variant="h2" className="text-2xl font-bold mb-1">
              {stat.number}
            </Typography>
            <Typography variant="body2" className="opacity-80 text-sm">
              {stat.label}
            </Typography>
          </div>
        ))}
      </div>

      {/* Call to action */}
      <div className="mt-12 text-center max-w-lg transform transition-all duration-500 hover:scale-105">
        <Typography variant="body1" className="text-lg opacity-90 mb-2">
          Ready to transform your workflow?
        </Typography>
        <Typography variant="body2" className="opacity-80">
          Join our community and experience the difference today.
        </Typography>
      </div>
    </div>
  </>
);

export default AuthPages;
