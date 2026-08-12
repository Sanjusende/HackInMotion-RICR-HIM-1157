import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sprout } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API Login call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Successfully logged in!');
      setTimeout(() => {
        navigate('/profile/setup');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-bg-custom relative">
      <Toaster position="top-right" />
      {/* Background shape */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 animate-pulse" />

      <Card shadow="large" className="w-full max-w-md p-8 bg-white" hoverLift={false}>
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
            <Sprout size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-dark-text">Welcome Back</h2>
          <p className="text-secondary-text font-medium text-sm mt-1">
            Access your agricultural dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="farmer@krishimitra.org"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div className="relative">
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[38px] text-secondary-text hover:text-dark-text cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="border-t border-border-custom mt-6 pt-6 text-center">
          <p className="text-sm text-secondary-text font-medium">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Create Account
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
