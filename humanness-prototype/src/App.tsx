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
  Image as ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// --- Types ---
type View = 'SPLASH' | 'CONTRIBUTOR_DASHBOARD' | 'LOCATION_SELECT' | 'CAPTURE' | 'ADMIN_DASHBOARD' | 'SUBMISSION_SUCCESS'

interface Submission {
  id: string;
  village: string;
  district: string;
  state: string;
  description: string;
  imageUrl: string;
  timestamp: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  synced: boolean;
}

// --- Mock Data ---
const VILLAGES = ["Rohtak Village 1", "Sonipat Village A", "Hisar Village B", "Rewari Village C"]
const DISTRICTS = ["Rohtak", "Sonipat", "Hisar", "Rewari"]
const STATES = ["Haryana", "Punjab", "Rajasthan", "Uttar Pradesh"]

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: '1',
    village: 'Rohtak Village 1',
    district: 'Rohtak',
    state: 'Haryana',
    description: 'A traditional handpump used for drinking water in rural Rohtak.',
    imageUrl: 'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=400',
    timestamp: Date.now() - 86400000,
    status: 'APPROVED',
    synced: true
  },
  {
    id: '2',
    village: 'Sonipat Village A',
    district: 'Sonipat',
    state: 'Haryana',
    description: 'Entrance to a local Durga Puja pandal during the festival.',
    imageUrl: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=400',
    timestamp: Date.now() - 3600000,
    status: 'PENDING',
    synced: true
  }
]

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4", className)}>
    {children}
  </div>
)

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  className,
  icon: Icon
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger',
  disabled?: boolean,
  className?: string,
  icon?: any
}) => {
  const variants = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-md active:scale-95",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 active:scale-95",
    outline: "border-2 border-brand-500 text-brand-500 hover:bg-brand-50 active:scale-95",
    danger: "bg-red-500 hover:bg-red-600 text-white active:scale-95"
  }

  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-200 disabled:opacity-50 disabled:scale-100",
        variants[variant],
        className
      )}
    >
      {Icon && <Icon size={20} />}
      {children}
    </button>
  )
}

// --- Main App ---

