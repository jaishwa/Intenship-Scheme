// ============================================================
// FutureFit – Enterprise AI Ecosystem — MockData.ts
// Central data registry for all platform portals
// ============================================================

// ─── INTERNSHIP ─────────────────────────────────────────────
export interface Internship {
  id: string;
  title: string;
  company: string;
  matchScore: number;
  stipend: string;
  duration: string;
  location: string;
  requiredSkills: string[];
  missingSkills: string[];
  overlapSkills: string[];
  description: string;
  roleDescription: string;
  confidence: "High" | "Medium" | "Low";
  reasoning: string;
  department: string;
}

export const MOCK_INTERNSHIPS: Internship[] = [
  {
    id: "intern-001",
    title: "AI Product & Systems Engineer",
    company: "TATA Consultancy Services",
    matchScore: 94,
    stipend: "₹35,000 / Month",
    duration: "6 Months",
    location: "Bengaluru (Hybrid)",
    requiredSkills: ["Python", "React", "TypeScript", "SQL", "Machine Learning"],
    missingSkills: ["AWS Cloud"],
    overlapSkills: ["Python", "React", "TypeScript", "SQL", "Machine Learning"],
    description: "Collaborate with cross-functional PMs to build intelligent automation dashboards for public service optimization.",
    roleDescription: "Responsible for deploying NLP pipelines and linking frontend React apps with Python AI microservices under the Prime Minister's Digital India initiative.",
    confidence: "High",
    reasoning: "Exceptional match due to perfect alignment with Python & React competencies. Added 5% bonus for high academic performance (CGPA 9.2) in quantitative models.",
    department: "Ministry of Electronics & IT"
  },
  {
    id: "intern-002",
    title: "Machine Learning Analytics Intern",
    company: "Reliance Digital AI Labs",
    matchScore: 89,
    stipend: "₹40,000 / Month",
    duration: "6 Months",
    location: "Mumbai (On-site)",
    requiredSkills: ["Python", "Pandas", "Scikit-Learn", "Data Visualisation", "SQL"],
    missingSkills: ["TensorFlow", "Docker"],
    overlapSkills: ["Python", "Pandas", "SQL"],
    description: "Apply modern machine learning models to consumer demand forecasting and telecom channel allocations.",
    roleDescription: "Perform explanatory data analysis, feature engineering, and design dashboard metrics to track high-volume resource scheduling.",
    confidence: "High",
    reasoning: "Strong background in analytical modeling and SQL queries. Candidate lacks specialized containerization (Docker), which can be learned on-the-job.",
    department: "Department of Telecommunications"
  },
  {
    id: "intern-003",
    title: "Full Stack Digital Portal Engineer",
    company: "Infosys EdgeVerve",
    matchScore: 85,
    stipend: "₹30,000 / Month",
    duration: "6 Months",
    location: "Pune (Remote)",
    requiredSkills: ["React", "Node.js", "Express", "MongoDB", "CSS", "TypeScript"],
    missingSkills: ["Tailwind CSS", "Redux"],
    overlapSkills: ["React", "TypeScript", "Node.js", "Express"],
    description: "Develop accessible and interactive features for national talent matching portals under PM Scheme.",
    roleDescription: "Work on responsive web applications, secure REST APIs, and optimize loading performance for state-wide platforms.",
    confidence: "High",
    reasoning: "Excellent full-stack capabilities with React/Node/TypeScript. A minor missing detail is specific knowledge of CSS animations, but standard CSS skill covers it.",
    department: "Ministry of Skill Development"
  },
  {
    id: "intern-004",
    title: "Smart Logistics & Operations Intern",
    company: "Adani Logistics Group",
    matchScore: 74,
    stipend: "₹28,000 / Month",
    duration: "6 Months",
    location: "Ahmedabad (On-site)",
    requiredSkills: ["Operations Research", "Excel", "Data Analytics", "SQL", "Python"],
    missingSkills: ["Supply Chain Systems", "Machine Learning"],
    overlapSkills: ["Data Analytics", "SQL", "Python"],
    description: "Integrate logistic pipelines with national cargo movement tracking algorithms.",
    roleDescription: "Analyze cargo transit time data, construct optimization matrices, and build predictive maintenance reports.",
    confidence: "Medium",
    reasoning: "Solid base in Python and SQL analytics, but lacks direct supply chain operational experience.",
    department: "Ministry of Ports & Shipping"
  },
  {
    id: "intern-005",
    title: "Financial AI Research Associate",
    company: "State Bank of India (SBI)",
    matchScore: 68,
    stipend: "₹32,000 / Month",
    duration: "6 Months",
    location: "Mumbai (Hybrid)",
    requiredSkills: ["Financial Analysis", "Python", "SQL", "Tableau", "Risk Modeling"],
    missingSkills: ["Risk Modeling", "Financial Analysis"],
    overlapSkills: ["Python", "SQL"],
    description: "Assist credit officers in developing risk scoring algorithms and automated loan evaluation systems.",
    roleDescription: "Validate data points from SME lending applications using natural language extraction models.",
    confidence: "Medium",
    reasoning: "Candidate's core programming is strong, but they lack advanced domain expertise in corporate risk modeling and banking procedures.",
    department: "Ministry of Finance"
  },
  {
    id: "intern-006",
    title: "Cloud Infrastructure Specialist",
    company: "Wipro Technologies",
    matchScore: 60,
    stipend: "₹25,000 / Month",
    duration: "6 Months",
    location: "Hyderabad (On-site)",
    requiredSkills: ["AWS Cloud", "Linux", "Docker", "Python", "Bash Scripting"],
    missingSkills: ["AWS Cloud", "Docker", "Linux"],
    overlapSkills: ["Python"],
    description: "Support digital sovereignty cloud initiatives by hosting micro-services on secured national clusters.",
    roleDescription: "Maintain container nodes, scale orchestration scripts, and automate system backups using bash utilities.",
    confidence: "Low",
    reasoning: "Significant skill gap detected in cloud computing and container environments (Docker, Linux orchestration). Recommend auxiliary training course first.",
    department: "Ministry of Electronics & IT"
  }
];

