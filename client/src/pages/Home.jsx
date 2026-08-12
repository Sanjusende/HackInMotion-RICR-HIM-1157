import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  CloudRain,
  ShieldCheck,
  Cpu,
  ArrowRight,
  TrendingUp,
  Users,
  Target,
  Play,
  Droplet,
  AlertTriangle,
  ChevronRight,
  Database
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { soilTrendData, testimonials, timelineSteps } from '../data/mockData';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import SectionTitle from '../components/ui/SectionTitle';
import Timeline from '../components/ui/Timeline';
import Modal from '../components/ui/Modal';

const Home = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  const whyChooseUsData = [
    {
      icon: Cpu,
      title: "AI-Powered Advisory",
      description: "Get agronomy recommendations matched perfectly to your farm parameters using machine learning."
    },
    {
      icon: CloudRain,
      title: "Weather Intelligence",
      description: "Hour-by-hour forecast updates and alerts to protect your crops from sudden temperature shifts."
    },
    {
      icon: ShieldCheck,
      title: "Disease Identification",
      description: "Upload leaf photos to scan, diagnose anomalies, and receive chemical and organic solutions."
    },
    {
      icon: TrendingUp,
      title: "Market Rate Analytics",
      description: "Monitor commodity price projections across local mandis to sell crops when prices peak."
    },
    {
      icon: Droplet,
      title: "Irrigation Scheduling",
      description: "Smart crop moisture calculation based on evaporation rates and rain profiles to save water."
    },
    {
      icon: Sprout,
      title: "Fertilizer Advisor",
      description: "Dose your farm accurately with calculated NPK targets, eliminating soil acidification risks."
    }
  ];

  return (
    <div className="relative overflow-hidden">
      
      {/* Animated background decorative objects */}
      <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-3xl -z-10 animate-pulse" />
      <div className="absolute top-1/2 left-5 w-[500px] h-[500px] rounded-full bg-accent/5 dark:bg-accent/10 blur-3xl -z-10 animate-pulse" />

      {/* Hero Section */}
      <Section className="pt-16 pb-12 md:pt-24 md:pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              <Sprout size={14} />
              <span>Next-Gen Smart Agriculture</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-dark-text dark:text-slate-100 tracking-tight leading-tight"
            >
              Maximize Your Yield with <span className="text-primary">Decision Intelligence</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-secondary-text dark:text-slate-400 text-lg sm:text-xl font-medium max-w-xl leading-relaxed"
            >
              KrishiMitra combines real-time climate telemetry, soil chemistry, and predictive analytics to help you make smarter farming choices.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
              <Link to="/profile/setup">
                <Button variant="primary" size="lg" className="shadow-medium">
                  Get Started <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setIsDemoOpen(true)}
                className="dark:bg-slate-900/40 dark:border-slate-700 dark:text-slate-200"
              >
                Watch Demo <Play className="ml-2 text-primary fill-primary" size={16} />
              </Button>
            </motion.div>
          </div>

          {/* Hero Right Visuals */}
          <motion.div variants={itemVariants} className="lg:col-span-5 flex justify-center">
            <Card shadow="glass" className="w-full max-w-md p-6 bg-white/70 dark:bg-slate-900/70 border-border-custom dark:border-slate-800">
              <div className="flex items-center justify-between border-b border-border-custom dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2.5 py-0.5 rounded">
                  Live Farm Dashboard
                </span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between bg-bg-custom dark:bg-slate-850 p-3 rounded-card border border-border-custom dark:border-slate-800 transition-colors">
                  <div>
                    <p className="text-xs text-secondary-text dark:text-slate-400 font-bold">Soil N-P-K Levels</p>
                    <p className="text-sm font-extrabold text-dark-text dark:text-slate-100">Optimal (65-42-38)</p>
                  </div>
                  <div className="h-2 w-16 bg-primary rounded-full" />
                </div>
                
                <div className="flex items-center justify-between bg-bg-custom dark:bg-slate-850 p-3 rounded-card border border-border-custom dark:border-slate-800 transition-colors">
                  <div>
                    <p className="text-xs text-secondary-text dark:text-slate-400 font-bold">Nitrogen Balance</p>
                    <p className="text-sm font-extrabold text-dark-text dark:text-slate-100">Sufficient</p>
                  </div>
                  <span className="text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded">Good</span>
                </div>

                <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 dark:border-primary/30 p-4 rounded-card">
                  <p className="text-xs font-extrabold text-primary dark:text-green-300 mb-1">AI CROP RECOMMENDATION</p>
                  <p className="text-lg font-bold text-dark-text dark:text-slate-100">Cotton & Groundnuts</p>
                  <p className="text-xs text-secondary-text dark:text-slate-400 font-semibold mt-1">Based on high soil water capacity and warm climate conditions.</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </Section>

      {/* Counters Stats */}
      <Section background="surface" className="border-t border-b border-border-custom dark:border-slate-800 py-12 bg-white dark:bg-slate-900 transition-colors">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary dark:text-green-300 rounded-full w-fit mx-auto">
              <Users size={24} />
            </div>
            <p className="text-3xl font-extrabold text-dark-text dark:text-slate-100 pt-2">25,000+</p>
            <p className="text-secondary-text dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Farmers Served</p>
          </div>
          <div className="space-y-1">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary dark:text-green-300 rounded-full w-fit mx-auto">
              <Sprout size={24} />
            </div>
            <p className="text-3xl font-extrabold text-dark-text dark:text-slate-100 pt-2">45+</p>
            <p className="text-secondary-text dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Crops Supported</p>
          </div>
          <div className="space-y-1">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary dark:text-green-300 rounded-full w-fit mx-auto">
              <CloudRain size={24} />
            </div>
            <p className="text-3xl font-extrabold text-dark-text dark:text-slate-100 pt-2">98%</p>
            <p className="text-secondary-text dark:text-slate-400 text-xs font-bold uppercase tracking-wider">Weather Accuracy</p>
          </div>
          <div className="space-y-1">
            <div className="p-3 bg-primary/10 dark:bg-primary/20 text-primary dark:text-green-300 rounded-full w-fit mx-auto">
              <Target size={24} />
            </div>
            <p className="text-3xl font-extrabold text-dark-text dark:text-slate-100 pt-2">94%</p>
            <p className="text-secondary-text dark:text-slate-400 text-xs font-bold uppercase tracking-wider">AI Accuracy Rate</p>
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section>
        <SectionTitle
          title="Why Choose KrishiMitra?"
          subtitle="A complete agricultural decision framework mapping soil metrics, climate alerts, and market price trends for optimal farming returns."
          badge="Core Advantages"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUsData.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Card key={idx} className="p-6 space-y-4 dark:bg-slate-900/60 dark:border-slate-800" shadow="medium">
                <div className="w-12 h-12 bg-primary/10 dark:bg-primary/20 rounded-card flex items-center justify-center text-primary dark:text-green-300 shrink-0">
                  <Icon size={24} />
                </div>
                <div className="text-left space-y-2">
                  <h3 className="text-lg font-bold text-dark-text dark:text-slate-100">{item.title}</h3>
                  <p className="text-secondary-text dark:text-slate-400 text-sm font-semibold leading-relaxed">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* How it Works Step Timeline */}
      <Section background="sidebar" className="bg-sidebar-bg dark:bg-slate-950/40 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 text-left space-y-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary dark:bg-primary/20 dark:text-green-300 uppercase tracking-wider">
              Setup Steps
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-dark-text dark:text-slate-100 tracking-tight leading-tight">
              Get Agronomy Insights in 4 Simple Steps
            </h2>
            <p className="text-secondary-text dark:text-slate-400 text-base font-semibold leading-relaxed">
              We guide you from registration to harvest. Match soil test variables, plan seed budgets, and monitor dynamic commodity price changes.
            </p>
            <div className="pt-2">
              <Link to="/profile/setup">
                <Button variant="primary">Start Setup Wizard</Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7">
            <Timeline steps={timelineSteps} />
          </div>
        </div>
      </Section>

      {/* Features Analytics Preview (NPK charts) */}
      <Section>
        <SectionTitle
          title="Interactive Farm Telemetry Previews"
          subtitle="Explore Soil nutrient changes over the season. Keep tabs on NPK levels, moisture index, and acidity to optimize application schedules."
          badge="Live Previews"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Chart preview */}
          <Card className="lg:col-span-8 p-6 bg-white dark:bg-slate-900/60 dark:border-slate-800" shadow="medium" hoverLift={false}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-dark-text dark:text-slate-100">Monthly Soil NPK Trend</h3>
                <p className="text-xs text-secondary-text dark:text-slate-400 font-semibold">Historical trace logs of Nitrogen, Phosphorus, Potassium balances</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded uppercase">
                Active Graph
              </span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={soilTrendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" className="hidden dark:block" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontWeight: 600
                    }}
                  />
                  <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
                  <Line type="monotone" dataKey="NPK" name="NPK Level (%)" stroke="#16A34A" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="moisture" name="Soil Moisture (%)" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Cards widgets preview */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-6">
            
            {/* Weather widget */}
            <Card className="p-5 flex-1 bg-white dark:bg-slate-900/60 dark:border-slate-800 text-left relative overflow-hidden" shadow="medium">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-400/10 rounded-full blur-xl" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-500/15 dark:text-sky-400 px-2 py-0.5 rounded">
                  Forecast (Pune, MH)
                </span>
                <CloudRain className="text-sky-500" size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-extrabold text-dark-text dark:text-slate-100">28°C</h4>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Light Showers Expected (3:00 PM)</p>
                <p className="text-xs text-secondary-text dark:text-slate-400 font-semibold leading-relaxed">
                  Advisory: Delayed fertilizer application recommended to avoid runoff wash.
                </p>
              </div>
            </Card>

            {/* Disease Alerts widget */}
            <Card className="p-5 flex-1 bg-white dark:bg-slate-900/60 dark:border-slate-800 text-left relative overflow-hidden" shadow="medium">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-400/10 rounded-full blur-xl" />
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-500/15 dark:text-red-400 px-2 py-0.5 rounded">
                  Early Crop Anomaly
                </span>
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-extrabold text-dark-text dark:text-slate-100">Yellow Rust Detected</h4>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Affecting 4 farms in adjacent sectors</p>
                <p className="text-xs text-secondary-text dark:text-slate-400 font-semibold leading-relaxed">
                  Advisory: Inspect wheat foliage for powdery spot margins. Spray Propiconazole if symptoms match.
                </p>
              </div>
            </Card>

          </div>

        </div>
      </Section>

      {/* Testimonials Review Slider */}
      <Section background="sidebar" className="bg-sidebar-bg dark:bg-slate-950/40 transition-colors">
        <SectionTitle
          title="What Our Farmers Say"
          subtitle="Real success logs and reviews from farmers across regions optimizing yields using KrishiMitra."
          badge="Testimonials"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <Card key={idx} className="p-6 space-y-4 dark:bg-slate-900/60 dark:border-slate-800 text-left flex flex-col justify-between" shadow="medium">
              <p className="text-secondary-text dark:text-slate-400 text-sm font-semibold leading-relaxed italic">
                "{t.review}"
              </p>
              <div className="flex items-center space-x-3 pt-4 border-t border-border-custom dark:border-slate-800">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-lg">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-dark-text dark:text-slate-100">{t.name}</h4>
                  <p className="text-xs text-secondary-text dark:text-slate-400 font-bold">{t.location}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA Join Now */}
      <Section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 bg-gradient-to-br from-primary to-accent p-8 md:p-12 rounded-[2rem] shadow-large text-white space-y-6">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-none">
            Ready to Upgrade Your Agricultural Yield?
          </h2>
          <p className="text-green-50 font-medium text-lg max-w-xl mx-auto">
            Get personalized advisory recommendations, weather calendars, NPK schedules, and disease detection toolkits.
          </p>
          <div className="pt-2 flex justify-center space-x-4">
            <Link to="/profile/setup">
              <Button className="bg-white text-primary hover:bg-green-50 border-none font-bold" size="lg">
                Setup Farm Profile
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="secondary" className="border-white text-white hover:bg-white/10 font-bold" size="lg">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Watch Demo Modal */}
      <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} title="KrishiMitra Demo Video" size="lg">
        <div className="space-y-4">
          <div className="aspect-video bg-slate-900 rounded-card flex flex-col items-center justify-center text-slate-400 relative overflow-hidden border border-border-custom dark:border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 to-slate-950 opacity-60" />
            <div className="p-4 bg-primary/20 text-primary dark:text-green-300 rounded-full mb-3 z-10 animate-bounce">
              <Sprout size={48} />
            </div>
            <p className="font-bold text-lg text-slate-100 z-10">KrishiMitra Walkthrough Simulation</p>
            <p className="text-xs text-slate-400 z-10 mt-1">Simulated agronomy analysis and crop forecast widgets in action.</p>
          </div>
          <p className="text-sm text-secondary-text dark:text-slate-400 font-semibold leading-relaxed text-center">
            In this demo, we outline NPK testing, mobile crop scanning, price peak indicators, and multi-lingual voice assistants.
          </p>
          <div className="flex justify-center">
            <Button variant="primary" onClick={() => setIsDemoOpen(false)}>
              Got It
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Home;