export default function App() {
  const [currentView, setCurrentView] = useState<View>('SPLASH')
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS)
  const [selectedLocation, setSelectedLocation] = useState({ state: 'Haryana', district: 'Rohtak', village: 'Rohtak Village 1' })
  const [isOnline, setIsOnline] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Simulation of sync process
  useEffect(() => {
    const unsynced = submissions.filter(s => !s.synced)
    if (unsynced.length > 0 && isOnline && !syncing) {
      setSyncing(true)
      setTimeout(() => {
        setSubmissions(prev => prev.map(s => ({ ...s, synced: true })))
        setSyncing(false)
      }, 3000)
    }
  }, [submissions, isOnline, syncing])

  const addSubmission = (description: string, imageUrl: string) => {
    const newSub: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      ...selectedLocation,
      description,
      imageUrl,
      timestamp: Date.now(),
      status: 'PENDING',
      synced: isOnline
    }
    setSubmissions([newSub, ...submissions])
    setCurrentView('SUBMISSION_SUCCESS')
  }

  const renderView = () => {
    switch (currentView) {
      case 'SPLASH':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-brand-500 p-6 rounded-3xl shadow-2xl"
            >
              <UploadCloud size={64} className="text-white" />
            </motion.div>
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                JoshTalksAI <span className="text-brand-500">Humanness</span>
              </h1>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                Collect gold-standard datasets from every village in India.
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <Button onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')} icon={User}>
                I am a Contributor
              </Button>
              <Button onClick={() => setCurrentView('ADMIN_DASHBOARD')} variant="secondary" icon={LayoutDashboard}>
                I am an Admin
              </Button>
            </div>
          </div>
        )

      case 'CONTRIBUTOR_DASHBOARD':
        return (
          <div className="max-w-md mx-auto w-full text-left space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Contributions</h2>
              <div className="flex items-center gap-2">
                <span className={cn("w-3 h-3 rounded-full", isOnline ? "bg-green-500" : "bg-yellow-500")} />
                <span className="text-sm font-medium text-gray-500">{isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            <Card className="bg-brand-500 text-white border-none p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-brand-100 text-sm font-medium">Village Goal Progress</p>
                  <h3 className="text-3xl font-bold mt-1">{submissions.length} / 1000</h3>
                </div>
                <div className="bg-white/20 p-2 rounded-lg">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${(submissions.length / 1000) * 100}%` }} />
              </div>
            </Card>

            <Button 
              className="w-full py-4 text-lg" 
              onClick={() => setCurrentView('LOCATION_SELECT')}
              icon={Camera}
            >
              Start Collecting
            </Button>

            <div className="space-y-4">
              <h4 className="font-semibold text-gray-400 uppercase tracking-wider text-xs">Recent Submissions</h4>
              {submissions.map(sub => (
                <Card key={sub.id} className="flex gap-4 items-center">
                  <img src={sub.imageUrl} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-bold truncate text-sm">{sub.description}</p>
                    <p className="text-xs text-gray-500">{sub.village}</p>
                  </div>
                  <div className="text-right">
                    {!sub.synced ? (
                      <Clock size={16} className="text-yellow-500 ml-auto" />
                    ) : sub.status === 'APPROVED' ? (
                      <Check size={16} className="text-green-500 ml-auto" />
                    ) : sub.status === 'REJECTED' ? (
                      <X size={16} className="text-red-500 ml-auto" />
                    ) : (
                      <Clock size={16} className="text-blue-500 ml-auto" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )

      case 'LOCATION_SELECT':
        return (
          <div className="max-w-md mx-auto w-full text-left space-y-6">
            <button onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')} className="text-gray-500 font-medium flex items-center gap-1">
              <X size={16} /> Cancel
            </button>
            <h2 className="text-3xl font-bold">Confirm Village</h2>
            <Card className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">State</label>
                <select className="w-full p-2 rounded-lg border dark:bg-gray-700" value={selectedLocation.state} onChange={e => setSelectedLocation({...selectedLocation, state: e.target.value})}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">District</label>
                <select className="w-full p-2 rounded-lg border dark:bg-gray-700" value={selectedLocation.district} onChange={e => setSelectedLocation({...selectedLocation, district: e.target.value})}>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Village</label>
                <select className="w-full p-2 rounded-lg border dark:bg-gray-700" value={selectedLocation.village} onChange={e => setSelectedLocation({...selectedLocation, village: e.target.value})}>
                  {VILLAGES.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2 text-green-500 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm">
                <MapPin size={16} />
                <span>GPS verified within 500m of village center</span>
              </div>
            </Card>
            <Button className="w-full" onClick={() => setCurrentView('CAPTURE')} icon={ArrowRight}>
              Continue to Camera
            </Button>
          </div>
        )

      case 'CAPTURE':
        return (
          <CaptureView onBack={() => setCurrentView('LOCATION_SELECT')} onAdd={addSubmission} />
        )

      case 'SUBMISSION_SUCCESS':
        return (
          <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center">
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-green-500 text-white p-4 rounded-full shadow-lg"
            >
              <Check size={64} strokeWidth={3} />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Great Work!</h2>
              <p className="text-gray-500">Your submission has been received.</p>
            </div>
            <Card className="max-w-xs w-full">
              <p className="text-sm font-medium text-gray-400 mb-1">Status</p>
              <div className="flex items-center justify-center gap-2 text-blue-500">
                <RefreshCw size={16} className="animate-spin" />
                <span>Waiting for Verification</span>
              </div>
            </Card>
            <Button className="w-full max-w-xs" onClick={() => setCurrentView('CONTRIBUTOR_DASHBOARD')}>
              Back to Dashboard
            </Button>
          </div>
        )

      case 'ADMIN_DASHBOARD':
        return (
          <div className="w-full text-left space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">Admin Central</h2>
                <p className="text-gray-500">Monitoring 720+ Districts across India</p>
              </div>
              <Button variant="secondary" onClick={() => setCurrentView('SPLASH')} icon={X}>Exit Admin</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 p-0 overflow-hidden min-h-[400px] flex flex-col">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="font-bold flex items-center gap-2"><MapPin size={18} /> Coverage Heatmap</h4>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-red-500" /> &lt;20%</div>
                    <div className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-yellow-500" /> 50%</div>
                    <div className="flex items-center gap-1 text-xs"><span className="w-2 h-2 rounded-full bg-green-500" /> &gt;90%</div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center relative">
                   <p className="text-gray-400 font-medium">Interactive Map of India (Simulated)</p>
                   {/* Mock Heatmap dots */}
                   <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-green-500 rounded-full blur-sm opacity-50 animate-pulse" />
                   <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-red-500 rounded-full blur-md opacity-50 animate-pulse" />
                   <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-yellow-500 rounded-full blur-sm opacity-50 animate-pulse" />
                </div>
              </Card>

              <div className="space-y-6">
                <Card className="bg-blue-500 text-white border-none">
                  <h4 className="font-medium text-blue-100 mb-1">Pending Verification</h4>
                  <p className="text-4xl font-extrabold">{submissions.filter(s => s.status === 'PENDING').length}</p>
                </Card>
                <Card className="bg-green-500 text-white border-none">
                  <h4 className="font-medium text-green-100 mb-1">Total Villages Reached</h4>
                  <p className="text-4xl font-extrabold">45,892</p>
                </Card>
                <Card>
                  <h4 className="font-bold mb-4 flex items-center gap-2"><Filter size={18} /> Filters</h4>
                  <div className="space-y-4">
                     <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Search District</label>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 text-gray-400" size={16} />
                          <input type="text" placeholder="e.g. Rohtak" className="w-full pl-8 p-2 rounded-lg border dark:bg-gray-700" />
                        </div>
                     </div>
                  </div>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-bold text-xl">Verification Queue</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {submissions.filter(s => s.status === 'PENDING').map(sub => (
                  <Card key={sub.id} className="p-0 overflow-hidden flex flex-col group">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img src={sub.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full">
                        {sub.village}
                      </div>
                    </div>
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <p className="text-sm font-medium leading-tight">{sub.description}</p>
                      <div className="mt-auto flex gap-2">
                        <button className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg font-bold text-xs hover:bg-green-100 transition-colors">APPROVE</button>
                        <button className="flex-1 py-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs hover:bg-red-100 transition-colors">REJECT</button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8 transition-colors">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>

      {/* Online/Offline Toggle for Demo */}
      <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-white dark:bg-gray-800 shadow-xl p-2 px-4 rounded-full border">
         <span className="text-xs font-bold text-gray-400">DEMO MODE:</span>
         <button 
           onClick={() => setIsOnline(!isOnline)}
           className={cn(
             "px-3 py-1 rounded-full text-xs font-bold transition-all",
             isOnline ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
           )}
         >
           {isOnline ? 'ONLINE' : 'OFFLINE'}
         </button>
      </div>
    </div>
  )
}

function CaptureView({ onBack, onAdd }: { onBack: () => void, onAdd: (desc: string, url: string) => void }) {
  const [captured, setCaptured] = useState(false)
  const [description, setDescription] = useState('')
  const [isCapturing, setIsCapturing] = useState(false)

  const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1540324155974-7523202daa3f?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1596422846543-75c6fc18a593?auto=format&fit=crop&q=80&w=600'
  ]

  const handleCapture = () => {
    setIsCapturing(true)
    setTimeout(() => {
      setIsCapturing(false)
      setCaptured(true)
    }, 1500)
  }

  if (captured) {
    return (
      <div className="max-w-md mx-auto w-full text-left space-y-6">
        <button onClick={() => setCaptured(false)} className="text-gray-500 font-medium flex items-center gap-1">
           Retake
        </button>
        <h2 className="text-3xl font-bold">Describe Photo</h2>
        <Card className="p-0 overflow-hidden">
           <img src={MOCK_IMAGES[2]} className="w-full h-48 object-cover" />
           <div className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
                <textarea 
                  className="w-full p-3 rounded-lg border dark:bg-gray-700 min-h-[100px] resize-none"
                  placeholder="e.g. A group of villagers sitting under a Banyan tree in the afternoon."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <div className="flex justify-between items-center mt-1">
                   <p className="text-[10px] text-gray-400 italic">Be descriptive for better AI training</p>
                   <span className={cn("text-xs font-bold", description.length >= 10 ? "text-green-500" : "text-gray-400")}>
                     {description.length}/10
                   </span>
                </div>
              </div>
           </div>
        </Card>
        <Button 
          className="w-full" 
          disabled={description.length < 10}
          onClick={() => onAdd(description, MOCK_IMAGES[2])}
          icon={Check}
        >
          Submit Contribution
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto w-full h-full min-h-[70vh] flex flex-col">
       <div className="flex justify-between items-center mb-4">
         <button onClick={onBack} className="text-gray-500 font-medium">Cancel</button>
         <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
           <MapPin size={14} /> VILLAGE BOUNDARY ACTIVE
         </div>
       </div>

       <div className="flex-1 bg-black rounded-3xl relative overflow-hidden flex items-center justify-center">
          {isCapturing ? (
            <div className="bg-white/20 w-24 h-24 rounded-full border-4 border-white animate-ping" />
          ) : (
            <div className="text-white/20 flex flex-col items-center gap-4">
              <ImageIcon size={80} />
              <p className="font-bold text-center px-8 text-sm uppercase tracking-widest">Camera View Simulation</p>
            </div>
          )}
          
          <div className="absolute inset-0 border-2 border-white/20 m-8 rounded-2xl pointer-events-none" />
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
             <button 
               onClick={handleCapture}
               className="w-20 h-20 bg-white rounded-full border-8 border-gray-300 active:scale-90 transition-transform flex items-center justify-center"
             >
               <div className="w-14 h-14 bg-white rounded-full border-2 border-gray-400" />
             </button>
          </div>
          
          <div className="absolute top-8 left-0 right-0 flex justify-center">
             <div className="bg-black/50 backdrop-blur-md px-4 py-1 rounded-full text-white text-[10px] font-bold border border-white/20">
                LEVEL: CENTERED
             </div>
          </div>
       </div>
    </div>
  )
}
