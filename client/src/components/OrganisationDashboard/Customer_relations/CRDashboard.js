import React, { useState } from 'react'

// ─── Sample Data ────────────────────────────────────────────────
const recentActivity = [
  { id: 1, icon: '🎫', color: '#E8EEF8', text: 'Ticket TKT-2841 escalated to Fraud & Risk', time: '2 min ago', type: 'ticket' },
  { id: 2, icon: '✅', color: '#E8F5E9', text: 'KYC-0489 approved for Lucy Adhiambo', time: '18 min ago', type: 'kyc' },
  { id: 3, icon: '👤', color: '#EDE7F6', text: 'New onboarding started: Isaac Moraa', time: '42 min ago', type: 'onboard' },
  { id: 4, icon: '⚠️', color: '#FFF3E0', text: 'TKT-2839 marked urgent — Fraud alert raised', time: '1 hr ago', type: 'urgent' },
  { id: 5, icon: '💬', color: '#E8EEF8', text: 'Comment added to TKT-2836 by J. Kamau', time: '1.5 hrs ago', type: 'comment' },
]

const kycQueue = [
  { id: 'KYC-0492', customer: 'Isaac Moraa', submitted: 'Today, 09:15', status: 'Pending', initials: 'IM' },
  { id: 'KYC-0491', customer: 'Jane Muthoni', submitted: 'Today, 08:42', status: 'Requires Review', initials: 'JM' },
  { id: 'KYC-0490', customer: 'Kariuki Holdings', submitted: 'Yesterday, 16:30', status: 'Pending', initials: 'KH' },
  { id: 'KYC-0489', customer: 'Lucy Adhiambo', submitted: 'Yesterday, 14:15', status: 'Approved', initials: 'LA' },
]

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekVals = [18, 24, 21, 30, 26, 12, 8]
const weekMax = Math.max(...weekVals)

// ─── Sub-components ─────────────────────────────────────────────
function StatCard({ label, value, delta, deltaUp, iconBg, iconColor, iconChar }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 cursor-pointer">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-lg"
        style={{ background: iconBg, color: iconColor }}
      >
        {iconChar}
      </div>
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-bold text-slate-800 mt-1 leading-tight">{value}</p>
      <p className={`text-[11px] mt-1 font-medium flex items-center gap-1 ${deltaUp ? 'text-emerald-600' : 'text-red-500'}`}>
        <span>{deltaUp ? '↑' : '↓'}</span>{delta}
      </p>
    </div>
  )
}

function StatusPill({ status }) {
  const map = {
    Pending: 'bg-amber-50 text-amber-700',
    'Requires Review': 'bg-orange-50 text-orange-700',
    Approved: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-red-50 text-red-700',
    Open: 'bg-blue-50 text-blue-700',
    Resolved: 'bg-emerald-50 text-emerald-700',
    Urgent: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function CRDashboard({ onNavigate }) {
  const stats = [
    { label: 'Open Tickets', value: 24, delta: '+3 today', deltaUp: false, iconBg: '#E8EEF8', iconColor: '#1565C0', iconChar: '🎫' },
    { label: 'Pending KYC', value: 11, delta: '6 new today', deltaUp: false, iconBg: '#FFF3E0', iconColor: '#E65100', iconChar: '📋' },
    { label: 'Approved KYCs', value: 38, delta: '+5 this week', deltaUp: true, iconBg: '#E8F5E9', iconColor: '#2E7D32', iconChar: '✅' },
    { label: 'Escalated / Urgent', value: 5, delta: '2 critical', deltaUp: false, iconBg: '#FFEBEE', iconColor: '#C62828', iconChar: '⚠️' },
    { label: 'Resolved Today', value: 12, delta: 'Target: 15', deltaUp: true, iconBg: '#E8EEF8', iconColor: '#1565C0', iconChar: '🎯' },
  ]

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Good morning, Sarah 👋</h1>
        <p className="text-sm text-slate-400 mt-0.5">Friday, 8 May 2026 · Here's your operational overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-5 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      {/* Charts + Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {/* Bar Chart */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-slate-700">Ticket Volume — This Week</p>
            <button
              onClick={() => onNavigate?.('tickets')}
              className="text-xs text-blue-600 font-medium hover:underline"
            >
              View all →
            </button>
          </div>
          <div className="flex items-end gap-3 h-28">
            {weekVals.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: Math.round((v / weekMax) * 96) + 'px',
                    background: i === 3 ? '#0F2154' : '#DBEAFE',
                    border: i === 3 ? 'none' : '1px solid #BFDBFE',
                  }}
                />
                <span className="text-[10px] text-slate-400">{weekDays[i]}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            {[['Open', 'bg-blue-50 text-blue-700', 10], ['Assigned', 'bg-violet-50 text-violet-700', 8], ['Resolved', 'bg-emerald-50 text-emerald-700', 12], ['Urgent', 'bg-red-50 text-red-700', 5]].map(([l, cl, v]) => (
              <div key={l} className="text-center">
                <p className="text-lg font-bold text-slate-800">{v}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cl}`}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { bg: '#FFF3E0', color: '#E65100', icon: '📋', label: 'Review KYC', sub: '11 pending', page: 'kyc' },
              { bg: '#E8EEF8', color: '#1565C0', icon: '🎫', label: 'Assign Tickets', sub: '5 unassigned', page: 'tickets' },
              { bg: '#FFEBEE', color: '#C62828', icon: '🚨', label: 'Urgent Cases', sub: '3 critical', page: 'tickets' },
              { bg: '#E8F5E9', color: '#2E7D32', icon: '👤', label: 'New Onboarding', sub: 'Start KYC', page: 'kyc' },
            ].map((qa, i) => (
              <button
                key={i}
                onClick={() => onNavigate?.(qa.page)}
                className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: qa.bg }}>
                  {qa.icon}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-slate-700">{qa.label}</p>
                  <p className="text-[11px] text-slate-400">{qa.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity + KYC Queue */}
      <div className="grid grid-cols-2 gap-4">
        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">Recent Activity</p>
            <span className="text-[11px] text-slate-400">Last 2 hours</span>
          </div>
          <div className="divide-y divide-slate-50">
            {recentActivity.map(a => (
              <div key={a.id} className="flex gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0" style={{ background: a.color }}>
                  {a.icon}
                </div>
                <div>
                  <p className="text-[12.5px] text-slate-700 leading-snug">{a.text}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* KYC Queue Preview */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-700">KYC Queue Preview</p>
            <button onClick={() => onNavigate?.('kyc')} className="text-xs text-blue-600 font-medium hover:underline">
              View all →
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {kycQueue.map(k => (
              <div key={k.id} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700 flex-shrink-0">
                  {k.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-700 truncate">{k.customer}</p>
                  <p className="text-[11px] text-slate-400">{k.id} · {k.submitted}</p>
                </div>
                <StatusPill status={k.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}