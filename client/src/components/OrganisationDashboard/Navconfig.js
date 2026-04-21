// config/navigation.js

export const navConfig = {

  // ─────────────────────────────────────────
  // FINANCE
  // ─────────────────────────────────────────
  finance: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',  label: 'Dashboard',       path: '/finance' },
        { icon: 'trend', label: 'Revenue & P&L',   path: '/finance/pnl' },
        { icon: 'chart', label: 'Budget tracker',  path: '/finance/budget',    badge: 3 },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'doc',    label: 'Invoices',        path: '/finance/invoices',      badge: 12 },
        { icon: 'swap',   label: 'Transactions',    path: '/finance/transactions' },
        { icon: 'report', label: 'Financial reports', path: '/finance/reports' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'check', label: 'Approvals',  path: '/finance/approvals', badge: 5 },
        { icon: 'lock',  label: 'Audit logs', path: '/finance/audit' },
      ],
    },
  ],

  // ─────────────────────────────────────────
  // HR
  // ─────────────────────────────────────────
  hr: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',   label: 'Dashboard',      path: '/org-dashboard/hr' },
        { icon: 'people', label: 'Staff directory', path: '/org-dashboard/hr/staff' },
        { icon: 'chart',  label: 'Headcount',      path: '/org-dashboard/hr/headcount' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'doc',    label: 'Leave requests',       path: '/org-dashboard/hr/leave',       badge: 8 },
        { icon: 'swap',   label: 'Payroll',              path: '/org-dashboard/hr/payroll' },
        { icon: 'check',  label: 'Performance reviews',  path: '/org-dashboard/hr/performance' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'people', label: 'Onboarding',  path: '/org-dashboard/hr/onboarding', badge: 2 },
        { icon: 'lock',   label: 'Compliance',  path: '/org-dashboard/hr/compliance' },
      ],
    },
  ],

  // ─────────────────────────────────────────
  // IT / TECH
  // ─────────────────────────────────────────
  it: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',   label: 'Dashboard',     path: '/it' },
        { icon: 'trend',  label: 'System health', path: '/it/health' },
        { icon: 'warn',   label: 'Incidents',     path: '/it/incidents', badge: 2 },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'doc',    label: 'Support tickets', path: '/it/tickets',        badge: 17 },
        { icon: 'lock',   label: 'Access control',  path: '/it/access' },
        { icon: 'shield', label: 'Security logs',   path: '/it/security' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'check',  label: 'Change requests',   path: '/it/changes',    badge: 3 },
        { icon: 'shield', label: 'Audit & compliance', path: '/it/audit' },
      ],
    },
  ],

  // ─────────────────────────────────────────
  // COMPLIANCE / LEGAL
  // ─────────────────────────────────────────
  compliance: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',   label: 'Dashboard',    path: '/compliance' },
        { icon: 'warn',   label: 'Risk register', path: '/compliance/risk' },
        { icon: 'shield', label: 'Alerts',        path: '/compliance/alerts', badge: 4 },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'doc',    label: 'Regulatory filings', path: '/compliance/filings',  badge: 2 },
        { icon: 'shield', label: 'AML monitoring',     path: '/compliance/aml' },
        { icon: 'report', label: 'Audit reports',      path: '/compliance/audit' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'check', label: 'Policy reviews',  path: '/compliance/policies', badge: 1 },
        { icon: 'lock',  label: 'Case management', path: '/compliance/cases' },
      ],
    },
  ],

  // ─────────────────────────────────────────
  // OPERATIONS
  // ─────────────────────────────────────────
  operations: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',  label: 'Dashboard',      path: '/operations' },
        { icon: 'trend', label: 'Branch network', path: '/operations/branches' },
        { icon: 'chart', label: 'Daily volume',   path: '/operations/volume' },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'doc',  label: 'Daily reports',    path: '/operations/reports',  badge: 1 },
        { icon: 'swap', label: 'Cash management',  path: '/operations/cash' },
        { icon: 'chart',label: 'SLA tracker',      path: '/operations/sla' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'warn', label: 'Escalations', path: '/operations/escalations', badge: 2 },
        { icon: 'doc',  label: 'Incident log', path: '/operations/incidents' },
      ],
    },
  ],

  // ─────────────────────────────────────────
  // CUSTOMER SERVICE
  // ─────────────────────────────────────────
  customerService: [
    {
      section: 'Overview',
      items: [
        { icon: 'grid',  label: 'Dashboard',           path: '/customer-service' },
        { icon: 'trend', label: 'Satisfaction scores', path: '/customer-service/csat' },
        { icon: 'msg',   label: 'Open tickets',        path: '/customer-service/tickets', badge: 34 },
      ],
    },
    {
      section: 'Operations',
      items: [
        { icon: 'warn', label: 'Complaints log',   path: '/customer-service/complaints', badge: 9 },
        { icon: 'msg',  label: 'Account queries',  path: '/customer-service/queries' },
        { icon: 'doc',  label: 'Daily summary',    path: '/customer-service/summary' },
      ],
    },
    {
      section: 'Governance',
      items: [
        { icon: 'check', label: 'Escalations',    path: '/customer-service/escalations', badge: 4 },
        { icon: 'doc',   label: 'Knowledge base', path: '/customer-service/kb' },
      ],
    },
  ],
}

// ─────────────────────────────────────────
// Helper: map department key from auth token
// to navConfig key — keeps your backend free
// to use its own naming convention.
// ─────────────────────────────────────────
export const deptKeyMap = {
  finance:          'finance',
  hr:               'hr',
  it:               'it',
  'it/tech':        'it',
  compliance:       'compliance',
  legal:            'compliance',
  operations:       'operations',
  ops:              'operations',
  'customer_service': 'customerService',
  'customer-service': 'customerService',
  cs:               'customerService',
}

// Usage in Sidebar.jsx:
//   const { user } = useAuth()
//   const navKey = deptKeyMap[user.department] ?? user.department
//   const nav    = navConfig[navKey] ?? []