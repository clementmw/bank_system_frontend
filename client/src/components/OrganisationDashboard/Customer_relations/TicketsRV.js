import React, { useState } from 'react'

// ─── Sample Data ────────────────────────────────────────────────
const TICKETS = [
  { id: 'TKT-2841', customer: 'Amara Osei', category: 'Account Access', priority: 'High', dept: 'IT Support', assigned: 'J. Kamau', status: 'Open', sla: 85, created: '2 hrs ago', desc: 'Customer cannot login to mobile banking app. Error code 403 on all devices.' },
  { id: 'TKT-2840', customer: 'Beatrice Wanjiku', category: 'Loan Inquiry', priority: 'Medium', dept: 'Loans', assigned: 'S. Mwangi', status: 'Assigned', sla: 60, created: '3 hrs ago', desc: 'Customer requesting status update on mortgage application submitted 2 weeks ago.' },
  { id: 'TKT-2839', customer: 'Charles Otieno', category: 'Fraud Alert', priority: 'High', dept: 'Fraud & Risk', assigned: 'Unassigned', status: 'Open', sla: 95, created: '1 hr ago', desc: 'Suspicious transactions detected. Customer reports three unauthorized withdrawals.' },
  { id: 'TKT-2838', customer: 'Diana Njeri', category: 'Account Statement', priority: 'Low', dept: 'Operations', assigned: 'M. Achieng', status: 'Resolved', sla: 20, created: '1 day ago', desc: 'Customer requested 12-month account statement for visa application.' },
  { id: 'TKT-2837', customer: 'Emmanuel Kipkurui', category: 'Card Blocked', priority: 'High', dept: 'Cards Unit', assigned: 'P. Ndungu', status: 'Open', sla: 78, created: '4 hrs ago', desc: 'Customer card blocked after failed PIN attempts during travel.' },
  { id: 'TKT-2836', customer: 'Faith Akinyi', category: 'Transfer Dispute', priority: 'Medium', dept: 'Operations', assigned: 'J. Kamau', status: 'Assigned', sla: 45, created: '5 hrs ago', desc: 'Customer disputing a KES 45,000 transfer they claim was not authorized.' },
  { id: 'TKT-2835', customer: 'George Mutua', category: 'Interest Query', priority: 'Low', dept: 'Loans', assigned: 'S. Mwangi', status: 'Resolved', sla: 15, created: '2 days ago', desc: 'Query regarding interest calculation on fixed deposit account.' },
  { id: 'TKT-2834', customer: 'Hannah Chebet', category: 'Account Closure', priority: 'Medium', dept: 'Operations', assigned: 'Unassigned', status: 'Open', sla: 55, created: '6 hrs ago', desc: 'Customer wants to close savings account and transfer balance.' },
]

const STAFF = ['Unassigned', 'J. Kamau', 'S. Mwangi', 'M. Achieng', 'P. Ndungu', 'R. Omondi']

// ─── Helpers ────────────────────────────────────────────────────
function priorityColor(p) {
  return p === 'High' ? '#C62828' : p === 'Medium' ? '#E65100' : '#2E7D32'
}

