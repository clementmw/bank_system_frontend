import React, { useState, useRef } from 'react';
import { handleCreateEmployee } from '../OrgHelper';

// ─── Steps ─────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'profile',   label: 'Profile',      icon: '👤', desc: 'Photo & identity' },
  { id: 'personal',  label: 'Personal',     icon: '📋', desc: 'Contact details' },
  { id: 'role',      label: 'Role',         icon: '🏷️',  desc: 'Job & employment' },
  { id: 'salary',    label: 'Compensation', icon: '💰', desc: 'Salary & benefits' },
  { id: 'emergency', label: 'Emergency',    icon: '🚨', desc: 'Next of kin' },
];

// ─── Dev autofill ──────────────────────────────────────────────────────────────
const DEV_FILL = {
  first_name: 'Jane', last_name: 'Wanjiku', email: 'jane.wanjiku@company.co.ke',
  profile_picture: null, profile_preview: null,
  phone_number: '+254 712 345 678', national_id: '28374651', gender: 'FEMALE',
  date_of_birth: '1995-06-14', address: '14 Ngong Road', city: 'Nairobi', country: 'Kenya',
  role_name: 'HR Staff', job_title: 'HR Analyst', employment_type: 'FULL_TIME',
  work_location: 'HYBRID', department: 'Human Resources', date_of_hire: '2024-02-01',
  salary: '85000', currency: 'KES', pay_frequency: 'MONTHLY',
  allowances: { Housing: '8000', Transport: '4000' },
  bank_name: 'Equity Bank', account_number: '0234567890', tax_pin: 'A012345678Z',
  contact_name: 'James Wanjiku', relationship: 'SIBLING',
  emergency_contact: '+254 722 987 654', emergency_email: 'james.w@gmail.com',
};

const INITIAL_FORM = {
  first_name: '', last_name: '', email: '',
  profile_picture: null, profile_preview: null,
  phone_number: '', national_id: '', gender: '', date_of_birth: '',
  address: '', city: '', country: 'Kenya',
  role_name: '', job_title: '', employment_type: '', work_location: '',
  department: '', date_of_hire: '',
  salary: '', currency: 'KES', pay_frequency: 'MONTHLY',
  allowances: {},
  bank_name: '', account_number: '', tax_pin: '',
  contact_name: '', relationship: '', emergency_contact: '', emergency_email: '',
};

// ─── Validation ────────────────────────────────────────────────────────────────
const validateStep = (step, form) => {
  const e = {};
  if (step === 0) {
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim())  e.last_name  = 'Required';
    if (!form.email.trim())      e.email      = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
  }
  if (step === 1) {
    if (!form.phone_number.trim()) e.phone_number = 'Required';
  }
  if (step === 2) {
    if (!form.role_name)        e.role_name       = 'Required';
    if (!form.job_title.trim()) e.job_title       = 'Required';
    if (!form.employment_type)  e.employment_type = 'Required';
    if (!form.date_of_hire)     e.date_of_hire    = 'Required';
  }
  if (step === 3) {
    if (!form.salary) e.salary = 'Required';
  }
  return e;
};

// ─── Field primitives ──────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <span className="text-[10.5px] font-bold uppercase tracking-widest text-gray-500">
      {children}
    </span>
  );
}

