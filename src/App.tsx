import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import StudentAIRecommendationsPage from './pages/StudentAIRecommendationsPage';
import InternshipListingPage from './pages/InternshipListingPage';
import ProfilePage from './pages/ProfilePage';
import StudentSettingsPage from './pages/StudentSettingsPage';
import StudentInterviewDeskPage from './pages/StudentInterviewDeskPage';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingPage from './pages/OnboardingPage';

// Company Pages
import CompanyDashboardHome from './pages/company/CompanyDashboardHome';
import PostInternshipPage from './pages/company/PostInternshipPage';
import ApplicantsPage from './pages/company/ApplicantsPage';
import InternshipsPostedPage from './pages/company/InternshipsPostedPage';
import CompanyProfilePage from './pages/company/CompanyProfilePage';
import CompanySettingsPage from './pages/company/CompanySettingsPage';
import CompanyInterviewDeskPage from './pages/company/CompanyInterviewDeskPage';
import StudentApplicationsPage from './pages/StudentApplicationsPage';

import { useEffect } from 'react';
import { insforge } from './lib/insforge';

function App() {
  useEffect(() => {
    async function seedData() {
      const { data } = await insforge.database.from('internships').select('id');
      if (data && data.length === 0) {
        // Create a dummy company first
        const companyId = 'comp_1';
        await insforge.database.from('companies').insert({
          id: companyId,
          name: 'TechFlow Solutions',
          industry: 'Software Development',
          location: 'San Francisco, CA',
          description: 'A leading tech company building future-fit software.'
        });

        // Add some internships
        await insforge.database.from('internships').insert([
          {
            id: 'int_1',
            company_id: companyId,
            title: 'Product Management Intern',
            description: 'Join our team to help build the next generation of allocation engines.',
            department: 'Product',
            required_skills: ['Product Strategy', 'UI/UX', 'Data Analysis'],
            location: 'Remote',
            is_active: true
          },
          {
            id: 'int_2',
            company_id: companyId,
            title: 'Full Stack Developer Intern',
            description: 'Work with React, Node.js and TypeScript on core platform features.',
            department: 'Engineering',
            required_skills: ['React', 'Node.js', 'TypeScript', 'Tailwind'],
            location: 'San Francisco, CA',
            is_active: true
          },
          {
            id: 'int_3',
            company_id: companyId,
            title: 'AI/ML Resarch Intern',
            description: 'Help optimize our matching algorithms using state-of-the-art NLP.',
            department: 'AI',
            required_skills: ['Python', 'Machine Learning', 'NLP', 'TensorFlow'],
            location: 'Remote',
            is_active: true
          }
        ]);
      }
    }
    seedData();
  }, []);

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/ai-recommendation" element={<StudentAIRecommendationsPage />} />
          <Route path="/student/internships" element={<InternshipListingPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/applications" element={<StudentApplicationsPage />} />
          <Route path="/student/interview-desk" element={<StudentInterviewDeskPage />} />
          <Route path="/student/settings" element={<StudentSettingsPage />} />

          {/* Company Routes */}
          <Route path="/company/dashboard" element={<CompanyDashboardHome />} />
          <Route path="/company/post" element={<PostInternshipPage />} />
          <Route path="/company/applicants" element={<ApplicantsPage />} />
          <Route path="/company/internships" element={<InternshipsPostedPage />} />
          <Route path="/company/interview-desk" element={<CompanyInterviewDeskPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
          <Route path="/company/settings" element={<CompanySettingsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

