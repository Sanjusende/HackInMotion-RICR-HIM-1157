import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/ui/Card';
import { api } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [devResetLink, setDevResetLink] = useState('');

  const handleSendLink = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors({ email: 'Email address is required' });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Invalid email address' });
      return;
    }
    setErrors({});
    setIsLoading(true);

    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      if (data.success) {
        setIsSubmitted(true);
        if (data.data?.resetLink) {
          // Expose the reset link for development / testing convenience
          setDevResetLink(data.data.resetLink);
        }
        toast.success('Password reset instructions sent!');
      } else {
        throw new Error(data.message || 'Request failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to submit request.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout title="Instructions Sent" subtitle="Check your email for the reset instructions">
        <Toaster position="top-right" />
        <div className="text-center space-y-6">
          <div className="flex flex-col items-center">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-full mb-4">
              <CheckCircle2 size={48} />
            </div>
            <p className="text-sm text-secondary-text max-w-xs mx-auto">
              If a registered user matches <strong className="text-dark-text">{email}</strong>, we have sent instructions to reset your password.
            </p>
          </div>

          {devResetLink && (
            <Card className="p-4 bg-amber-500/10 border border-amber-500/20 text-left space-y-2 mt-4">
              <span className="text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider block">
                Developer Test Link:
              </span>
              <p className="text-xs text-secondary-text break-all">
                {devResetLink}
              </p>
              <a
                href={devResetLink}
                className="inline-block text-xs font-bold text-primary hover:underline mt-1"
              >
                Go to Reset Password page &rarr;
              </a>
            </Card>
          )}

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
    <AuthLayout title="Forgot Password" subtitle="Enter your email to receive password reset link">
      <Toaster position="top-right" />
      <form onSubmit={handleSendLink} className="space-y-5">
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

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Send Reset Link
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

export default ForgotPassword;