function FieldWrap({ label, error, half, children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? 'col-span-1' : 'col-span-2'}`}>
      <Label>{label}</Label>
      {children}
      {error && <span className="text-[11px] text-red-500">{error}</span>}
    </div>
  );
}

const inputBase = (err) =>
  `w-full bg-white border ${err ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-emerald-500'} rounded-xl px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors shadow-sm`;

function Inp({ k, label, form, setForm, errors, type = 'text', placeholder, half }) {
  return (
    <FieldWrap label={label} error={errors[k]} half={half}>
      <input
        type={type}
        placeholder={placeholder}
        value={form[k] ?? ''}
        onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
        className={inputBase(errors[k])}
      />
    </FieldWrap>
  );
}

function Sel({ k, label, form, setForm, errors, options, half }) {
  return (
    <FieldWrap label={label} error={errors[k]} half={half}>
      <select
        value={form[k] ?? ''}
        onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
        className={`${inputBase(errors[k])} cursor-pointer`}
      >
        <option value="">Select…</option>
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </FieldWrap>
  );
}

function Divider({ label }) {
  return (
    <div className="col-span-2 flex items-center gap-3 pt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-emerald-100" />
    </div>
  );
}

// ─── Photo uploader ────────────────────────────────────────────────────────────
function PhotoUploader({ form, setForm }) {
  const ref = useRef();
  const [dragging, setDragging] = useState(false);

  const handle = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => setForm(f => ({ ...f, profile_picture: file, profile_preview: e.target.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-span-2 flex items-center gap-8 py-2">
      <div
        onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
        className={`w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden transition-all relative
          ${dragging
            ? 'border-2 border-emerald-500 bg-emerald-50'
            : 'border-2 border-dashed border-gray-200 bg-gray-50 hover:border-emerald-400 hover:bg-emerald-50'
          }`}
      >
        {form.profile_preview ? (
          <>
            <img src={form.profile_preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl">📷</div>
            <div className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mt-1">Upload</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files[0])} />
      <div>
        <p className="text-gray-800 text-sm font-semibold mb-1">
          {form.profile_preview ? 'Photo ready ✓' : 'Profile Photo'}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed">
          Click or drag & drop.<br />
          JPG, PNG or WEBP · max 5 MB<br />
          <span className="text-gray-300">Optional but recommended.</span>
        </p>
        {form.profile_preview && (
          <button
            onClick={() => setForm(f => ({ ...f, profile_picture: null, profile_preview: null }))}
            className="mt-2 text-red-500 text-xs hover:text-red-400 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Allowance builder ─────────────────────────────────────────────────────────
const ALLOWANCE_TYPES = [
  'Housing', 'Transport', 'Medical', 'Meal', 'Communication',
  'Commuter', 'Uniform', 'Shift', 'Performance Bonus', 'Other',
];

function AllowanceBuilder({ form, setForm }) {
  const allowances = form.allowances && typeof form.allowances === 'object' ? form.allowances : {};
  const [rows, setRows] = useState(
    Object.keys(allowances).length > 0
      ? Object.entries(allowances).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: '', value: '' }]
  );
  const [customKey, setCustomKey] = useState({});

  const sync = (updated) => {
    setRows(updated);
    const obj = {};
    updated.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) obj[key.trim()] = value.trim();
    });
    setForm(f => ({ ...f, allowances: obj }));
  };

  const addRow    = () => sync([...rows, { key: '', value: '' }]);
  const removeRow = (i) => {
    if (rows.length === 1) { sync([{ key: '', value: '' }]); return; }
    sync(rows.filter((_, idx) => idx !== i));
    setCustomKey(prev => { const n = { ...prev }; delete n[i]; return n; });
  };
  const updateKey = (i, val) => {
    const updated = rows.map((r, idx) => idx === i ? { ...r, key: val === 'Other' ? '' : val } : r);
    if (val === 'Other') setCustomKey(prev => ({ ...prev, [i]: true }));
    else setCustomKey(prev => { const n = { ...prev }; delete n[i]; return n; });
    sync(updated);
  };
  const updateCustomKey = (i, val) => sync(rows.map((r, idx) => idx === i ? { ...r, key: val } : r));
  const updateValue     = (i, val) => sync(rows.map((r, idx) => idx === i ? { ...r, value: val } : r));

  const total = Object.values(allowances).map(v => parseFloat(v) || 0).reduce((a, b) => a + b, 0);

  return (
    <div className="col-span-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Allowances</Label>
        {total > 0 && (
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
            Total: {form.currency || 'KES'} {total.toLocaleString()}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            {customKey[i] ? (
              <input
                autoFocus
                placeholder="Custom allowance…"
                value={row.key}
                onChange={e => updateCustomKey(i, e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 transition-colors"
              />
            ) : (
              <select
                value={row.key || ''}
                onChange={e => updateKey(i, e.target.value)}
                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="">Select type…</option>
                {ALLOWANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <div className="relative w-44 flex-shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-mono pointer-events-none">
                {form.currency || 'KES'}
              </span>
              <input
                type="number"
                placeholder="0"
                value={row.value}
                onChange={e => updateValue(i, e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-emerald-500 transition-colors text-right font-mono"
              />
            </div>
            <button
              onClick={() => removeRow(i)}
              className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-500 transition-colors text-lg leading-none"
            >×</button>
          </div>
        ))}
      </div>
      <button
        onClick={addRow}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-emerald-600 transition-colors w-fit mt-1"
      >
        <span className="w-5 h-5 rounded border border-dashed border-gray-300 flex items-center justify-center text-base leading-none hover:border-emerald-400">+</span>
        Add allowance
      </button>
      {Object.keys(allowances).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(allowances).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1 text-[11px] text-emerald-700">
              <span>{k}</span>
              <span className="text-emerald-300">·</span>
              <span className="font-mono">{parseFloat(v).toLocaleString()}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Step panels ───────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { v: 'HR Staff',               l: 'HR Staff' },
  { v: 'Human resource manager', l: 'HR Manager' },
  { v: 'Finance Officer',        l: 'Finance Officer' },
  { v: 'Finance Manager',        l: 'Finance Manager' },
  { v: 'ACCOUNTANT',             l: 'Accountant' },
  { v: 'INTERN',                 l: 'Intern' },
];

function StepProfile({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <PhotoUploader form={form} setForm={setForm} />
      <Inp k="first_name" label="First Name"    form={form} setForm={setForm} errors={errors} placeholder="Jane"             half />
      <Inp k="last_name"  label="Last Name"     form={form} setForm={setForm} errors={errors} placeholder="Wanjiku"          half />
      <Inp k="email"      label="Email Address" form={form} setForm={setForm} errors={errors} placeholder="jane@company.com" type="email" />
    </div>
  );
}

function StepPersonal({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Inp k="phone_number"  label="Phone Number"           form={form} setForm={setForm} errors={errors} placeholder="+254 700 000 000" half />
      <Inp k="national_id"   label="National ID / Passport" form={form} setForm={setForm} errors={errors} placeholder="12345678"         half />
      <Sel k="gender" label="Gender" form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'MALE', l: 'Male' }, { v: 'FEMALE', l: 'Female' }, { v: 'OTHER', l: 'Other' }, { v: 'PREFER_NOT', l: 'Prefer not to say' }]}
      />
      <Inp k="date_of_birth" label="Date of Birth" type="date" form={form} setForm={setForm} errors={errors} half />
      <Inp k="address" label="Street Address" form={form} setForm={setForm} errors={errors} placeholder="14 Ngong Road" />
      <Inp k="city"    label="City / Town"    form={form} setForm={setForm} errors={errors} placeholder="Nairobi" half />
      <Sel k="country" label="Country" form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'Kenya', l: 'Kenya' }, { v: 'Uganda', l: 'Uganda' },
          { v: 'Tanzania', l: 'Tanzania' }, { v: 'Rwanda', l: 'Rwanda' },
          { v: 'Ethiopia', l: 'Ethiopia' }, { v: 'Other', l: 'Other' },
        ]}
      />
    </div>
  );
}

function StepRole({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Sel k="role_name" label="System Role" form={form} setForm={setForm} errors={errors} half options={ROLE_OPTIONS} />
      <Inp k="job_title"  label="Job Title"  form={form} setForm={setForm} errors={errors} placeholder="e.g. HR Analyst" half />
      <Sel k="employment_type" label="Employment Type" form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'FULL_TIME', l: 'Full Time' }, { v: 'PART_TIME', l: 'Part Time' },
          { v: 'CONTRACT',  l: 'Contract'  }, { v: 'INTERN',    l: 'Intern'    },
        ]}
      />
      <Sel k="work_location" label="Work Location" form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'ON_SITE', l: 'On-site' }, { v: 'REMOTE', l: 'Remote' }, { v: 'HYBRID', l: 'Hybrid' },
        ]}
      />
      <Inp k="department"   label="Department"   form={form} setForm={setForm} errors={errors} placeholder="e.g. Human Resources" half />
      <Inp k="date_of_hire" label="Date of Hire" type="date" form={form} setForm={setForm} errors={errors} half />
    </div>
  );
}

function StepSalary({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <FieldWrap label="Basic Salary" error={errors.salary} half>
        <div className="flex gap-2">
          <select
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500 transition-colors w-20 flex-shrink-0 cursor-pointer shadow-sm"
          >
            {['KES', 'USD', 'GBP', 'EUR'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            placeholder="0.00"
            value={form.salary}
            onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
            className={`${inputBase(errors.salary)} flex-1 font-mono`}
          />
        </div>
      </FieldWrap>
      <Sel k="pay_frequency" label="Pay Frequency" form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'MONTHLY',   l: 'Monthly'   }, { v: 'BI_WEEKLY', l: 'Bi-weekly' },
          { v: 'WEEKLY',    l: 'Weekly'    }, { v: 'DAILY',      l: 'Daily'     },
        ]}
      />
      <AllowanceBuilder form={form} setForm={setForm} />
      <Divider label="Banking Details" />
      <Inp k="bank_name"      label="Bank Name"        form={form} setForm={setForm} errors={errors} placeholder="e.g. Equity Bank" half />
      <Inp k="account_number" label="Account Number"   form={form} setForm={setForm} errors={errors} placeholder="0123456789"       half />
      <Inp k="tax_pin"        label="KRA PIN / Tax ID" form={form} setForm={setForm} errors={errors} placeholder="A000000000Z"     half />
    </div>
  );
}

function StepEmergency({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <Inp k="contact_name" label="Contact Full Name" form={form} setForm={setForm} errors={errors} placeholder="James Wanjiku"    half />
      <Sel k="relationship" label="Relationship"      form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'SPOUSE', l: 'Spouse' }, { v: 'PARENT', l: 'Parent' },
          { v: 'SIBLING', l: 'Sibling' }, { v: 'CHILD', l: 'Child' },
          { v: 'FRIEND', l: 'Friend' }, { v: 'OTHER', l: 'Other' },
        ]}
      />
      <Inp k="emergency_contact" label="Phone Number"      form={form} setForm={setForm} errors={errors} placeholder="+254 722 987 654"  half />
      <Inp k="emergency_email"   label="Email (optional)"  form={form} setForm={setForm} errors={errors} placeholder="james@example.com" type="email" half />
    </div>
  );
}

