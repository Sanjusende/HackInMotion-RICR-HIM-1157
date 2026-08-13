import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/layout/AuthLayout';
import { api } from '../context/AuthContext';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const tempErrors = {};
    if (!newPassword) {
      tempErrors.newPassword = 'Password is required';
    } else if (newPassword.length < 6) {
      tempErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!confirmPassword) {
      tempErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (!token) {
      toast.error('Invalid password reset session. Missing token.');
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/reset-password', { token, newPassword });
      if (data.success) {
        setIsSuccess(true);
        toast.success('Password reset successfully!');
      } else {
        throw new Error(data.message || 'Reset failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Unable to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout title="Invalid Request" subtitle="Password reset token is missing.">
        <div className="text-center space-y-4">
          <p className="text-sm text-secondary-text">
            Please request a new reset link from the forgot password page.
          </p>
          <Link to="/forgot-password" className="block">
            <Button variant="primary" fullWidth>
              Go to Forgot Password
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout title="Success!" subtitle="Your password has been successfully reset.">
        <Toaster position="top-right" />
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
              <CheckCircle2 size={48} />
            </div>
            <p className="text-sm text-secondary-text max-w-xs mx-auto">
              You can now log in using your new credentials.
            </p>
          </div>
          <Link to="/login" className="block">
            <Button variant="primary" fullWidth>
              Back to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new security credentials">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="relative">
          <Input
            id="newPassword"
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={Lock}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={errors.newPassword}
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
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
        />

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Reset Password
        </Button>
      </form>

      <div className="border-t border-border-custom mt-6 pt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to Login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