// ─── STUDENT ─────────────────────────────────────────────────
export interface Student {
  name: string;
  email: string;
  cgpa: number;
  resumeName: string;
  parsedSkills: string[];
  softSkills: string[];
  missingSkills: string[];
  atsScore: number;
  role: string;
  university: string;
  domain: string;
}

export const CURRENT_STUDENT: Student = {
  name: "Arjun Sharma",
  email: "arjun.sharma@nitt.edu",
  cgpa: 9.2,
  resumeName: "Arjun_Sharma_Resume_2026.pdf",
  parsedSkills: ["Python", "React", "TypeScript", "SQL", "Machine Learning", "Node.js", "Express"],
  softSkills: ["Team Collaboration", "Problem Solving", "Strategic Planning", "Communication"],
  missingSkills: ["AWS Cloud", "Docker", "Kubernetes", "Tailwind CSS"],
  atsScore: 84,
  role: "AI Developer / Product Engineer",
  university: "National Institute of Technology, Trichy",
  domain: "Artificial Intelligence & Web Engineering"
};

// ─── COMPANY ─────────────────────────────────────────────────
export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  location: string;
  aiTrustScore: number;
  verified: boolean;
  activePostings: number;
  totalHires: number;
  description: string;
  website: string;
  founded: string;
  hiringRate: number;
  logo: string;
}

export const MOCK_COMPANIES: Company[] = [
  { id: "co-001", name: "TATA Consultancy Services", industry: "IT Services & AI", size: "500,000+ employees", location: "Mumbai, India", aiTrustScore: 98, verified: true, activePostings: 45, totalHires: 12500, description: "India's largest IT company specializing in AI, cloud, and digital transformation.", website: "tcs.com", founded: "1968", hiringRate: 94, logo: "TCS" },
  { id: "co-002", name: "Reliance Digital AI Labs", industry: "Technology & Research", size: "10,000+ employees", location: "Mumbai, India", aiTrustScore: 95, verified: true, activePostings: 28, totalHires: 4200, description: "AI research and development arm of Reliance Industries focused on next-gen intelligence.", website: "reliance.com", founded: "2018", hiringRate: 88, logo: "RDA" },
  { id: "co-003", name: "Infosys EdgeVerve", industry: "Enterprise Software", size: "30,000+ employees", location: "Bangalore, India", aiTrustScore: 92, verified: true, activePostings: 32, totalHires: 8900, description: "Next-generation enterprise AI and automation solutions provider.", website: "edgeverve.com", founded: "2014", hiringRate: 86, logo: "IEV" },
  { id: "co-004", name: "MeitY Digital India Corp.", industry: "Government Technology", size: "5,000+ employees", location: "New Delhi, India", aiTrustScore: 99, verified: true, activePostings: 120, totalHires: 25000, description: "Ministry of Electronics and IT driving the Digital India initiative.", website: "meity.gov.in", founded: "2016", hiringRate: 97, logo: "MDI" },
  { id: "co-005", name: "Zepto AI Commerce", industry: "Quick Commerce & AI", size: "8,000+ employees", location: "Bangalore, India", aiTrustScore: 87, verified: true, activePostings: 18, totalHires: 2100, description: "AI-powered quick commerce platform disrupting traditional retail.", website: "zeptonow.com", founded: "2021", hiringRate: 82, logo: "ZAC" }
];

