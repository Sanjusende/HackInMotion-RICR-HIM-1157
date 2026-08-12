import React from 'react';
import { Link } from 'react-router-dom';
import { CloudRain, Droplets, Leaf, LineChart, Sprout, TestTube2, Tractor, Wheat } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Section from '../components/ui/Section';
import EmptyState from '../components/ui/EmptyState';

const modules = [
  { icon: CloudRain, label: 'Weather', note: 'Weather API not yet available' },
  { icon: TestTube2, label: 'Soil health', note: 'Soil API not yet available' },
  { icon: Sprout, label: 'Crop advisor', note: 'Crop API not yet available' },
  { icon: Droplets, label: 'Irrigation', note: 'Irrigation API not yet available' },
  { icon: Leaf, label: 'Disease detection', note: 'Disease API not yet available' },
  { icon: Wheat, label: 'Market prices', note: 'Market API not yet available' },
  { icon: LineChart, label: 'Reports', note: 'Reports API not yet available' },
  { icon: Tractor, label: 'Farm activities', note: 'Activity API not yet available' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const profile = JSON.parse(localStorage.getItem('krishimitra-farm-profile') || 'null');
  return (
    <Section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-primary font-bold text-sm">FARM DASHBOARD</p><h1 className="text-3xl font-extrabold">Welcome back, {user?.name?.split(' ')[0] || 'Farmer'}</h1><p className="text-secondary-text mt-1">Your decision-support modules are ready as their APIs come online.</p></div>
          {!profile && <Link className="text-primary font-bold hover:text-primary-hover" to="/profile/setup">Complete farm profile →</Link>}
        </div>
        {profile ? <Card className="p-5 bg-primary/5 border-primary/20" shadow="small"><p className="font-bold text-dark-text">{profile.farmSize} acres · {profile.soilType} soil · {profile.irrigationType} irrigation</p><p className="text-sm text-secondary-text mt-1">Farm profile saved locally because the Farm API has not been implemented yet.</p></Card> : <EmptyState title="Complete your farm profile" description="Add your farm details to prepare personalized insights when the farm APIs are available." actionText="Set up farm" onAction={() => window.location.assign('/profile/setup')} icon={Sprout} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {modules.map(({ icon: Icon, label, note }) => <Card key={label} className="p-5 space-y-4" shadow="medium"><div className="w-11 h-11 rounded-card bg-primary/10 text-primary flex items-center justify-center"><Icon size={22} /></div><div><h2 className="text-base font-bold">{label}</h2><p className="text-sm text-secondary-text mt-1">{note}</p></div><span className="inline-block text-xs font-bold text-warning bg-warning/10 px-2 py-1 rounded">Coming soon</span></Card>)}
        </div>
      </div>
    </Section>
  );
};
export default Dashboard;
