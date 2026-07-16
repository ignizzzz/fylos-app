// Entry point for the private Growth Admin. Mounted at /admin/* by the host
// router. Owns its own providers, its own mock-auth gate (sign-in /
// session-expired), reference-data loading, and its nested routes.

import { Routes, Route, Navigate } from 'react-router-dom';
import { ServicesProvider } from './context/ServicesContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ReferenceProvider, useReference } from './context/ReferenceContext';
import { AdminShell, RequireRole } from './components/layout';
import { SignIn } from './features/auth/SignIn';
import { SessionExpired } from './components/states';
import { Spinner } from './components/ui';
import { tokens } from './theme';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { LeadsPage } from './features/leads/LeadsPage';
import { ContactsPage } from './features/contacts/ContactsPage';
import { CompaniesPage } from './features/companies/CompaniesPage';
import { PipelinePage } from './features/pipeline/PipelinePage';
import { SubmissionsPage } from './features/submissions/SubmissionsPage';
import { AttributionPage } from './features/attribution/AttributionPage';
import { TasksPage } from './features/tasks/TasksPage';
import { FollowUpsPage } from './features/followups/FollowUpsPage';
import { NotesPage } from './features/notes/NotesPage';
import { TagsPage } from './features/tags/TagsPage';
import { SourcesPage } from './features/sources/SourcesPage';

export default function AdminApp() {
  return (
    <ServicesProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ServicesProvider>
  );
}

function AuthGate() {
  const { status, signOut } = useAuth();
  if (status === 'unauthenticated') return <SignIn />;
  if (status === 'expired') return <SessionExpired onSignIn={() => void signOut()} />;
  return (
    <ReferenceProvider>
      <Shell />
    </ReferenceProvider>
  );
}

function FullLoader() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: tokens.appBg }}>
      <Spinner size={24} />
    </div>
  );
}

function Shell() {
  const { ready } = useReference();
  if (!ready) return <FullLoader />;
  return (
    <Routes>
      <Route element={<AdminShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="pipeline" element={<PipelinePage />} />
        <Route path="submissions" element={<RequireRole role="manager"><SubmissionsPage /></RequireRole>} />
        <Route path="attribution" element={<RequireRole role="manager"><AttributionPage /></RequireRole>} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="follow-ups" element={<FollowUpsPage />} />
        <Route path="notes" element={<NotesPage />} />
        <Route path="tags" element={<TagsPage />} />
        <Route path="sources" element={<SourcesPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
}