// ─── CANDIDATE PIPELINE ───────────────────────────────────────
export type PipelineStage = "applied" | "ai_screening" | "shortlisted" | "assessment" | "interview" | "final_review" | "selected" | "rejected";

export interface Candidate {
  id: string;
  name: string;
  university: string;
  cgpa: number;
  skills: string[];
  matchScore: number;
  atsScore: number;
  status: PipelineStage;
  appliedRole: string;
  interviewScore?: number;
  assessmentScore?: number;
  location: string;
  experience: string;
  rank: number;
  email: string;
}

export const MOCK_CANDIDATES: Candidate[] = [
  { id: "c-001", name: "Arjun Sharma", university: "NIT Trichy", cgpa: 9.2, skills: ["Python", "React", "ML", "SQL", "TypeScript"], matchScore: 94, atsScore: 92, status: "interview", appliedRole: "AI Product Engineer", interviewScore: 88, assessmentScore: 91, location: "Chennai", experience: "0 years", rank: 1, email: "arjun@nitt.edu" },
  { id: "c-002", name: "Priya Menon", university: "IIT Madras", cgpa: 9.5, skills: ["Python", "TensorFlow", "ML", "Computer Vision", "AWS"], matchScore: 97, atsScore: 95, status: "shortlisted", appliedRole: "ML Research Intern", assessmentScore: 94, location: "Bangalore", experience: "0 years", rank: 2, email: "priya@iitm.ac.in" },
  { id: "c-003", name: "Rahul Verma", university: "BITS Pilani", cgpa: 8.8, skills: ["React", "Node.js", "MongoDB", "TypeScript", "Redux"], matchScore: 89, atsScore: 87, status: "assessment", appliedRole: "Full Stack Engineer", assessmentScore: 82, location: "Hyderabad", experience: "0 years", rank: 3, email: "rahul@bits.ac.in" },
  { id: "c-004", name: "Sneha Patel", university: "IIT Bombay", cgpa: 9.1, skills: ["Data Science", "Python", "Tableau", "SQL", "Power BI"], matchScore: 91, atsScore: 89, status: "selected", appliedRole: "Data Analytics Intern", interviewScore: 92, assessmentScore: 88, location: "Mumbai", experience: "0 years", rank: 4, email: "sneha@iitb.ac.in" },
  { id: "c-005", name: "Karan Singh", university: "DTU Delhi", cgpa: 8.5, skills: ["Cloud", "AWS", "Docker", "Kubernetes", "DevOps"], matchScore: 85, atsScore: 83, status: "ai_screening", appliedRole: "Cloud Infrastructure Intern", location: "Delhi", experience: "0 years", rank: 5, email: "karan@dtu.ac.in" },
  { id: "c-006", name: "Meera Iyer", university: "VIT Vellore", cgpa: 8.9, skills: ["UI/UX", "Figma", "React", "CSS", "Design Systems"], matchScore: 87, atsScore: 85, status: "final_review", appliedRole: "Product Design Intern", interviewScore: 85, assessmentScore: 89, location: "Chennai", experience: "0 years", rank: 6, email: "meera@vit.ac.in" },
  { id: "c-007", name: "Dev Kumar", university: "IIT Delhi", cgpa: 9.3, skills: ["Blockchain", "Solidity", "Web3", "Python", "Smart Contracts"], matchScore: 83, atsScore: 81, status: "applied", appliedRole: "Blockchain Research Intern", location: "Delhi", experience: "0 years", rank: 7, email: "dev@iitd.ac.in" },
  { id: "c-008", name: "Ananya Roy", university: "Jadavpur University", cgpa: 8.7, skills: ["NLP", "BERT", "Python", "Transformers", "Hugging Face"], matchScore: 90, atsScore: 88, status: "shortlisted", appliedRole: "NLP Research Intern", assessmentScore: 86, location: "Kolkata", experience: "0 years", rank: 8, email: "ananya@jadavpur.edu" }
];

