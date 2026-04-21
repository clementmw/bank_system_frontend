import React, { useState, useEffect } from 'react';
import CreateEmployeeModal from './HrRecruitment';
import { handleGetEmployees } from '../OrgHelper';
import { useNavigate } from 'react-router-dom';

// ─── Read permissions from localStorage ───────────────────────────────────────
const getOrgUser = () => JSON.parse(localStorage.getItem('org_user') || '{}');

// ─── Design tokens ─────────────────────────────────────────────────────────────
// Emerald + White classic corporate palette
// Primary:   #059669 (emerald-600)
// Hover:     #047857 (emerald-700)
// Light bg:  #f0fdf4 (emerald-50)
// Border:    #d1fae5 (emerald-100)
// Page bg:   #f8faf9

// ─── Badge ────────────────────────────────────────────────────────────────────
function Badge({ children, color = 'neutral' }) {
  const map = {
    green:   'bg-emerald-100 text-emerald-800 border-emerald-200',
    yellow:  'bg-amber-100   text-amber-800   border-amber-200',
    blue:    'bg-sky-100     text-sky-800     border-sky-200',
    red:     'bg-red-100     text-red-800     border-red-200',
    purple:  'bg-violet-100  text-violet-800  border-violet-200',
    neutral: 'bg-gray-100    text-gray-600    border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold border uppercase tracking-wider ${map[color]}`}>
      {children}
    </span>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-gray-900 text-sm font-semibold tracking-tight">{title}</h2>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, delta }) {
  const isPositive = delta > 0;
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <span className="text-gray-500 text-[10.5px] font-bold uppercase tracking-widest">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-base">
          {icon}
        </div>
      </div>
      <div className="text-gray-900 text-3xl font-bold tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
        {value ?? <span className="text-gray-300">—</span>}
      </div>
      <div className="flex items-center gap-2">
        {delta !== undefined && (
          <span className={`text-[11px] font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {Math.abs(delta)}%
          </span>
        )}
        {sub && <span className="text-gray-400 text-[11px]">{sub}</span>}
      </div>
    </div>
  );
}

// ─── Onboarding Pipeline ─────────────────────────────────────────────────────
// Replaces "Recent Employees" — much more actionable for HR managers.
// Shows new hires progressing through onboarding stages.
const PIPELINE_STAGES = [
  { key: 'OFFER',       label: 'Offer Sent',    color: 'blue',   dot: 'bg-sky-400' },
  { key: 'DOCS',        label: 'Documents',     color: 'yellow', dot: 'bg-amber-400' },
  { key: 'ORIENTATION', label: 'Orientation',   color: 'purple', dot: 'bg-violet-400' },
  { key: 'ACTIVE',      label: 'Active',        color: 'green',  dot: 'bg-emerald-500' },
];

// Sample pipeline data — replace with real API data
const SAMPLE_PIPELINE = [
  { id: 1, name: 'Amara Kimani',    role: 'Product Designer',  stage: 'ACTIVE',      start: 'Apr 7', avatar: 'AK', avatarBg: '#d1fae5', avatarColor: '#065f46' },
  { id: 2, name: 'James Odhiambo', role: 'Software Engineer', stage: 'ORIENTATION', start: 'Apr 9', avatar: 'JO', avatarBg: '#dbeafe', avatarColor: '#1e40af' },
  { id: 3, name: 'Njeri Wanjiku',  role: 'Marketing Intern',  stage: 'DOCS',        start: 'Apr 10', avatar: 'NW', avatarBg: '#fef3c7', avatarColor: '#92400e' },
  { id: 4, name: 'Brian Mutua',    role: 'Finance Analyst',   stage: 'OFFER',       start: 'Apr 12', avatar: 'BM', avatarBg: '#ede9fe', avatarColor: '#5b21b6' },
  { id: 5, name: 'Grace Ndung\'u', role: 'HR Coordinator',    stage: 'DOCS',        start: 'Apr 11', avatar: 'GN', avatarBg: '#fee2e2', avatarColor: '#991b1b' },
];

function OnboardingPipeline({ onAdd }) {
  const [activeStage, setActiveStage] = useState(null);

  const filtered = activeStage
    ? SAMPLE_PIPELINE.filter(p => p.stage === activeStage)
    : SAMPLE_PIPELINE;

  const countByStage = (key) => SAMPLE_PIPELINE.filter(p => p.stage === key).length;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-sm font-semibold">Onboarding Pipeline</h2>
          <p className="text-gray-400 text-xs mt-0.5">New hire progress tracker</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors"
        >
          + Add Hire
        </button>
      </div>

      {/* Stage filter pills */}
      <div className="flex gap-2 px-5 py-3 border-b border-emerald-50 bg-gray-50 overflow-x-auto">
        <button
          onClick={() => setActiveStage(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            activeStage === null
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
          }`}
        >
          All ({SAMPLE_PIPELINE.length})
        </button>
        {PIPELINE_STAGES.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveStage(activeStage === s.key ? null : s.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              activeStage === s.key
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label} ({countByStage(s.key)})
          </button>
        ))}
      </div>

      {/* Pipeline rows */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-400 text-sm">No hires in this stage.</div>
      ) : (
        filtered.map((hire) => {
          const stageInfo = PIPELINE_STAGES.find(s => s.key === hire.stage);
          const stageIdx  = PIPELINE_STAGES.findIndex(s => s.key === hire.stage);
          const progress  = Math.round(((stageIdx + 1) / PIPELINE_STAGES.length) * 100);
          return (
            <div key={hire.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-emerald-50/40 transition-colors">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
                style={{ background: hire.avatarBg, color: hire.avatarColor }}
              >
                {hire.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-gray-800 text-sm font-medium truncate">{hire.name}</p>
                  <span className="text-gray-400 text-xs hidden sm:block">·</span>
                  <p className="text-gray-400 text-xs truncate hidden sm:block">{hire.role}</p>
                </div>
                {/* Progress bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-[120px]">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-[10.5px]">{progress}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Badge color={stageInfo?.color ?? 'neutral'}>{stageInfo?.label ?? hire.stage}</Badge>
                <span className="text-gray-400 text-[10.5px]">Start: {hire.start}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ─── Headcount Breakdown ──────────────────────────────────────────────────────
function HeadcountBreakdown({ employees }) {
  const types = [
    { key: 'FULL_TIME', label: 'Full Time',  color: '#059669' },
    { key: 'PART_TIME', label: 'Part Time',  color: '#f59e0b' },
    { key: 'CONTRACT',  label: 'Contract',   color: '#38bdf8' },
    { key: 'INTERN',    label: 'Intern',     color: '#f472b6' },
  ];
  const total = employees.length || 1;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-white p-5">
      <SectionHeader title="Headcount Breakdown" sub="By employment type (this page)" />
      <div className="flex flex-col gap-3">
        {types.map(t => {
          const count = employees.filter(e => e.employment_type === t.key).length;
          const pct   = Math.round((count / total) * 100);
          return (
            <div key={t.key}>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-600 text-xs">{t.label}</span>
                <span className="text-gray-500 text-xs font-mono">
                  {count} <span className="text-gray-300">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: t.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────
function RecentActivity({ activities = [], loading }) {
  const icons = {
    CREATE: '➕', UPDATE: '✏️', DELETE: '🗑️',
    LEAVE: '🏖️', PAYROLL: '💰', ONBOARD: '🎉', DEFAULT: '📋',
  };
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-emerald-100">
        <h2 className="text-gray-900 text-sm font-semibold">Recent Activity</h2>
        <p className="text-gray-400 text-xs mt-0.5">Audit trail — last 8 actions</p>
      </div>
      {loading ? (
        <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
      ) : activities.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-400 text-sm">No activity to show.</p>
          <p className="text-gray-300 text-xs mt-1">You may not have permission to view audit logs.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {activities.map((act, i) => (
            <div key={act.id ?? i} className="flex gap-3 px-5 py-3 hover:bg-emerald-50/40 transition-colors">
              <span className="text-base flex-shrink-0 mt-0.5">{icons[act.action] ?? icons.DEFAULT}</span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-600 text-xs leading-relaxed">
                  <span className="text-gray-900 font-medium">{act.user_name ?? 'Someone'}</span>
                  {' '}{act.description ?? `performed ${act.action}`}
                </p>
                <p className="text-gray-400 text-[10.5px] mt-0.5 font-mono">{act.timestamp ?? '—'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Leave Requests ───────────────────────────────────────────────────────────
function PendingLeave({ leaves = [], loading }) {
  const statusColor = { PENDING: 'yellow', APPROVED: 'green', REJECTED: 'red' };
  const pendingCount = leaves.filter(l => l.status === 'PENDING').length;
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-emerald-100 flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-sm font-semibold">Leave Requests</h2>
          <p className="text-gray-400 text-xs mt-0.5">Pending approvals</p>
        </div>
        {pendingCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 text-[10px] font-bold">
            {pendingCount}
          </span>
        )}
      </div>
      {loading ? (
        <div className="p-6 text-center text-gray-400 text-sm">Loading…</div>
      ) : leaves.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-400 text-sm">No leave requests.</p>
          <p className="text-gray-300 text-xs mt-1">You may not have permission to view these.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {leaves.slice(0, 5).map((l, i) => (
            <div key={l.id ?? i} className="flex items-center gap-3 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-xs font-medium truncate">{l.employee_name ?? '—'}</p>
                <p className="text-gray-400 text-[10.5px]">
                  {l.leave_type} · {l.days} day{l.days !== 1 ? 's' : ''}
                </p>
              </div>
              <Badge color={statusColor[l.status] ?? 'neutral'}>{l.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Employee Table ───────────────────────────────────────────────────────────
function EmployeeTable({ employees, loading, meta, page, setPage, filters, setFilters, onRefresh }) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-white overflow-hidden">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-5 py-4 border-b border-emerald-100 bg-gray-50">
        <input
          placeholder="Search name, email, ID…"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 transition-colors min-w-[200px]"
        />
        <select
          value={filters.employment_type}
          onChange={e => setFilters(f => ({ ...f, employment_type: e.target.value }))}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400 transition-colors cursor-pointer"
        >
          <option value="">All types</option>
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="CONTRACT">Contract</option>
          <option value="INTERN">Intern</option>
        </select>
        <input
          placeholder="Department…"
          value={filters.department}
          onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-emerald-400 transition-colors min-w-[150px]"
        />
        <button
          onClick={onRefresh}
          className="px-3 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:border-emerald-400 hover:text-emerald-700 transition-colors ml-auto bg-white"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Table head */}
      <div
        className="grid px-5 py-3 bg-emerald-50 border-b border-emerald-100"
        style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1fr' }}
      >
        {['Employee', 'Job Title', 'Department', 'Type', 'ID'].map(h => (
          <span key={h} className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{h}</span>
        ))}
      </div>

      {/* Rows */}
      {loading ? (
        <div className="py-12 text-center text-gray-400 text-sm">Loading employees…</div>
      ) : employees.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">No employees found.</div>
      ) : (
        employees.map(emp => <EmployeeRow key={emp.id} emp={emp} />)
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-emerald-100 bg-gray-50">
        <span className="text-gray-400 text-xs">{meta.count} total</span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!meta.previous}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          >← Prev</button>
          <span className="px-3 py-1.5 text-gray-400 text-xs">Page {page}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!meta.next}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs bg-white disabled:opacity-30 disabled:cursor-not-allowed hover:border-emerald-400 hover:text-emerald-700 transition-colors"
          >Next →</button>
        </div>
      </div>
    </div>
  );
}

// ─── Employee Row ─────────────────────────────────────────────────────────────
function EmployeeRow({ emp }) {
  const palette = [
    { bg: '#d1fae5', color: '#065f46' },
    { bg: '#dbeafe', color: '#1e40af' },
    { bg: '#fef3c7', color: '#92400e' },
    { bg: '#ede9fe', color: '#5b21b6' },
    { bg: '#fee2e2', color: '#991b1b' },
    { bg: '#fce7f3', color: '#9d174d' },
  ];
  const p        = palette[(emp.employee_id?.charCodeAt(0) ?? 0) % palette.length];
  const initials = `${emp.user?.first_name?.[0] ?? ''}${emp.user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div
      className="grid px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-emerald-50/40 transition-colors cursor-default"
      style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1fr', alignItems: 'center' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
          style={{ background: p.bg, color: p.color }}
        >
          {initials || '?'}
        </div>
        <div className="min-w-0">
          <p className="text-gray-800 text-sm font-medium truncate">
            {emp.user?.first_name} {emp.user?.last_name}
          </p>
          <p className="text-gray-400 text-xs truncate">{emp.user?.email}</p>
        </div>
      </div>
      <span className="text-gray-500 text-sm truncate">{emp.job_title || '—'}</span>
      <span className="text-gray-500 text-sm truncate">{emp.department?.name || '—'}</span>
      <div>
        <Badge color={emp.employment_type === 'FULL_TIME' ? 'green' : 'yellow'}>
          {emp.employment_type?.replace('_', ' ') || '—'}
        </Badge>
      </div>
      <span className="text-gray-300 text-xs font-mono">{emp.employee_id}</span>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function HrDashboard() {
  const [employees,  setEmployees]  = useState([]);
  const [meta,       setMeta]       = useState({ count: 0 });
  const [loading,    setLoading]    = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filters,    setFilters]    = useState({ search: '', employment_type: '', department: '' });
  const [page,       setPage]       = useState(1);

  const [activities,    setActivities]    = useState([]);
  const [leaves,        setLeaves]        = useState([]);
  const [widgetLoading, setWidgetLoading] = useState(false);

  const orgUser  = getOrgUser();
  const userName = orgUser?.user?.first_name ?? 'HR';

  const navigate = useNavigate()

  const handlenavigation = ()=>{
  navigate('/org-dashboard/hr/onboarding')

}
  // ── Fetch employees ──────────────────────────────────────────────────────────
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page });
      if (filters.search)          params.append('search',          filters.search);
      if (filters.employment_type) params.append('employment_type', filters.employment_type);
      if (filters.department)      params.append('department',      filters.department);

      const data = await handleGetEmployees(params);
      setEmployees(data.data.results ?? []);
      setMeta({ count: data.data.count ?? 0, next: data.data.next, previous: data.data.previous });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch sidebar widgets ────────────────────────────────────────────────────
  // Replace these stubs with real API calls.
  // Backend returns [] when user lacks permission — no frontend guard needed.
  const fetchWidgets = async () => {
    setWidgetLoading(true);
    try {
      // const actRes   = await handleGetAuditLogs({ limit: 8 });
      // const leaveRes = await handleGetLeaveRequests({ status: 'PENDING' });
      // setActivities(actRes.data.results ?? []);
      // setLeaves(leaveRes.data.results ?? []);
      setActivities([]);
      setLeaves([]);
    } catch (e) {
      console.error(e);
    } finally {
      setWidgetLoading(false);
    }
  };
 

  useEffect(() => { fetchEmployees(); }, [filters, page]);
  useEffect(() => { fetchWidgets(); },  []);

  // ── Derived stats ────────────────────────────────────────────────────────────
  const fullTime = employees.filter(e => e.employment_type === 'FULL_TIME').length;
  const partTime = employees.filter(e => e.employment_type === 'PART_TIME').length;
  const contract = employees.filter(e => e.employment_type === 'CONTRACT').length;

  return (
    <div
      className="min-h-screen text-gray-900 p-8"
      style={{ background: '#f8faf9', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Good morning, {userName} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Here's what's happening across your workforce today.
          </p>
        </div>
        <button
          onClick={handlenavigation}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
        >
          <span className="text-base">+</span> Add Employee
        </button>
      </div>

      {/* ── Stat strip ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Staff" value={meta.count} sub="All employees" icon="👥" />
        <StatCard label="Full Time"   value={fullTime}   sub="This page"     icon="💼" />
        <StatCard label="Part Time"   value={partTime}   sub="This page"     icon="⏰" />
        <StatCard label="Contract"    value={contract}   sub="This page"     icon="📝" />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left column — 2/3 width */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Onboarding pipeline — replaces Recent Employees */}
          <OnboardingPipeline onAdd={() => setShowCreate(true)} />

          {/* Full employee directory */}
          <div>
            <SectionHeader
              title="All Employees"
              sub="Full directory with filters"
            />
            <EmployeeTable
              employees={employees}
              loading={loading}
              meta={meta}
              page={page}
              setPage={setPage}
              filters={filters}
              setFilters={(fn) => { setFilters(fn); setPage(1); }}
              onRefresh={fetchEmployees}
            />
          </div>
        </div>

        {/* Right column — 1/3 width */}
        <div className="flex flex-col gap-6">

          <HeadcountBreakdown employees={employees} />

          <PendingLeave leaves={leaves} loading={widgetLoading} />

          <RecentActivity activities={activities} loading={widgetLoading} />

          {/* Quick actions */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-5">
            <SectionHeader title="Quick Actions" />
            <div className="flex flex-col gap-2">
              {[
                { label: '+ Add Employee',        onClick: () => setShowCreate(true), primary: true  },
                { label: '↗ Export Directory',    onClick: () => {},                  primary: false },
                { label: '📋 View Leave Tracker', onClick: () => {},                  primary: false },
                { label: '💰 Run Payroll',         onClick: () => {},                  primary: false },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    a.primary
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-gray-50 border border-gray-200 text-gray-600 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── Modal ── */}
      {showCreate && (
        <CreateEmployeeModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); fetchEmployees(); }}
        />
      )}
    </div>
  );
}