// ─── Success state ─────────────────────────────────────────────────────────────
function SuccessState({ success, onAddAnother, onDone }) {
  return (
    <div className="flex-1 flex items-center justify-center px-8">
      <div className="max-w-md w-full text-center">
        {/* Animated check */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-emerald-600 text-3xl mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
          Employee Onboarded
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          The account is live. Share the temporary credentials securely with the new employee.
        </p>

        {/* Credentials card */}
        <div className="bg-white border border-emerald-100 rounded-2xl px-6 py-4 mb-8 text-left shadow-sm">
          {[
            { label: 'Employee ID',   value: success.employee_id,       mono: true,  accent: false },
            { label: 'Role',          value: success.role,              mono: false, accent: false },
            { label: 'Temp Password', value: success.temporary_password, mono: true,  accent: true  },
          ].map(row => row.value ? (
            <div key={row.label} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
              <span className="text-gray-500 text-sm">{row.label}</span>
              <span className={`text-sm font-semibold ${row.mono ? 'font-mono' : ''} ${row.accent ? 'text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100' : 'text-gray-900'}`}>
                {row.value}
              </span>
            </div>
          ) : null)}
        </div>


      </div>
    </div>
  );
}

// ─── Main page component ───────────────────────────────────────────────────────
// Props:
//   onBack    — called when user clicks back/cancel (navigate to dashboard)
//   onCreated — called after successful creation (navigate somewhere)
export default function CreateEmployeePage({ onBack, onCreated }) {
  const [step,     setStep]    = useState(0);
  const [form,     setForm]    = useState(INITIAL_FORM);
  const [errors,   setErrors]  = useState({});
  const [loading,  setLoading] = useState(false);
  const [apiError, setApiError]= useState('');
  const [success,  setSuccess] = useState(null);

  const goNext = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };
  const goBack = () => { setErrors({}); setStep(s => s - 1); };

  const autofill = () => { setForm(DEV_FILL); setErrors({}); };

const handleSubmit = async () => {
    setLoading(true); setApiError('');
    try {
      // Strip UI-only fields before sending
      const { profile_picture, profile_preview, ...payload } = form;
      
      // allowances is already a dict — backend now handles JSON serialisation
      const res  = await handleCreateEmployee(payload);
      const data = await res.json();
      if (res.ok) setSuccess(data);
      else setApiError(data.error || JSON.stringify(data));
    } catch {
      setApiError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
};

  const pct    = Math.round((step / (STEPS.length - 1)) * 100);
  const isLast = step === STEPS.length - 1;

  const avatarLetters = `${form.first_name?.[0] ?? ''}${form.last_name?.[0] ?? ''}`.toUpperCase();

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#f8faf9', fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* ── Top nav bar ─────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-emerald-100 px-8 py-4 flex items-center justify-between flex-shrink-0">


        {/* Progress in top bar */}
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-xs">{step + 1} of {STEPS.length} steps</span>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-emerald-600 text-xs font-mono font-semibold">{pct}%</span>
        </div>

        {/* Dev autofill */}
        <button
          onClick={autofill}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-gray-400 text-[10px] font-bold uppercase tracking-wider hover:border-amber-400 hover:text-amber-600 transition-colors"
        >
          ⚡ Dev Fill
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Left sidebar ─────────────────────────────────────────────── */}
        <div className="w-64 flex-shrink-0 bg-white border-r border-emerald-100 flex flex-col">

          {/* Employee preview card */}
          <div className="px-6 py-6 border-b border-emerald-50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center text-sm font-bold text-emerald-700 overflow-hidden flex-shrink-0">
                {form.profile_preview
                  ? <img src={form.profile_preview} alt="" className="w-full h-full object-cover" />
                  : (avatarLetters || '?')
                }
              </div>
              <div className="min-w-0">
                <p className="text-gray-800 text-sm font-semibold truncate">
                  {form.first_name || form.last_name
                    ? `${form.first_name} ${form.last_name}`.trim()
                    : 'Name not set'}
                </p>
                <p className="text-gray-400 text-xs truncate">{form.job_title || 'Role not set'}</p>
              </div>
            </div>
            {form.department && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                {form.department}
              </span>
            )}
          </div>

          {/* Step navigation */}
          <nav className="flex-1 py-4">
            {STEPS.map((s, i) => {
              const done   = i < step;
              const active = i === step;
              return (
                <button
                  key={s.id}
                  onClick={() => { if (done) { setErrors({}); setStep(i); } }}
                  className={`w-full flex items-center gap-3 px-6 py-3.5 text-left transition-all group
                    ${active
                      ? 'bg-emerald-50 border-l-2 border-emerald-600'
                      : 'border-l-2 border-transparent hover:bg-gray-50'}
                    ${done ? 'cursor-pointer' : i > step ? 'cursor-default' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all
                    ${done   ? 'bg-emerald-600 text-white'
                    : active ? 'bg-emerald-50 border-2 border-emerald-600 text-emerald-600'
                              : 'border border-gray-200 text-gray-400 bg-white'}`}
                  >
                    {done ? '✓' : s.icon}
                  </div>
                  <div>
                    <p className={`text-xs font-semibold transition-colors
                      ${active ? 'text-emerald-700' : done ? 'text-gray-600' : 'text-gray-400'}`}>
                      {s.label}
                    </p>
                    <p className="text-gray-400 text-[10px]">{s.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Completion hint */}
          <div className="px-6 py-5 border-t border-emerald-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-emerald-600 text-[10px] font-mono font-semibold">{pct}%</span>
            </div>
            <p className="text-gray-400 text-[11px]">
              {step === 0 ? 'Start with the basics.' :
               step < STEPS.length - 1 ? `${STEPS.length - step - 1} step${STEPS.length - step - 1 !== 1 ? 's' : ''} remaining.` :
               'Almost done!'}
            </p>
          </div>
        </div>

        {/* ── Main content area ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0">

          {success ? (
            <SuccessState
              success={success}
              onAddAnother={() => { setSuccess(null); setForm(INITIAL_FORM); setStep(0); }}
              onDone={onCreated ?? onBack}
            />
          ) : (
            <>
              {/* Step header */}
              <div className="bg-white border-b border-emerald-100 px-10 py-6">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{STEPS[step].icon}</span>
                    <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                      {STEPS[step].label}
                    </h2>
                  </div>
                  <p className="text-gray-500 text-sm">{STEPS[step].desc}</p>
                </div>
              </div>

              {/* Form scroll area */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-10 py-8">
                  {apiError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6 text-red-600 text-sm">
                      {apiError}
                    </div>
                  )}
                  {step === 0 && <StepProfile   form={form} setForm={setForm} errors={errors} />}
                  {step === 1 && <StepPersonal  form={form} setForm={setForm} errors={errors} />}
                  {step === 2 && <StepRole      form={form} setForm={setForm} errors={errors} />}
                  {step === 3 && <StepSalary    form={form} setForm={setForm} errors={errors} />}
                  {step === 4 && <StepEmergency form={form} setForm={setForm} errors={errors} />}
                </div>
              </div>

              {/* Footer nav */}
              <div className="bg-white border-t border-emerald-100 px-10 py-4 flex items-center justify-between flex-shrink-0">
                <button
                  onClick={step === 0 ? onBack : goBack}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                >
                  {step === 0 ? '← Cancel' : '← Back'}
                </button>

                <div className="flex items-center gap-2">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-full transition-all duration-300 ${
                        i === step  ? 'w-5 h-2 bg-emerald-600' :
                        i < step    ? 'w-2 h-2 bg-emerald-300' :
                                      'w-2 h-2 bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {isLast ? (
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating…
                      </>
                    ) : 'Create Employee ✓'}
                  </button>
                ) : (
                  <button
                    onClick={goNext}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                  >
                    Continue →
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}