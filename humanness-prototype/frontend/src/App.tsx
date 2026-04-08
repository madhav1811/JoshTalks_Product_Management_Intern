import React, { useState, useEffect } from 'react'
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  UploadCloud, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock, 
  LayoutDashboard,
  User,
  ArrowRight,
  RefreshCw,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  Menu,
  Bell
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Types ---
type View = 'SPLASH' | 'CONTRIBUTOR_DASHBOARD' | 'LOCATION_SELECT' | 'CAPTURE' | 'ADMIN_DASHBOARD' | 'SUBMISSION_SUCCESS' | 'EVALUATOR_PORTAL' | 'EVALUATION_SCREEN'

interface Submission {
  _id: string;
  village: string;
  district: string;
  state: string;
  description: string;
  imageUrl: string;
  timestamp: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface TranscriberAnalytic {
  user_id: string;
  total_tasks: number;
  edit_rate: string;
  time_ratio: string;
  avg_cps: string;
  flags: string[];
  status: 'FLAGGED' | 'HEALTHY';
}

interface VoiceEvaluation {
  _id: string;
  call_id: string;
  evaluator_id: string;
  intent_understanding: number;
  task_completion: number;
  naturalness: number;
  dialogue_flow: number;
  comments: string;
  critical_failure: boolean;
  failure_type: string;
  timestamp: string;
}

const API_URL = 'http://localhost:5000/api'

// --- Mock Data ---
const VILLAGES = ["Rohtak Village 1", "Sonipat Village A", "Hisar Village B", "Rewari Village C"]
const DISTRICTS = ["Rohtak", "Sonipat", "Hisar", "Rewari"]
const STATES = ["Haryana", "Punjab", "Rajasthan", "Uttar Pradesh"]

// --- Components ---

const Card = ({ children, className, hover = false }: { children: React.ReactNode, className?: string, hover?: boolean }) => (
  <div className={cn(
    "bg-white dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-700 p-5 shadow-soft transition-all duration-300",
    hover && "hover:shadow-lg hover:-translate-y-1",
    className
  )}>
    {children}
  </div>
)

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className,
  icon: Icon,
  loading = false
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost',
  disabled?: boolean,
  className?: string,
  icon?: any,
  loading?: boolean
}) => {
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-glow active:scale-95",
    secondary: "bg-surface-100 hover:bg-surface-200 text-surface-800 dark:bg-surface-700 dark:text-surface-100 active:scale-95",
    outline: "border-2 border-brand-500 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20 active:scale-95",
    danger: "bg-red-500 hover:bg-red-600 text-white active:scale-95",
    ghost: "bg-transparent hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-600 dark:text-surface-400 active:scale-95"
  }

  return (
    <button 
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:scale-100",
        variants[variant],
        className
      )}
    >
      {loading ? <RefreshCw size={20} className="animate-spin" /> : Icon && <Icon size={20} />}
      {children}
    </button>
  )
}

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' }) => {
  const variants = {
    default: "bg-surface-100 text-surface-600",
    success: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    warning: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
    danger: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
  }
  return (
    <span className={cn("px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  )
}

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('SPLASH')
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [transcriberAnalytics, setTranscriberAnalytics] = useState<TranscriberAnalytic[]>([])
  const [voiceEvaluations, setVoiceEvaluations] = useState<VoiceEvaluation[]>([])
  const [adminTab, setAdminTab] = useState<'SUBMISSIONS' | 'TRANSCRIBERS' | 'VOICE_AI'>('SUBMISSIONS')
  const [selectedLocation, setSelectedLocation] = useState({ state: 'Haryana', district: 'Rohtak', village: 'Rohtak Village 1' })
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/submissions`)
      setSubmissions(res.data)
    } catch (err) {
      console.error('Error fetching submissions:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchTranscriberAnalytics = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/transcriptions/analytics`)
      setTranscriberAnalytics(res.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchVoiceEvaluations = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/evaluations`)
      setVoiceEvaluations(res.data)
    } catch (err) {
      console.error('Error fetching evaluations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (currentView === 'CONTRIBUTOR_DASHBOARD') {
      fetchSubmissions()
    }
    if (currentView === 'ADMIN_DASHBOARD') {
      fetchSubmissions()
      fetchTranscriberAnalytics()
      fetchVoiceEvaluations()
    }
    if (currentView === 'EVALUATOR_PORTAL') {
      fetchVoiceEvaluations()
    }
  }, [currentView])

  const addSubmission = async (description: string, imageUrl: string) => {
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/submissions`, {
        ...selectedLocation,
        description,
        imageUrl
      })
      setSubmissions([res.data, ...submissions])
      setCurrentView('SUBMISSION_SUCCESS')
    } catch (err) {
      console.error('Error adding submission:', err)
      alert('Failed to submit. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/submissions/${id}/status`, { status })
      fetchSubmissions()
    } catch (err) {
      console.error('Error updating status:', err)
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'SPLASH':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 bg-gradient-to-b from-surface-50 to-white dark:from-surface-900 dark:to-surface-800">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-12 max-w-6xl w-full"
            >
              <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-6 py-3 rounded-full text-sm font-bold shadow-soft">
                <Zap size={18} className="animate-pulse" /> Empowering AI with Local Context
              </div>
              
              <div className="space-y-6">
                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-surface-900 dark:text-white leading-[0.85]">
                  JoshTalksAI<br/>
                  <span className="text-brand-500">Humanness</span>
                </h1>
                <p className="text-2xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto font-medium leading-relaxed">
                  The gold-standard platform for building inclusive, culturally-rich AI datasets from every village in India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-8">
                <Card hover className="p-8 flex flex-col items-center text-center gap-6 cursor-pointer group" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')}>
                  <div className="w-16 h-16 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black">Contributor</h3>
                    <p className="text-sm text-surface-500">Submit images and descriptions from your village.</p>
                  </div>
                  <Button variant="primary" className="w-full mt-auto">Get Started</Button>
                </Card>

                <Card hover className="p-8 flex flex-col items-center text-center gap-6 cursor-pointer group" onClick={() => setCurrentView('EVALUATOR_PORTAL')}>
                  <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Database size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black">Evaluator</h3>
                    <p className="text-sm text-surface-500">Grade Voice AI conversations for quality and flow.</p>
                  </div>
                  <Button variant="outline" className="w-full mt-auto">Launch Portal</Button>
                </Card>

                <Card hover className="p-8 flex flex-col items-center text-center gap-6 cursor-pointer group" onClick={() => setCurrentView('ADMIN_DASHBOARD')}>
                  <div className="w-16 h-16 bg-surface-900 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShieldCheck size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black">Admin</h3>
                    <p className="text-sm text-surface-500">Monitor data coverage and transcription quality.</p>
                  </div>
                  <Button variant="secondary" className="w-full mt-auto">Operations</Button>
                </Card>
              </div>

              <div className="pt-16 grid grid-cols-3 gap-12 border-t border-surface-100 dark:border-surface-800">
                <div className="text-center">
                  <p className="text-4xl font-black text-surface-900 dark:text-white">600K+</p>
                  <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mt-1">Villages</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-surface-900 dark:text-white">1M+</p>
                  <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mt-1">Images</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black text-surface-900 dark:text-white">99.8%</p>
                  <p className="text-sm font-bold text-surface-400 uppercase tracking-widest mt-1">Accuracy</p>
                </div>
              </div>
            </motion.div>
          </div>
        )

      case 'CONTRIBUTOR_DASHBOARD':
        return (
          <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
            <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('SPLASH')}>
                  <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-glow">
                    <Zap size={24} />
                  </div>
                  <h1 className="text-xl font-black tracking-tight hidden md:block">JoshTalksAI</h1>
                </div>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700 hidden md:block" />
                <div>
                  <h2 className="text-lg font-black tracking-tight">Contributor Dashboard</h2>
                  <p className="text-surface-500 text-xs font-medium flex items-center gap-1"><MapPin size={12} /> {selectedLocation.village}, {selectedLocation.district}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-full text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live Sync Active
                </div>
                <button className="p-2.5 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-100 dark:border-surface-600 shadow-soft hover:bg-surface-100 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-white dark:border-surface-800" />
                </button>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
                <button onClick={() => setCurrentView('SPLASH')} className="flex items-center gap-2 p-2 px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl transition-all font-bold text-sm">
                  <X size={18} />
                  <span className="hidden md:inline">Exit</span>
                </button>
              </div>
            </header>

            <main className="flex-1 p-8 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none relative overflow-hidden p-8 shadow-glow">
                    <div className="relative z-10 space-y-4">
                      <p className="text-brand-100 text-xs font-black uppercase tracking-widest">Village Progress</p>
                      <h3 className="text-5xl font-black">{submissions.length} <span className="text-xl opacity-60">/ 1000</span></h3>
                      <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((submissions.length / 1000) * 100, 100)}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="bg-white h-full" 
                        />
                      </div>
                      <p className="text-xs font-bold text-brand-100">Target: Complete data coverage for {selectedLocation.village}</p>
                    </div>
                    <Zap className="absolute -right-8 -bottom-8 text-white/10" size={200} />
                  </Card>
                  
                  <Card className="flex flex-col justify-between p-8">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-2xl">
                        <Globe size={28} />
                      </div>
                      <Badge variant="success">Online</Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-black">Cloud Sync</p>
                      <p className="text-sm text-surface-500 font-medium">Automatic background uploads enabled</p>
                    </div>
                  </Card>

                  <Card className="flex flex-col justify-between p-8 border-brand-500/20 bg-brand-50/30 dark:bg-brand-900/10">
                    <div className="flex justify-between items-start">
                      <div className="p-4 bg-brand-500 text-white rounded-2xl shadow-glow">
                        <Camera size={28} />
                      </div>
                    </div>
                    <Button 
                      className="w-full py-4 text-base rounded-xl" 
                      onClick={() => setCurrentView('LOCATION_SELECT')}
                      loading={loading}
                    >
                      New Collection
                    </Button>
                  </Card>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-xl tracking-tight">Recent Submissions</h4>
                    <button onClick={fetchSubmissions} className="flex items-center gap-2 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors">
                      <RefreshCw size={16} className={cn(loading && "animate-spin")} />
                      Refresh Feed
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {submissions.length === 0 && !loading && (
                      <div className="col-span-full text-center py-24 bg-white dark:bg-surface-800 rounded-3xl border-2 border-dashed border-surface-200 dark:border-surface-700">
                        <ImageIcon size={64} className="mx-auto text-surface-200 mb-4" />
                        <p className="text-surface-500 font-black text-xl">No data collected yet</p>
                        <p className="text-sm text-surface-400 mt-2 font-medium">Start your first mission by clicking 'New Collection'</p>
                      </div>
                    )}
                    {submissions.map(sub => (
                      <Card key={sub._id} className="flex gap-6 items-center p-4 group" hover>
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <img src={sub.imageUrl} className="w-full h-full rounded-2xl object-cover shadow-soft group-hover:scale-105 transition-transform" />
                          <div className="absolute -top-2 -right-2 z-10">
                            {sub.status === 'APPROVED' ? (
                              <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><Check size={14} /></div>
                            ) : sub.status === 'REJECTED' ? (
                              <div className="bg-red-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><X size={14} /></div>
                            ) : (
                              <div className="bg-blue-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white"><Clock size={14} /></div>
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex justify-between items-start">
                            <Badge variant={sub.status === 'APPROVED' ? 'success' : sub.status === 'REJECTED' ? 'danger' : 'info'}>
                              {sub.status}
                            </Badge>
                            <p className="text-xs text-surface-400 font-bold">{new Date(sub.timestamp).toLocaleDateString()}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-lg truncate text-surface-900 dark:text-white leading-tight">{sub.description}</p>
                            <p className="text-sm text-surface-500 font-bold uppercase tracking-wider">{sub.village}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="lg:col-span-4 space-y-8">
                <Card className="p-8 space-y-6 border-none bg-surface-900 text-white shadow-2xl overflow-hidden relative">
                  <div className="relative z-10 space-y-6">
                    <h4 className="text-xl font-black tracking-tight">System Integrity</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black">GPS Validation</p>
                          <p className="text-xs text-surface-400">High precision active</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="w-10 h-10 bg-brand-500/20 text-brand-500 rounded-xl flex items-center justify-center">
                          <Zap size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-black">Edge Processing</p>
                          <p className="text-xs text-surface-400">Real-time image QA</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Globe className="absolute -right-20 -bottom-20 text-white/5" size={300} />
                </Card>

                <Card className="p-8 space-y-6">
                  <h4 className="text-xl font-black tracking-tight">Mission Guidelines</h4>
                  <div className="space-y-4">
                    {[
                      "Ensure clear natural lighting for all captures.",
                      "Avoid identifiable faces or private information.",
                      "Descriptions must be in plain, descriptive English.",
                      "Stay within village boundaries for GPS sync."
                    ].map((text, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-500 flex items-center justify-center text-xs font-black">
                          {i + 1}
                        </div>
                        <p className="text-sm text-surface-600 dark:text-surface-400 font-medium leading-relaxed">{text}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </main>
          </div>
        )

      case 'LOCATION_SELECT':
        return (
          <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
            <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-6">
                <Button variant="ghost" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')} className="p-2"><X size={24} /></Button>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
                <h2 className="text-lg font-black tracking-tight">Set Collection Location</h2>
              </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="max-w-2xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                <Card className="p-10 space-y-8 shadow-2xl border-none">
                  <div className="text-center space-y-2">
                    <h3 className="text-3xl font-black tracking-tight">Where are you collecting data?</h3>
                    <p className="text-surface-500 font-medium">Select the target village for your mission.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">State</label>
                        <select className="w-full h-14 px-6 rounded-2xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-black appearance-none outline-none focus:border-brand-500 transition-all text-sm" value={selectedLocation.state} onChange={e => setSelectedLocation({...selectedLocation, state: e.target.value})}>
                          {STATES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">District</label>
                        <select className="w-full h-14 px-6 rounded-2xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-black appearance-none outline-none focus:border-brand-500 transition-all text-sm" value={selectedLocation.district} onChange={e => setSelectedLocation({...selectedLocation, district: e.target.value})}>
                          {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Village</label>
                        <select className="w-full h-14 px-6 rounded-2xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-black appearance-none outline-none focus:border-brand-500 transition-all text-sm" value={selectedLocation.village} onChange={e => setSelectedLocation({...selectedLocation, village: e.target.value})}>
                          {VILLAGES.map(v => <option key={v}>{v}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-6">
                      <div className="flex-1 bg-surface-50 dark:bg-surface-900 rounded-[32px] border-2 border-dashed border-surface-200 dark:border-surface-700 flex flex-col items-center justify-center p-8 text-center gap-4">
                        <div className="w-16 h-16 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-glow animate-bounce">
                          <MapPin size={32} />
                        </div>
                        <div>
                          <p className="font-black text-lg">GPS Verified</p>
                          <p className="text-sm text-surface-500 font-medium">Your current coordinates match the selected village boundaries.</p>
                        </div>
                      </div>
                      <Button className="w-full h-20 text-lg rounded-2xl shadow-glow" onClick={() => setCurrentView('CAPTURE')} icon={ArrowRight}>
                        Open Camera Interface
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </main>
          </div>
        )

      case 'CAPTURE':
        return (
          <CaptureView onBack={() => setCurrentView('LOCATION_SELECT')} onAdd={addSubmission} loading={loading} />
        )

      case 'SUBMISSION_SUCCESS':
        return (
          <div className="w-full min-h-screen flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-900 p-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="max-w-2xl w-full text-center space-y-12"
            >
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }} 
                  animate={{ scale: 1, rotate: 0 }} 
                  className="relative bg-green-500 text-white p-12 rounded-[60px] shadow-glow"
                >
                  <CheckCircle size={100} strokeWidth={2.5} />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-5xl font-black tracking-tight text-surface-900 dark:text-white">Mission Accomplished</h2>
                <p className="text-xl text-surface-500 dark:text-surface-400 font-medium max-w-lg mx-auto leading-relaxed">
                  Your contribution has been securely uploaded and is now helping train the next generation of inclusive AI models.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-8">
                <Button className="h-16 rounded-2xl text-lg shadow-glow" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl text-lg" onClick={() => setCurrentView('CAPTURE')}>
                  Capture More
                </Button>
              </div>
            </motion.div>
          </div>
        )

      case 'EVALUATOR_PORTAL':
        return (
          <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
            <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('SPLASH')}>
                  <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-glow">
                    <Database size={24} />
                  </div>
                  <h1 className="text-xl font-black tracking-tight hidden md:block">JoshTalksAI</h1>
                </div>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700 hidden md:block" />
                <div>
                  <h2 className="text-lg font-black tracking-tight">Evaluator Portal</h2>
                  <p className="text-surface-500 text-xs font-medium">Standardized Voice AI Quality Review</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="info">Batch #42 Active</Badge>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
                <Button variant="secondary" onClick={() => setCurrentView('SPLASH')} icon={X} className="py-2 text-sm">Exit Portal</Button>
              </div>
            </header>

            <main className="flex-1 p-8 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
                <Card className="p-8 space-y-8">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-2xl tracking-tight text-surface-900 dark:text-white">Assigned Conversations</h4>
                    <div className="flex gap-2">
                      <div className="px-4 py-2 bg-surface-50 dark:bg-surface-800 rounded-xl border border-surface-100 dark:border-surface-700 flex items-center gap-2">
                        <Filter size={16} className="text-surface-400" />
                        <span className="text-sm font-bold">All Topics</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {['CALL-2001', 'CALL-2002', 'CALL-2003', 'CALL-2004', 'CALL-2005'].map(callId => (
                      <div key={callId} className="group flex items-center justify-between p-6 bg-white dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-700 hover:border-brand-500/50 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-2xl flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                            <RefreshCw size={24} />
                          </div>
                          <div className="space-y-1">
                            <p className="font-black text-lg text-surface-900 dark:text-white">{callId}</p>
                            <div className="flex items-center gap-3 text-xs text-surface-500 font-bold uppercase tracking-wider">
                              <span>Duration: 1m 24s</span>
                              <span className="w-1 h-1 rounded-full bg-surface-300" />
                              <span>Topic: Hotel Booking</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          variant="primary" 
                          className="px-8 py-3 rounded-xl" 
                          onClick={() => { setSelectedCallId(callId); setCurrentView('EVALUATION_SCREEN'); }}
                        >
                          Start Review
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              
              <aside className="lg:col-span-4 space-y-8">
                <Card className="bg-brand-500 text-white border-none shadow-glow p-8 space-y-6">
                  <div>
                    <p className="text-brand-100 text-xs font-black uppercase tracking-widest">Personal Performance</p>
                    <h4 className="text-6xl font-black mt-2">12 <span className="text-2xl opacity-60">/ 20</span></h4>
                    <p className="mt-4 text-sm font-bold text-brand-100">Evaluations completed today</p>
                  </div>
                  <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '60%' }}
                      className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                    />
                  </div>
                </Card>

                <Card className="p-8 space-y-6">
                  <h5 className="font-black text-xl tracking-tight">Review Rubric v2.1</h5>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center">
                        <Zap size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">Intent Accuracy</p>
                        <p className="text-xs text-surface-500 font-medium leading-relaxed">Rate based on how well the AI captured primary and secondary user goals.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">Speech Prosody</p>
                        <p className="text-xs text-surface-500 font-medium leading-relaxed">Evaluate naturalness, including tone, pace, and human-like inflection.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center">
                        <CheckCircle size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black">Task Completion</p>
                        <p className="text-xs text-surface-500 font-medium leading-relaxed">Was the user's objective reached without unnecessary friction?</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </aside>
            </main>
          </div>
        )

      case 'EVALUATION_SCREEN':
        return (
          <EvaluationInterface 
            callId={selectedCallId || 'CALL-UNKNOWN'} 
            onBack={() => setCurrentView('EVALUATOR_PORTAL')} 
            onSubmit={async (data) => {
              if (!selectedCallId) {
                alert('No call selected.');
                return;
              }
              try {
                setLoading(true);
                await axios.post(`${API_URL}/evaluations`, {
                  ...data,
                  call_id: selectedCallId,
                  evaluator_id: 'EVAL-007' // Simulated current evaluator ID
                });
                setCurrentView('EVALUATOR_PORTAL');
              } catch (err) {
                console.error('Error submitting evaluation:', err);
                alert('Submission failed. Is the backend running?');
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          />
        )

      case 'ADMIN_DASHBOARD':
        return (
          <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
            <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('SPLASH')}>
                  <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-white shadow-glow">
                    <ShieldCheck size={24} />
                  </div>
                  <h1 className="text-xl font-black tracking-tight hidden md:block">JoshTalksAI</h1>
                </div>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700 hidden md:block" />
                <div>
                  <h2 className="text-lg font-black tracking-tight">Admin Operations</h2>
                  <p className="text-surface-500 text-xs font-medium">Quality Assurance & Coverage Monitoring</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary" onClick={() => { fetchSubmissions(); fetchTranscriberAnalytics(); }} icon={RefreshCw} loading={loading} className="py-2 text-sm">Refresh</Button>
                <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
                <Button variant="danger" onClick={() => setCurrentView('SPLASH')} icon={X} className="py-2 text-sm">Exit Console</Button>
              </div>
            </header>

            <main className="flex-1 p-8 w-full max-w-[1800px] mx-auto space-y-8">
              <div className="flex gap-2 bg-white dark:bg-surface-800 p-1.5 rounded-2xl border border-surface-100 dark:border-surface-700 w-fit">
                {[
                  { id: 'SUBMISSIONS', label: 'Vision (Task 1)', icon: Camera },
                  { id: 'TRANSCRIBERS', label: 'Transcription (Task 2)', icon: User },
                  { id: 'VOICE_AI', label: 'Voice AI (Task 3)', icon: RefreshCw }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm transition-all",
                      adminTab === tab.id ? "bg-brand-500 text-white shadow-glow" : "text-surface-400 hover:text-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700"
                    )}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {adminTab === 'SUBMISSIONS' ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-surface-900 text-white border-none shadow-2xl p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Active Requests</p>
                      <h4 className="text-6xl font-black">{submissions.filter(s => s.status === 'PENDING').length}</h4>
                      <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        Needs verification
                      </div>
                    </Card>
                    <Card className="bg-brand-500 text-white border-none shadow-glow p-8 space-y-4">
                      <p className="text-brand-100 text-xs font-black uppercase tracking-widest">Total Dataset</p>
                      <h4 className="text-6xl font-black">{submissions.length}</h4>
                      <p className="text-sm font-bold text-brand-100">+12% growth this week</p>
                    </Card>
                    <Card className="p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Villages Covered</p>
                      <h4 className="text-6xl font-black">45K</h4>
                      <div className="w-full bg-surface-100 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[8%]" />
                      </div>
                      <p className="text-sm font-bold text-green-500">Target: 600K</p>
                    </Card>
                    <Card className="p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Global Accuracy</p>
                      <h4 className="text-6xl font-black">98.4%</h4>
                      <p className="text-sm font-bold text-brand-500">WER: 1.6%</p>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                    <div className="xl:col-span-8 space-y-6">
                      <h4 className="font-black text-2xl tracking-tight">Verification Queue</h4>
                      
                      {submissions.filter(s => s.status === 'PENDING').length === 0 && (
                        <div className="text-center py-32 bg-white dark:bg-surface-800 rounded-[40px] border-2 border-dashed border-surface-200 dark:border-surface-700">
                          <ShieldCheck size={80} className="mx-auto text-surface-200 mb-6" />
                          <p className="text-surface-500 font-black text-2xl">All Clear!</p>
                          <p className="text-surface-400 font-medium mt-2">No pending submissions for review.</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {submissions.filter(s => s.status === 'PENDING').map(sub => (
                          <Card key={sub._id} className="p-0 overflow-hidden group flex flex-col h-full border-none shadow-lg" hover>
                            <div className="relative aspect-video">
                              <img src={sub.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />
                              <div className="absolute top-4 left-4">
                                <Badge variant="info" className="bg-white/20 backdrop-blur-md text-white border-none">{sub.state}</Badge>
                              </div>
                            </div>
                            <div className="p-6 flex-1 flex flex-col gap-6 bg-white dark:bg-surface-800">
                              <div className="space-y-2">
                                <p className="text-xs font-black text-brand-500 uppercase tracking-[0.2em]">{sub.village}</p>
                                <p className="text-surface-900 dark:text-white font-black text-xl leading-tight">{sub.description}</p>
                              </div>
                              <div className="mt-auto flex gap-3">
                                <button onClick={() => updateStatus(sub._id, 'APPROVED')} className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm shadow-glow active:scale-95 transition-all">APPROVE</button>
                                <button onClick={() => updateStatus(sub._id, 'REJECTED')} className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-sm shadow-glow active:scale-95 transition-all">REJECT</button>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="xl:col-span-4 space-y-6">
                      <h4 className="font-black text-2xl tracking-tight">Spatial Distribution</h4>
                      <Card className="p-0 overflow-hidden h-[600px] flex flex-col bg-surface-900 border-none relative shadow-2xl">
                        <div className="absolute inset-0 opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                        <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-white/5 backdrop-blur-md">
                          <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                          </div>
                          <Badge variant="info" className="bg-brand-500/20 text-brand-400 border-none font-black">LIVE COVERAGE</Badge>
                        </div>
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center relative z-10">
                          <div className="relative mb-8">
                            <div className="absolute inset-0 bg-brand-500 blur-[80px] opacity-20 animate-pulse" />
                            <Globe size={120} className="text-brand-500 relative animate-spin-slow" />
                          </div>
                          <h5 className="text-white font-black text-2xl">India Spatial Data</h5>
                          <p className="text-surface-400 font-medium mt-4 leading-relaxed max-w-xs mx-auto">
                            Visualizing data density across 600,000+ villages for localized AI training.
                          </p>
                          <Button variant="outline" className="mt-8 border-white/20 text-white hover:bg-white/10">Expand Map View</Button>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              ) : adminTab === 'TRANSCRIBERS' ? (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-red-500 text-white border-none shadow-glow p-8 space-y-4">
                      <p className="text-red-100 text-xs font-black uppercase tracking-widest">Anomalies Detected</p>
                      <h4 className="text-6xl font-black">{transcriberAnalytics.filter(t => t.status === 'FLAGGED').length}</h4>
                      <p className="text-sm font-bold text-red-100">Transcribers flagged for review</p>
                    </Card>
                    <Card className="p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Network Edit Rate</p>
                      <h4 className="text-6xl font-black">
                        {(transcriberAnalytics.reduce((acc, curr) => acc + parseFloat(curr.edit_rate), 0) / (transcriberAnalytics.length || 1)).toFixed(1)}%
                      </h4>
                      <p className="text-sm font-bold text-surface-400">Target Benchmark: &gt;15%</p>
                    </Card>
                    <Card className="p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Avg. Time Ratio</p>
                      <h4 className="text-6xl font-black">
                        {(transcriberAnalytics.reduce((acc, curr) => acc + parseFloat(curr.time_ratio), 0) / (transcriberAnalytics.length || 1)).toFixed(2)}
                      </h4>
                      <p className="text-sm font-bold text-surface-400">Target Efficiency: &gt;0.7</p>
                    </Card>
                  </div>

                  <Card className="p-0 overflow-hidden border-none shadow-xl bg-white dark:bg-surface-800">
                    <div className="p-6 border-b border-surface-100 dark:border-surface-700 flex justify-between items-center">
                      <h4 className="font-black text-xl">Contributor Quality Matrix</h4>
                      <div className="flex gap-4">
                        <div className="relative">
                          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
                          <input type="text" placeholder="Search User ID..." className="pl-10 pr-4 py-2 bg-surface-50 dark:bg-surface-900 border border-surface-100 dark:border-surface-700 rounded-xl text-sm font-medium outline-none focus:border-brand-500" />
                        </div>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-50/50 dark:bg-surface-900/50">
                          <tr>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">User ID</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">Tasks</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">Edit Rate</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">Time Ratio</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">Avg. CPS</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700">Flags</th>
                            <th className="p-6 text-xs font-black uppercase tracking-widest text-surface-400 border-b border-surface-100 dark:border-surface-700 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transcriberAnalytics.map(user => (
                            <tr key={user.user_id} className="group hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                              <td className="p-6 font-black text-surface-900 dark:text-white">{user.user_id}</td>
                              <td className="p-6 font-bold text-surface-500">{user.total_tasks}</td>
                              <td className={cn("p-6 font-black", parseFloat(user.edit_rate) < 15 ? "text-red-500" : "text-green-500")}>{user.edit_rate}%</td>
                              <td className={cn("p-6 font-black", parseFloat(user.time_ratio) < 0.7 ? "text-red-500" : "text-green-500")}>{user.time_ratio}</td>
                              <td className={cn("p-6 font-black", parseFloat(user.avg_cps) > 15 ? "text-red-500" : "text-surface-900 dark:text-white")}>{user.avg_cps}</td>
                              <td className="p-6">
                                <div className="flex flex-wrap gap-2">
                                  {user.flags.length > 0 ? user.flags.map(f => <Badge key={f} variant="danger" className="text-[9px]">{f}</Badge>) : <Badge variant="success" className="text-[9px]">HEALTHY</Badge>}
                                </div>
                              </td>
                              <td className="p-6 text-right">
                                <button 
                                  onClick={() => alert(`User ${user.user_id} has been blocked.`)}
                                  className="px-4 py-2 bg-red-50 hover:bg-red-500 hover:text-white text-red-600 rounded-xl text-xs font-black transition-all"
                                >
                                  BLOCK
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="bg-surface-900 text-white border-none shadow-2xl p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Avg. Intent Score</p>
                      <h4 className="text-6xl font-black">
                        {(voiceEvaluations.reduce((acc, curr) => acc + curr.intent_understanding, 0) / (voiceEvaluations.length || 1)).toFixed(1)}
                      </h4>
                      <p className="text-sm font-bold text-blue-400">Industry Avg: 4.2</p>
                    </Card>
                    <Card className="bg-brand-500 text-white border-none shadow-glow p-8 space-y-4">
                      <p className="text-brand-100 text-xs font-black uppercase tracking-widest">Task Success</p>
                      <h4 className="text-6xl font-black">
                        {((voiceEvaluations.filter(e => e.task_completion >= 4).length / (voiceEvaluations.length || 1)) * 100).toFixed(0)}%
                      </h4>
                      <p className="text-sm font-bold text-brand-100">Completion Rate</p>
                    </Card>
                    <Card className="p-8 space-y-4 border-red-500/20 bg-red-50/10">
                      <p className="text-red-500 text-xs font-black uppercase tracking-widest">Critical Failures</p>
                      <h4 className="text-6xl font-black text-red-500">
                        {voiceEvaluations.filter(e => e.critical_failure).length}
                      </h4>
                      <p className="text-sm font-bold text-red-400 uppercase tracking-widest">Needs Review</p>
                    </Card>
                    <Card className="p-8 space-y-4">
                      <p className="text-surface-400 text-xs font-black uppercase tracking-widest">Naturalness</p>
                      <h4 className="text-6xl font-black">
                        {(voiceEvaluations.reduce((acc, curr) => acc + curr.naturalness, 0) / (voiceEvaluations.length || 1)).toFixed(1)}
                      </h4>
                      <p className="text-sm font-bold text-green-500">High Quality Rating</p>
                    </Card>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-black text-2xl tracking-tight">Recent Evaluations</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {voiceEvaluations.map(evalItem => (
                        <Card key={evalItem._id} className="p-8 space-y-6 border-none shadow-lg bg-white dark:bg-surface-800" hover>
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4 items-center">
                              <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-2xl flex items-center justify-center">
                                <RefreshCw size={24} />
                              </div>
                              <div>
                                <p className="font-black text-lg text-surface-900 dark:text-white">{evalItem.call_id}</p>
                                <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Evaluator: {evalItem.evaluator_id}</p>
                              </div>
                            </div>
                            {evalItem.critical_failure && <Badge variant="danger" className="py-2 px-4 text-xs">CRITICAL: {evalItem.failure_type}</Badge>}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6 border-y border-surface-50 dark:border-surface-700">
                            {[
                              { label: 'Intent', score: evalItem.intent_understanding, icon: Zap },
                              { label: 'Task', score: evalItem.task_completion, icon: CheckCircle },
                              { label: 'Natural', score: evalItem.naturalness, icon: User },
                              { label: 'Flow', score: evalItem.dialogue_flow, icon: RefreshCw }
                            ].map(stat => (
                              <div key={stat.label} className="space-y-3">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">{stat.label}</p>
                                <div className="flex gap-1 text-brand-500">
                                  {[...Array(5)].map((_, i) => (
                                    <stat.icon 
                                      key={i} 
                                      size={14} 
                                      className={cn(i < stat.score ? "fill-current" : "opacity-10")} 
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-black text-surface-400 uppercase tracking-widest">Evaluator Comments</p>
                            <p className="text-base font-medium italic text-surface-600 dark:text-surface-300 leading-relaxed">
                              "{evalItem.comments}"
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 font-sans selection:bg-brand-200 selection:text-brand-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full"
        >
          <div className="w-full">
            {renderView()}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Status Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface-900/90 dark:bg-white/10 backdrop-blur-xl p-2 px-6 rounded-2xl border border-white/10 shadow-2xl z-50">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Backend Live</span>
         </div>
         <div className="w-px h-4 bg-white/20" />
         <button className="text-[10px] font-black text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors">Documentation</button>
      </div>
    </div>
  )
}

interface EvaluationScores {
  intent_understanding: number;
  task_completion: number;
  naturalness: number;
  dialogue_flow: number;
}

function EvaluationInterface({ callId, onBack, onSubmit, loading }: { callId: string, onBack: () => void, onSubmit: (data: any) => void, loading: boolean }) {
  const [scores, setScores] = useState<EvaluationScores>({
    intent_understanding: 0,
    task_completion: 0,
    naturalness: 0,
    dialogue_flow: 0
  });
  const [comments, setComments] = useState('');
  const [criticalFailure, setCriticalFailure] = useState(false);
  const [failureType, setFailureType] = useState('NONE');

  const criteria = [
    { id: 'intent_understanding', label: 'Intent Understanding', icon: Zap, desc: 'Did AI correctly interpret user goals?' },
    { id: 'task_completion', label: 'Task Completion', icon: CheckCircle, desc: 'Was the objective successfully achieved?' },
    { id: 'naturalness', label: 'Naturalness', icon: User, desc: 'Human-like tone, pace, and prosody.' },
    { id: 'dialogue_flow', label: 'Dialogue Flow', icon: RefreshCw, desc: 'Coherence and smooth turn-taking.' }
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <Button variant="ghost" onClick={onBack} className="p-2"><X size={24} /></Button>
          <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
          <div>
            <h2 className="text-lg font-black tracking-tight">Reviewing {callId}</h2>
            <p className="text-surface-500 text-xs font-medium">Standard Evaluation Rubric v2.1</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="info">Topic: Hotel Booking</Badge>
          <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
          <Button 
            className="px-8 py-2 text-sm rounded-xl shadow-glow" 
            disabled={Object.values(scores).some(s => s === 0) || loading}
            onClick={() => onSubmit({ ...scores, comments, critical_failure: criticalFailure, failure_type: failureType })}
            loading={loading}
          >
            Submit Evaluation
          </Button>
        </div>
      </header>

      <main className="flex-1 p-8 w-full max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <Card className="p-0 overflow-hidden border-none shadow-xl bg-surface-900">
            <div className="p-8 border-b border-white/5 space-y-6">
              <h4 className="font-black text-xs uppercase tracking-[0.2em] text-surface-400">Audio Recording & Waveform</h4>
              <div className="flex flex-col gap-6">
                <div className="h-32 flex items-end gap-1 px-4">
                  {[...Array(80)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ height: "20%" }}
                      animate={{ height: `${20 + Math.random() * 80}%` }}
                      transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: i * 0.05 }}
                      className="flex-1 bg-brand-500/40 rounded-full" 
                    />
                  ))}
                </div>
                <div className="flex items-center gap-6 text-white bg-white/5 p-6 rounded-[32px] border border-white/10">
                  <button className="w-14 h-14 bg-brand-500 rounded-full flex items-center justify-center shadow-glow hover:scale-105 transition-transform">
                    <RefreshCw size={24} />
                  </button>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-white w-1/3 shadow-[0_0_15px_white]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-surface-400">
                      <span>00:24</span>
                      <span>01:24</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 space-y-8 border-none shadow-xl">
            <h4 className="font-black text-xl tracking-tight">Conversation Transcript</h4>
            <div className="space-y-8 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              {[
                { role: 'USR', text: "I want to book a room for tomorrow night in Delhi.", time: "10:02 AM" },
                { role: 'AI', text: "Sure! I can help with that. Which area in Delhi do you prefer?", time: "10:02 AM", isAi: true },
                { role: 'USR', text: "Near the airport would be great. Budget is around 5000.", time: "10:03 AM" },
                { role: 'AI', text: "I've found 3 hotels near IGI Airport within your budget. Would you like to hear the top-rated one?", time: "10:03 AM", isAi: true }
              ].map((msg, i) => (
                <div key={i} className={cn("flex gap-6", msg.isAi ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 text-xs font-black shadow-soft",
                    msg.isAi ? "bg-brand-500 text-white" : "bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300"
                  )}>
                    {msg.role}
                  </div>
                  <div className="space-y-2 max-w-2xl">
                    <div className={cn(
                      "p-6 rounded-[32px] shadow-soft border",
                      msg.isAi 
                        ? "bg-brand-500 text-white border-brand-400 rounded-tr-none" 
                        : "bg-white dark:bg-surface-800 border-surface-100 dark:border-surface-700 rounded-tl-none"
                    )}>
                      <p className="text-base font-medium leading-relaxed">{msg.text}</p>
                    </div>
                    <p className={cn("text-[10px] font-black text-surface-400 uppercase tracking-widest px-2", msg.isAi && "text-right")}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <aside className="lg:col-span-4 space-y-8">
          <Card className="p-8 space-y-8 shadow-2xl border-brand-500/20 sticky top-28">
            <h4 className="font-black text-2xl tracking-tight">Quality Assessment</h4>
            <div className="space-y-8">
              {criteria.map(item => (
                <div key={item.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl flex items-center justify-center">
                        <item.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-black">{item.label}</p>
                        <p className="text-[10px] text-surface-400 font-medium">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setScores({ ...scores, [item.id as keyof EvaluationScores]: star })}
                        className={cn(
                          "flex-1 h-12 rounded-xl border-2 transition-all flex items-center justify-center font-black text-sm",
                          scores[item.id as keyof EvaluationScores] >= star 
                            ? "bg-brand-500 border-brand-500 text-white shadow-glow" 
                            : "border-surface-100 dark:border-surface-700 text-surface-300 hover:border-brand-200"
                        )}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-6 pt-8 border-t border-surface-100 dark:border-surface-700">
              <div className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-100 dark:border-surface-700">
                <div className="space-y-1">
                  <p className="text-sm font-black">Critical Failure?</p>
                  <p className="text-[10px] text-surface-400 font-medium">Mark severe system errors</p>
                </div>
                <button 
                  onClick={() => setCriticalFailure(!criticalFailure)}
                  className={cn(
                    "w-14 h-7 rounded-full transition-all relative p-1",
                    criticalFailure ? "bg-red-500" : "bg-surface-200 dark:bg-surface-700"
                  )}
                >
                  <div className={cn("w-5 h-5 bg-white rounded-full shadow-lg transition-all", criticalFailure ? "translate-x-7" : "translate-x-0")} />
                </button>
              </div>
              
              {criticalFailure && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                  <label className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Failure Category</label>
                  <select 
                    className="w-full h-14 px-4 rounded-2xl border-2 border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 text-red-600 font-black text-sm outline-none appearance-none"
                    value={failureType}
                    onChange={e => setFailureType(e.target.value)}
                  >
                    <option value="NONE">Select Failure Type</option>
                    <option value="HALLUCINATION">Hallucination</option>
                    <option value="OFFENSIVE">Offensive Content</option>
                    <option value="DEAD_AIR">Dead Air / Loop</option>
                  </select>
                </motion.div>
              )}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">Qualitative Feedback</label>
                <textarea 
                  className="w-full p-6 rounded-[32px] border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-medium min-h-[150px] resize-none outline-none focus:border-brand-500 text-sm transition-all"
                  placeholder="Provide detailed observations about the conversation flow and AI performance..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>
            </div>
          </Card>
        </aside>
      </main>
    </div>
  );
}

function CaptureView({ onBack, onAdd, loading }: { onBack: () => void, onAdd: (desc: string, url: string) => void, loading: boolean }) {
  const [captured, setCaptured] = useState(false)
  const [description, setDescription] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)
  
  const MOCK_IMG = 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=1000'

  const handleCapture = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      setCaptured(true)
    }, 1200)
  }

  if (captured) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
        <header className="w-full bg-white dark:bg-surface-800 border-b border-surface-100 dark:border-surface-700 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <Button variant="ghost" onClick={() => setCaptured(false)} className="p-2"><X size={24} /></Button>
            <div className="h-8 w-px bg-surface-100 dark:bg-surface-700" />
            <h2 className="text-lg font-black tracking-tight">Finalize Submission</h2>
          </div>
        </header>

        <main className="flex-1 p-8 w-full max-w-[1400px] mx-auto flex items-center justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="space-y-6">
              <div className="aspect-[4/3] rounded-[48px] overflow-hidden shadow-2xl border-8 border-white dark:border-surface-800 group relative">
                <img src={MOCK_IMG} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex items-center justify-center gap-3 text-surface-400 font-bold text-sm uppercase tracking-widest">
                <ImageIcon size={18} />
                Preview of village capture
              </div>
            </div>
            
            <div className="flex flex-col justify-center gap-8">
              <Card className="p-10 space-y-6 shadow-xl border-none">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black">Describe this scene</h3>
                  <p className="text-surface-500 font-medium">Provide a high-quality description for AI training.</p>
                </div>
                <div className="space-y-4">
                  <textarea 
                    className="w-full p-8 rounded-[32px] border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-medium min-h-[240px] resize-none outline-none focus:border-brand-500 transition-all text-lg leading-relaxed"
                    placeholder="Example: A small dirt road leading into a cluster of mud-brick houses with straw roofs, surrounded by lush green neem trees under a bright afternoon sun..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <div className="flex justify-between items-center px-4">
                     <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", description.length >= 10 ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-surface-300")} />
                        <p className="text-xs text-surface-400 font-black uppercase tracking-widest">Data Quality Check</p>
                     </div>
                     <span className={cn("text-sm font-black tabular-nums", description.length >= 10 ? "text-green-500" : "text-surface-300")}>
                       {description.length} / 10 characters
                     </span>
                  </div>
                </div>
              </Card>
              
              <div className="space-y-4">
                <Button 
                  className="w-full h-20 rounded-3xl text-xl shadow-glow group" 
                  disabled={description.length < 10 || loading} 
                  onClick={() => onAdd(description, MOCK_IMG)}
                  loading={loading}
                  icon={UploadCloud}
                >
                  <span className="group-hover:translate-x-1 transition-transform">Complete Mission</span>
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">
                  <ShieldCheck size={12} className="text-green-500" />
                  Secure end-to-end encryption active
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-surface-900">
       <header className="w-full bg-black/20 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-30">
         <Button variant="ghost" onClick={onBack} className="p-2 text-white/60 hover:text-white"><X size={24} /></Button>
         <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
             <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
             <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Camera Sensor Active</span>
           </div>
           <div className="h-8 w-px bg-white/10" />
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Village:</span>
              <span className="text-[10px] font-black text-brand-400 uppercase tracking-widest">ROHTAK-V1</span>
           </div>
         </div>
       </header>

       <main className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none" />
          
          <div className="w-full max-w-5xl aspect-video bg-black rounded-[60px] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden border-[12px] border-surface-800 flex items-center justify-center">
            {/* Camera Viewfinder Elements */}
            <div className="absolute inset-12 border border-white/10 rounded-[40px] pointer-events-none" />
            <div className="absolute top-1/2 left-8 right-8 h-px bg-white/5 pointer-events-none" />
            <div className="absolute left-1/2 top-8 bottom-8 w-px bg-white/5 pointer-events-none" />
            
            {/* Corners */}
            <div className="absolute top-16 left-16 w-12 h-12 border-t-4 border-l-4 border-white/20 rounded-tl-2xl" />
            <div className="absolute top-16 right-16 w-12 h-12 border-t-4 border-r-4 border-white/20 rounded-tr-2xl" />
            <div className="absolute bottom-16 left-16 w-12 h-12 border-b-4 border-l-4 border-white/20 rounded-bl-2xl" />
            <div className="absolute bottom-16 right-16 w-12 h-12 border-b-4 border-r-4 border-white/20 rounded-br-2xl" />

            <div className="relative z-10">
              {isCapturing ? (
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-4 border-brand-500/20 animate-ping absolute inset-0" />
                  <motion.div 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1.1 }}
                    className="w-40 h-40 rounded-full border-4 border-brand-500 flex items-center justify-center bg-brand-500/10 backdrop-blur-xl shadow-[0_0_50px_rgba(59,130,246,0.3)]"
                  >
                    <Zap size={64} className="text-brand-500 fill-brand-500" />
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-8 group">
                  <div className="p-12 border-4 border-dashed border-white/5 rounded-full group-hover:border-brand-500/20 transition-colors duration-500">
                    <Camera size={120} strokeWidth={0.5} className="text-white/5 group-hover:text-brand-500/20 transition-colors duration-500" />
                  </div>
                  <div className="space-y-2 text-center">
                    <p className="font-black text-white/20 uppercase tracking-[0.4em] text-sm group-hover:text-white/40 transition-colors">
                      Stabilizing Scene
                    </p>
                    <p className="text-[10px] font-bold text-white/10 uppercase tracking-widest">Hold device firmly</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls Area */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center gap-16 px-20">
               <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/5 hover:text-white transition-all">
                  <ImageIcon size={24} />
               </button>
               
               <button 
                 onClick={handleCapture}
                 disabled={isCapturing}
                 className="group relative"
               >
                 <div className="absolute inset-0 bg-brand-500 blur-2xl opacity-0 group-hover:opacity-40 transition-opacity" />
                 <div className="w-28 h-28 bg-white rounded-full p-2 relative shadow-2xl active:scale-90 transition-all duration-300">
                   <div className="w-full h-full rounded-full border-[6px] border-surface-900 bg-white group-hover:bg-surface-50 transition-colors" />
                 </div>
               </button>

               <button className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center text-white/20 hover:bg-white/5 hover:text-white transition-all">
                  <RefreshCw size={24} />
               </button>
            </div>

            {/* Top Right Metadata */}
            <div className="absolute top-12 right-12 text-right space-y-1">
               <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest">4K RAW</p>
               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">GPS: 28.8955° N</p>
            </div>
          </div>
       </main>
       
       <footer className="w-full p-8 flex justify-center">
          <div className="flex items-center gap-6 bg-white/5 backdrop-blur-xl p-4 px-10 rounded-full border border-white/10">
             <div className="flex items-center gap-4">
                <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    className="h-full bg-brand-500 shadow-[0_0_15px_#3b82f6]" 
                   />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Signal: 85%</span>
             </div>
             <div className="w-px h-4 bg-white/10" />
             <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Authentic Village Metadata will be attached</p>
          </div>
       </footer>
    </div>
  )
}
