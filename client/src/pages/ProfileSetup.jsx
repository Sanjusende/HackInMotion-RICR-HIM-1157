import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Globe, Check, Edit2, ArrowRight, ArrowLeft, Sprout } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import { api } from '../context/AuthContext';

const ProfileSetup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    fullName: '',
    phone: '',
    location: '',
    village: '',
    district: '',
    state: '',
    latitude: '',
    longitude: '',
    language: 'English',

    // Step 2: Farm Details
    farmSize: '',
    soilType: 'Clayey',
    irrigationType: 'Drip',

    // Step 3: Crop Preferences & Challenges
    farmingType: 'Organic',
    budget: '',
    cropPreference: 'Vegetables',
    currentCrop: '',
    plannedCrop: '',
    challenge: 'Water Shortage',
  });

  const [errors, setErrors] = useState({});
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validateStep = (currentStep) => {
    const tempErrors = {};
    if (currentStep === 1) {
      if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required';
      if (!formData.phone.trim()) {
        tempErrors.phone = 'Phone Number is required';
      } else if (!/^\+?[0-9\s-]{10,14}$/.test(formData.phone)) {
        tempErrors.phone = 'Please enter a valid phone number';
      }
      if (!formData.location.trim()) tempErrors.location = 'Location is required';
      if (!formData.village.trim()) tempErrors.village = 'Village is required';
      if (!formData.district.trim()) tempErrors.district = 'District is required';
      if (!formData.state.trim()) tempErrors.state = 'State is required';
    } else if (currentStep === 2) {
      if (!formData.farmSize) {
        tempErrors.farmSize = 'Farm Size is required';
      } else if (parseFloat(formData.farmSize) <= 0) {
        tempErrors.farmSize = 'Farm size must be a positive number';
      }
      if (formData.latitude === '' || Number.isNaN(Number(formData.latitude))) tempErrors.latitude = 'Latitude is required';
      if (formData.longitude === '' || Number.isNaN(Number(formData.longitude))) tempErrors.longitude = 'Longitude is required';
    } else if (currentStep === 3) {
      if (!formData.budget) {
        tempErrors.budget = 'Seasonal Budget is required';
      } else if (parseFloat(formData.budget) <= 0) {
        tempErrors.budget = 'Budget must be a positive amount';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    } else {
      toast.error('Please fix the errors before continuing.');
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep((prev) => prev - 1);
  };

  const handleEditStep = (targetStep) => {
    setStep(targetStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await api.post('/farms', {
        farmName: `${formData.fullName}'s Farm`, state: formData.state, district: formData.district, village: formData.village,
        latitude: Number(formData.latitude), longitude: Number(formData.longitude), landSize: Number(formData.farmSize), landUnit: 'ACRE',
        soilType: formData.soilType.toUpperCase(), currentCrop: formData.currentCrop, plannedCrop: formData.plannedCrop,
        irrigationMethod: ({ Drip: 'DRIP', Sprinkler: 'SPRINKLER', Rainfed: 'RAIN-FED' })[formData.irrigationType] || 'OTHER',
      }, { headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem('krishimitra-session'))?.accessToken}` } });
      if (!data.success) throw new Error(data.message);
      localStorage.setItem('krishimitra-farm-profile', JSON.stringify({ ...formData, id: data.data.farm._id }));
      setShowSummaryModal(true); toast.success('Farm profile saved successfully.');
    } catch (error) { toast.error(error.response?.data?.message || error.message || 'Unable to save your farm profile.'); }
    finally { setIsSubmitting(false); }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Steps indicators
  const stepsList = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Farm Details' },
    { number: 3, title: 'Crop Preferences' },
    { number: 4, title: 'Review & Submit' }
  ];

  return (
    <Section className="py-12">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-dark-text tracking-tight">Configure Your Farm Profile</h1>
          <p className="text-secondary-text font-medium max-w-lg mx-auto">
            Provide the details below so our smart decision support system can generate customized recommendations for you.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white border border-border-custom rounded-card p-6 shadow-small">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {stepsList.map((s) => (
              <div key={s.number} className="flex items-center space-x-3 flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors shrink-0 ${
                    step >= s.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-secondary-text border border-border-custom'
                  }`}
                >
                  {step > s.number ? <Check size={20} /> : s.number}
                </div>
                <div className="text-left">
                  <p className="text-xs text-secondary-text font-bold uppercase tracking-wider">Step {s.number}</p>
                  <p className="text-sm font-bold text-dark-text">{s.title}</p>
                </div>
                {s.number < 4 && <div className="hidden md:block flex-1 h-px bg-border-custom" />}
              </div>
            ))}
          </div>
          {/* Progress bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full mt-6 overflow-hidden">
            <motion.div
              className="bg-primary h-full"
              initial={{ width: '25%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Wizard Form Cards */}
        <Card shadow="medium" className="p-8 bg-white min-h-[400px] flex flex-col justify-between overflow-hidden" hoverLift={false}>
          <div className="flex-1 mb-8">
            <AnimatePresence mode="wait" initial={false}>
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-dark-text border-b border-border-custom pb-3">Step 1: Personal Profile</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="fullName"
                      label="Full Name"
                      placeholder="Enter your name"
                      icon={User}
                      value={formData.fullName}
                      onChange={(e) => handleChange('fullName', e.target.value)}
                      error={errors.fullName}
                    />

                    <Input
                      id="phone"
                      label="Phone Number"
                      placeholder="e.g. +91 9876543210"
                      icon={Phone}
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      error={errors.phone}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input id="village" label="Village" placeholder="Enter village" value={formData.village} onChange={(e) => handleChange('village', e.target.value)} error={errors.village} />
                    <Input id="district" label="District" placeholder="Enter district" value={formData.district} onChange={(e) => handleChange('district', e.target.value)} error={errors.district} />
                    <Input id="state" label="State" placeholder="Enter state" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} error={errors.state} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="location"
                      label="Location / State"
                      placeholder="e.g. Punjab, Ludhiana"
                      icon={MapPin}
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      error={errors.location}
                    />

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-dark-text">Preferred Language</label>
                      <div className="relative">
                        <select
                          value={formData.language}
                          onChange={(e) => handleChange('language', e.target.value)}
                          className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none font-semibold cursor-pointer"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="Marathi">Marathi (मराठी)</option>
                          <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                          <option value="Telugu">Telugu (తెలుగు)</option>
                        </select>
                        <div className="absolute right-4 top-[14px] pointer-events-none text-secondary-text">
                          <Globe size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Input id="latitude" label="Latitude" type="number" placeholder="e.g. 18.5204" value={formData.latitude} onChange={(e) => handleChange('latitude', e.target.value)} error={errors.latitude} />
                    <Input id="longitude" label="Longitude" type="number" placeholder="e.g. 73.8567" value={formData.longitude} onChange={(e) => handleChange('longitude', e.target.value)} error={errors.longitude} />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-dark-text border-b border-border-custom pb-3">Step 2: Farm Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="farmSize"
                      label="Farm Size (in Acres)"
                      type="number"
                      placeholder="e.g. 5"
                      icon={Sprout}
                      value={formData.farmSize}
                      onChange={(e) => handleChange('farmSize', e.target.value)}
                      error={errors.farmSize}
                    />

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-dark-text">Soil Type</label>
                      <select
                        value={formData.soilType}
                        onChange={(e) => handleChange('soilType', e.target.value)}
                        className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer"
                      >
                        <option value="Clayey">Clayey Soil (Retains water)</option>
                        <option value="Black">Black Soil (Cotton Soil)</option>
                        <option value="Alluvial">Alluvial Soil (Highly Fertile)</option>
                        <option value="Sandy">Sandy Soil (High Drainage)</option>
                        <option value="Red">Red Soil (Loamy)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Input id="currentCrop" label="Current Crop" placeholder="e.g. Wheat" value={formData.currentCrop} onChange={(e) => handleChange('currentCrop', e.target.value)} />
                    <Input id="plannedCrop" label="Planned Crop" placeholder="e.g. Soybean" value={formData.plannedCrop} onChange={(e) => handleChange('plannedCrop', e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5 col-span-2">
                      <label className="text-sm font-semibold text-dark-text">Irrigation Type / Primary Water Source</label>
                      <select
                        value={formData.irrigationType}
                        onChange={(e) => handleChange('irrigationType', e.target.value)}
                        className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer"
                      >
                        <option value="Drip">Drip Irrigation (Highly Efficient)</option>
                        <option value="Sprinkler">Sprinkler System</option>
                        <option value="Rainfed">Rainfed / Monsoon dependent</option>
                        <option value="Well">Tube Well / Groundwater</option>
                        <option value="Canal">Canal Irrigation</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-dark-text border-b border-border-custom pb-3">Step 3: Crop Preferences & Challenges</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-dark-text">Farming Classification</label>
                      <select
                        value={formData.farmingType}
                        onChange={(e) => handleChange('farmingType', e.target.value)}
                        className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer"
                      >
                        <option value="Organic">Organic Farming</option>
                        <option value="Commercial">Commercial (High Scale)</option>
                        <option value="Subsistence">Subsistence (Self-consumption)</option>
                        <option value="Mixed">Mixed / Agro-forestry</option>
                      </select>
                    </div>

                    <Input
                      id="budget"
                      label="Seasonal Farming Budget ($/₹)"
                      type="number"
                      placeholder="e.g. 50000"
                      value={formData.budget}
                      onChange={(e) => handleChange('budget', e.target.value)}
                      error={errors.budget}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-dark-text">Preferred Crop Category</label>
                      <select
                        value={formData.cropPreference}
                        onChange={(e) => handleChange('cropPreference', e.target.value)}
                        className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer"
                      >
                        <option value="Vegetables">Vegetables (Fast yielding)</option>
                        <option value="Cereals">Cereals & Grains (Rice, Wheat, etc.)</option>
                        <option value="Fruits">Orchards / Fruits</option>
                        <option value="Cash">Cash Crops (Sugarcane, Cotton)</option>
                        <option value="Pulses">Pulses & Oilseeds</option>
                      </select>
                    </div>

                    <div className="flex flex-col space-y-1.5">
                      <label className="text-sm font-semibold text-dark-text">Primary Farming Challenge</label>
                      <select
                        value={formData.challenge}
                        onChange={(e) => handleChange('challenge', e.target.value)}
                        className="w-full h-12 bg-white text-dark-text rounded-input border-2 border-border-custom px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 font-semibold cursor-pointer"
                      >
                        <option value="Water Shortage">Water shortage / Lack of rain</option>
                        <option value="Soil Fertility">Soil infertility / Degradation</option>
                        <option value="Pests & Diseases">Pests, weed infestation, diseases</option>
                        <option value="Fertilizer Costs">High cost of chemical inputs</option>
                        <option value="Weather">Weather instability / Frost risks</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-dark-text border-b border-border-custom pb-3">Step 4: Review Your Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card Column 1 */}
                    <div className="border border-border-custom rounded-card p-5 space-y-3 bg-bg-custom relative">
                      <button onClick={() => handleEditStep(1)} className="absolute top-4 right-4 text-primary hover:bg-white p-1.5 rounded-full shadow-sm cursor-pointer transition-colors border border-border-custom bg-white/70">
                        <Edit2 size={14} />
                      </button>
                      <h4 className="text-sm font-bold text-dark-text uppercase tracking-wider">Personal Profile</h4>
                      <div className="space-y-1.5 text-sm font-semibold text-secondary-text">
                        <p><span className="font-medium">Name:</span> <strong className="text-dark-text">{formData.fullName}</strong></p>
                        <p><span className="font-medium">Phone:</span> <strong className="text-dark-text">{formData.phone}</strong></p>
                        <p><span className="font-medium">Location:</span> <strong className="text-dark-text">{formData.location}</strong></p>
                        <p><span className="font-medium">Language:</span> <strong className="text-dark-text">{formData.language}</strong></p>
                      </div>
                    </div>

                    {/* Card Column 2 */}
                    <div className="border border-border-custom rounded-card p-5 space-y-3 bg-bg-custom relative">
                      <button onClick={() => handleEditStep(2)} className="absolute top-4 right-4 text-primary hover:bg-white p-1.5 rounded-full shadow-sm cursor-pointer transition-colors border border-border-custom bg-white/70">
                        <Edit2 size={14} />
                      </button>
                      <h4 className="text-sm font-bold text-dark-text uppercase tracking-wider">Farm Details</h4>
                      <div className="space-y-1.5 text-sm font-semibold text-secondary-text">
                        <p><span className="font-medium">Farm Size:</span> <strong className="text-dark-text">{formData.farmSize} Acres</strong></p>
                        <p><span className="font-medium">Soil Type:</span> <strong className="text-dark-text">{formData.soilType}</strong></p>
                        <p><span className="font-medium">Irrigation:</span> <strong className="text-dark-text">{formData.irrigationType}</strong></p>
                      </div>
                    </div>

                    {/* Card Column 3 */}
                    <div className="border border-border-custom rounded-card p-5 space-y-3 bg-bg-custom relative">
                      <button onClick={() => handleEditStep(3)} className="absolute top-4 right-4 text-primary hover:bg-white p-1.5 rounded-full shadow-sm cursor-pointer transition-colors border border-border-custom bg-white/70">
                        <Edit2 size={14} />
                      </button>
                      <h4 className="text-sm font-bold text-dark-text uppercase tracking-wider">Preferences</h4>
                      <div className="space-y-1.5 text-sm font-semibold text-secondary-text">
                        <p><span className="font-medium">Farming:</span> <strong className="text-dark-text">{formData.farmingType}</strong></p>
                        <p><span className="font-medium">Budget:</span> <strong className="text-dark-text">{formData.budget}</strong></p>
                        <p><span className="font-medium">Crop Category:</span> <strong className="text-dark-text">{formData.cropPreference}</strong></p>
                        <p><span className="font-medium">Challenge:</span> <strong className="text-dark-text">{formData.challenge}</strong></p>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between border-t border-border-custom pt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={handlePrev}
              disabled={step === 1}
              className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
            >
              <ArrowLeft className="mr-2" size={18} /> Previous
            </Button>

            {step < 4 ? (
              <Button variant="primary" size="md" onClick={handleNext}>
                Continue <ArrowRight className="ml-2" size={18} />
              </Button>
            ) : (
              <Button variant="success" size="md" onClick={handleSubmit} isLoading={isSubmitting}>
                Save Farm Setup <Check className="ml-2" size={18} />
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Confirmation Modal overlay */}
      <AnimatePresence>
        {showSummaryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSummaryModal(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 30, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative w-full max-w-md bg-white rounded-modal shadow-large p-8 text-center border border-border-custom z-10"
            >
              <div className="w-16 h-16 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto mb-5">
                <Check size={32} />
              </div>
              <h3 className="text-2xl font-extrabold text-dark-text mb-2">Profile Completed!</h3>
              <p className="text-secondary-text font-medium text-sm mb-6 leading-relaxed">
                Welcome, <strong className="text-dark-text">{formData.fullName}</strong>. Your farm in <strong className="text-dark-text">{formData.location}</strong> has been configured with soil parameters and weather targets.
              </p>
              <div className="bg-primary/5 rounded-card p-4 border border-primary/20 text-left mb-6 space-y-1">
                <p className="text-xs font-extrabold text-primary">INITIAL DECISION MODEL ADVISORY</p>
                <p className="text-base font-bold text-dark-text">Recommended Crops: Sugarcane, Wheat</p>
                <p className="text-xs text-secondary-text font-medium">Optimal sowing period: October - November.</p>
              </div>
              <Button
                variant="primary"
                fullWidth
                onClick={() => { setShowSummaryModal(false); navigate('/dashboard'); }}
              >
                View dashboard
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default ProfileSetup;
