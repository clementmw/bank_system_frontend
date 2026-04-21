import React, { useState, useRef, useCallback } from 'react';
import { handleCreateEmployee } from '../OrgHelper';

// ─── Steps ────────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 'profile',   label: 'Profile',      icon: '👤', desc: 'Photo & identity' },
  { id: 'personal',  label: 'Personal',     icon: '📋', desc: 'Contact details' },
  { id: 'role',      label: 'Role',         icon: '🏷️',  desc: 'Job & employment' },
  { id: 'salary',    label: 'Compensation', icon: '💰', desc: 'Salary & benefits' },
  { id: 'emergency', label: 'Emergency',    icon: '🚨', desc: 'Next of kin' },
];

// ─── Modal size presets ───────────────────────────────────────────────────────
const SIZES = {
  sm:  { label: 'SM',  w: 'max-w-2xl',  h: 'max-h-[560px]' },
  md:  { label: 'MD',  w: 'max-w-3xl',  h: 'max-h-[680px]' },
  lg:  { label: 'LG',  w: 'max-w-5xl',  h: 'max-h-[820px]' },
  xl:  { label: 'XL',  w: 'max-w-6xl',  h: 'max-h-[90vh]'  },
};

// ─── Dev autofill data ────────────────────────────────────────────────────────
const DEV_FILL = {
  first_name: 'Jane', last_name: 'Wanjiku', email: 'jane.wanjiku@company.co.ke',
  profile_picture: null, profile_preview: null,
  phone_number: '+254 712 345 678', national_id: '28374651', gender: 'FEMALE',
  date_of_birth: '1995-06-14', address: '14 Ngong Road', city: 'Nairobi', country: 'Kenya',
  role_name: 'HR Staff', job_title: 'HR Analyst', employment_type: 'FULL_TIME',
  work_location: 'HYBRID', department: 'Human Resources', date_of_hire: '2024-02-01',
  salary: '85000', currency: 'KES', pay_frequency: 'MONTHLY',
  allowances: 'Housing KES 8,000 · Transport KES 4,000',
  bank_name: 'Equity Bank', account_number: '0234567890', tax_pin: 'A012345678Z',
  contact_name: 'James Wanjiku', relationship: 'SIBLING',
  emergency_contact: '+254 722 987 654', emergency_email: 'james.w@gmail.com',
};

const INITIAL_FORM = {
  first_name: '', last_name: '', email: '',
  profile_picture: null, profile_preview: null,
  phone_number: '', national_id: '', gender: '', date_of_birth: '', address: '', city: '', country: 'Kenya',
  role_name: '', job_title: '', employment_type: '', work_location: '', department: '', date_of_hire: '',
  salary: '', currency: 'KES', pay_frequency: 'MONTHLY', allowances: '', bank_name: '', account_number: '', tax_pin: '',
  contact_name: '', relationship: '', emergency_contact: '', emergency_email: '',
};

// ─── Validation ───────────────────────────────────────────────────────────────
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

// ─── Reusable field components ────────────────────────────────────────────────
function Label({ children }) {
  return (
    <span className="text-[10.5px] font-bold uppercase tracking-widest text-neutral-400">
      {children}
    </span>
  );
}

function FieldWrap({ label, error, half, children }) {
  return (
    <div className={`flex flex-col gap-1.5 ${half ? 'col-span-1' : 'col-span-2'}`}>
      <Label>{label}</Label>
      {children}
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  );
}

const inputCls = (err) =>
  `w-full bg-black border ${err ? 'border-red-400' : 'border-neutral-700'} rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-neutral-600 outline-none transition-colors focus:border-white`;

