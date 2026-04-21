import React, { useState, useEffect } from 'react';
import { handleGetEmployees } from '../OrgHelper';


function SectionHeader({ title, sub, action }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h2 className="text-white text-sm font-bold tracking-tight">{title}</h2>
        {sub && <p className="text-neutral-600 text-xs mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function EmployeeRow({ emp }) {
  const palette = ['#818cf8','#10b981','#f472b6','#fbbf24','#38bdf8','#f87171'];
  const color = palette[(emp.employee_id?.charCodeAt(0) ?? 0) % palette.length];
  const initials = `${emp.user?.first_name?.[0] ?? ''}${emp.user?.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div
      className="grid px-5 py-3 border-b border-neutral-800/50 items-center"
      style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1fr' }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div>
          <p className="text-white text-sm">
            {emp.user?.first_name} {emp.user?.last_name}
          </p>
          <p className="text-neutral-600 text-xs">{emp.user?.email}</p>
        </div>
      </div>

      <span className="text-neutral-300 text-sm">{emp.job_title}</span>
      <span className="text-neutral-300 text-sm">{emp.department?.name}</span>
      <span className="text-neutral-300 text-sm">{emp.employment_type}</span>
      <span className="text-neutral-500 text-xs">{emp.employee_id}</span>
    </div>
  );
}

function EmployeeTable({ employees, loading, meta, page, setPage, filters, setFilters, onRefresh }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
      
      {/* Filters */}
      <div className="flex flex-wrap gap-2 px-5 py-4 border-b border-neutral-800 bg-black/20">
        <input
          placeholder="Search name, email, ID…"
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
        />

        <select
          value={filters.employment_type}
          onChange={e => setFilters(f => ({ ...f, employment_type: e.target.value }))}
          className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
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
          className="bg-black border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white"
        />

        <button
          onClick={onRefresh}
          className="ml-auto px-3 py-2 rounded-lg border border-neutral-800 text-neutral-500 text-xs"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Header */}
      <div
        className="grid px-5 py-3 bg-black/30 border-b border-neutral-800/60"
        style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 1fr 1fr' }}
      >
        {['Employee', 'Job Title', 'Department', 'Type', 'ID'].map(h => (
          <span key={h} className="text-neutral-700 text-[10px] font-bold uppercase">
            {h}
          </span>
        ))}
      </div>

      {/* Rows */}
      {loading ? (
        <div className="py-12 text-center text-neutral-700 text-sm">Loading...</div>
      ) : employees.length === 0 ? (
        <div className="py-12 text-center text-neutral-700 text-sm">No employees found</div>
      ) : (
        employees.map(emp => <EmployeeRow key={emp.id} emp={emp} />)
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-800">
        <span className="text-neutral-700 text-xs">{meta.count} total</span>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={!meta.previous}
          >
            ← Prev
          </button>

          <span>Page {page}</span>

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!meta.next}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------- Main Component -------------------- */

function HrStaff() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ count: 0, next: null, previous: null });

  const [filters, setFilters] = useState({
    search: '',
    employment_type: '',
    department: ''
  });

  const [page, setPage] = useState(1);

  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ page });

      if (filters.search) params.append('search', filters.search);
      if (filters.employment_type) params.append('employment_type', filters.employment_type);
      if (filters.department) params.append('department', filters.department);

      const data = await handleGetEmployees(params);

      setEmployees(data.data.results ?? []);
      setMeta({
        count: data.data.count ?? 0,
        next: data.data.next,
        previous: data.data.previous
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [filters, page]);

  return (
    <div className="xl:col-span-2 flex flex-col gap-6">
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
        setFilters={(fn) => {
          setFilters(fn);
          setPage(1);
        }}
        onRefresh={fetchEmployees}
      />
    </div>
  );
}

export default HrStaff;