// ─── PIPELINE STAGES ─────────────────────────────────────────
export const PIPELINE_STAGES: { id: PipelineStage; label: string; color: string; bgColor: string; count: number }[] = [
  { id: "applied", label: "Applied", color: "#94a3b8", bgColor: "rgba(148,163,184,0.1)", count: 847 },
  { id: "ai_screening", label: "AI Screening", color: "#6366f1", bgColor: "rgba(99,102,241,0.1)", count: 312 },
  { id: "shortlisted", label: "Shortlisted", color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)", count: 124 },
  { id: "assessment", label: "Assessment", color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", count: 67 },
  { id: "interview", label: "Interview", color: "#06b6d4", bgColor: "rgba(6,182,212,0.1)", count: 45 },
  { id: "final_review", label: "Final Review", color: "#10b981", bgColor: "rgba(16,185,129,0.1)", count: 18 },
  { id: "selected", label: "Selected ✓", color: "#22c55e", bgColor: "rgba(34,197,94,0.1)", count: 12 },
  { id: "rejected", label: "Rejected", color: "#ef4444", bgColor: "rgba(239,68,68,0.08)", count: 189 }
];

// ─── INTERVIEWS ───────────────────────────────────────────────
export interface Interview {
  id: string;
  candidateName: string;
  candidateId: string;
  role: string;
  scheduledAt: string;
  duration: number;
  type: "technical" | "hr" | "cultural" | "ai_mock";
  status: "scheduled" | "live" | "completed" | "cancelled";
  aiScore?: number;
  feedback?: string;
  round: number;
}

export const MOCK_INTERVIEWS: Interview[] = [
  { id: "iv-001", candidateName: "Priya Menon", candidateId: "c-002", role: "ML Research Intern", scheduledAt: "Today, 10:00 AM", duration: 60, type: "technical", status: "scheduled", round: 1 },
  { id: "iv-002", candidateName: "Arjun Sharma", candidateId: "c-001", role: "AI Product Engineer", scheduledAt: "Today, 02:00 PM", duration: 45, type: "hr", status: "live", aiScore: 88, round: 2 },
  { id: "iv-003", candidateName: "Meera Iyer", candidateId: "c-006", role: "Product Design Intern", scheduledAt: "Yesterday, 11:00 AM", duration: 45, type: "cultural", status: "completed", aiScore: 85, feedback: "Excellent communication and design thinking. Strong portfolio.", round: 1 },
  { id: "iv-004", candidateName: "Rahul Verma", candidateId: "c-003", role: "Full Stack Engineer", scheduledAt: "Tomorrow, 03:00 PM", duration: 90, type: "technical", status: "scheduled", round: 1 }
];

// ─── ASSESSMENTS ──────────────────────────────────────────────
export interface Assessment {
  id: string;
  title: string;
  type: "aptitude" | "coding" | "mcq" | "behavioral";
  duration: number;
  questions: number;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  participants: number;
  avgScore: number;
}

export const MOCK_ASSESSMENTS: Assessment[] = [
  { id: "as-001", title: "Python & Data Science Fundamentals", type: "mcq", duration: 45, questions: 30, difficulty: "medium", category: "Technical", participants: 1240, avgScore: 72 },
  { id: "as-002", title: "AI & Machine Learning Core Concepts", type: "mcq", duration: 60, questions: 40, difficulty: "hard", category: "AI/ML", participants: 890, avgScore: 68 },
  { id: "as-003", title: "Quantitative Aptitude & Logical Reasoning", type: "aptitude", duration: 30, questions: 25, difficulty: "medium", category: "Aptitude", participants: 3400, avgScore: 78 },
  { id: "as-004", title: "Full Stack Web Dev Challenge", type: "coding", duration: 90, questions: 5, difficulty: "hard", category: "Coding", participants: 560, avgScore: 65 },
  { id: "as-005", title: "Behavioral & Situational Assessment", type: "behavioral", duration: 25, questions: 20, difficulty: "easy", category: "Soft Skills", participants: 2100, avgScore: 84 }
];

export interface MCQQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export const SAMPLE_MCQ_QUESTIONS: MCQQuestion[] = [
  { id: 1, question: "What is the time complexity of Binary Search?", options: ["O(n)", "O(log n)", "O(n²)", "O(n log n)"], correctIndex: 1, category: "Algorithms", difficulty: "medium" },
  { id: 2, question: "Which technique is used for dimensionality reduction in ML?", options: ["KNN", "PCA", "SVM", "Random Forest"], correctIndex: 1, category: "Machine Learning", difficulty: "medium" },
  { id: 3, question: "What does 'gradient descent' minimize during neural network training?", options: ["Accuracy", "Data size", "Loss function", "Learning rate"], correctIndex: 2, category: "Deep Learning", difficulty: "easy" },
  { id: 4, question: "Which Python library is primarily used for deep learning?", options: ["Pandas", "NumPy", "TensorFlow", "Matplotlib"], correctIndex: 2, category: "Programming", difficulty: "easy" },
  { id: 5, question: "In REST APIs, which HTTP method updates an existing resource?", options: ["GET", "POST", "PUT", "DELETE"], correctIndex: 2, category: "Web Dev", difficulty: "easy" },
  { id: 6, question: "Which data structure uses LIFO (Last In, First Out) ordering?", options: ["Queue", "Stack", "Linked List", "Binary Tree"], correctIndex: 1, category: "Data Structures", difficulty: "easy" },
  { id: 7, question: "What is 'overfitting' in machine learning?", options: ["Model too simple for data", "Model memorizes training data poorly", "Model performs well on training but poorly on test", "Model has too few parameters"], correctIndex: 2, category: "Machine Learning", difficulty: "medium" },
  { id: 8, question: "Which SQL clause filters groups created by GROUP BY?", options: ["WHERE", "FILTER", "HAVING", "CASE"], correctIndex: 2, category: "Databases", difficulty: "medium" },
  { id: 9, question: "What does CNN stand for in deep learning?", options: ["Computed Neural Net", "Convolutional Neural Network", "Circular Node Network", "Clustered Neuron Net"], correctIndex: 1, category: "Deep Learning", difficulty: "easy" },
  { id: 10, question: "What is the purpose of the 'virtual DOM' in React?", options: ["Direct DOM manipulation", "Server-side rendering", "Efficient diff-based UI updates", "CSS styling engine"], correctIndex: 2, category: "Web Dev", difficulty: "medium" }
];

// ─── CHAT / MESSAGES ──────────────────────────────────────────
export interface ChatMessage {
  id: string;
  from: string;
  fromRole: "student" | "recruiter" | "ai";
  content: string;
  timestamp: string;
  read: boolean;
  avatar: string;
}

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: "msg-001", from: "TCS — HR Talent Team", fromRole: "recruiter", content: "Hi Arjun! We're excited to invite you for the technical interview round for the AI Product Engineer position. Please confirm your availability.", timestamp: "10:30 AM", read: false, avatar: "TCS" },
  { id: "msg-002", from: "Reliance Digital AI Labs", fromRole: "recruiter", content: "Your resume has been shortlisted for the ML Analytics Intern role. Please complete the online assessment by Friday, 5 PM IST.", timestamp: "Yesterday", read: true, avatar: "RDA" },
  { id: "msg-003", from: "FutureFit AI Assistant", fromRole: "ai", content: "Based on your updated profile, I recommend applying to the NLP Research Intern role at Zepto AI — 91% match score detected!", timestamp: "2 days ago", read: true, avatar: "AI" }
];

