import { useState, useEffect } from 'react';
import { useUser } from '../lib/AuthContext';
import { insforge } from '../lib/insforge';
import Sidebar from '../components/Sidebar';
import {
  Video,
  Calendar,
  Clock,
  Sparkles,
  Play,
  Award,
  BookOpen,
  CheckCircle,
  MessageSquare,
  RefreshCw,
  Send,
  Briefcase
} from 'lucide-react';

interface MockQuestion {
  question: string;
  expectedKeywords: string[];
  tips: string;
}

const INTERVIEW_TOPICS: Record<string, MockQuestion[]> = {
  'Product Management': [
    {
      question: "How would you design an allocation engine to match student interns with companies? What metrics would you track?",
      expectedKeywords: ["matching", "retention", "fairness", "engagement", "feedback", "satisfaction"],
      tips: "Use the product design framework: define users, identify pain points, brainstorm solutions, and prioritize based on impact/effort."
    },
    {
      question: "How do you handle a situation where engineering team estimates a feature will take 3 months, but business requires it in 1 month?",
      expectedKeywords: ["scope", "mvp", "prioritize", "communication", "collaborate", "trade-off"],
      tips: "Focus on scoping down to a Minimum Viable Product (MVP), aligning stakeholders, and collaborative problem-solving."
    },
    {
      question: "Describe a product you use daily. How would you improve it?",
      expectedKeywords: ["user group", "pain point", "metric", "solution", "prioritization"],
      tips: "Clearly state what the product is, who uses it, why it excels, what its weaknesses are, and how you would design a feature to improve engagement."
    }
  ],
  'Software Engineering': [
    {
      question: "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR). When would you choose one over the other?",
      expectedKeywords: ["seo", "performance", "initial load", "fcp", "spa", "server", "lighthouse"],
      tips: "Discuss SEO implications, initial page load speed (FCP), server load, and user experience characteristics."
    },
    {
      question: "How does React reconciler work? What is the purpose of the 'key' prop in lists?",
      expectedKeywords: ["virtual dom", "reconciliation", "fiber", "diffing", "identity", "performance"],
      tips: "Explain how React creates a virtual tree, compares it with the previous tree (diffing algorithm), and uses keys to identify elements across renders."
    },
    {
      question: "What is a RESTful API, and how does it differ from GraphQL?",
      expectedKeywords: ["endpoint", "over-fetching", "schema", "query", "methods", "http", "under-fetching"],
      tips: "Highlight that REST uses fixed endpoints for specific resources, while GraphQL allows clients to request exactly the data they need in a single query."
    }
  ],
  'AI / Machine Learning': [
    {
      question: "What is cosine similarity, and how is it used in recommendation systems?",
      expectedKeywords: ["vector", "angle", "dot product", "magnitude", "similarity", "text", "embedding"],
      tips: "Explain that cosine similarity measures the angle between two multi-dimensional vectors, regardless of their magnitude, scoring similarity from -1 to 1."
    },
    {
      question: "What is overfitting, and what techniques can you use to prevent it in a deep learning model?",
      expectedKeywords: ["dropout", "regularization", "validation", "early stopping", "augmentation", "noise"],
      tips: "Detail the symptoms of overfitting (high training accuracy, low test accuracy) and countermeasures like L1/L2 regularization, dropout layers, and data augmentation."
    },
    {
      question: "Explain how a Transformer architecture works at a high level. What is the role of self-attention?",
      expectedKeywords: ["attention", "weights", "parallel", "sequence", "encoder", "decoder", "tokens"],
      tips: "Mention that self-attention allows the model to look at other words in the input sequence to better understand each word's context, bypassing sequential RNN structures."
    }
  ],
  'General / Behavioral': [
    {
      question: "Tell me about a time when you faced a major obstacle during a group project. How did you resolve it?",
      expectedKeywords: ["situation", "task", "action", "result", "communication", "collaborated"],
      tips: "Use the STAR method: state the Situation, describe your Task, explain your Actions, and summarize the final measurable Result."
    },
    {
      question: "Why are you interested in joining the PM Internship Scheme, and what do you hope to contribute?",
      expectedKeywords: ["growth", "skills", "impact", "passion", "allocated", "learn"],
      tips: "Align your personal career objectives with the mission of the program, demonstrating eagerness to learn and active value you bring."
    },
    {
      question: "How do you prioritize your tasks when handling multiple deadlines simultaneously?",
      expectedKeywords: ["matrix", "calendar", "delegate", "urgent", "important", "focus"],
      tips: "Explain your framework for organization (e.g. Eisenhower Matrix), how you communicate constraints, and how you stay focused."
    }
  ]
};

