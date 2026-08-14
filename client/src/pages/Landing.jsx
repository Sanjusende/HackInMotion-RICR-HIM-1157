import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  CloudRain,
  Droplets,
  TrendingUp,
  Mic,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Bell,
  UserPlus,
  MapPin,
  BrainCircuit,
  LineChart,
  ChevronDown,
  Sparkles,
  Layers,
  Sun,
  Wind,
  Zap,
  X,
  Camera,
  AlertTriangle,
  Clock,
  Compass,
  Check,
  Globe,
  Database,
  Radio,
  BarChart3,
} from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
  const [openFaq, setOpenFaq] = useState(0);

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  // 1. Problems & KrishiMitra Solution
  const problems = [
    {
      title: 'Uncertain Weather',
      desc: 'Unexpected rain or dry spells damage crops without real-time telemetry.',
      icon: CloudRain,
      color: 'bg-rose-50 border-rose-200 text-rose-600',
    },
    {
      title: 'Changing Market Prices',
      desc: 'Selling at low rates due to lack of live mandi commodity trends.',
      icon: TrendingUp,
      color: 'bg-amber-50 border-amber-200 text-amber-600',
    },
    {
      title: 'Lack of Useful Info',
      desc: 'Fragmented advice makes soil moisture & disease treatment hard to find.',
      icon: AlertTriangle,
      color: 'bg-orange-50 border-orange-200 text-orange-600',
    },
    {
      title: 'Difficulty Making Decisions',
      desc: 'Relying on traditional guesswork instead of data-backed insights.',
      icon: BrainCircuit,
      color: 'bg-purple-50 border-purple-200 text-purple-600',
    },
  ];

  // 2. Key Features (Implemented in Project)
  const actualFeatures = [
    {
      title: 'Weather Information',
      icon: CloudRain,
      badge: 'Open-Meteo API',
      color: 'from-blue-500 to-cyan-600',
      description:
        'Real-time temperature, humidity, wind, 7-day rainfall forecasts, and automated rain alerts.',
      link: '/weather',
    },
    {
      title: 'Market/Mandi Prices',
      icon: TrendingUp,
      badge: 'Live Mandi Rates',
      color: 'from-emerald-500 to-teal-600',
      description:
        'Live mandi commodity prices, 7d/30d trend charts, and nearby market price comparisons.',
      link: '/market',
    },
    {
      title: 'Crop Recommendations',
      icon: Sprout,
      badge: 'NPK Soil Engine',
      color: 'from-green-500 to-emerald-700',
      description:
        'Intelligent crop selection tailored to your soil profile (NPK), climate, and seasonal suitability.',
      link: '/crop-recommendation',
    },
    {
      title: 'AI Agricultural Assistance',
      icon: Mic,
      badge: 'Multi-Lingual Voice',
      color: 'from-amber-500 to-orange-600',
      description:
        'Context-aware AI voice assistant in regional languages plus crop leaf disease photo scanning.',
      link: '/voice-assistant',
    },
    {
      title: 'Location & Maps',
      icon: MapPin,
      badge: 'Farm Telemetry',
      color: 'from-indigo-500 to-violet-600',
      description:
        'Automatic farm location detection for precision micro-climate and nearby mandi mapping.',
      link: '/farm-profile',
    },
    {
      title: 'Farmer Dashboard',
      icon: Layers,
      badge: 'Control Center',
      color: 'from-cyan-500 to-blue-600',
      description:
        'Single-screen overview of weather, mandi rates, active crop status, and PDF agronomy downloads.',
      link: '/dashboard',
    },
    {
      title: 'Alerts & Notifications',
      icon: Bell,
      badge: 'Instant Risk Warnings',
      color: 'from-rose-500 to-red-600',
      description:
        'Real-time notifications for heavy rainfall risk, sudden market price spikes, and irrigation alerts.',
      link: '/dashboard',
    },
    {
      title: 'Fertilizer & Irrigation Planning',
      icon: Droplets,
      badge: 'Resource Saver',
      color: 'from-purple-500 to-indigo-600',
      description:
        'Automated water decision engine (IRRIGATE / DONT_IRRIGATE) and NPK fertilizer optimization.',
      link: '/fertilizer-planning',
    },
  ];

  // 3. How It Works (Simple 4 steps)
  const steps = [
    {
      step: '01',
      title: 'Connect',
      desc: 'Create your free account and set your farm coordinates.',
      icon: UserPlus,
    },
    {
      step: '02',
      title: 'Get Data',
      desc: 'KrishiMitra aggregates live weather, mandi prices, and soil profiles.',
      icon: MapPin,
    },
    {
      step: '03',
      title: 'AI Insights',
      desc: 'Get automated irrigation advice, price trends, and disease scans.',
      icon: BrainCircuit,
    },
    {
      step: '04',
      title: 'Make Better Decisions',
      desc: 'Save water, reduce fertilizer costs, and sell crops at peak rates.',
      icon: LineChart,
    },
  ];

  // 4. Why KrishiMitra? (5 Key Benefits)
  const benefits = [
    {
      title: 'Smart Decision Making',
      desc: 'Base every farm action on reliable data instead of guesswork.',
      icon: CheckCircle2,
    },
    {
      title: 'Real-Time Information',
      desc: 'Instant weather forecasts, mandi price updates, and storm alerts.',
      icon: Clock,
    },
    {
      title: 'AI-Powered Assistance',
      desc: 'Multi-lingual voice support and leaf disease photo diagnostics.',
      icon: Cpu,
    },
    {
      title: 'Easy-to-Use Platform',
      desc: 'Simple icon-driven mobile-first interface designed for farmers.',
      icon: Sparkles,
    },
    {
      title: 'Agriculture-Focused Insights',
      desc: 'Specific recommendations tailored to Indian soil and crop varieties.',
      icon: Sprout,
    },
  ];

  // 5. Technologies Actually Implemented
  const techStack = [
    { name: 'React 19 & Vite', desc: 'Frontend UI Framework', icon: Globe },
    { name: 'Node.js & Express 5', desc: 'REST API Backend', icon: Database },
    { name: 'MongoDB & Mongoose', desc: 'Cloud Database', icon: Layers },
    { name: 'Open-Meteo Weather API', desc: 'Live Weather Feed', icon: Sun },
    { name: 'Mandi Market Feed API', desc: 'Real-Time Commodity Prices', icon: TrendingUp },
    { name: 'Socket.IO', desc: 'Instant Push Alerts', icon: Radio },
    { name: 'Tailwind CSS v4', desc: 'Responsive Design System', icon: Sparkles },
    { name: 'Framer Motion', desc: 'Smooth Micro-animations', icon: Zap },
  ];

  const faqs = [
    {
      q: 'What is KrishiMitra?',
      a: 'KrishiMitra is an AI-powered smart agriculture platform that helps farmers make better decisions using real-time weather forecasts, market prices, crop recommendations, irrigation planning, and disease detection.',
    },
    {
      q: 'How does KrishiMitra calculate smart irrigation guidance?',
      a: 'Our Irrigation Engine evaluates crop growth stage water requirements combined with 7-day Open-Meteo rainfall forecast probabilities.',
    },
    {
      q: 'Is KrishiMitra free to use for farmers?',
      a: 'Yes! KrishiMitra is fully accessible for farmers to inspect weather, mandi prices, crop recommendations, and voice guidance.',
    },
    {
      q: 'Does KrishiMitra support mobile smartphones?',
      a: 'Yes, KrishiMitra is a 100% responsive web app optimized for mobile smartphones, tablets, and desktop computers.',
    },
  ];

  return (
    <div
      id="home"
      className="relative bg-[#F8FAF6] text-slate-900 overflow-hidden font-sans selection:bg-emerald-600 selection:text-white"
    >
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute top-1/3 left-0 -z-10 w-[250px] sm:w-[450px] h-[250px] sm:h-[450px] rounded-full bg-lime-200/30 blur-3xl" />

      {/* ======================================================== */}
      {/* 1. HERO SECTION — What is KrishiMitra? */}
      {/* ======================================================== */}
      <section className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300/80 text-emerald-900 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
              >
                <Sparkles size={14} className="text-emerald-600 animate-pulse shrink-0" />
                <span className="truncate">AI-POWERED AGRICROP TELEMETRY PLATFORM</span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
              >
                KrishiMitra — <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500">
                  Your Smart Farming Companion
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-slate-600 text-sm sm:text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl"
              >
                KrishiMitra uses technology, real-time agricultural information, and AI-driven
                insights to help farmers make better decisions every day.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2"
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shadow-lg shadow-emerald-700/20 font-bold flex items-center justify-center gap-2 text-sm sm:text-base px-7 py-3.5 rounded-2xl hover:scale-[1.02] transition-all"
                  >
                    Get Started <ArrowRight size={18} />
                  </Button>
                </Link>

                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, 'features')}
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="w-full sm:w-auto font-bold text-sm sm:text-base px-6 py-3.5 rounded-2xl border-emerald-200 text-slate-700 hover:bg-emerald-50/80 transition-all justify-center"
                  >
                    Explore Features
                  </Button>
                </a>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="pt-4 border-t border-emerald-100 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-semibold text-slate-600"
              >
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> Real-time Weather
                  Telemetry
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> Live Mandi Market
                  Feeds
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> AI Voice & Leaf
                  Diagnostics
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Mock Showcase */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md p-1.5 rounded-[2.5rem] bg-gradient-to-b from-emerald-400/30 via-emerald-200/20 to-transparent shadow-2xl backdrop-blur-xl">
                <div className="bg-white/95 backdrop-blur-md rounded-[2.2rem] border border-emerald-100 p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                      KrishiMitra Telemetry Live
                    </span>
                  </div>

                  {/* Weather Widget */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 flex items-center justify-between shadow-sm gap-2">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm shrink-0">
                        <Sun size={20} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-500 font-semibold truncate">
                          Local Farm Weather
                        </p>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                          28°C • Clear Sky
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full shrink-0">
                      Rain: 10%
                    </span>
                  </div>

                  {/* Irrigation Recommendation */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Droplets size={16} className="text-cyan-600 shrink-0" />
                        <span className="text-xs font-extrabold text-slate-700 truncate">
                          Irrigation Recommendation
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md shrink-0">
                        OPTIMAL
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      Soil moisture optimal at 68%. No rain forecast over next 48 hrs.
                    </p>
                  </div>

                  {/* Mandi Rate */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Wheat Mandi Price
                      </span>
                      <p className="text-base sm:text-lg font-extrabold text-white">
                        ₹2,450 <span className="text-xs font-normal text-slate-300">/ Quintal</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-extrabold border border-emerald-500/30 shrink-0">
                      <TrendingUp size={14} /> +4.2% Rising
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PROBLEM + SOLUTION */}
      {/* ======================================================== */}
      <section
        id="problem-solution"
        className="py-12 sm:py-16 md:py-20 bg-white border-t border-b border-emerald-100/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              The Agricultural Problem
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Challenges Farmers Face
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed">
              Without accurate data, farming decisions often depend on unpredictable weather and
              market guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {problems.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/80 rounded-3xl p-5 sm:p-6 border border-slate-200/80 space-y-3 flex flex-col justify-start"
                >
                  <div
                    className={`w-11 h-11 rounded-2xl border ${p.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Solution Highlight Banner */}
          <div className="mt-8 sm:mt-10 p-6 sm:p-8 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-left">
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
                The KrishiMitra Solution
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                One Connected Platform for Smarter Farming
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl font-medium leading-relaxed">
                KrishiMitra combines weather telemetry, mandi commodity feeds, NPK soil
                compatibility, and AI assistance to empower farmers with actionable real-time
                insights.
              </p>
            </div>
            <Link to="/register" className="w-full lg:w-auto shrink-0">
              <Button
                variant="primary"
                size="md"
                className="w-full lg:w-auto font-bold bg-emerald-400 text-slate-950 hover:bg-emerald-300 justify-center"
              >
                Try KrishiMitra Now <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. KEY FEATURES */}
      {/* ======================================================== */}
      <section id="features" className="py-12 sm:py-16 md:py-24 bg-[#F8FAF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Actual Features Available in KrishiMitra
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium">
              Every tool is implemented directly in our project to help you plan, irrigate, monitor,
              and sell smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {actualFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full truncate">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-slate-600 text-xs font-medium leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <Link
                      to={feat.link}
                      className="hover:underline flex items-center justify-between w-full"
                    >
                      <span>Open Feature</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform shrink-0"
                      />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HOW IT WORKS */}
      {/* ======================================================== */}
      <section
        id="how-it-works"
        className="py-12 sm:py-16 md:py-24 bg-white border-t border-b border-emerald-100/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Simple Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              How KrishiMitra Works
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium">
              Connect → Get Data → AI Insights → Make Better Decisions
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((st, i) => {
              const Icon = st.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/80 rounded-3xl p-6 sm:p-7 border border-slate-200/80 hover:bg-white hover:shadow-lg transition-all space-y-4 text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                        <Icon size={24} />
                      </div>
                      <span className="text-xl font-black text-emerald-300">{st.step}</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{st.title}</h3>
                    <p className="text-slate-600 text-xs font-medium leading-relaxed">{st.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200/60 text-[11px] font-bold text-emerald-700">
                    Seamless & Automated
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. WHY KRISHIMITRA? */}
      {/* ======================================================== */}
      <section id="why-us" className="py-12 sm:py-16 md:py-24 bg-[#F8FAF6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Key Benefits
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose KrishiMitra?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium">
              Empowering farmers with data-driven intelligence for a more profitable harvest.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm hover:shadow-md transition-all space-y-3 text-left"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{b.title}</h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TECHNOLOGY */}
      {/* ======================================================== */}
      <section
        id="tech"
        className="py-12 sm:py-16 md:py-20 bg-white border-t border-b border-emerald-100/80"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3">
            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
              Stack Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Built with Modern Technologies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              AI + Weather APIs + Mandi Feeds + Modern Web Frameworks
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {techStack.map((t, i) => {
              const Icon = t.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:bg-white hover:border-emerald-300 transition-all flex items-start gap-3.5"
                >
                  <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{t.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. ABOUT & FAQ */}
      {/* ======================================================== */}
      <section id="about" className="py-12 sm:py-16 bg-[#F8FAF6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full uppercase tracking-wider inline-block">
            About KrishiMitra
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Empowering Farmers Through Technology
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            KrishiMitra is designed to make precision agriculture accessible to every farmer,
            providing clear, real-time insights on weather, market prices, and crop management.
          </p>

          <div className="pt-4 sm:pt-6 space-y-3.5 text-left">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 text-center mb-6">
              Frequently Asked Questions
            </h3>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 sm:px-6 py-4 text-left flex items-center justify-between text-slate-900 font-bold text-xs sm:text-sm hover:text-emerald-700 transition-colors cursor-pointer gap-2"
                >
                  <span className="pr-2">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-600' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 sm:px-6 pb-4 text-slate-600 text-xs font-medium leading-relaxed border-t border-slate-50 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FINAL CTA SECTION */}
      {/* ======================================================== */}
      <section
        id="get-started"
        className="py-12 sm:py-16 md:py-24 bg-white border-t border-emerald-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-16 shadow-2xl overflow-hidden text-center space-y-5 sm:space-y-6">
            <div className="absolute top-0 right-0 -z-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="inline-flex items-center justify-center p-2.5 sm:p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-1">
              <Sprout size={28} className="text-emerald-300" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
              Make Every Farming Decision Smarter with KrishiMitra.
            </h2>

            <p className="text-emerald-100 text-xs sm:text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Join farmers across India using data-driven insights to boost crop yields and sell at
              optimal market prices.
            </p>

            <div className="flex justify-center pt-2 sm:pt-4 relative z-10">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-emerald-900 hover:bg-emerald-50 border-none font-extrabold text-sm sm:text-base px-8 py-3.5 sm:py-4 rounded-2xl shadow-xl hover:scale-105 transition-all justify-center">
                  Get Started Now <ArrowRight size={18} className="ml-2" />
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