function Inp({ k, label, form, setForm, errors, type = 'text', placeholder, half }) {
  return (
    <FieldWrap label={label} error={errors[k]} half={half}>
      <input
        type={type} placeholder={placeholder}
        value={form[k] ?? ''}
        onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
        className={inputCls(errors[k])}
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
        className={`${inputCls(errors[k])} cursor-pointer`}
      >
        <option value="" className="bg-neutral-900">Select…</option>
        {options.map(o => <option key={o.v} value={o.v} className="bg-neutral-900">{o.l}</option>)}
      </select>
    </FieldWrap>
  );
}

function Divider({ label }) {
  return (
    <div className="col-span-2 flex items-center gap-3 pt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 whitespace-nowrap">{label}</span>
      <div className="flex-1 h-px bg-neutral-800" />
    </div>
  );
}

// ─── Photo uploader ───────────────────────────────────────────────────────────
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
    <div className="col-span-2 flex items-center gap-6 py-2">
      <div
        onClick={() => ref.current.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]); }}
        className={`w-24 h-24 rounded-full flex-shrink-0 flex items-center justify-center cursor-pointer overflow-hidden transition-all relative
          ${dragging ? 'border-2 border-white bg-neutral-900' : 'border-2 border-dashed border-neutral-700 bg-black hover:border-neutral-500'}`}
      >
        {form.profile_preview ? (
          <>
            <img src={form.profile_preview} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
              <span className="text-white text-xs font-semibold">Change</span>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="text-2xl">📷</div>
            <div className="text-neutral-600 text-[9px] font-bold uppercase tracking-wider mt-1">Upload</div>
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => handle(e.target.files[0])} />

      <div>
        <p className="text-neutral-300 text-sm font-medium mb-1">
          {form.profile_preview ? 'Photo ready ✓' : 'Profile Photo'}
        </p>
        <p className="text-neutral-600 text-xs leading-relaxed">
          Click or drag & drop.<br />
          JPG, PNG or WEBP · max 5 MB<br />
          <span className="text-neutral-700">Optional but recommended.</span>
        </p>
        {form.profile_preview && (
          <button
            onClick={() => setForm(f => ({ ...f, profile_picture: null, profile_preview: null }))}
            className="mt-2 text-red-400 text-xs hover:text-red-300 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Step panels ──────────────────────────────────────────────────────────────
const ROLE_OPTIONS = [
  { v: 'HR Staff',                  l: 'HR Staff' },
  { v: 'Human resource manager',    l: 'HR Manager' },
  { v: 'Finance Officer',           l: 'Finance Officer' },
  { v: 'Finance Manager',           l: 'Finance Manager' },
  { v: 'ACCOUNTANT',                l: 'Accountant' },
  { v: 'INTERN',                    l: 'Intern' },
];

function StepProfile({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <PhotoUploader form={form} setForm={setForm} />
      <Inp k="first_name" label="First Name"    form={form} setForm={setForm} errors={errors} placeholder="Jane"             half />
      <Inp k="last_name"  label="Last Name"     form={form} setForm={setForm} errors={errors} placeholder="Wanjiku"          half />
      <Inp k="email"      label="Email Address" form={form} setForm={setForm} errors={errors} placeholder="jane@company.com" type="email" />
    </div>
  );
}

function StepPersonal({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Inp k="phone_number"  label="Phone Number"           form={form} setForm={setForm} errors={errors} placeholder="+254 700 000 000" half />
      <Inp k="national_id"   label="National ID / Passport" form={form} setForm={setForm} errors={errors} placeholder="12345678"         half />
      <Sel k="gender" label="Gender" form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'MALE', l: 'Male' }, { v: 'FEMALE', l: 'Female' }, { v: 'OTHER', l: 'Other' }, { v: 'PREFER_NOT', l: 'Prefer not to say' }]}
      />
      <Inp k="date_of_birth" label="Date of Birth" type="date" form={form} setForm={setForm} errors={errors} half />
      <Inp k="address" label="Street Address" form={form} setForm={setForm} errors={errors} placeholder="14 Ngong Road" />
      <Inp k="city"    label="City / Town"    form={form} setForm={setForm} errors={errors} placeholder="Nairobi" half />
      <Sel k="country" label="Country" form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'Kenya', l: 'Kenya' }, { v: 'Uganda', l: 'Uganda' }, { v: 'Tanzania', l: 'Tanzania' }, { v: 'Rwanda', l: 'Rwanda' }, { v: 'Ethiopia', l: 'Ethiopia' }, { v: 'Other', l: 'Other' }]}
      />
    </div>
  );
}


