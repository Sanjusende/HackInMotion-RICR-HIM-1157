import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, MapPin, Lock, Eye, EyeOff, Sprout } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = 'Full name is required';
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!location) tempErrors.location = 'Farm location is required';
    if (!password) {
      tempErrors.password = 'Password is required';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    }, 1500);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-12 bg-bg-custom relative">
      <Toaster position="top-right" />
      <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 animate-pulse" />

      <Card shadow="large" className="w-full max-w-md p-8 bg-white" hoverLift={false}>
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
            <Sprout size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-dark-text">Create Account</h2>
          <p className="text-secondary-text font-medium text-sm mt-1">
            Start optimizing your crops with AI
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="name"
            label="Full Name"
            placeholder="John Doe"
            icon={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

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

          <Input
            id="location"
            label="Farm Location (State/District)"
            placeholder="Maharashtra, Pune"
            icon={MapPin}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            error={errors.location}
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

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
            Register Farm
          </Button>
        </form>

        <div className="border-t border-border-custom mt-6 pt-6 text-center">
          <p className="text-sm text-secondary-text font-medium">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-hover font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;