// ─── PLATFORM STATS (ADMIN) ──────────────────────────────────
export const MOCK_ADMIN_STATS = {
  totalStudents: 25480,
  matchAccuracy: 98.4,
  allocationSuccessRate: 94.2,
  activeInternships: 12500,
  totalDepartments: 18,
  pendingAllocations: 854
};

export const PLATFORM_STATS = {
  totalStudents: 248950,
  totalCompanies: 1842,
  totalInternships: 45200,
  activeApplications: 128400,
  successfulPlacements: 89200,
  aiMatchAccuracy: 98.4,
  platformUptime: 99.97,
  dailyActiveUsers: 18240,
  avgTimeToPlace: 12.4,
  revenueGrowth: 284,
  fraudAlertsToday: 3,
  verifiedCompanies: 1724,
  pendingVerification: 118,
  aiModelsRunning: 7
};

// ─── MODEL TRAINING ───────────────────────────────────────────
export const MODEL_TRAINING_EPOCHS = [
  { epoch: 1, accuracy: 65.4, loss: 0.88, valAccuracy: 62.1 },
  { epoch: 2, accuracy: 72.1, loss: 0.62, valAccuracy: 69.4 },
  { epoch: 3, accuracy: 79.5, loss: 0.44, valAccuracy: 78.2 },
  { epoch: 4, accuracy: 84.8, loss: 0.31, valAccuracy: 83.9 },
  { epoch: 5, accuracy: 91.2, loss: 0.22, valAccuracy: 89.1 },
  { epoch: 6, accuracy: 95.6, loss: 0.14, valAccuracy: 94.3 },
  { epoch: 7, accuracy: 98.4, loss: 0.08, valAccuracy: 97.8 }
];

// ─── DEMAND & TRENDS ─────────────────────────────────────────
export const DEMAND_TRENDS = [
  { month: "Jan", "Machine Learning": 40, "Web Development": 80, "Data Analytics": 60, "Cloud Dev": 30 },
  { month: "Feb", "Machine Learning": 55, "Web Development": 95, "Data Analytics": 65, "Cloud Dev": 35 },
  { month: "Mar", "Machine Learning": 70, "Web Development": 110, "Data Analytics": 75, "Cloud Dev": 45 },
  { month: "Apr", "Machine Learning": 95, "Web Development": 115, "Data Analytics": 90, "Cloud Dev": 50 },
  { month: "May", "Machine Learning": 120, "Web Development": 130, "Data Analytics": 110, "Cloud Dev": 65 }
];

