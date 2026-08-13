import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, CloudRain, ShieldCheck, Cpu, ArrowRight, TrendingUp, Users, Target } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const features = [
    {
      icon: Cpu,
      title: 'AI Crop Recommendation',
      description: 'Get precise crop recommendations based on your local soil profile, climate parameters, and water resources.'
    },
    {
      icon: CloudRain,
      title: 'Smart Weather Insights',
      description: 'Receive real-time micro-weather forecasts and warnings configured specifically for your farm location.'
    },
    {
      icon: Sprout,
      title: 'Soil Health Analysis',
      description: 'Understand NPK ratios, soil acidity, and organic carbon levels with easy-to-read charts and guidelines.'
    },
    {
      icon: TrendingUp,
      title: 'Market Rate Intelligence',
      description: 'Track commodity prices in nearby markets, helping you sell your produce at the absolute peak price.'
    }
  ];

  const stats = [
    { icon: Users, value: '15,000+', label: 'Active Farmers' },
    { icon: Target, value: '94%', label: 'Recommendation Accuracy' },
    { icon: ShieldCheck, value: '25%+', label: 'Average Yield Increase' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute top-1/2 left-0 -z-10 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl" />

      {/* Hero Section */}
      <section className="py-20 pb-16 md:pt-28 md:pb-24 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                <Sprout size={16} />
                <span>Next-Gen Smart Agriculture</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-text tracking-tight leading-none">
                Empowering Farmers with <span className="text-primary">Data-Driven</span> Decisions
              </motion.h1>

              <motion.p variants={itemVariants} className="text-secondary-text text-lg sm:text-xl font-medium max-w-xl">
                KrishiMitra matches advanced AI models with your farm profile to provide customized crop selections, soil analytics, and market forecasts.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-medium">
                    Get Started <ArrowRight className="ml-2" size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Hero Feature Preview Visual Card */}
            <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center">
              <Card shadow="glass" className="w-full max-w-md p-6 border border-border-custom bg-white/70">
                <div className="flex items-center justify-between border-b border-border-custom pb-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">KrishiMitra OS v1.0</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-bg-custom p-3 rounded-card border border-border-custom">
                    <div>
                      <p className="text-xs text-secondary-text font-semibold">Soil N-P-K Levels</p>
                      <p className="text-sm font-bold text-dark-text">Optimal (65-42-38)</p>
                    </div>
                    <div className="h-2 w-16 bg-primary rounded-full" />
                  </div>
                  <div className="flex justify-between items-center bg-bg-custom p-3 rounded-card border border-border-custom">
                    <div>
                      <p className="text-xs text-secondary-text font-semibold">Primary Soil pH</p>
                      <p className="text-sm font-bold text-dark-text">6.8 pH (Slightly Acidic)</p>
                    </div>
                    <div className="px-2 py-0.5 bg-yellow-500/10 text-yellow-600 rounded text-xs font-bold">Good</div>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-card">
                    <p className="text-xs font-bold text-primary mb-1">RECOMMENDED CROP</p>
                    <p className="text-lg font-bold text-dark-text">Sugarcane & Groundnuts</p>
                    <p className="text-xs text-secondary-text font-medium mt-1">Based on high soil water capacity and warm climate conditions.</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-b border-border-custom py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex flex-col items-center space-y-2">
                  <div className="p-3 bg-primary/10 text-primary rounded-full">
                    <Icon size={24} />
                  </div>
                  <p className="text-3xl md:text-4xl font-extrabold text-dark-text">{stat.value}</p>
                  <p className="text-secondary-text font-semibold text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold text-dark-text tracking-tight">
              Comprehensive Farm Management Tools
            </h2>
            <p className="text-secondary-text text-base md:text-lg font-medium">
              Built for modern agricultural workflows to maximize yield, optimize budgets, and increase long-term crop safety.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i} className="p-6 space-y-4" shadow="medium">
                  <div className="w-12 h-12 bg-primary/10 rounded-card flex items-center justify-center text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-dark-text">{feature.title}</h3>
                  <p className="text-secondary-text text-sm font-medium leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto bg-primary p-8 md:p-12 rounded-[2rem] shadow-large space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white animate-pulse">
              Ready to Transform Your Farming Operations?
            </h2>
            <p className="text-green-100 font-medium text-lg max-w-xl mx-auto">
              Create your account in 30 seconds and start exploring next-generation agricultural intelligence.
            </p>
            <div className="pt-2 flex justify-center">
              <Link to="/register">
                <Button className="bg-white text-primary hover:bg-green-50 border-none font-bold" size="lg">
                  Get Started Now <ArrowRight className="ml-2 text-primary" size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
