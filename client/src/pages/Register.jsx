import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/layout/AuthLayout';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const validate = () => {
    const tempErrors = {};
    if (!name) tempErrors.name = 'Full name is required';
    if (!email) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (phone && !/^\+?[0-9\s-]{10,14}$/.test(phone)) {
      tempErrors.phone = 'Please enter a valid phone number';
    }
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
    if (!acceptedTerms) {
      tempErrors.terms = 'Please accept the terms to continue';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register({ name, email, phone, password, role: 'FARMER' });
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || 'Unable to create your account.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start optimizing your crops with AI">
      <Toaster position="top-right" />
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
          id="phone"
          label="Phone number (optional)"
          placeholder="+91 9876543210"
          icon={Phone}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={errors.phone}
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

        <div>
          <label className="flex items-start gap-2 text-sm text-secondary-text cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 accent-primary"
            />
            <span>I agree to the terms and privacy policy.</span>
          </label>
          {errors.terms && <p className="text-danger text-xs mt-1">{errors.terms}</p>}
        </div>

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
    </AuthLayout>
  );
};

export default Register;