export const DEPARTMENT_ALLOCATIONS = [
  { name: "MeitY", allocated: 4500, capacity: 5000 },
  { name: "Telecom", allocated: 3200, capacity: 3500 },
  { name: "Finance", allocated: 2100, capacity: 2500 },
  { name: "Skill Dev", allocated: 1800, capacity: 2000 },
  { name: "Logistics", allocated: 900, capacity: 1200 }
];

// ─── COMPANY ANALYTICS ───────────────────────────────────────
export const COMPANY_ANALYTICS_DATA = [
  { month: "Jan", applications: 142, shortlisted: 28, hired: 8 },
  { month: "Feb", applications: 189, shortlisted: 35, hired: 11 },
  { month: "Mar", applications: 234, shortlisted: 42, hired: 14 },
  { month: "Apr", applications: 312, shortlisted: 58, hired: 19 },
  { month: "May", applications: 398, shortlisted: 72, hired: 24 }
];

export const SKILL_DEMAND_DATA = [
  { skill: "AI/ML", demand: 94, supply: 62, gap: 32 },
  { skill: "Cloud", demand: 88, supply: 71, gap: 17 },
  { skill: "Full Stack", demand: 82, supply: 78, gap: 4 },
  { skill: "Data Science", demand: 91, supply: 65, gap: 26 },
  { skill: "DevOps", demand: 76, supply: 58, gap: 18 },
  { skill: "Blockchain", demand: 55, supply: 32, gap: 23 }
];

// ─── NOTIFICATIONS ───────────────────────────────────────────
export const MOCK_NOTIFICATIONS = [
  { id: "1", type: "system", text: "AI matching engine database successfully updated to Scikit v1.6.", time: "10m ago" },
  { id: "2", type: "allocation", text: "New: TATA Consultancy Services matched 94% with your profile.", time: "2h ago" },
  { id: "3", type: "academic", text: "NITT Registrar verified your official CGPA credentials.", time: "1d ago" },
  { id: "4", type: "interview", text: "Interview scheduled: TCS Technical Round — Today 2:00 PM.", time: "3h ago" },
  { id: "5", type: "assessment", text: "Python Assessment result: 91% — Top 5% nationally!", time: "1d ago" }
];

// ─── PLATFORM HEALTH (ADMIN) ─────────────────────────────────
export const PLATFORM_HEALTH_DATA = [
  { time: "00:00", dau: 8200, api: 99.8, latency: 142 },
  { time: "04:00", dau: 4100, api: 99.9, latency: 98 },
  { time: "08:00", dau: 12400, api: 99.6, latency: 187 },
  { time: "12:00", dau: 18240, api: 99.4, latency: 234 },
  { time: "16:00", dau: 16800, api: 99.7, latency: 198 },
  { time: "20:00", dau: 11200, api: 99.9, latency: 156 }
];

// ─── LEADERBOARD ─────────────────────────────────────────────
export const ASSESSMENT_LEADERBOARD = [
  { rank: 1, name: "Priya Menon", university: "IIT Madras", score: 96, time: "28:14" },
  { rank: 2, name: "Dev Kumar", university: "IIT Delhi", score: 94, time: "31:05" },
  { rank: 3, name: "Arjun Sharma", university: "NIT Trichy", score: 91, time: "33:42" },
  { rank: 4, name: "Ananya Roy", university: "Jadavpur University", score: 89, time: "34:18" },
  { rank: 5, name: "Sneha Patel", university: "IIT Bombay", score: 88, time: "35:00" }
];

