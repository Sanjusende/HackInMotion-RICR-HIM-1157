import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Sprout, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

const FERTILIZER_PLANS = {
  Wheat: [
    { stage: 'Initial / Germination', nutrient: 'NPK (12:32:16) & Zinc Sulphate', timing: 'At sowing / basal application', method: 'Soil broadcast / drill placement', guidance: 'Basal dose provides phosphorus for root development.' },
    { stage: 'Vegetative', nutrient: 'Urea (Nitrogen top-dressing)', timing: '20-25 days after sowing (first irrigation)', method: 'Top-dressing in moist soil', guidance: 'Promotes tillering and leaf growth.' },
    { stage: 'Flowering', nutrient: 'Urea & Micronutrient Spray', timing: 'At earhead emergence stage', method: 'Foliar spray / soil top-dressing', guidance: 'Supports grain head formation and prevents earhead tip drying.' }
  ],
  Default: [
    { stage: 'Initial / Germination', nutrient: 'Basal NPK & Organic Compost', timing: 'At planting / land preparation', method: 'Soil incorporation', guidance: 'Establishes initial root strength.' },
    { stage: 'Vegetative', nutrient: 'Nitrogen Rich Fertilizer (Urea / DAP)', timing: 'Active vegetative growth phase', method: 'Moist soil top-dressing', guidance: 'Enhances canopy expansion.' },
    { stage: 'Flowering', nutrient: 'Potassium / Micronutrient Blend', timing: 'Pre-flowering / fruit initiation', method: 'Soil application or foliar spray', guidance: 'Improves grain/fruit quality.' }
  ]
};

const FertilizerPlanning = () => {
  const { farm } = useFarm();
  const crop = farm?.currentCrop || 'Wheat';
  const plans = FERTILIZER_PLANS[crop] || FERTILIZER_PLANS.Default;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
          <Sprout className="w-8 h-8 text-emerald-600" />
          Fertilizer & Resource Planning
        </h1>
        <p className="text-slate-600 text-sm mt-1">
          Qualitative nutrient schedule tailored for {crop} ({farm?.growthStage || 'Vegetative'} Stage) • {farm?.soilType || 'Black Soil'}
        </p>
      </div>

      {/* Quality Rule Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Agronomic Quality Rule:</strong> Guidance below lists nutrient type, timing window, and application method. Dosage figures require soil test confirmation from your local agriculture laboratory.
        </p>
      </div>

      <div className="space-y-4">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-3xl p-6 border shadow-sm space-y-3 ${
              plan.stage === farm?.growthStage ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">STAGE: {plan.stage}</span>
              {plan.stage === farm?.growthStage && (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                  Current Growth Stage
                </span>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">{plan.nutrient}</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-semibold block">Timing Window:</span>
                <span className="font-bold text-slate-800">{plan.timing}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">Application Method:</span>
                <span className="font-bold text-slate-800">{plan.method}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 italic">💡 {plan.guidance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FertilizerPlanning;
