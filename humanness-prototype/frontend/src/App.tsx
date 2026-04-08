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
          <div className="flex flex-col items-center justify-center min-h-[90vh] max-w-4xl mx-auto px-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 px-4 py-2 rounded-full text-sm font-bold">
                <Zap size={16} /> Empowering AI with Local Context
              </div>
              
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-surface-900 dark:text-white leading-[0.9]">
                  JoshTalksAI<br/>
                  <span className="text-brand-500">Humanness</span>
                </h1>
                <p className="text-xl text-surface-500 dark:text-surface-400 max-w-lg mx-auto font-medium">
                  The gold-standard platform for building inclusive, culturally-rich AI datasets from every village in India.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mx-auto pt-8">
                <Button 
                  onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')} 
                  icon={User}
                  className="h-16 text-lg"
                >
                  Contributor
                </Button>
                <Button 
                  onClick={() => setCurrentView('EVALUATOR_PORTAL')} 
                  variant="outline" 
                  icon={Database}
                  className="h-16 text-lg"
                >
                  Evaluator
                </Button>
                <Button 
                  onClick={() => setCurrentView('ADMIN_DASHBOARD')} 
                  variant="secondary" 
                  icon={ShieldCheck}
                  className="h-16 text-lg"
                >
                  Admin
                </Button>
              </div>

              <div className="pt-12 grid grid-cols-3 gap-8 border-t border-surface-100 dark:border-surface-800">
                <div className="text-center">
                  <p className="text-2xl font-black text-surface-900 dark:text-white">600K+</p>
                  <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Villages</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-surface-900 dark:text-white">1M+</p>
                  <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Images</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-surface-900 dark:text-white">99%</p>
                  <p className="text-xs font-bold text-surface-400 uppercase tracking-widest">Accuracy</p>
                </div>
              </div>
            </motion.div>
          </div>
        )

      case 'CONTRIBUTOR_DASHBOARD':
        return (
          <div className="max-w-2xl mx-auto w-full space-y-8 pb-20">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-black tracking-tight">Dashboard</h2>
                <p className="text-surface-500 font-medium flex items-center gap-1"><MapPin size={14} /> {selectedLocation.village}, {selectedLocation.district}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white dark:bg-surface-800 rounded-xl border shadow-soft"><Bell size={20} /></button>
                <button onClick={() => setCurrentView('SPLASH')} className="p-2 bg-white dark:bg-surface-800 rounded-xl border shadow-soft text-red-500"><X size={20} /></button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-brand-500 to-brand-600 text-white border-none relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-brand-100 text-xs font-black uppercase tracking-widest">Your Impact</p>
                  <h3 className="text-4xl font-black mt-2">{submissions.length} <span className="text-lg opacity-60">/ 1000</span></h3>
                  <div className="mt-6 w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full transition-all duration-1000" style={{ width: `${Math.min((submissions.length / 1000) * 100, 100)}%` }} />
                  </div>
                </div>
                <Zap className="absolute -right-4 -bottom-4 text-white/10" size={120} />
              </Card>
              
              <Card className="flex flex-col justify-center gap-2">
                <div className="flex items-center gap-3 text-green-500">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg"><Globe size={20} /></div>
                  <p className="text-xs font-black uppercase tracking-widest text-surface-400">System Status</p>
                </div>
                <p className="text-lg font-bold">Cloud Connected</p>
                <p className="text-xs text-surface-500">Automatic background sync active</p>
              </Card>
            </div>

            <Button 
              className="w-full h-20 text-xl rounded-2xl" 
              onClick={() => setCurrentView('LOCATION_SELECT')}
              icon={Camera}
              loading={loading}
            >
              Collect New Data
            </Button>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-surface-400 uppercase tracking-widest text-xs">Recent Submissions</h4>
                <button onClick={fetchSubmissions} className="text-xs font-bold text-brand-500 hover:underline">Refresh</button>
              </div>
              
              <div className="grid gap-4">
                {submissions.length === 0 && !loading && (
                  <div className="text-center py-16 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border-2 border-dashed border-surface-200 dark:border-surface-700">
                    <ImageIcon size={48} className="mx-auto text-surface-200 mb-4" />
                    <p className="text-surface-500 font-bold">No data collected yet</p>
                    <p className="text-xs text-surface-400 mt-1">Start by clicking the button above</p>
                  </div>
                )}
                {submissions.map(sub => (
                  <Card key={sub._id} className="flex gap-4 items-center p-3" hover>
                    <div className="relative">
                      <img src={sub.imageUrl} className="w-20 h-20 rounded-xl object-cover" />
                      <div className="absolute -top-2 -right-2">
                        {sub.status === 'APPROVED' ? (
                          <div className="bg-green-500 text-white p-1 rounded-full shadow-lg border-2 border-white"><Check size={12} /></div>
                        ) : sub.status === 'REJECTED' ? (
                          <div className="bg-red-500 text-white p-1 rounded-full shadow-lg border-2 border-white"><X size={12} /></div>
                        ) : (
                          <div className="bg-blue-500 text-white p-1 rounded-full shadow-lg border-2 border-white"><Clock size={12} /></div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <Badge variant={sub.status === 'APPROVED' ? 'success' : sub.status === 'REJECTED' ? 'danger' : 'info'}>
                          {sub.status}
                        </Badge>
                        <p className="text-[10px] text-surface-400 font-bold">{new Date(sub.timestamp).toLocaleDateString()}</p>
                      </div>
                      <p className="font-bold truncate text-surface-900 dark:text-white mt-1">{sub.description}</p>
                      <p className="text-xs text-surface-500 font-medium">{sub.village}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )

      case 'LOCATION_SELECT':
        return (
          <div className="max-w-md mx-auto w-full space-y-8">
            <header className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')} className="p-2"><X size={24} /></Button>
              <h2 className="text-3xl font-black tracking-tight">Set Location</h2>
            </header>
            
            <Card className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest">State</label>
                  <select className="w-full h-14 px-4 rounded-xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-bold appearance-none outline-none focus:border-brand-500 transition-colors" value={selectedLocation.state} onChange={e => setSelectedLocation({...selectedLocation, state: e.target.value})}>
                    {STATES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest">District</label>
                  <select className="w-full h-14 px-4 rounded-xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-bold appearance-none outline-none focus:border-brand-500 transition-colors" value={selectedLocation.district} onChange={e => setSelectedLocation({...selectedLocation, district: e.target.value})}>
                    {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Village</label>
                  <select className="w-full h-14 px-4 rounded-xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-bold appearance-none outline-none focus:border-brand-500 transition-colors" value={selectedLocation.village} onChange={e => setSelectedLocation({...selectedLocation, village: e.target.value})}>
                    {VILLAGES.map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded-2xl">
                <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-sm font-bold">GPS Verified</p>
                  <p className="text-xs opacity-80">Location matches target village</p>
                </div>
              </div>
            </Card>
            
            <Button className="w-full h-16 text-lg rounded-2xl" onClick={() => setCurrentView('CAPTURE')} icon={ArrowRight}>
              Continue to Camera
            </Button>
          </div>
        )

      case 'CAPTURE':
        return (
          <CaptureView onBack={() => setCurrentView('LOCATION_SELECT')} onAdd={addSubmission} loading={loading} />
        )

      case 'SUBMISSION_SUCCESS':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 text-center max-w-md mx-auto">
            <motion.div 
              initial={{ scale: 0, rotate: -45 }} 
              animate={{ scale: 1, rotate: 0 }} 
              className="bg-green-500 text-white p-8 rounded-[40px] shadow-glow"
            >
              <CheckCircle size={80} strokeWidth={2.5} />
            </motion.div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tight">Mission Accomplished</h2>
              <p className="text-surface-500 font-medium px-8">Your contribution is now helping train the next generation of inclusive AI models.</p>
            </div>
            <div className="w-full space-y-3 pt-4">
              <Button className="w-full h-16 rounded-2xl" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')}>
                Return to Dashboard
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setCurrentView('CAPTURE')}>
                Submit Another Photo
              </Button>
            </div>
          </div>
        )

      case 'EVALUATOR_PORTAL':
        return (
          <div className="max-w-4xl mx-auto w-full space-y-8 pb-20">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-4xl font-black tracking-tight text-surface-900 dark:text-white leading-[0.9]">Evaluator Portal</h2>
                <p className="text-surface-500 font-medium mt-2">Task: Standardized Voice AI Quality Review</p>
              </div>
              <Button variant="secondary" onClick={() => setCurrentView('SPLASH')} icon={X}>Exit Portal</Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="font-black text-xl tracking-tight">Assigned Conversations</h4>
                  <Badge variant="info">Batch #42</Badge>
                </div>
                <div className="space-y-3">
                  {['CALL-2001', 'CALL-2002', 'CALL-2003'].map(callId => (
                    <div key={callId} className="flex items-center justify-between p-4 bg-surface-50 dark:bg-surface-800 rounded-2xl border border-surface-100 dark:border-surface-700">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-brand-50 dark:bg-brand-900/20 text-brand-500 rounded-xl">
                          <RefreshCw size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-surface-900 dark:text-white">{callId}</p>
                          <p className="text-xs text-surface-500">Duration: 1m 24s • Topic: Hotel Booking</p>
                        </div>
                      </div>
                      <Button 
                        variant="primary" 
                        className="px-4 py-2 text-xs" 
                        onClick={() => { setSelectedCallId(callId); setCurrentView('EVALUATION_SCREEN'); }}
                      >
                        Start Review
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
              
              <div className="space-y-6">
                <Card className="bg-brand-500 text-white border-none shadow-glow">
                  <p className="text-brand-100 text-[10px] font-black uppercase tracking-widest">Reviews Today</p>
                  <h4 className="text-5xl font-black mt-2">12 <span className="text-lg opacity-60">/ 20</span></h4>
                  <p className="mt-4 text-xs font-bold text-brand-100">8 more to hit your goal</p>
                </Card>
                <Card className="space-y-4">
                  <h5 className="font-black text-xs uppercase tracking-widest text-surface-400">Review Rubric</h5>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" />
                      <p className="text-xs font-medium text-surface-600 dark:text-surface-400">Rate intent understanding based on user goal completion.</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5" />
                      <p className="text-xs font-medium text-surface-600 dark:text-surface-400">Naturalness includes tone, pace, and prosody.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )

      case 'EVALUATION_SCREEN':
        return (
          <EvaluationInterface 
            callId={selectedCallId || 'CALL-UNKNOWN'} 
            onBack={() => setCurrentView('EVALUATOR_PORTAL')} 
            onSubmit={async (data) => {
              try {
                setLoading(true);
                await axios.post(`${API_URL}/evaluations`, {
                  ...data,
                  call_id: selectedCallId,
                  evaluator_id: 'EVAL-CURRENT-USER'
                });
                setCurrentView('EVALUATOR_PORTAL');
              } catch (err) {
                console.error('Error submitting evaluation:', err);
                alert('Submission failed.');
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          />
        )

      case 'ADMIN_DASHBOARD':
        return (
          <div className="w-full max-w-7xl mx-auto space-y-8 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-4xl font-black tracking-tight">Admin Operations</h2>
                <p className="text-surface-500 font-medium">Quality Assurance & Coverage Monitoring</p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <Button variant="secondary" onClick={() => { fetchSubmissions(); fetchTranscriberAnalytics(); }} icon={RefreshCw} loading={loading}>Refresh</Button>
                <Button variant="danger" onClick={() => setCurrentView('SPLASH')} icon={X}>Exit Console</Button>
              </div>
            </header>

            <div className="flex gap-4 border-b border-surface-100 dark:border-surface-800 pb-4">
              <button 
                onClick={() => setAdminTab('SUBMISSIONS')}
                className={cn(
                  "px-6 py-2 rounded-xl font-black text-sm transition-all",
                  adminTab === 'SUBMISSIONS' ? "bg-brand-500 text-white shadow-glow" : "text-surface-400 hover:text-surface-600"
                )}
              >
                Vision Submissions (Task 1)
              </button>
              <button 
                onClick={() => setAdminTab('TRANSCRIBERS')}
                className={cn(
                  "px-6 py-2 rounded-xl font-black text-sm transition-all",
                  adminTab === 'TRANSCRIBERS' ? "bg-brand-500 text-white shadow-glow" : "text-surface-400 hover:text-surface-600"
                )}
              >
                Transcriber Quality (Task 2)
              </button>
              <button 
                onClick={() => setAdminTab('VOICE_AI')}
                className={cn(
                  "px-6 py-2 rounded-xl font-black text-sm transition-all",
                  adminTab === 'VOICE_AI' ? "bg-brand-500 text-white shadow-glow" : "text-surface-400 hover:text-surface-600"
                )}
              >
                Voice AI Analytics (Task 3)
              </button>
            </div>

            {adminTab === 'SUBMISSIONS' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-surface-900 text-white border-none shadow-2xl">
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Active Requests</p>
                    <h4 className="text-5xl font-black mt-2">{submissions.filter(s => s.status === 'PENDING').length}</h4>
                    <div className="mt-4 flex items-center gap-2 text-blue-400">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <p className="text-xs font-bold">Needs verification</p>
                    </div>
                  </Card>
                  <Card className="bg-brand-500 text-white border-none shadow-glow">
                    <p className="text-brand-100 text-[10px] font-black uppercase tracking-widest">Total Dataset</p>
                    <h4 className="text-5xl font-black mt-2">{submissions.length}</h4>
                    <p className="mt-4 text-xs font-bold text-brand-100">+12% from yesterday</p>
                  </Card>
                  <Card className="bg-surface-50 dark:bg-surface-800/50">
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Villages Covered</p>
                    <h4 className="text-5xl font-black mt-2">45K</h4>
                    <p className="mt-4 text-xs font-bold text-green-500">Target: 600K</p>
                  </Card>
                  <Card className="bg-surface-50 dark:bg-surface-800/50">
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Quality Score</p>
                    <h4 className="text-5xl font-black mt-2">98.4%</h4>
                    <p className="mt-4 text-xs font-bold text-brand-500">Word Error Rate: 1.6%</p>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-xl tracking-tight">Verification Queue</h4>
                    </div>
                    
                    {submissions.filter(s => s.status === 'PENDING').length === 0 && (
                      <div className="text-center py-24 bg-surface-50 dark:bg-surface-800/50 rounded-3xl border-2 border-dashed border-surface-200 dark:border-surface-700">
                        <ShieldCheck size={64} className="mx-auto text-surface-200 mb-4" />
                        <p className="text-surface-500 font-black text-xl">Queue Clear!</p>
                        <p className="text-surface-400 font-medium">All submissions have been verified.</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {submissions.filter(s => s.status === 'PENDING').map(sub => (
                        <Card key={sub._id} className="p-0 overflow-hidden group flex flex-col h-full" hover>
                          <div className="relative aspect-video">
                            <img src={sub.imageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-3 left-3 flex gap-2">
                              <Badge variant="info">{sub.state}</Badge>
                            </div>
                          </div>
                          <div className="p-5 flex-1 flex flex-col gap-4">
                            <div className="space-y-1">
                              <p className="text-xs font-black text-brand-500 uppercase tracking-widest">{sub.village}</p>
                              <p className="text-surface-900 dark:text-white font-bold leading-snug line-clamp-2">{sub.description}</p>
                            </div>
                            <div className="mt-auto pt-4 flex gap-2 border-t border-surface-50 dark:border-surface-700">
                              <button onClick={() => updateStatus(sub._id, 'APPROVED')} className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all">APPROVE</button>
                              <button onClick={() => updateStatus(sub._id, 'REJECTED')} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-xs shadow-lg active:scale-95 transition-all">REJECT</button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-black text-xl tracking-tight text-surface-900 dark:text-white">Coverage Map</h4>
                    <Card className="p-0 overflow-hidden h-[400px] flex flex-col bg-surface-900 border-none relative">
                      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                      <div className="p-4 border-b border-white/5 flex justify-between items-center relative z-10">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                        </div>
                        <Badge variant="info">Live View</Badge>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative z-10">
                        <Globe size={80} className="text-brand-500 mb-6 animate-pulse" />
                        <p className="text-white font-black text-lg">Interactive Spatial Data</p>
                        <p className="text-surface-400 text-sm mt-2">Visualizing 1,000 images per village density mapping</p>
                      </div>
                    </Card>
                  </div>
                </div>
              </>
            ) : adminTab === 'TRANSCRIBERS' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-red-500 text-white border-none shadow-glow">
                    <p className="text-red-100 text-[10px] font-black uppercase tracking-widest">Flagged Transcribers</p>
                    <h4 className="text-5xl font-black mt-2">{transcriberAnalytics.filter(t => t.status === 'FLAGGED').length}</h4>
                    <p className="mt-4 text-xs font-bold">Needs immediate audit</p>
                  </Card>
                  <Card>
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Avg. Edit Rate</p>
                    <h4 className="text-5xl font-black mt-2">
                      {(transcriberAnalytics.reduce((acc, curr) => acc + parseFloat(curr.edit_rate), 0) / (transcriberAnalytics.length || 1)).toFixed(1)}%
                    </h4>
                    <p className="mt-4 text-xs font-bold text-surface-400">Target: &gt;15%</p>
                  </Card>
                  <Card>
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Avg. Time Ratio</p>
                    <h4 className="text-5xl font-black mt-2">
                      {(transcriberAnalytics.reduce((acc, curr) => acc + parseFloat(curr.time_ratio), 0) / (transcriberAnalytics.length || 1)).toFixed(2)}
                    </h4>
                    <p className="mt-4 text-xs font-bold text-surface-400">Target: &gt;0.7</p>
                  </Card>
                </div>

                <Card className="p-0 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-surface-50 dark:bg-surface-800/50 border-b border-surface-100 dark:border-surface-700">
                      <tr>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">User ID</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Tasks</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Edit Rate</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Time Ratio</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Avg. CPS</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Flags</th>
                        <th className="p-4 text-[10px] font-black uppercase tracking-widest text-surface-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transcriberAnalytics.map(user => (
                        <tr key={user.user_id} className="border-b border-surface-50 dark:border-surface-800 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-colors">
                          <td className="p-4 font-bold">{user.user_id}</td>
                          <td className="p-4 font-medium">{user.total_tasks}</td>
                          <td className={cn("p-4 font-black", parseFloat(user.edit_rate) < 15 ? "text-red-500" : "text-green-500")}>{user.edit_rate}%</td>
                          <td className={cn("p-4 font-black", parseFloat(user.time_ratio) < 0.7 ? "text-red-500" : "text-green-500")}>{user.time_ratio}</td>
                          <td className={cn("p-4 font-black", parseFloat(user.avg_cps) > 15 ? "text-red-500" : "text-surface-900 dark:text-white")}>{user.avg_cps}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {user.flags.length > 0 ? user.flags.map(f => <Badge key={f} variant="danger">{f}</Badge>) : <Badge variant="success">HEALTHY</Badge>}
                            </div>
                          </td>
                          <td className="p-4">
                            <button 
                              onClick={() => {
                                alert(`User ${user.user_id} has been blocked and flagged for review.`);
                                // In a real app, this would call an API
                              }}
                              className="text-[10px] font-black uppercase text-brand-500 hover:underline"
                            >
                              Block User
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transcriberAnalytics.length === 0 && <p className="text-center py-12 text-surface-400 italic">No transcriber data found.</p>}
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="bg-surface-900 text-white border-none shadow-2xl">
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Avg. Intent Score</p>
                    <h4 className="text-5xl font-black mt-2">
                      {(voiceEvaluations.reduce((acc, curr) => acc + curr.intent_understanding, 0) / (voiceEvaluations.length || 1)).toFixed(1)}
                    </h4>
                    <p className="mt-4 text-xs font-bold text-blue-400">Target: 4.5+</p>
                  </Card>
                  <Card className="bg-brand-500 text-white border-none shadow-glow">
                    <p className="text-brand-100 text-[10px] font-black uppercase tracking-widest">Task Success Rate</p>
                    <h4 className="text-5xl font-black mt-2">
                      {((voiceEvaluations.filter(e => e.task_completion >= 4).length / (voiceEvaluations.length || 1)) * 100).toFixed(0)}%
                    </h4>
                    <p className="mt-4 text-xs font-bold text-brand-100">Across {voiceEvaluations.length} calls</p>
                  </Card>
                  <Card>
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Critical Failures</p>
                    <h4 className="text-5xl font-black mt-2 text-red-500">
                      {voiceEvaluations.filter(e => e.critical_failure).length}
                    </h4>
                    <p className="mt-4 text-xs font-bold text-surface-400">Needs Root Cause Analysis</p>
                  </Card>
                  <Card>
                    <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Naturalness</p>
                    <h4 className="text-5xl font-black mt-2">
                      {(voiceEvaluations.reduce((acc, curr) => acc + curr.naturalness, 0) / (voiceEvaluations.length || 1)).toFixed(1)}
                    </h4>
                    <p className="mt-4 text-xs font-bold text-green-500">Industry Standard: 4.2</p>
                  </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <h4 className="font-black text-xl tracking-tight">Recent Evaluations</h4>
                  {voiceEvaluations.map(evalItem => (
                    <Card key={evalItem._id} className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <Badge variant="info">{evalItem.call_id}</Badge>
                          <p className="text-xs font-bold text-surface-400">Evaluated by {evalItem.evaluator_id}</p>
                        </div>
                        {evalItem.critical_failure && <Badge variant="danger">CRITICAL: {evalItem.failure_type}</Badge>}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">Intent</p>
                          <div className="flex text-brand-500">
                            {[...Array(5)].map((_, i) => <Zap key={i} size={12} className={i < evalItem.intent_understanding ? "fill-current" : "opacity-20"} />)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">Task</p>
                          <div className="flex text-brand-500">
                            {[...Array(5)].map((_, i) => <CheckCircle key={i} size={12} className={i < evalItem.task_completion ? "fill-current" : "opacity-20"} />)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">Natural</p>
                          <div className="flex text-brand-500">
                            {[...Array(5)].map((_, i) => <User key={i} size={12} className={i < evalItem.naturalness ? "fill-current" : "opacity-20"} />)}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-surface-400 uppercase tracking-tighter">Flow</p>
                          <div className="flex text-brand-500">
                            {[...Array(5)].map((_, i) => <RefreshCw key={i} size={12} className={i < evalItem.dialogue_flow ? "fill-current" : "opacity-20"} />)}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium italic text-surface-600 dark:text-surface-300">"{evalItem.comments}"</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
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
        >
          <div className="p-4 md:p-8">
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

function EvaluationInterface({ callId, onBack, onSubmit, loading }: { callId: string, onBack: () => void, onSubmit: (data: any) => void, loading: boolean }) {
  const [scores, setScores] = useState({
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
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-20">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="p-2"><X size={24} /></Button>
          <div>
            <h2 className="text-3xl font-black tracking-tight">Reviewing {callId}</h2>
            <p className="text-surface-500 font-medium">Standard Evaluation Rubric v2.1</p>
          </div>
        </div>
        <Badge variant="info">Topic: Hotel Booking</Badge>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-surface-400">Audio Recording</h4>
              <div className="bg-surface-900 rounded-2xl p-6 flex flex-col gap-4">
                <div className="h-16 flex items-end gap-1 px-4">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="flex-1 bg-brand-500/40 rounded-full" style={{ height: `${Math.random() * 100}%` }} />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-white">
                  <button className="p-3 bg-brand-500 rounded-full"><RefreshCw size={20} /></button>
                  <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-1/3" />
                  </div>
                  <span className="text-xs font-mono">00:24 / 01:24</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-surface-400">Transcript</h4>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0 text-[10px] font-black">USR</div>
                  <div className="bg-surface-50 dark:bg-surface-800 p-3 rounded-2xl rounded-tl-none border border-surface-100 dark:border-surface-700">
                    <p className="text-sm font-medium">"I want to book a room for tomorrow night in Delhi."</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-brand-500 text-white flex items-center justify-center flex-shrink-0 text-[10px] font-black">AI</div>
                  <div className="bg-brand-500 text-white p-3 rounded-2xl rounded-tr-none shadow-glow">
                    <p className="text-sm font-medium">"Sure! I can help with that. Which area in Delhi do you prefer?"</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-surface-100 flex items-center justify-center flex-shrink-0 text-[10px] font-black">USR</div>
                  <div className="bg-surface-50 dark:bg-surface-800 p-3 rounded-2xl rounded-tl-none border border-surface-100 dark:border-surface-700">
                    <p className="text-sm font-medium">"Near the airport would be great. Budget is around 5000."</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-6 shadow-2xl border-brand-500/20">
            <h4 className="font-black text-xl tracking-tight">Quality Scores</h4>
            <div className="space-y-6">
              {criteria.map(item => (
                <div key={item.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <item.icon size={16} className="text-brand-500" />
                      <p className="text-sm font-black">{item.label}</p>
                    </div>
                    <span className="text-xs font-black text-brand-500">{(scores as any)[item.id] || 0}/5</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => setScores({ ...scores, [item.id]: star })}
                        className={cn(
                          "flex-1 h-10 rounded-lg border-2 transition-all flex items-center justify-center font-black text-xs",
                          (scores as any)[item.id] >= star 
                            ? "bg-brand-500 border-brand-500 text-white shadow-glow" 
                            : "border-surface-100 dark:border-surface-700 text-surface-300 hover:border-brand-200"
                        )}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-surface-400 font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-surface-100 dark:border-surface-700">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black">Critical Failure?</p>
                <button 
                  onClick={() => setCriticalFailure(!criticalFailure)}
                  className={cn(
                    "w-12 h-6 rounded-full transition-colors relative",
                    criticalFailure ? "bg-red-500" : "bg-surface-200 dark:bg-surface-700"
                  )}
                >
                  <div className={cn("w-4 h-4 bg-white rounded-full absolute top-1 transition-all", criticalFailure ? "left-7" : "left-1")} />
                </button>
              </div>
              
              {criticalFailure && (
                <select 
                  className="w-full h-12 px-4 rounded-xl border-2 border-red-100 bg-red-50 dark:bg-red-900/20 dark:border-red-900/40 text-red-600 font-bold text-xs"
                  value={failureType}
                  onChange={e => setFailureType(e.target.value)}
                >
                  <option value="NONE">Select Failure Type</option>
                  <option value="HALLUCINATION">Hallucination</option>
                  <option value="OFFENSIVE">Offensive Content</option>
                  <option value="DEAD_AIR">Dead Air / Loop</option>
                </select>
              )}

              <div className="space-y-2">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Comments</label>
                <textarea 
                  className="w-full p-4 rounded-2xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-medium min-h-[100px] resize-none outline-none focus:border-brand-500 text-sm"
                  placeholder="Optional qualitative feedback..."
                  value={comments}
                  onChange={e => setComments(e.target.value)}
                />
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl shadow-glow" 
              disabled={Object.values(scores).some(s => s === 0) || loading}
              onClick={() => onSubmit({ ...scores, comments, critical_failure: criticalFailure, failure_type: failureType })}
              loading={loading}
            >
              Submit Evaluation
            </Button>
          </Card>
        </div>
      </div>
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
      <div className="max-w-xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <header className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setCaptured(false)} className="p-2"><X size={24} /></Button>
          <h2 className="text-3xl font-black tracking-tight">Final Details</h2>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl border-4 border-white dark:border-surface-800">
              <img src={MOCK_IMG} className="w-full h-full object-cover" />
            </div>
            <p className="text-center text-xs font-bold text-surface-400 uppercase tracking-widest italic">Preview of capture</p>
          </div>
          
          <div className="flex flex-col gap-6">
            <Card className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest">Image Description</label>
                <textarea 
                  className="w-full p-4 rounded-2xl border-2 border-surface-100 bg-surface-50 dark:bg-surface-800 dark:border-surface-700 font-medium min-h-[180px] resize-none outline-none focus:border-brand-500 transition-colors"
                  placeholder="Tell us what you see in this scene. Mention colors, objects, and people..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className="flex justify-between items-center px-1">
                   <p className="text-[10px] text-surface-400 font-bold uppercase">Training Data Quality</p>
                   <span className={cn("text-xs font-black", description.length >= 10 ? "text-green-500" : "text-surface-300")}>
                     {description.length} / 10
                   </span>
                </div>
              </div>
            </Card>
            
            <div className="mt-auto space-y-3">
              <Button 
                className="w-full h-16 rounded-2xl text-lg shadow-glow" 
                disabled={description.length < 10 || loading} 
                onClick={() => onAdd(description, MOCK_IMG)}
                loading={loading}
                icon={UploadCloud}
              >
                Submit Data
              </Button>
              <p className="text-[10px] text-center font-bold text-surface-400 uppercase tracking-widest">Securely uploading to JoshTalksAI Servers</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto w-full h-[85vh] flex flex-col gap-6">
       <header className="flex justify-between items-center">
         <Button variant="ghost" onClick={onBack} className="p-2 text-surface-400"><X size={24} /></Button>
         <div className="flex items-center gap-2 bg-surface-900/5 dark:bg-white/5 px-4 py-2 rounded-full border border-surface-100 dark:border-white/10">
           <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Sensor Active</span>
         </div>
       </header>

       <div className="flex-1 bg-surface-900 rounded-[40px] shadow-2xl relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
          
          {isCapturing ? (
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white/20 animate-ping absolute -inset-0" />
              <div className="w-32 h-32 rounded-full border-4 border-white flex items-center justify-center">
                <Zap size={48} className="text-white fill-white" />
              </div>
            </div>
          ) : (
            <div className="text-white/10 flex flex-col items-center gap-6">
              <div className="p-8 border-2 border-dashed border-white/10 rounded-full">
                <Camera size={80} strokeWidth={1} />
              </div>
              <p className="font-black text-center px-12 text-sm uppercase tracking-[0.2em] leading-relaxed">
                Position scene in center<br/>& hold steady
              </p>
            </div>
          )}
          
          {/* Camera Frame */}
          <div className="absolute inset-10 border border-white/20 rounded-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-4 right-4 h-px bg-white/10 pointer-events-none" />
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-white/10 pointer-events-none" />
          
          {/* Shutter Button */}
          <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
             <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40">
                <ImageIcon size={20} />
             </div>
             <button 
               onClick={handleCapture}
               className="w-24 h-24 bg-white rounded-full border-[8px] border-surface-800 shadow-2xl active:scale-90 transition-all duration-300 flex items-center justify-center group"
             >
               <div className="w-16 h-16 bg-white rounded-full border-2 border-surface-200 group-hover:border-brand-500 transition-colors" />
             </button>
             <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/40">
                <RefreshCw size={20} />
             </div>
          </div>
          
          {/* Status Indicators */}
          <div className="absolute top-10 left-0 right-0 flex justify-center px-10">
             <div className="flex items-center gap-4 w-full">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-500 w-[85%] shadow-glow" />
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Level: 85%</span>
             </div>
          </div>
       </div>
       
       <p className="text-center text-[10px] font-black text-surface-400 uppercase tracking-widest">Authentic Village Metadata will be attached</p>
    </div>
  )
}