function StepRole({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-5">
      <Sel k="role_name" label="System Role" form={form} setForm={setForm} errors={errors} half options={ROLE_OPTIONS} />
      <Inp k="job_title"  label="Job Title"  form={form} setForm={setForm} errors={errors} placeholder="e.g. HR Analyst" half />
      <Sel k="employment_type" label="Employment Type" form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'FULL_TIME', l: 'Full Time' }, { v: 'PART_TIME', l: 'Part Time' }, { v: 'CONTRACT', l: 'Contract' }, { v: 'INTERN', l: 'Intern' }]}
      />
      <Sel k="work_location" label="Work Location" form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'ON_SITE', l: 'On-site' }, { v: 'REMOTE', l: 'Remote' }, { v: 'HYBRID', l: 'Hybrid' }]}
      />
      <Inp k="department"   label="Department"  form={form} setForm={setForm} errors={errors} placeholder="e.g. Human Resources" half />
      <Inp k="date_of_hire" label="Date of Hire" type="date" form={form} setForm={setForm} errors={errors} half />
    </div>
  );
}
const ALLOWANCE_TYPES = [
  'Housing',
  'Transport',
  'Medical',
  'Meal',
  'Communication',
  'Commuter',
  'Uniform',
  'Shift',
  'Performance Bonus',
  'Other',
];
 