export default function StudentInterviewDeskPage() {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'scheduler' | 'simulator' | 'tips'>('scheduler');
  const [scheduledInterviews, setScheduledInterviews] = useState<any[]>([]);
  const [approvedApplications, setApprovedApplications] = useState<any[]>([]);

  // Simulator States
  const [selectedTopic, setSelectedTopic] = useState<string>('Product Management');
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string; feedback?: any }>>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [sessionScore, setSessionScore] = useState<number[]>([]);
  const [simulatorEnded, setSimulatorEnded] = useState(false);

  useEffect(() => {
    async function loadInterviews() {
      if (!user) return;
      try {
        // Fetch interviews
        const { data: list } = await insforge.database
          .from('interviews')
          .select('*')
          .eq('user_id', user.id);

        if (list && list.length > 0) {
          setScheduledInterviews(list);
        } else {
          // Seed initial dummy interviews for visual appeal
          const dummyList = [
            {
              id: 'intv_1',
              user_id: user.id,
              companyName: 'TechFlow Solutions',
              roleTitle: 'Full Stack Developer Intern',
              date: new Date(Date.now() + 86400000 * 2).toLocaleDateString(), // 2 days from now
              time: '11:00 AM - 11:45 AM',
              type: 'Technical Interview',
              status: 'scheduled',
              url: 'https://meet.google.com/abc-defg-hij'
            },
            {
              id: 'intv_2',
              user_id: user.id,
              companyName: 'TechFlow Solutions',
              roleTitle: 'Product Management Intern',
              date: new Date(Date.now() - 86400000 * 4).toLocaleDateString(), // 4 days ago
              time: '02:00 PM - 02:30 PM',
              type: 'Behavioral Round',
              status: 'completed',
              score: 88,
              feedback: 'Demonstrated strong structured thinking. Excelled in customer empathy examples. Work on streamlining time estimations.'
            }
          ];
          // Insert into local storage
          await insforge.database.from('interviews').insert(dummyList);
          setScheduledInterviews(dummyList);
        }

        // Fetch student profile to get student_id
        const { data: studentDoc } = await insforge.database
          .from('students')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (studentDoc) {
          const { data: apps } = await insforge.database
            .from('applications')
            .select(`
              id,
              status,
              applied_at,
              match_score,
              internships:internship_id (
                title,
                location,
                type,
                department,
                companies:company_id (
                  name,
                  logo_url
                )
              )
            `)
            .eq('student_id', studentDoc.id)
            .in('status', ['approved', 'accepted']);

          setApprovedApplications(apps || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadInterviews();
  }, [user]);

  // Start Practice Mock
  const startSimulator = () => {
    setIsSimulatorRunning(true);
    setSimulatorEnded(false);
    setCurrentQuestionIndex(0);
    setSessionScore([]);
    const questions = INTERVIEW_TOPICS[selectedTopic];
    setChatHistory([
      {
        sender: 'ai',
        text: `Welcome to your AI Mock Interview for the ${selectedTopic} role. Let's begin. Here is your first question:\n\n"${questions[0].question}"`
      }
    ]);
    setUserResponse('');
  };

  // Submit response
  const submitAnswer = () => {
    if (!userResponse.trim()) return;

    const questions = INTERVIEW_TOPICS[selectedTopic];
    const currentQuestion = questions[currentQuestionIndex];

    // Add user message
    const updatedHistory = [
      ...chatHistory,
      { sender: 'user' as const, text: userResponse }
    ];
    setChatHistory(updatedHistory);
    setIsAiThinking(true);

    const submittedText = userResponse;
    setUserResponse('');

    setTimeout(() => {
      // Simple logic to compute mock AI score & feedback
      const responseWords = submittedText.toLowerCase().split(/\s+/);
      const matches = currentQuestion.expectedKeywords.filter(keyword => 
        submittedText.toLowerCase().includes(keyword.toLowerCase())
      );
      
      const keywordScore = (matches.length / currentQuestion.expectedKeywords.length) * 50;
      const lengthScore = Math.min((responseWords.length / 80) * 50, 50); // expects around 80 words
      const totalScore = Math.round(Math.min(keywordScore + lengthScore, 100));

      const feedback = {
        score: totalScore,
        strengths: matches.length > 0 
          ? `Excellent inclusion of key concepts like: ${matches.slice(0, 3).join(', ')}.` 
          : "Good attempt in answering the core query.",
        improvement: `Consider exploring these areas: ${currentQuestion.expectedKeywords.filter(k => !matches.includes(k)).slice(0, 3).join(', ') || 'Provide more detailed scenarios'}.`,
        tip: currentQuestion.tips
      };

      setSessionScore(prev => [...prev, totalScore]);

      const nextIndex = currentQuestionIndex + 1;
      const hasNext = nextIndex < questions.length;

      let aiMessageText = '';
      if (hasNext) {
        aiMessageText = `Thanks for your response. Here is your next question:\n\n"${questions[nextIndex].question}"`;
      } else {
        aiMessageText = `Excellent, that concludes our mock interview session. I am compiling your performance evaluation now...`;
      }

      setChatHistory(prev => [
        ...prev,
        { 
          sender: 'ai' as const, 
          text: aiMessageText,
          feedback: feedback 
        }
      ]);
      
      setIsAiThinking(false);

      if (hasNext) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setSimulatorEnded(true);
      }
    }, 1500);
  };

  const getOverallMockGrade = () => {
    if (sessionScore.length === 0) return 'N/A';
    const avg = sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length;
    if (avg >= 85) return 'A (Outstanding)';
    if (avg >= 70) return 'B (Proficient)';
    if (avg >= 55) return 'C (Developing)';
    return 'D (Needs Practice)';
  };

  const approvedAwaitingSchedule = approvedApplications.filter(app => {
    const hasScheduled = scheduledInterviews.some(i => 
      i.companyName === app.internships?.companies?.name && 
      i.roleTitle === app.internships?.title && 
      i.status === 'scheduled'
    );
    return !hasScheduled;
  });

  const getTopicForApp = (app: any) => {
    const dept = app.internships?.department || '';
    const title = app.internships?.title || '';
    
    if (INTERVIEW_TOPICS[dept]) return dept;
    
    for (const key of Object.keys(INTERVIEW_TOPICS)) {
      if (dept.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(dept.toLowerCase())) {
        return key;
      }
    }
    
    for (const key of Object.keys(INTERVIEW_TOPICS)) {
      if (title.toLowerCase().includes(key.toLowerCase())) {
        return key;
      }
    }
    
    if (title.toLowerCase().includes('software') || title.toLowerCase().includes('developer') || title.toLowerCase().includes('engineering')) {
      return 'Software Engineering';
    }
    if (title.toLowerCase().includes('product') || title.toLowerCase().includes('pm')) {
      return 'Product Management';
    }
    if (title.toLowerCase().includes('ai') || title.toLowerCase().includes('machine learning') || title.toLowerCase().includes('data science') || title.toLowerCase().includes('ml')) {
      return 'AI / Machine Learning';
    }
    
    return 'General / Behavioral';
  };

  const handlePrepareWithMock = (app: any) => {
    const topic = getTopicForApp(app);
    setSelectedTopic(topic);
    setActiveTab('simulator');
  };


  return (
    <div className="flex bg-[#fcfcff] min-h-screen">
      <Sidebar role="student" />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Video size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Coaching Engine Ready</span>
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">Interview Desk</h1>
              <p className="text-slate-500 font-medium text-lg">
                Manage upcoming live interviews and train with the conversational AI Mock Interview simulator.
              </p>
            </div>
          </div>
        </header>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-8">
          {[
            { id: 'scheduler', label: 'Company Interviews', icon: Calendar },
            { id: 'simulator', label: 'AI Mock Simulator', icon: Sparkles },
            { id: 'tips', label: 'Prep Guides & Tips', icon: BookOpen }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="h-64 bg-white rounded-3xl animate-pulse border border-slate-100" />
        ) : (
          <div>
            {/* TAB 1: Scheduler / Live Interviews */}
            {activeTab === 'scheduler' && (
              <div className="space-y-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Upcoming Rounds</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">
                        {scheduledInterviews.filter(i => i.status === 'scheduled').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                      <Calendar size={22} />
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Completed Sessions</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">
                        {scheduledInterviews.filter(i => i.status === 'completed').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <CheckCircle size={22} />
                    </div>
                  </div>
                  <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Avg Performance Score</p>
                      <p className="text-3xl font-black text-slate-900 mt-1">88%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                      <Award size={22} />
                    </div>
                  </div>
                </div>

                {/* Approved Applications (Awaiting Scheduling) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Approved Applications (Awaiting Scheduling)</h3>
                  {approvedAwaitingSchedule.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-3xl p-8 text-center text-slate-400">
                      <Briefcase className="mx-auto mb-2 opacity-30 text-indigo-600" size={24} />
                      <p className="text-xs font-bold">No approved applications awaiting scheduling</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Your approved roles will appear here once the company reviews your profile.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {approvedAwaitingSchedule.map(app => (
                        <div
                          key={app.id}
                          className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                          <div className="flex gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border bg-emerald-50 border-emerald-100 text-emerald-600">
                              {app.internships?.companies?.logo_url ? (
                                <img
                                  src={app.internships.companies.logo_url}
                                  alt={app.internships.companies.name}
                                  className="w-10 h-10 object-contain rounded-lg"
                                />
                              ) : (
                                <Briefcase size={28} />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                  {app.internships?.companies?.name}
                                </span>
                                <span className="text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                                  Approved / Ready to Schedule
                                </span>
                              </div>
                              <h4 className="text-xl font-bold text-slate-800 uppercase mt-0.5">
                                {app.internships?.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-4 mt-2 text-xs text-slate-400 font-bold">
                                <span>{app.internships?.location}</span>
                                <span>·</span>
                                <span>{app.internships?.type}</span>
                                <span>·</span>
                                <span className="text-indigo-500 uppercase tracking-wide">
                                  {app.internships?.department}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-4">
                            <button
                              onClick={() => handlePrepareWithMock(app)}
                              className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                            >
                              <Sparkles size={12} fill="white" /> Prepare with AI Mock
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Interview Cards */}
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Your Schedule</h3>

                  {scheduledInterviews.map(intv => (
                    <div
                      key={intv.id}
                      className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="flex gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                          intv.status === 'scheduled' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}>
                          <Video size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              {intv.companyName}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider ${
                              intv.status === 'scheduled' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {intv.status}
                            </span>
                          </div>
                          <h4 className="text-xl font-bold text-slate-800 uppercase mt-0.5">{intv.roleTitle}</h4>
                          <div className="flex flex-wrap items-center gap-x-4 mt-2 text-xs text-slate-400 font-bold">
                            <span className="flex items-center gap-1"><Calendar size={13} /> {intv.date}</span>
                            <span className="flex items-center gap-1"><Clock size={13} /> {intv.time}</span>
                            <span className="text-indigo-500 uppercase tracking-wide">{intv.type}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-4">
                        {intv.status === 'scheduled' ? (
                          <a
                            href={intv.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
                          >
                            <Play size={12} fill="white" /> Join Meeting
                          </a>
                        ) : (
                          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-right max-w-sm">
                            <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-600 mb-1">
                              <Award size={14} /> Score: {intv.score}%
                            </div>
                            <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                              "{intv.feedback}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: AI Mock Interview Simulator */}
            {activeTab === 'simulator' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Selector / Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-lg font-black text-slate-800 mb-4 uppercase tracking-tight">Configure Interview</h3>
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-wider">Select Role Track</label>
                      {Object.keys(INTERVIEW_TOPICS).map(topic => (
                        <button
                          key={topic}
                          onClick={() => !isSimulatorRunning && setSelectedTopic(topic)}
                          disabled={isSimulatorRunning}
                          className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all border ${
                            selectedTopic === topic
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold shadow-sm'
                              : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50'
                          }`}
                        >
                          {topic}
                        </button>
                      ))}
                    </div>

                    {!isSimulatorRunning ? (
                      <button
                        onClick={startSimulator}
                        className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2 group"
                      >
                        <Play size={14} fill="white" /> Start Practice Interview
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsSimulatorRunning(false)}
                        className="w-full mt-8 py-4 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                      >
                        Quit Simulator
                      </button>
                    )}
                  </div>

                  <div className="bg-indigo-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16 pointer-events-none" />
                    <Sparkles className="text-amber-400 mb-4 animate-pulse" size={28} />
                    <h4 className="text-md font-bold mb-2">Simulated Live Feedback</h4>
                    <p className="text-xs text-indigo-200 leading-relaxed font-medium">
                      The AI evaluator scans your responses for key terminology alignments, structure density, and logical scope depth. Take your time to write complete sentences.
                    </p>
                  </div>
                </div>

                {/* Interactive Console */}
                <div className="lg:col-span-2">
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col min-h-[500px] overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                          {isSimulatorRunning ? `Practice Arena: ${selectedTopic}` : 'Arena Standby'}
                        </span>
                      </div>
                      {isSimulatorRunning && (
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
                          Question {currentQuestionIndex + 1} of 3
                        </span>
                      )}
                    </div>

                    {/* Chat Arena */}
                    {!isSimulatorRunning ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-300">
                          <MessageSquare size={32} />
                        </div>
                        <h4 className="text-lg font-black text-slate-800 mb-1">Simulator Ready</h4>
                        <p className="text-xs font-semibold max-w-sm">
                          Configure your track on the left and hit "Start Practice Interview" to begin your interactive conversation.
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-between p-6">
                        {/* Feed */}
                        <div className="space-y-6 overflow-y-auto max-h-[360px] pr-2">
                          {chatHistory.map((msg, index) => (
                            <div key={index} className="space-y-4">
                              {/* Message bubble */}
                              <div className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                                  msg.sender === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                                    : 'bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none font-medium'
                                }`}>
                                  {msg.text.split('\n').map((line, lIdx) => (
                                    <p key={lIdx} className={lIdx > 0 ? 'mt-2' : ''}>{line}</p>
                                  ))}
                                </div>
                              </div>

                              {/* AI Response Feedback Card if present */}
                              {msg.feedback && (
                                <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-5 ml-4 mr-12 animate-in fade-in duration-300">
                                  <div className="flex items-center justify-between border-b border-indigo-100/50 pb-2 mb-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">AI Evaluation Feed</span>
                                    <span className="text-xs font-black text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded">
                                      Score: {msg.feedback.score}/100
                                    </span>
                                  </div>
                                  <div className="space-y-2 text-xs leading-relaxed text-slate-700">
                                    <p>🎯 <strong className="text-indigo-900">Key Strengths:</strong> {msg.feedback.strengths}</p>
                                    <p>💡 <strong className="text-indigo-900">Room to Grow:</strong> {msg.feedback.improvement}</p>
                                    <p className="bg-white/80 p-2.5 rounded-xl border border-indigo-100/40 text-[11px] text-slate-500 italic mt-3">
                                      <strong>Coaching Tip:</strong> {msg.feedback.tip}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {isAiThinking && (
                            <div className="flex justify-start">
                              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <RefreshCw className="animate-spin text-indigo-600" size={16} />
                                <span className="text-xs text-slate-400 font-semibold">AI is scoring your response...</span>
                              </div>
                            </div>
                          )}

                          {simulatorEnded && (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center animate-in zoom-in-95 duration-500">
                              <Award className="text-emerald-500 mx-auto mb-3" size={40} />
                              <h4 className="text-lg font-black text-emerald-900">Interview Evaluation Complete</h4>
                              <p className="text-xs text-emerald-800/80 max-w-md mx-auto mb-4 font-semibold">
                                Congratulations on finishing the simulation! Here is your final diagnostic profile score:
                              </p>
                              <div className="flex justify-center gap-8 mb-6">
                                <div className="text-center">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Final Grade</span>
                                  <p className="text-2xl font-black text-emerald-900 mt-0.5">{getOverallMockGrade()}</p>
                                </div>
                                <div className="text-center border-l border-emerald-200 pl-8">
                                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Average Score</span>
                                  <p className="text-2xl font-black text-emerald-900 mt-0.5">
                                    {Math.round(sessionScore.reduce((a, b) => a + b, 0) / sessionScore.length)}%
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={startSimulator}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors"
                              >
                                Try Practice Session Again
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Input Arena */}
                        {!simulatorEnded && (
                          <div className="border-t border-slate-100 pt-4 flex gap-3">
                            <textarea
                              rows={2}
                              value={userResponse}
                              onChange={e => setUserResponse(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  submitAnswer();
                                }
                              }}
                              placeholder="Type your response here... (Press Enter to submit)"
                              disabled={isAiThinking}
                              className="flex-1 p-3.5 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all shadow-sm text-sm font-medium resize-none bg-white"
                            />
                            <button
                              onClick={submitAnswer}
                              disabled={!userResponse.trim() || isAiThinking}
                              className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shrink-0 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
                            >
                              <Send size={18} fill="white" />
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Prep Guides & Tips */}
            {activeTab === 'tips' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Guide 1 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">The STAR Response Method</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
                    A structured pattern to deliver perfect behavioral responses to interviewers. STAR helps keep answers concise and results-oriented.
                  </p>
                  <div className="space-y-4">
                    {[
                      { l: 'S', name: 'Situation', desc: 'Describe the context, challenge, or background details.' },
                      { l: 'T', name: 'Task', desc: 'Detail the responsibilities or objectives that needed addressing.' },
                      { l: 'A', name: 'Action', desc: 'Focus on what YOU explicitly did to drive resolutions.' },
                      { l: 'R', name: 'Result', desc: 'Share the metrics-focused positive outcome of your actions.' }
                    ].map(step => (
                      <div key={step.l} className="flex gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xs shrink-0">
                          {step.l}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{step.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 font-medium">{step.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Guide 2 */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                      <CheckCircle size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Interview Prep Checklist</h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold mb-6">
                    Ensure these critical tasks are taken care of prior to any scheduled live interview rounds.
                  </p>
                  <div className="space-y-3">
                    {[
                      "Review the company profile, core industry, and main product line.",
                      "Study the exact listing requirements and align 3 personal projects with them.",
                      "Verify microphone, webcam, and internet bandwidth latency limits.",
                      "Prepare 2 thoughtful questions to ask the interviewer at the end of the round.",
                      "Ensure your environment has clean lighting and a quiet background."
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 mt-0.5">
                          <CheckCircle className="text-emerald-500" size={13} />
                        </div>
                        <span className="text-xs text-slate-500 font-semibold leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