function StatusPill({ status }) {
  const map = {
    Open: 'bg-blue-50 text-blue-700 border border-blue-200',
    Assigned: 'bg-violet-50 text-violet-700 border border-violet-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Escalated: 'bg-red-50 text-red-700 border border-red-200',
    'In Progress': 'bg-amber-50 text-amber-700 border border-amber-200',
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${map[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

function SlaBar({ pct }) {
  const color = pct > 75 ? '#C62828' : pct > 40 ? '#E65100' : '#2E7D32'
  return (
    <div className="w-24">
      <p className="text-[10px] text-slate-400 mb-1">{pct}% elapsed</p>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: pct + '%', background: color }} />
      </div>
    </div>
  )
}

// ─── Ticket Detail Modal ─────────────────────────────────────────
function TicketModal({ ticket, onClose }) {
  const [status, setStatus] = useState(ticket.status)
  const [assigned, setAssigned] = useState(ticket.assigned)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between z-10">
          <div>
            <p className="text-[11px] text-slate-400 font-medium mb-1">{ticket.id} · {ticket.created}</p>
            <h2 className="text-base font-bold text-slate-800">{ticket.customer}</h2>
            <p className="text-sm text-slate-500">{ticket.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none mt-1">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Priority</p>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: priorityColor(ticket.priority) }} />
                <span className="text-sm font-medium text-slate-700">{ticket.priority}</span>
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Department</p>
              <p className="text-sm text-slate-700">{ticket.dept}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">SLA Status</p>
              <SlaBar pct={ticket.sla} />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Current Status</p>
              <StatusPill status={status} />
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Description</p>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-lg p-3">{ticket.desc}</p>
          </div>

          {/* Change Status + Reassign */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Change Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                <option>Open</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Escalated</option>
                <option>Resolved</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Assign To</label>
              <select
                value={assigned}
                onChange={e => setAssigned(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
              >
                {STAFF.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Internal Note */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">Add Internal Note</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              rows={3}
              placeholder="Type your note here..."
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-2 justify-end">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
            ⚠ Escalate
          </button>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-[#0F2154] text-white text-xs font-semibold hover:bg-[#1a3068] transition-colors">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function TicketsRV() {
  const [selected, setSelected] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [deptFilter, setDeptFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = TICKETS.filter(t =>
    (statusFilter === 'All' || t.status === statusFilter) &&
    (priorityFilter === 'All' || t.priority === priorityFilter) &&
    (deptFilter === 'All' || t.dept === deptFilter) &&
    (t.customer.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase()))
  )

  const departments = ['All', ...Array.from(new Set(TICKETS.map(t => t.dept)))]

  return (
    <div className="space-y-4">
      {selected && <TicketModal ticket={selected} onClose={() => setSelected(null)} />}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Ticket Management</h1>
          <p className="text-sm text-slate-400 mt-0.5">{TICKETS.length} total tickets · {TICKETS.filter(t => t.status === 'Open').length} open</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0F2154] text-white text-sm font-semibold rounded-lg hover:bg-[#1a3068] transition-colors">
          + New Ticket
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Filter Bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-slate-100 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-[180px]">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search by customer or ticket ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>

          {/* Filters */}
          {[
            ['Status', ['All', 'Open', 'Assigned', 'In Progress', 'Escalated', 'Resolved'], statusFilter, setStatusFilter],
            ['Priority', ['All', 'High', 'Medium', 'Low'], priorityFilter, setPriorityFilter],
            ['Department', departments, deptFilter, setDeptFilter],
          ].map(([label, options, val, setter]) => (
            <select
              key={label}
              value={val}
              onChange={e => setter(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none bg-white hover:border-slate-300 cursor-pointer"
            >
              {options.map(o => <option key={o}>{o === 'All' ? `All ${label}` : o}</option>)}
            </select>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Ticket ID', 'Customer', 'Category', 'Priority', 'Department', 'Assigned To', 'SLA', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((t, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-blue-600 text-xs">{t.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-700 text-[13px]">{t.customer}</p>
                    <p className="text-[11px] text-slate-400">{t.created}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 whitespace-nowrap text-[12px]">{t.category}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityColor(t.priority) }} />
                      <span className="text-[12px] text-slate-600">{t.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500 whitespace-nowrap">{t.dept}</td>
                  <td className="px-4 py-3 text-[12px]">
                    {t.assigned === 'Unassigned'
                      ? <span className="italic text-slate-400">Unassigned</span>
                      : <span className="text-slate-700">{t.assigned}</span>
                    }
                  </td>
                  <td className="px-4 py-3"><SlaBar pct={t.sla} /></td>
                  <td className="px-4 py-3"><StatusPill status={t.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelected(t)}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 text-[11px] font-semibold hover:bg-slate-100 transition-colors"
                      >
                        View
                      </button>
                      <button className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-500 text-[11px] font-semibold hover:bg-slate-100 transition-colors">
                        Assign
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Showing {filtered.length} of {TICKETS.length} tickets</p>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50">← Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-[#0F2154] text-white text-xs font-semibold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}