// ─── AllowanceBuilder ─────────────────────────────────────────────────────────
function AllowanceBuilder({ form, setForm }) {
  const allowances = form.allowances && typeof form.allowances === 'object'
    ? form.allowances
    : {};
 
  // Local row state: [{ key, value }]
  const [rows, setRows] = useState(
    Object.keys(allowances).length > 0
      ? Object.entries(allowances).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: '', value: '' }]
  );
  const [customKey, setCustomKey] = useState({}); // tracks which rows are using "Other"
 
  // Sync rows → form.allowances (as object)
  const sync = (updated) => {
    setRows(updated);
    const obj = {};
    updated.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) {
        obj[key.trim()] = value.trim();
      }
    });
    setForm(f => ({ ...f, allowances: obj }));
  };
 
  const addRow = () => sync([...rows, { key: '', value: '' }]);
 
  const removeRow = (i) => {
    if (rows.length === 1) {
      sync([{ key: '', value: '' }]);
      return;
    }
    const updated = rows.filter((_, idx) => idx !== i);
    sync(updated);
    setCustomKey(prev => {
      const next = { ...prev };
      delete next[i];
      return next;
    });
  };
 
  const updateKey = (i, val) => {
    const updated = rows.map((r, idx) => idx === i ? { ...r, key: val === 'Other' ? '' : val } : r);
    if (val === 'Other') setCustomKey(prev => ({ ...prev, [i]: true }));
    else setCustomKey(prev => { const n = { ...prev }; delete n[i]; return n; });
    sync(updated);
  };
 
  const updateCustomKey = (i, val) => {
    const updated = rows.map((r, idx) => idx === i ? { ...r, key: val } : r);
    sync(updated);
  };
 
  const updateValue = (i, val) => {
    const updated = rows.map((r, idx) => idx === i ? { ...r, value: val } : r);
    sync(updated);
  };
 
  const total = Object.values(allowances)
    .map(v => parseFloat(v) || 0)
    .reduce((a, b) => a + b, 0);
 
  return (
    <div className="col-span-2 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>Allowances</Label>
        {total > 0 && (
          <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
            Total: {form.currency || 'KES'} {total.toLocaleString()}
          </span>
        )}
      </div>
 
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-2 items-center">
            {/* Key — dropdown or custom input */}
            {customKey[i] ? (
              <input
                autoFocus
                placeholder="Custom allowance…"
                value={row.key}
                onChange={e => updateCustomKey(i, e.target.value)}
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors"
              />
            ) : (
              <select
                value={row.key || ''}
                onChange={e => updateKey(i, e.target.value)}
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-white transition-colors cursor-pointer"
              >
                <option value="" className="bg-neutral-900">Select type…</option>
                {ALLOWANCE_TYPES.map(t => (
                  <option key={t} value={t} className="bg-neutral-900">{t}</option>
                ))}
              </select>
            )}
 
            {/* Value — amount */}
            <div className="relative w-40 flex-shrink-0">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600 text-xs font-mono pointer-events-none">
                {form.currency || 'KES'}
              </span>
              <input
                type="number"
                placeholder="0"
                value={row.value}
                onChange={e => updateValue(i, e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder-neutral-600 outline-none focus:border-white transition-colors text-right font-mono"
              />
            </div>
 
            {/* Remove */}
            <button
              onClick={() => removeRow(i)}
              className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg border border-neutral-800 text-neutral-600 hover:border-red-500/50 hover:text-red-400 transition-colors text-base leading-none"
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>
 
      {/* Add row */}
      <button
        onClick={addRow}
        className="flex items-center gap-2 text-xs text-neutral-600 hover:text-neutral-300 transition-colors w-fit mt-1"
      >
        <span className="w-5 h-5 rounded border border-dashed border-neutral-700 flex items-center justify-center text-base leading-none hover:border-neutral-500">+</span>
        Add allowance
      </button>
 
      {/* Live preview chips */}
      {Object.keys(allowances).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {Object.entries(allowances).map(([k, v]) => (
            <span key={k} className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1 text-[11px] text-neutral-400">
              <span className="text-neutral-500">{k}</span>
              <span className="text-neutral-700">·</span>
              <span className="font-mono text-neutral-300">{parseFloat(v).toLocaleString()}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StepSalary({ form, setForm, errors }) {
  return (
    <div className="grid grid-cols-2 gap-5">
 
      {/* Salary + currency */}
      <FieldWrap label="Basic Salary" error={errors.salary} half>
        <div className="flex gap-2">
          <select
            value={form.currency}
            onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
            className="bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-white transition-colors w-20 flex-shrink-0 cursor-pointer"
          >
            {['KES', 'USD', 'GBP', 'EUR'].map(c => (
              <option key={c} value={c} className="bg-neutral-900">{c}</option>
            ))}
          </select>
          <input
            type="number"
            placeholder="0.00"
            value={form.salary}
            onChange={e => setForm(f => ({ ...f, salary: e.target.value }))}
            className={`${inputCls(errors.salary)} flex-1 font-mono`}
          />
        </div>
      </FieldWrap>
 
      <Sel
        k="pay_frequency" label="Pay Frequency"
        form={form} setForm={setForm} errors={errors} half
        options={[
          { v: 'MONTHLY',   l: 'Monthly'   },
          { v: 'BI_WEEKLY', l: 'Bi-weekly' },
          { v: 'WEEKLY',    l: 'Weekly'    },
          { v: 'DAILY',     l: 'Daily'     },
        ]}
      />
 
      {/* Allowance builder — spans full width */}
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
    <div className="grid grid-cols-2 gap-5">
      <Inp k="contact_name" label="Contact Full Name" form={form} setForm={setForm} errors={errors} placeholder="James Wanjiku"   half />
      <Sel k="relationship" label="Relationship"      form={form} setForm={setForm} errors={errors} half
        options={[{ v: 'SPOUSE', l: 'Spouse' }, { v: 'PARENT', l: 'Parent' }, { v: 'SIBLING', l: 'Sibling' }, { v: 'CHILD', l: 'Child' }, { v: 'FRIEND', l: 'Friend' }, { v: 'OTHER', l: 'Other' }]}
      />
      <Inp k="emergency_contact" label="Phone Number"      form={form} setForm={setForm} errors={errors} placeholder="+254 722 987 654"  half />
      <Inp k="emergency_email"   label="Email (optional)"  form={form} setForm={setForm} errors={errors} placeholder="james@example.com" type="email" half />
    </div>
  );
}

// ─── Success info row ─────────────────────────────────────────────────────────
function InfoRow({ label, value, mono, red }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-neutral-800 last:border-0">
      <span className="text-neutral-500 text-sm">{label}</span>
      <span className={`text-sm font-semibold ${red ? 'text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded' : 'text-white'} ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CreateEmployeeModal({ onClose, onCreated }) {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState(null);
  const [size, setSize]         = useState('md');

  const goNext = () => {
    const errs = validateStep(step, form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStep(s => s + 1);
  };

  const goBack = () => { setErrors({}); setStep(s => s - 1); };

  const autofill = () => {
    setForm(DEV_FILL);
    setErrors({});
  };

const handleSubmit = async () => {
  setLoading(true);
  setApiError('');
  try {
    const { profile_picture, profile_preview, ...rest } = form;
    const res = await handleCreateEmployee(rest);
    console.log(res)

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Server returned status ${res.status} with no valid JSON body`);
    }

    if (res.data.status === 201) {
      setSuccess(data);
    } else {
      setApiError(data?.error || data?.detail || `Unexpected error (${res.status})`);
    }
  } catch (err) {
    setApiError(err.message || 'Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};

  const { w, h } = SIZES[size];
  const pct = Math.round((step / (STEPS.length - 1)) * 100);
  const isLast = step === STEPS.length - 1;

  // ── Success ─────────────────────────────────────────────────────────────────
  if (success) {
    return (
      <Backdrop onClose={onClose}>
        <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl w-full ${w} overflow-hidden shadow-2xl`}>
          <div className="flex flex-col items-center text-center p-10">
            <div className="w-16 h-16 rounded-full border border-neutral-700 flex items-center justify-center text-white text-2xl mb-5">✓</div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
              Employee Onboarded
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-sm">
              Account is live. Share the temporary credentials securely with the new employee.
            </p>
            <div className="w-full max-w-sm bg-black border border-neutral-800 rounded-xl px-5 py-2 mb-8 text-left">
              <InfoRow label="Employee ID"    value={success.employee_id} mono />
              <InfoRow label="Role"           value={success.role} />
              <InfoRow label="Temp Password"  value={success.temporary_password} mono red />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setSuccess(null); setForm(INITIAL_FORM); setStep(0); }}
                className="px-5 py-2.5 rounded-lg border border-neutral-700 text-neutral-400 text-sm font-medium hover:border-neutral-500 hover:text-white transition-colors"
              >
                Add Another
              </button>
              <button
                onClick={onCreated}
                className="px-5 py-2.5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Backdrop>
    );
  }

  return (
    <Backdrop onClose={onClose}>
      <div className={`bg-neutral-950 border border-neutral-800 rounded-2xl w-full ${w} ${h} flex flex-col shadow-2xl overflow-hidden`}>

        {/* ── Top bar: size controls + dev autofill ── */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800/60 bg-black/30">
          {/* Size switcher */}
          <div className="flex items-center gap-1">
            <span className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest mr-2">Size</span>
            {Object.entries(SIZES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setSize(key)}
                className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors
                  ${size === key ? 'bg-white text-black' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Dev autofill */}
          <button
            onClick={autofill}
            className="flex items-center gap-1.5 px-3 py-1 rounded border border-dashed border-neutral-700 text-neutral-500 text-[10px] font-bold uppercase tracking-wider hover:border-yellow-500/60 hover:text-yellow-500 transition-colors"
            title="Fill all fields with test data (dev only)"
          >
            <span>⚡</span> Dev Autofill
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 min-h-0">

          {/* ── Left sidebar ── */}
          <div className="w-52 flex-shrink-0 border-r border-neutral-800 flex flex-col">
            {/* Header */}
            <div className="px-5 py-5 border-b border-neutral-800">
              <p className="text-white text-sm font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>New Employee</p>
              <p className="text-neutral-600 text-[11px] mt-0.5">Step {step + 1} of {STEPS.length}</p>
              <div className="mt-3 h-0.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Step list */}
            <div className="flex-1 py-3">
              {STEPS.map((s, i) => {
                const done   = i < step;
                const active = i === step;
                return (
                  <button
                    key={s.id}
                    onClick={() => { if (done) { setErrors({}); setStep(i); } }}
                    className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-all
                      ${active ? 'bg-white/5 border-l-2 border-white' : 'border-l-2 border-transparent'}
                      ${done ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs transition-all
                      ${done   ? 'bg-white text-black font-bold'
                      : active ? 'border border-white text-white'
                                : 'border border-neutral-800 text-neutral-700'}`}
                    >
                      {done ? '✓' : s.icon}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold transition-colors ${active ? 'text-white' : done ? 'text-neutral-400' : 'text-neutral-700'}`}>
                        {s.label}
                      </p>
                      <p className="text-neutral-700 text-[10px]">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Mini preview card */}
            <div className="px-4 py-4 border-t border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex-shrink-0 border border-neutral-700 overflow-hidden flex items-center justify-center bg-neutral-900 text-white text-xs font-bold">
                  {form.profile_preview
                    ? <img src={form.profile_preview} alt="" className="w-full h-full object-cover" />
                    : (form.first_name?.[0] ?? '?').toUpperCase()
                  }
                </div>
                <div className="min-w-0">
                  <p className="text-neutral-300 text-xs font-medium truncate">
                    {form.first_name || form.last_name ? `${form.first_name} ${form.last_name}`.trim() : 'Name not set'}
                  </p>
                  <p className="text-neutral-700 text-[10px] truncate">{form.job_title || 'Role not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right content ── */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Step header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-neutral-800">
              <div>
                <h2 className="text-white text-base font-bold" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {STEPS[step].icon}&nbsp;&nbsp;{STEPS[step].label}
                </h2>
                <p className="text-neutral-600 text-xs mt-0.5">{STEPS[step].desc}</p>
              </div>
              <button onClick={onClose} className="text-neutral-700 hover:text-white text-xl transition-colors leading-none p-1">×</button>
            </div>

            {/* Form scroll area */}
            <div key={step} className="flex-1 overflow-y-auto px-7 py-6 scroll-smooth">
              {apiError && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 mb-5 text-red-400 text-sm">
                  {apiError}
                </div>
              )}
              {step === 0 && <StepProfile   form={form} setForm={setForm} errors={errors} />}
              {step === 1 && <StepPersonal  form={form} setForm={setForm} errors={errors} />}
              {step === 2 && <StepRole      form={form} setForm={setForm} errors={errors} />}
              {step === 3 && <StepSalary    form={form} setForm={setForm} errors={errors} />}
              {step === 4 && <StepEmergency form={form} setForm={setForm} errors={errors} />}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-7 py-4 border-t border-neutral-800 bg-black/20">
              <button
                onClick={goBack}
                disabled={step === 0}
                className="px-4 py-2 rounded-lg border border-neutral-800 text-neutral-500 text-sm font-medium hover:border-neutral-600 hover:text-neutral-300 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
              <span className="text-neutral-700 text-xs">{step + 1} / {STEPS.length}</span>
              {isLast ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating…' : 'Create Employee ✓'}
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="px-5 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                  Continue →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

// ─── Backdrop ─────────────────────────────────────────────────────────────────
function Backdrop({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap');`}</style>
      {children}
    </div>
  );
}