// ─── TRANSLATIONS ─────────────────────────────────────────────
export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    title: "FutureFit",
    subtitle: "AI Smart Allocation Engine for PM Internship Scheme",
    tagline: "Automating fair, transparent, and accurate internship matching using Artificial Intelligence, NLP, and Machine Learning.",
    launchBtn: "Launch Platform",
    demoBtn: "Watch AI Demo",
    navHome: "Home",
    navBenefits: "Benefits",
    navFaq: "FAQ",
    navLogin: "Secure Login",
    navBack: "Back to Home",
    overview: "Overview",
    profile: "My Profile",
    resumeUpload: "Resume Upload",
    resumeAnalysis: "AI Resume Analysis",
    matchScores: "Match Intelligence",
    recommendations: "AI Recommendations",
    applications: "My Applications",
    careerInsights: "Career Insights",
    settings: "Settings",
    logout: "Log Out",
    welcomeBack: "Welcome back",
    atsScore: "Resume Strength (ATS)",
    matchScore: "Match Fit Probability",
    careerReadiness: "Career Readiness Index",
    profileComp: "Profile Completion",
    missingSkills: "Missing Skills",
    suggestedAITip: "AI Skill Gap Suggestion",
    suggestedAITipText: "Acquire AWS Cloud and Docker foundations to boost your compatibility score by 15% across MeitY schemes.",
    totalStudents: "Total Enrolled Students",
    matchAccuracy: "Engine Match Accuracy",
    allocationRate: "Successful Allocation Rate",
    activePositions: "Active PM Placements",
    modelStatus: "AI Model Diagnostics",
    triggerRun: "Trigger AI Allocation Engine",
    manualOverride: "Manual Override Table",
    filterDept: "Filter Department",
    exportData: "Export Matrix (CSV)",
    accuracyCurve: "Epoch Accuracy Curve",
    skillTrend: "National Talent Demand Trends",
    deptCap: "Department Allocation Capacity",
    chatBotTitle: "FutureFit Assistant",
    chatPrompt1: "How do I improve my resume ATS score?",
    chatPrompt2: "Show me the top high-demand skills for 2026",
    chatPrompt3: "Explain how explainable AI prevents bias",
    chatVoiceHelp: "Voice Guidance: Ready",
    interviewDesk: "Interview Desk",
    assessments: "Assessments",
    messages: "Messages",
    aiAssistant: "AI Career Assistant",
    hiringPipeline: "Hiring Pipeline",
    skillGap: "Skill Gap Analysis"
  },
  ta: {
    title: "பியூச்சர்பிட் (FutureFit)",
    subtitle: "பிரதமரின் இன்டர்ன்ஷிப் திட்டத்திற்கான AI ஸ்மார்ட் ஒதுக்கீடு இயந்திரம்",
    tagline: "செயற்கை நுண்ணறிவு, NLP மற்றும் இயந்திர கற்றல் ஆகியவற்றைப் பயன்படுத்தி நியாயமான, வெளிப்படையான மற்றும் துல்லியமான இன்டர்ன்ஷிப் பொருத்தத்தை தானியங்குபடுத்துதல்.",
    launchBtn: "இயங்குதளத்தைத் தொடங்கு",
    demoBtn: "AI டெமோ காண்க",
    navHome: "முகப்பு",
    navBenefits: "நன்மைகள்",
    navFaq: "கேள்விகள்",
    navLogin: "பாதுகாப்பான உள்நுழைவு",
    navBack: "முகப்பு பக்கத்திற்கு",
    overview: "கண்ணோட்டம்",
    profile: "எனது சுயவிவரம்",
    resumeUpload: "மறுதொடக்கத்தை பதிவேற்று",
    resumeAnalysis: "AI மறுதொடக்க பகுப்பாய்வு",
    matchScores: "பொருத்த நுண்ணறிவு",
    recommendations: "AI பரிந்துரைகள்",
    applications: "எனது விண்ணப்பங்கள்",
    careerInsights: "தொழில் நுண்ணறிவு",
    settings: "அமைப்புகள்",
    logout: "வெளியேறு",
    welcomeBack: "மீண்டும் வருக",
    atsScore: "மறுதொடக்க வலிமை (ATS)",
    matchScore: "பொருத்தப்படும் நிகழ்தகவு",
    careerReadiness: "தொழில் தயார்நிலை குறியீடு",
    profileComp: "சுயவிவரம் நிறைவு",
    missingSkills: "விடுபட்ட திறன்கள்",
    suggestedAITip: "AI திறன் இடைவெளி பரிந்துரை",
    suggestedAITipText: "MeitY திட்டங்களில் உங்கள் பொருந்தக்கூடிய மதிப்பெண்ணை 15% அதிகரிக்க AWS Cloud மற்றும் Docker அடிப்படைகளைப் பெறுங்கள்.",
    totalStudents: "மொத்த மாணவர்கள் சேர்க்கை",
    matchAccuracy: "இயந்திர பொருத்த துல்லியம்",
    allocationRate: "வெற்றிகரமான ஒதுக்கீட்டு விகிதம்",
    activePositions: "செயலில் உள்ள பிரதமரின் இடங்கள்",
    modelStatus: "AI மாதிரி கண்டறிதல்",
    triggerRun: "AI ஒதுக்கீடு இயந்திரத்தை இயக்கு",
    manualOverride: "கைமுறை மேலெழுதும் அட்டவணை",
    filterDept: "துறையை வடிகட்டு",
    exportData: "தரவை ஏற்றுமதி செய் (CSV)",
    accuracyCurve: "துல்லிய வளைவு",
    skillTrend: "தேசிய திறமை தேவை போக்குகள்",
    deptCap: "துறை ஒதுக்கீட்டு திறன்",
    chatBotTitle: "பியூச்சர்பிட் உதவியாளர்",
    chatPrompt1: "எனது மறுதொடக்க ATS மதிப்பெண்ணை எவ்வாறு மேம்படுத்துவது?",
    chatPrompt2: "2026 இன் முக்கிய தேவைப்படும் திறன்களைக் காட்டு",
    chatPrompt3: "விளக்கமளிக்கக்கூடிய AI எவ்வாறு சார்புகளைத் தடுக்கிறது?",
    chatVoiceHelp: "குரல் வழிகாட்டுதல்: தயார்",
    interviewDesk: "நேர்காணல் மேடை",
    assessments: "மதிப்பீடுகள்",
    messages: "செய்திகள்",
    aiAssistant: "AI வாழ்க்கை உதவியாளர்",
    hiringPipeline: "பணியமர்த்தல் குழாய்",
    skillGap: "திறன் இடைவெளி பகுப்பாய்வு"
  },
  hi: {
    title: "फ्यूचरफिट (FutureFit)",
    subtitle: "पीएम इंटर्नशिप योजना के लिए एआई स्मार्ट आवंटन इंजन",
    tagline: "कृत्रिम बुद्धिमत्ता, एनएलपी और मशीन लर्निंग का उपयोग करके निष्पक्ष, पारदर्शी और सटीक इंटर्नशिप मिलान को स्वचालित करना।",
    launchBtn: "प्लेटफ़ॉर्म लॉन्च करें",
    demoBtn: "एआई डेमो देखें",
    navHome: "होम",
    navBenefits: "लाभ",
    navFaq: "अक्सर पूछे जाने वाले प्रश्न",
    navLogin: "सुरक्षित लॉगिन",
    navBack: "मुख्य पृष्ठ पर",
    overview: "अवलोकन",
    profile: "मेरी प्रोफ़ाइल",
    resumeUpload: "रिज्यूमे अपलोड",
    resumeAnalysis: "एआई रिज्यूमे विश्लेषण",
    matchScores: "मैच इंटेलिजेंस",
    recommendations: "एआई सिफारिशें",
    applications: "मेरे आवेदन",
    careerInsights: "करियर अंतर्दृष्टि",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    welcomeBack: "स्वागत है",
    atsScore: "रिज्यूमे स्कोर (ATS)",
    matchScore: "मैच की संभावना",
    careerReadiness: "करियर तैयारी सूचकांक",
    profileComp: "प्रोफ़ाइल पूर्णता",
    missingSkills: "लापता कौशल",
    suggestedAITip: "एआई कौशल अंतर सुझाव",
    suggestedAITipText: "MeitY योजनाओं में अपने संगतता स्कोर को 15% बढ़ाने के लिए AWS क्लाउड और डॉकर की बुनियादी बातें सीखें।",
    totalStudents: "कुल नामांकित छात्र",
    matchAccuracy: "इंजन मिलान सटीकता",
    allocationRate: "सफल आवंटन दर",
    activePositions: "सक्रिय पीएम प्लेसमेंट",
    modelStatus: "एआई मॉडल निदान",
    triggerRun: "एआई आवंटन इंजन सक्रिय करें",
    manualOverride: "मैनुअल ओवरराइड तालिका",
    filterDept: "विभाग फ़िल्टर करें",
    exportData: "डेटा निर्यात (CSV)",
    accuracyCurve: "सटीकता वक्र",
    skillTrend: "राष्ट्रीय प्रतिभा मांग रुझान",
    deptCap: "विभाग आवंटन क्षमता",
    chatBotTitle: "फ्यूचरफिट सहायक",
    chatPrompt1: "मैं अपना रिज्यूमे एटीएस स्कोर कैसे सुधारूं?",
    chatPrompt2: "मुझे 2026 के शीर्ष उच्च-मांग वाले कौशल दिखाएं",
    chatPrompt3: "स्पष्ट करें कि व्याख्या योग्य एआई पक्षपात कैसे रोकता है",
    chatVoiceHelp: "वॉयस गाइडेंस: तैयार",
    interviewDesk: "इंटरव्यू डेस्क",
    assessments: "मूल्यांकन",
    messages: "संदेश",
    aiAssistant: "एआई करियर सहायक",
    hiringPipeline: "हायरिंग पाइपलाइन",
    skillGap: "कौशल अंतर विश्लेषण"
  }
};
