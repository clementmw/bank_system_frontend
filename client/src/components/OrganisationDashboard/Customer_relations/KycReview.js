import React, { useState, useEffect } from 'react'
import { handleGetKyc } from '../OrgHelper'

function StatusPill({ status }) {
  const map = {
    PENDING: 'bg-amber-50 text-amber-700 border border-amber-200',
    REQUIRES_REVIEW: 'bg-orange-50 text-orange-700 border border-orange-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    REJECTED: 'bg-red-50 text-red-700 border border-red-200',
    VERIFIED: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  }
  
  const displayStatus = status?.replace(/_/g, ' ') || 'Unknown'
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${map[status] || 'bg-slate-100 text-slate-500'}`}>
      {displayStatus}
    </span>
  )
}

function RiskPill({ risk }) {
  const map = {
    Low: 'bg-emerald-50 text-emerald-700',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${map[risk] || 'bg-slate-100 text-slate-500'}`}>
      {risk} Risk
    </span>
  )
}

// ─── Format Date Helper ──────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  } else if (diffDays === 1) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`
  } else {
    return `${diffDays} days ago`
  }
}

// ─── Get Initials Helper ─────────────────────────────────────────
function getInitials(fullName) {
  if (!fullName) return '??'
  return fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

// ─── KYC Review Modal (Updated for API Data) ─────────────────────
function KycModal({ kyc, onClose }) {
  const [checks, setChecks] = useState(new Array(6).fill(false))
  const [comment, setComment] = useState(kyc.review_notes || '')

  const toggleCheck = i => {
    const updated = [...checks]
    updated[i] = !updated[i]
    setChecks(updated)
  }

  const checkedCount = checks.filter(Boolean).length

  const checkList = [
    'Identity document is valid and not expired',
    'Photo clearly matches the submitted document',
    'All documents are clear and fully legible',
    'All required documents have been submitted',
    'No signs of tampering or suspicious alterations',
    'Customer information matches documents',
  ]

  // Transform documents to match the UI format
  const transformDocuments = (docs) => {
    if (!docs || docs.length === 0) return []
    return docs.map(doc => ({
      name: doc.document_type?.replace(/_/g, ' ') || 'Document',
      uploaded: formatDate(doc.created_at),
      valid: doc.status !== 'REJECTED',
      status: doc.status,
      fileName: doc.file_name,
      fileSize: doc.file_size,
      documentUrl: doc.document_upload,
    }))
  }

  // Simulate audit trail from available data
  const auditTrail = [
    { time: formatDate(kyc.created_at)?.split(',')[1] || 'N/A', text: 'KYC submission created' },
    { time: formatDate(kyc.updated_at)?.split(',')[1] || 'N/A', text: `Status updated to ${kyc.verification_status?.replace(/_/g, ' ') || 'Pending'}` },
    ...(kyc.verified_at ? [{ time: formatDate(kyc.verified_at)?.split(',')[1] || 'N/A', text: 'Verification completed' }] : []),
  ]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between z-10">
          <div>
            <p className="text-[11px] text-slate-400 font-medium mb-1">
              {kyc.id?.slice(0, 8)} · Individual
            </p>
            <h2 className="text-base font-bold text-slate-800">{kyc.user_full_name || 'Unknown User'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <StatusPill status={kyc.verification_status} />
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl leading-none mt-1">✕</button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Contact Info */}
          <div className="bg-slate-50 rounded-xl p-4 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Email</p>
              <p className="text-sm font-medium text-slate-700 break-all">{kyc.user_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Submitted</p>
              <p className="text-sm font-medium text-slate-700">{formatDate(kyc.created_at)}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Reviewer</p>
              <p className="text-sm font-medium text-slate-700">
                {kyc.verified_by_email || 'Unassigned'}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wide mb-0.5">Status</p>
              <StatusPill status={kyc.verification_status} />
            </div>
          </div>

          {/* Documents */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Submitted Documents ({kyc.documents?.length || 0})
            </p>
            {kyc.documents?.length > 0 ? (
              <div className="space-y-2">
                {transformDocuments(kyc.documents).map((doc, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      doc.valid 
                        ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50' 
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${
                      doc.valid ? 'bg-blue-50' : 'bg-red-100'
                    }`}>
                      📄
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${doc.valid ? 'text-slate-700' : 'text-red-700'}`}>
                        {doc.name}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Uploaded · {doc.uploaded}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {doc.fileName} · {(doc.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button className="px-2.5 py-1 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors flex-shrink-0">
                      👁 View
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No documents submitted</p>
            )}
          </div>

          {/* Verification Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Verification Checklist</p>
              <span className="text-[11px] font-semibold text-slate-500">{checkedCount}/{checkList.length} completed</span>
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {checkList.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleCheck(i)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                    checks[i] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {checks[i] && <span className="text-white text-[10px] font-bold">✓</span>}
                  </div>
                  <p className="text-[12.5px] text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviewer Comments */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block mb-1.5">
              Reviewer Comments
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Add review notes or reason for action..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-400 resize-none"
            />
          </div>

          {/* Audit Trail */}
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Audit Trail</p>
            <div className="space-y-2">
              {auditTrail.map((a, i) => (
                <div key={i} className="flex gap-3 text-[12px]">
                  <span className="text-slate-400 flex-shrink-0 w-12">{a.time}</span>
                  <span className="text-slate-600">{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-2 justify-end">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors">
            ↑ Request Re-upload
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
            ✕ Reject
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors">
            ✓ Approve
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────
export default function KycReview() {
  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [kycData, setKycData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch KYC data from API
  useEffect(() => {
    const fetchKycData = async () => {
      try {
        setLoading(true)
        const response = await handleGetKyc()
        console.log(response.data.results)
        setKycData(response.data?.results || [])
      } catch (err) {
        setError(err.message)
        console.error('Error fetching KYC data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchKycData()
  }, [])

  const tabs = ['All', 'PENDING', 'REQUIRES_REVIEW', 'APPROVED', 'REJECTED']

  const tabCount = (tab) => {
    if (tab === 'All') return kycData.length
    return kycData.filter(k => k.verification_status === tab).length
  }

  const getFilteredData = () => {
    if (activeTab === 'All') return kycData
    return kycData.filter(k => k.verification_status === activeTab)
  }

  const filtered = getFilteredData()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading KYC submissions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error loading KYC data: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {selected && <KycModal kyc={selected} onClose={() => setSelected(null)} />}

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">KYC Verification</h1>
          <p className="text-sm text-slate-400 mt-0.5">Review and approve customer onboarding documents</p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Pending', status: 'PENDING', bg: '#FFF3E0', color: '#E65100' },
          { label: 'Requires Review', status: 'REQUIRES_REVIEW', bg: '#FFF3E0', color: '#BF360C' },
          { label: 'Approved', status: 'APPROVED', bg: '#E8F5E9', color: '#2E7D32' },
          { label: 'Rejected', status: 'REJECTED', bg: '#FFEBEE', color: '#C62828' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold flex-shrink-0" style={{ background: s.bg, color: s.color }}>
              {tabCount(s.status)}
            </div>
            <p className="text-sm font-medium text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#0F2154] text-[#0F2154]'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab === 'REQUIRES_REVIEW' ? 'Requires Review' : tab.charAt(0) + tab.slice(1).toLowerCase()}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === tab ? 'bg-[#0F2154] text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {tabCount(tab)}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Row */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-50">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 flex-1">
            <span className="text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-transparent outline-none text-sm text-slate-700 w-full placeholder:text-slate-400"
            />
          </div>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none bg-white">
            <option>All Types</option>
            <option>Individual</option>
            <option>Corporate</option>
          </select>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none bg-white">
            <option>All Status</option>
            <option>PENDING</option>
            <option>APPROVED</option>
            <option>REJECTED</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['KYC ID', 'Customer', 'Status', 'Documents', 'Submitted', 'Reviewer', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((k, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-semibold text-blue-600 text-xs">{k.id?.slice(0, 8)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-bold text-blue-700 flex-shrink-0">
                        {getInitials(k.user_full_name)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-700 text-[13px]">{k.user_full_name || 'Unknown'}</p>
                        <p className="text-[11px] text-slate-400">{k.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={k.verification_status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-slate-600">📁 {k.documents?.length || 0} docs</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500 whitespace-nowrap">
                    {formatDate(k.created_at)}
                  </td>
                  <td className="px-4 py-3 text-[12px] text-slate-500">
                    {k.verified_by_email || 'Unassigned'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(k)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-[11px] font-semibold hover:bg-slate-100 hover:border-blue-300 transition-colors"
                    >
                      👁 Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">Showing {filtered.length} submissions</p>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50">← Prev</button>
            <button className="px-3 py-1.5 rounded-lg bg-[#0F2154] text-white text-xs font-semibold">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:bg-slate-50">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}