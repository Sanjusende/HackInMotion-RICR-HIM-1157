import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1 = Email submission, 2 = OTP, 3 = Reset Password, 4 = Success
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSendOtp = (e) => {
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

    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
      toast.success('Mock OTP sent to ' + email);
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }
    if (otp !== '1234') {
      setErrors({ otp: 'Invalid OTP. Enter "1234" to test.' });
      return;
    }
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(3);
      toast.success('OTP Verified!');
    }, 1200);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword) {
      setErrors({ newPassword: 'Password is required' });
      return;
    }
    if (newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setStep(4);
      toast.success('Password reset successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-bg-custom relative">
      <Toaster position="top-right" />
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 animate-pulse" />

      <Card shadow="large" className="w-full max-w-md p-8 bg-white" hoverLift={false}>
        {step === 1 && (
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-dark-text">Forgot Password</h2>
              <p className="text-secondary-text font-medium text-sm mt-1 text-center">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-5">
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
                Send OTP
              </Button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-dark-text">Enter OTP</h2>
              <p className="text-secondary-text font-medium text-sm mt-1 text-center">
                We've sent a 4-digit code to <strong className="text-dark-text">{email}</strong>. Enter <span className="text-primary font-bold">1234</span> to verify.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <Input
                id="otp"
                label="Verification Code"
                placeholder="Enter 1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                error={errors.otp}
                className="text-center font-bold tracking-widest text-lg"
              />

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Verify OTP
              </Button>
            </form>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
                <KeyRound size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-dark-text">Set New Password</h2>
              <p className="text-secondary-text font-medium text-sm mt-1">
                Enter your new security credentials
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-5">
              <Input
                id="newPassword"
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={errors.newPassword}
              />

              <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={errors.confirmPassword}
              />

              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-success/10 rounded-full text-success mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-extrabold text-dark-text">Success!</h2>
              <p className="text-secondary-text font-medium text-sm mt-2 max-w-xs mx-auto">
                Your password has been successfully reset. You can now log in using your new credentials.
              </p>
            </div>

            <Link to="/login" className="block">
              <Button variant="primary" fullWidth>
                Back to Login
              </Button>
            </Link>
          </div>
        )}

        {step < 4 && (
          <div className="border-t border-border-custom mt-6 pt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
            >
              <ArrowLeft size={16} className="mr-1.5" /> Back to Login
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
