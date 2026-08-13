import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  CloudRain,
  Droplets,
  TrendingUp,
  Mic,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Users,
  Target,
  Play,
  CheckCircle2,
  BarChart3,
  FileText,
  Bell,
  UserPlus,
  MapPin,
  BrainCircuit,
  LineChart,
  Star,
  ChevronDown,
  Sparkles,
  Layers,
  Sun,
  Wind,
  Thermometer,
  Activity,
  DollarSign,
  Award,
  Zap,
  X,
  Camera
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Landing = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [activeDashboardTab, setActiveDashboardTab] = useState('overview');
  const [openFaq, setOpenFaq] = useState(0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 14 }
    }
  };

  const stats = [
    { icon: Users, value: '1,000+', label: 'Farmers Empowered', badge: 'Active nationwide' },
    { icon: Cpu, value: '20+', label: 'AI Smart Features', badge: 'Real-time engines' },
    { icon: Target, value: '95%', label: 'Prediction Accuracy', badge: 'Validated models' },
    { icon: Award, value: '30%', label: 'Water & Cost Saved', badge: 'Average per season' }
  ];

  const features = [
    {
      icon: Cpu,
      title: 'AI Crop Recommendation',
      description: 'Get precise crop advice based on NPK soil profiles, rainfall forecasts, and local climate suitability.',
      tag: 'Machine Learning',
      color: 'from-emerald-500 to-green-600'
    },
    {
      icon: CloudRain,
      title: 'Hyperlocal Weather Forecast',
      description: 'Real-time Open-Meteo forecasts with temperature, humidity, wind, and severe weather alert risk detection.',
      tag: 'Real-time API',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation Engine',
      description: 'Automated water decision engine (IRRIGATE / DONT_IRRIGATE) factoring soil moisture deficit and rain probabilities.',
      tag: 'Water Saver',
      color: 'from-sky-500 to-indigo-600'
    },
    {
      icon: Camera,
      title: 'Crop Disease Scan',
      description: 'Upload leaf photos or describe symptoms to identify diseases, get treatment steps, and trigger community warnings.',
      tag: 'Computer Vision',
      color: 'from-amber-500 to-orange-600'
    },
    {
      icon: TrendingUp,
      title: 'Mandi Market Intelligence',
      description: 'Track live mandi prices, historical 7d/30d/90d trends, and nearby market price comparisons to sell at peak rates.',
      tag: 'Market Analytics',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      icon: BarChart3,
      title: 'Yield & Revenue Prediction',
      description: 'Forecast potential crop yields per acre and estimate gross earnings based on live market pricing benchmarks.',
      tag: 'Predictive Tech',
      color: 'from-violet-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Agronomy Reports',
      description: 'Generate comprehensive downloadable PDF agronomy reports for bank loans, crop insurance, and soil health records.',
      tag: 'PDF Export',
      color: 'from-rose-500 to-pink-600'
    },
    {
      icon: Mic,
      title: 'Voice Assistant',
      description: 'Context-aware voice queries supporting multi-lingual voice responses (Hindi, English, Marathi, Telugu, Punjabi).',
      tag: 'AI Voice',
      color: 'from-amber-600 to-yellow-600'
    },
    {
      icon: Bell,
      title: 'Smart Push Notifications',
      description: 'Instant notification alerts for heavy rain forecasts, pest outbreaks in nearby farms, and mandi price spikes.',
      tag: 'Instant Alerts',
      color: 'from-emerald-500 to-teal-600'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Register Account',
      description: 'Create your free account in under 30 seconds with basic contact details.',
      icon: UserPlus
    },
    {
      number: '02',
      title: 'Create Farm Profile',
      description: 'Add land size, select soil type (Black, Red, Alluvial), and set current crop.',
      icon: MapPin
    },
    {
      number: '03',
      title: 'Receive AI Insights',
      description: 'Get automated daily irrigation advice, weather alerts, and market price trends.',
      icon: BrainCircuit
    },
    {
      number: '04',
      title: 'Maximize Yield & Profit',
      description: 'Execute data-backed decisions to save water, reduce fertilizer costs, and boost earnings.',
      icon: LineChart
    }
  ];

  const testimonials = [
    {
      name: 'Ramesh Kumar Patel',
      role: 'Wheat & Soybean Farmer',
      location: 'Indore, Madhya Pradesh',
      avatar: '👨‍🌾',
      stars: 5,
      quote: 'KrishiMitra helped me save 30% on my irrigation costs during the Rabi season. The mandi price alerts enabled me to sell my wheat at ₹2,450/quintal at peak rate!'
    },
    {
      name: 'Sunita Deshmukh',
      role: 'Cotton & Gram Grower',
      location: 'Nagpur, Maharashtra',
      avatar: '👩‍🌾',
      stars: 5,
      quote: 'The AI leaf health scan identified early bollworm infestation on my cotton crop before it spread. The treatment guidance saved my entire harvest.'
    },
    {
      name: 'Gurpreet Singh',
      role: 'Paddy & Maize Cultivator',
      location: 'Ludhiana, Punjab',
      avatar: '👨‍🌾',
      stars: 5,
      quote: 'Voice Assistant in Hindi is a game-changer! I just speak into my phone asking whether to irrigate today, and KrishiMitra checks local weather and answers instantly.'
    }
  ];

  const faqs = [
    {
      q: 'How does KrishiMitra calculate smart irrigation recommendations?',
      a: 'Our Irrigation Engine evaluates crop water requirements for your specific growth stage (Initial, Vegetative, Flowering) combined with live Open-Meteo 7-day rainfall probability and temperature data.'
    },
    {
      q: 'Is KrishiMitra free to use for smallholder farmers?',
      a: 'Yes! KrishiMitra is designed to empower all farmers. Basic farm profiling, weather forecasts, crop health inspection, and mandi market rate features are completely free.'
    },
    {
      q: 'Can I use KrishiMitra if I do not know technical terms?',
      a: 'Absolutely. KrishiMitra features a simple, icon-driven user interface and an intuitive Voice Assistant that supports natural spoken queries in regional Indian languages.'
    },
    {
      q: 'Where does the market pricing data come from?',
      a: 'Market price data integrates benchmark mandi rates across regional mandis (such as Indore, Ujjain, Nagpur) along with calculated 7-day, 30-day, and 90-day price trend analysis.'
    },
    {
      q: 'Does KrishiMitra work on mobile smartphones?',
      a: 'Yes, KrishiMitra is a 100% responsive web app optimized for mobile devices, tablets, and desktop computers with glassmorphic, fast-loading performance.'
    }
  ];

  const techStack = [
    { name: 'React 19', category: 'Frontend UI' },
    { name: 'Node.js & Express', category: 'Backend Server' },
    { name: 'MongoDB & Mongoose', category: 'Database & Schemas' },
    { name: 'Open-Meteo AI API', category: 'Weather Engine' },
    { name: 'Cloudinary', category: 'Media Storage' },
    { name: 'JWT & Bcrypt', category: 'Security & Auth' },
    { name: 'Framer Motion', category: 'Animations' },
    { name: 'Tailwind CSS', category: 'Styling' }
  ];

  return (
    <div className="relative bg-[#F7FFF5] text-slate-900 overflow-hidden font-sans selection:bg-emerald-600 selection:text-white">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 right-1/4 -z-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-300/20 to-green-400/10 blur-3xl" />
      <div className="absolute top-1/3 left-0 -z-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-lime-200/30 to-emerald-200/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 -z-10 w-[550px] h-[550px] rounded-full bg-emerald-200/15 blur-3xl" />

      {/* ======================================================== */}
      {/* HERO SECTION */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Innovation Badge */}
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 bg-emerald-100/80 border border-emerald-300/60 text-emerald-900 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
              >
                <Sparkles size={14} className="text-emerald-700 animate-spin-slow" />
                <span>🌱 AI-POWERED SMART AGRICULTURE • HACKINMOTION 2026</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]"
              >
                Empowering Farmers with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500">AI-Powered Smart Decisions</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                variants={itemVariants}
                className="text-slate-600 text-lg sm:text-xl font-medium leading-relaxed max-w-2xl"
              >
                KrishiMitra is an all-in-one AI platform that helps farmers make better decisions using real-time weather forecasts, crop recommendations, irrigation planning, mandi market intelligence, and leaf disease detection.
              </motion.p>

              {/* Action Buttons */}
              <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pt-3">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-lg shadow-emerald-700/20 font-bold flex items-center gap-2 text-base px-7 py-3.5 rounded-2xl hover:scale-[1.02] transition-all">
                    Get Started <ArrowRight size={18} />
                  </Button>
                </Link>

                <a href="#features">
                  <Button variant="secondary" size="lg" className="font-bold text-base px-6 py-3.5 rounded-2xl border-emerald-200 text-slate-700 hover:bg-emerald-50/80 transition-all">
                    Explore Features
                  </Button>
                </a>

                <button
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <Play size={14} className="ml-0.5 fill-emerald-700" />
                  </div>
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants} className="pt-6 border-t border-emerald-100 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Free for Farmers
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Multi-Lingual Support
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <CheckCircle2 size={16} className="text-emerald-600" /> Live Mandi API
                </div>
              </motion.div>
            </div>

            {/* Right Interactive Mock Showcase */}
            <motion.div variants={itemVariants} className="lg:col-span-5 relative flex justify-center">
              {/* Outer Glow frame */}
              <div className="relative w-full max-w-lg p-2 rounded-[2.5rem] bg-gradient-to-b from-emerald-400/30 via-emerald-200/20 to-transparent p-1 shadow-2xl backdrop-blur-xl">
                {/* Main Glass Dashboard Preview Card */}
                <div className="bg-white/90 backdrop-blur-md rounded-[2.2rem] border border-emerald-100/80 p-6 shadow-xl space-y-5">
                  {/* Mock Window Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      KrishiMitra AI v2.4 Live
                    </span>
                  </div>

                  {/* Floating Widget 1: Weather Alert */}
                  <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200/60 flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-sm">
                        <Sun size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold">Indore Mandi Weather</p>
                        <p className="text-sm font-extrabold text-slate-900">28°C • Clear Sky</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Rain: 12%
                      </span>
                    </div>
                  </div>

                  {/* Floating Widget 2: Irrigation Recommendation */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Droplets size={16} className="text-cyan-600" />
                        <span className="text-xs font-extrabold text-slate-700">Irrigation Recommendation</span>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                        IRRIGATE
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">
                      High soil evapotranspiration (5.5mm/day) with 0mm expected rainfall over next 48 hrs.
                    </p>
                  </div>

                  {/* Floating Widget 3: Live Mandi Price */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Wheat Mandi Rate</span>
                      <p className="text-lg font-extrabold text-white">₹2,450 <span className="text-xs font-normal text-slate-300">/ Quintal</span></p>
                    </div>
                    <div className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl text-xs font-extrabold border border-emerald-500/30">
                      <TrendingUp size={14} /> +4.2% Rising
                    </div>
                  </div>
                </div>

                {/* Floating Badge Left */}
                <div className="absolute -left-6 bottom-12 bg-white/95 backdrop-blur-md border border-emerald-200 p-3 rounded-2xl shadow-xl flex items-center space-x-3 hidden sm:flex">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Sprout size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Optimal Soil NPK</p>
                    <p className="text-xs font-extrabold text-slate-800">Black Soil • pH 6.8</p>
                  </div>
                </div>

                {/* Floating Badge Right */}
                <div className="absolute -right-6 top-16 bg-white/95 backdrop-blur-md border border-emerald-200 p-3 rounded-2xl shadow-xl flex items-center space-x-3 hidden sm:flex">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                    <Zap size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">AI Accuracy</p>
                    <p className="text-xs font-extrabold text-emerald-700">95.4% Validated</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Statistics Grid Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-16 md:mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm border border-emerald-100 p-5 md:p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {stat.badge}
                    </span>
                  </div>
                  <p className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                  <p className="text-xs md:text-sm font-semibold text-slate-600">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FEATURES SECTION */}
      {/* ======================================================== */}
      <section id="features" className="py-20 bg-white/60 backdrop-blur-sm border-t border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Smart Features Suite
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Next-Generation Agriculture Tools
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              Engineered for smallholder and large-scale farmers to boost yields, prevent crop losses, and maximize selling revenues.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="bg-white rounded-3xl p-6 md:p-7 border border-emerald-100/80 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <Icon size={24} />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                        {feature.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Explore Capability</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* HOW IT WORKS */}
      {/* ======================================================== */}
      <section id="how-it-works" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Simple Workflow
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              4 Steps to Smart Farming Success
            </h2>
            <p className="text-slate-600 text-base md:text-lg font-medium">
              Start making data-driven decisions for your land in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative group text-left">
                  <div className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm hover:shadow-lg transition-all space-y-4 relative z-10 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <Icon size={24} />
                        </div>
                        <span className="text-2xl font-black text-emerald-200 group-hover:text-emerald-500 transition-colors">
                          {step.number}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900">{step.title}</h3>
                      <p className="text-slate-600 text-xs font-medium leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* WHY KRISHIMITRA (SPLIT COMPARISON) */}
      {/* ======================================================== */}
      <section id="why-us" className="py-20 bg-emerald-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Comparison Card */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-extrabold text-emerald-300 bg-emerald-800/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider border border-emerald-700">
                Why Farmers Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Traditional Intuition vs <span className="text-emerald-400">AI-Powered Farming</span>
              </h2>
              <p className="text-emerald-100 text-base font-medium leading-relaxed">
                Traditional farming relies on guesswork and outdated seasonal habits. KrishiMitra combines satellite weather telemetry, local mandi market feeds, and machine learning to maximize farm profitability.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 bg-emerald-800/60 rounded-2xl border border-emerald-700/80 flex items-start gap-3">
                  <div className="p-2 bg-emerald-600/40 text-emerald-300 rounded-xl shrink-0 mt-0.5">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">25-35% Higher Yield</h4>
                    <p className="text-xs text-emerald-200 mt-0.5">Optimal sowing times and balanced NPK fertilizer recommendations.</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-800/60 rounded-2xl border border-emerald-700/80 flex items-start gap-3">
                  <div className="p-2 bg-emerald-600/40 text-emerald-300 rounded-xl shrink-0 mt-0.5">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Save Up to 40% Irrigation Water</h4>
                    <p className="text-xs text-emerald-200 mt-0.5">Irrigate only when needed using live evapotranspiration algorithms.</p>
                  </div>
                </div>

                <div className="p-4 bg-emerald-800/60 rounded-2xl border border-emerald-700/80 flex items-start gap-3">
                  <div className="p-2 bg-emerald-600/40 text-emerald-300 rounded-xl shrink-0 mt-0.5">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Sell at Peak Mandi Prices</h4>
                    <p className="text-xs text-emerald-200 mt-0.5">Track 7d/30d market trends to know exactly when and where to sell.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Comparison Visual */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full bg-emerald-800/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-emerald-700/80 space-y-6">
                <h3 className="text-lg font-bold text-white flex items-center justify-between">
                  <span>Farm Operational Impact</span>
                  <span className="text-xs text-emerald-300 bg-emerald-700/60 px-2.5 py-1 rounded-full">Per 5 Acres / Season</span>
                </h3>

                <div className="space-y-4 text-xs font-semibold">
                  <div>
                    <div className="flex justify-between text-emerald-200 mb-1">
                      <span>Water Consumption</span>
                      <span className="text-emerald-400 font-bold">-40% Saved</span>
                    </div>
                    <div className="w-full bg-emerald-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-emerald-800">
                      <div className="bg-emerald-400 h-full rounded-full w-[60%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-emerald-200 mb-1">
                      <span>Fertilizer Expenditure</span>
                      <span className="text-emerald-400 font-bold">-₹14,500 Saved</span>
                    </div>
                    <div className="w-full bg-emerald-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-emerald-800">
                      <div className="bg-lime-400 h-full rounded-full w-[65%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-emerald-200 mb-1">
                      <span>Net Harvest Revenue</span>
                      <span className="text-emerald-300 font-bold">+₹42,000 Increase</span>
                    </div>
                    <div className="w-full bg-emerald-950/80 h-3 rounded-full overflow-hidden p-0.5 border border-emerald-800">
                      <div className="bg-gradient-to-r from-emerald-400 to-green-300 h-full rounded-full w-[90%]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-700/50 text-center">
                  <p className="text-xs text-emerald-300 font-semibold">Average ROI for KrishiMitra Farmers</p>
                  <p className="text-3xl font-black text-white mt-1">4.2x Net Return</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DASHBOARD PREVIEW SECTION */}
      {/* ======================================================== */}
      <section id="dashboard-preview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Interactive Preview
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Experience the KrishiMitra Control Center
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Click the tabs below to explore real-time dashboard analytics.
            </p>

            {/* Dashboard Tabs */}
            <div className="flex justify-center flex-wrap gap-2 pt-4">
              {[
                { id: 'overview', label: 'Farm Overview', icon: Layers },
                { id: 'weather', label: 'Weather Forecast', icon: CloudRain },
                { id: 'market', label: 'Market Prices', icon: TrendingUp },
                { id: 'health', label: 'Crop Health Scan', icon: Camera }
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeDashboardTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDashboardTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Window Preview Frame */}
          <div className="bg-slate-900 rounded-[2.5rem] p-4 md:p-8 shadow-2xl border border-slate-800 text-white max-w-5xl mx-auto">
            {/* Window Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs font-mono text-slate-400">app.krishimitra.org/dashboard</span>
              </div>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Connected: Indore Farm #1024
              </span>
            </div>

            {/* Tab Content Display */}
            <div className="min-h-[320px]">
              {activeDashboardTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 space-y-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">Land & Crop</span>
                    <p className="text-xl font-extrabold text-white">5.0 Acres • Wheat</p>
                    <div className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                      Growth Stage: Vegetative (Day 28)
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 space-y-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">Irrigation Status</span>
                    <p className="text-xl font-extrabold text-emerald-400">No Action Required</p>
                    <p className="text-xs text-slate-300">Soil moisture optimal at 68%. Rain probability 10%.</p>
                  </div>

                  <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700/70 space-y-3">
                    <span className="text-xs text-slate-400 font-bold uppercase">Market Price Rate</span>
                    <p className="text-xl font-extrabold text-white">₹2,450 / Quintal</p>
                    <p className="text-xs text-emerald-400 font-bold">Trending +4.2% higher this week</p>
                  </div>
                </div>
              )}

              {activeDashboardTab === 'weather' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center">
                      <Sun className="mx-auto text-amber-400 mb-1" size={24} />
                      <p className="text-xs text-slate-400">Temperature</p>
                      <p className="text-lg font-bold text-white">28°C</p>
                    </div>
                    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center">
                      <Droplets className="mx-auto text-cyan-400 mb-1" size={24} />
                      <p className="text-xs text-slate-400">Humidity</p>
                      <p className="text-lg font-bold text-white">62%</p>
                    </div>
                    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center">
                      <Wind className="mx-auto text-teal-400 mb-1" size={24} />
                      <p className="text-xs text-slate-400">Wind Speed</p>
                      <p className="text-lg font-bold text-white">12 km/h</p>
                    </div>
                    <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-center">
                      <CloudRain className="mx-auto text-indigo-400 mb-1" size={24} />
                      <p className="text-xs text-slate-400">Precipitation</p>
                      <p className="text-lg font-bold text-white">0.0 mm</p>
                    </div>
                  </div>
                  <div className="p-4 bg-emerald-950/60 rounded-2xl border border-emerald-800/60 text-xs text-emerald-300 font-semibold">
                    7-Day Forecast: Clear skies expected through Thursday. Excellent conditions for fertilizer top-dressing.
                  </div>
                </div>
              )}

              {activeDashboardTab === 'market' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
                    <div>
                      <p className="text-xs text-slate-400">Selected Commodity</p>
                      <p className="text-lg font-extrabold text-white">Wheat (Sharbati)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Indore Benchmark Mandi</p>
                      <p className="text-lg font-extrabold text-emerald-400">₹2,450 / Quintal</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 text-xs text-slate-300">
                    Selling Insight: Recent prices have been trending upward over 7 days (+4.2%). Compare against holding costs before deciding to sell.
                  </div>
                </div>
              )}

              {activeDashboardTab === 'health' && (
                <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                      Scan Result: Healthy
                    </span>
                    <span className="text-xs text-slate-400">Confidence: 94.2%</span>
                  </div>
                  <h4 className="text-lg font-extrabold text-white">No Critical Leaf Disease Detected</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Visual leaf examination indicates standard chlorophyll density. Continue current irrigation schedule and monitor for aphids after rainfall events.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* TESTIMONIALS */}
      {/* ======================================================== */}
      <section className="py-20 bg-slate-50/70 border-t border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Farmer Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted by Farmers Across India
            </h2>
            <p className="text-slate-600 text-base font-medium">
              Read how KrishiMitra is making a real difference on ground level.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-3xl p-7 border border-emerald-100 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {Array.from({ length: t.stars }).map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-sm font-medium italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-4 border-t border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{t.name}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{t.role} • {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* TECH STACK SECTION */}
      {/* ======================================================== */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-8">
            Powered by Enterprise MERN & AI Telemetry Architecture
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 flex items-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{tech.name}</span>
                <span className="text-[10px] text-slate-400 font-normal">({tech.category})</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FAQ SECTION */}
      {/* ======================================================== */}
      <section id="faq" className="py-20 bg-slate-50/50 border-t border-emerald-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-3">
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Questions & Answers
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-emerald-100/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between text-slate-900 font-bold text-base hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-emerald-600' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-600 text-sm font-medium leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 -z-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl" />

            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-2">
              <Sprout size={32} className="text-emerald-300" />
            </div>

            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight max-w-3xl mx-auto leading-tight">
              Start Your Smart Farming Journey Today
            </h2>

            <p className="text-emerald-100 text-base md:text-lg max-w-2xl mx-auto font-medium">
              Join thousands of farmers using AI-driven decisions to increase yields, conserve water, and sell at optimal market rates.
            </p>

            <div className="flex flex-wrap justify-center gap-4 pt-4 relative z-10">
              <Link to="/register">
                <Button className="bg-white text-emerald-800 hover:bg-emerald-50 border-none font-bold text-base px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition-all">
                  Register Now <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-emerald-900/60 text-white hover:bg-emerald-900 border border-emerald-500/50 font-bold text-base px-8 py-4 rounded-2xl transition-all">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DEMO MODAL */}
      {/* ======================================================== */}
      <AnimatePresence>
        {demoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Sprout size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">KrishiMitra Interactive Showcase</h3>
                </div>
                <button
                  onClick={() => setDemoModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-slate-700 text-sm">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                    <Sparkles size={16} /> Key Capabilities Overview:
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-medium">
                    <li>Hyperlocal Weather & Severe Risk Alerts</li>
                    <li>Automated Water Irrigation Engine</li>
                    <li>Mandi Price Trend Tracking (7d/30d/90d)</li>
                    <li>Leaf Disease Scanning & Community Alert System</li>
                    <li>Multi-lingual Voice Assistant</li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" size="md" onClick={() => setDemoModalOpen(false)}>
                  Close Preview
                </Button>
                <Link to="/register" onClick={() => setDemoModalOpen(false)}>
                  <Button variant="primary" size="md" className="font-bold">
                    Start Free Account
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Landing;
