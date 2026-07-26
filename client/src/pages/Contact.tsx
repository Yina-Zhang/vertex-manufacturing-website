import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, CheckCircle2, FileText } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Common countries for manufacturing clients
const COUNTRIES = [
  // North America & Oceania
  'Australia', 'Brazil', 'Canada', 'Chile', 'China',
  'Hong Kong', 'India', 'Indonesia', 'Israel', 'Japan',
  'Malaysia', 'Mexico', 'New Zealand', 'Philippines', 'Russia',
  'Saudi Arabia', 'Singapore', 'South Africa', 'South Korea',
  'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Arab Emirates',
  'United States', 'Vietnam',
  // Nordic
  'Iceland', 'Norway', 'Denmark', 'Sweden', 'Finland',
  // Western Europe
  'United Kingdom', 'France', 'Ireland', 'Belgium', 'Netherlands', 'Luxembourg',
  // Central Europe
  'Switzerland', 'Germany', 'Austria', 'Czech Republic', 'Slovakia', 'Poland', 'Liechtenstein',
  // Southern Europe
  'Spain', 'Portugal', 'Andorra', 'Italy', 'Vatican City', 'San Marino', 'Malta',
  'Croatia', 'Bosnia and Herzegovina', 'Slovenia', 'North Macedonia',
  'Serbia', 'Montenegro', 'Albania', 'Romania', 'Greece', 'Bulgaria', 'Hungary',
  'Other'
].sort((a, b) => a === 'Other' ? 1 : b === 'Other' ? -1 : a.localeCompare(b));

const PROCESS_TYPES = [
  '3D Printing',
  'CNC Machining',
  'Tooling & Molding',
  'Surface Finishing',
  'Assembly',
  'Other'
];

// Common email domains for autocomplete
const EMAIL_DOMAINS = [
  'gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com',
  'protonmail.com', 'me.com', 'live.com', 'msn.com', 'aol.com',
];

// Phone dial codes - sorted alphabetically by country name
const DIAL_CODES = [
  { code: '+355', country: 'Albania' },
  { code: '+376', country: 'Andorra' },
  { code: '+54',  country: 'Argentina' },
  { code: '+61',  country: 'Australia' },
  { code: '+43',  country: 'Austria' },
  { code: '+32',  country: 'Belgium' },
  { code: '+387', country: 'Bosnia and Herzegovina' },
  { code: '+55',  country: 'Brazil' },
  { code: '+1',   country: 'Canada' },
  { code: '+56',  country: 'Chile' },
  { code: '+86',  country: 'China' },
  { code: '+385', country: 'Croatia' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45',  country: 'Denmark' },
  { code: '+20',  country: 'Egypt' },
  { code: '+358', country: 'Finland' },
  { code: '+33',  country: 'France' },
  { code: '+49',  country: 'Germany' },
  { code: '+30',  country: 'Greece' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36',  country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+62',  country: 'Indonesia' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39',  country: 'Italy' },
  { code: '+81',  country: 'Japan' },
  { code: '+82',  country: 'South Korea' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+60',  country: 'Malaysia' },
  { code: '+356', country: 'Malta' },
  { code: '+52',  country: 'Mexico' },
  { code: '+382', country: 'Montenegro' },
  { code: '+31',  country: 'Netherlands' },
  { code: '+64',  country: 'New Zealand' },
  { code: '+389', country: 'North Macedonia' },
  { code: '+47',  country: 'Norway' },
  { code: '+92',  country: 'Pakistan' },
  { code: '+63',  country: 'Philippines' },
  { code: '+48',  country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+40',  country: 'Romania' },
  { code: '+7',   country: 'Russia' },
  { code: '+378', country: 'San Marino' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+381', country: 'Serbia' },
  { code: '+65',  country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+27',  country: 'South Africa' },
  { code: '+34',  country: 'Spain' },
  { code: '+94',  country: 'Sri Lanka' },
  { code: '+46',  country: 'Sweden' },
  { code: '+41',  country: 'Switzerland' },
  { code: '+886', country: 'Taiwan' },
  { code: '+66',  country: 'Thailand' },
  { code: '+90',  country: 'Turkey' },
  { code: '+380', country: 'Ukraine' },
  { code: '+971', country: 'United Arab Emirates' },
  { code: '+44',  country: 'United Kingdom' },
  { code: '+1',   country: 'United States' },
  { code: '+379', country: 'Vatican City' },
  { code: '+84',  country: 'Vietnam' },
].filter((v, i, arr) => arr.findIndex(x => x.country === v.country) === i); // deduplicate by country

// Upload status for each file
type UploadStatus = 'uploading' | 'done' | 'error';

interface UploadingFile {
  id: string;           // unique key per upload attempt
  name: string;
  size: number;
  progress: number;     // 0-100
  status: UploadStatus;
  errorMsg?: string;
  // filled when done
  url?: string;
  cacheKey?: string;
}

interface UploadedFile {
  name: string;
  url: string;
  size: number;
  cacheKey?: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  customerType?: string;
  country?: string;
  processType?: string;
}

/** Upload a single file via XHR so we get progress events. Returns storageUrl + cacheKey. */
function uploadFileWithProgress(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ storageUrl: string; originalName: string; cacheKey?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const fd = new FormData();
    fd.append('file', file, file.name);

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error('Invalid server response'));
        }
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          const err = JSON.parse(xhr.responseText);
          if (err?.error) msg = err.error;
        } catch { /* ignore */ }
        reject(new Error(msg));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    if (signal) {
      signal.addEventListener('abort', () => xhr.abort());
    }

    xhr.open('POST', '/api/upload');
    xhr.withCredentials = true;
    xhr.send(fd);
  });
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dialCode: '+1',
    phoneNumber: '',
    customerType: '',
    country: '',
    processType: '',
    description: '',
  });

  // Files that have finished uploading successfully
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  // Files currently being uploaded (shows progress bars)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const [dragActive, setDragActive] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touchedFields, setTouchedFields] = useState<string[]>([]);

  // Email autocomplete
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const emailRef = useRef<HTMLDivElement>(null);

  const submitMutation = trpc.contact.submit.useMutation();

  const isUploading = uploadingFiles.some(f => f.status === 'uploading');

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emailRef.current && !emailRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, email: value }));

    if (touchedFields.includes('email')) {
      const error = validateEmail(value);
      setFieldErrors(prev => ({ ...prev, email: error }));
    }

    // Build autocomplete suggestions
    const atIdx = value.indexOf('@');
    if (atIdx !== -1) {
      const typed = value.slice(atIdx + 1).toLowerCase();
      const local = value.slice(0, atIdx);
      if (local.length > 0) {
        const filtered = EMAIL_DOMAINS.filter(d => d.startsWith(typed) && d !== typed);
        if (filtered.length > 0) {
          setEmailSuggestions(filtered.map(d => `${local}@${d}`));
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const selectEmailSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, email: suggestion }));
    setShowSuggestions(false);
    setFieldErrors(prev => ({ ...prev, email: undefined }));
  };

  // Validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    return undefined;
  };

  const validateField = (fieldName: string, value: string): string | undefined => {
    switch (fieldName) {
      case 'name': return validateName(value);
      case 'email': return validateEmail(value);
      case 'customerType': return !value ? 'Please select a customer type' : undefined;
      case 'country': return !value ? 'Please select a country/region' : undefined;
      case 'processType': return !value ? 'Please select a process type' : undefined;
      default: return undefined;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Auto-match dial code when country changes
    if (name === 'country') {
      const matched = DIAL_CODES.find(d => d.country === value);
      if (matched) {
        setFormData(prev => ({ ...prev, country: value, dialCode: matched.code }));
      } else {
        setFormData(prev => ({ ...prev, country: value }));
      }
    } else if (name === 'dialCode') {
      // Auto-fill country when dial code changes
      // Only auto-fill if country is empty or was previously auto-matched
      const matched = DIAL_CODES.find(d => d.code === value);
      if (matched) {
        // Check if the matched country is in our COUNTRIES list
        const countryInList = COUNTRIES.includes(matched.country);
        setFormData(prev => ({
          ...prev,
          dialCode: value,
          // Only update country if it's in the list; skip ambiguous codes like +1 (US/Canada)
          ...(countryInList && value !== '+1' ? { country: matched.country } : {}),
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (touchedFields.includes(name)) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouchedFields(prev => prev.includes(name) ? prev : [...prev, name]);
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const handleFiles = async (files: FileList) => {
    const allowedExtensions = ['.step', '.stp', '.stl', '.pdf', '.dwg', '.zip'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isAllowed = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      if (!isAllowed) {
        alert(`File "${file.name}" is not supported.\nSupported formats: STEP, STP, STL, PDF, DWG, ZIP`);
        continue;
      }
      if (file.size > 200 * 1024 * 1024) {
        alert(`File "${file.name}" exceeds the 200MB limit.`);
        continue;
      }

      // Create a progress entry immediately
      const id = crypto.randomUUID();
      setUploadingFiles(prev => [...prev, {
        id,
        name: file.name,
        size: file.size,
        progress: 0,
        status: 'uploading',
      }]);

      // Upload with progress tracking
      uploadFileWithProgress(
        file,
        (pct) => {
          setUploadingFiles(prev =>
            prev.map(f => f.id === id ? { ...f, progress: pct } : f)
          );
        }
      ).then((result) => {
        // Move from uploading → uploaded
        setUploadingFiles(prev =>
          prev.map(f => f.id === id ? { ...f, progress: 100, status: 'done' } : f)
        );
        setUploadedFiles(prev => [...prev, {
          name: file.name,
          url: result.storageUrl,
          size: file.size,
          cacheKey: result.cacheKey,
        }]);
        // Remove the progress entry after a short delay so user sees 100%
        setTimeout(() => {
          setUploadingFiles(prev => prev.filter(f => f.id !== id));
        }, 1200);
      }).catch((err: Error) => {
        setUploadingFiles(prev =>
          prev.map(f => f.id === id ? { ...f, status: 'error', errorMsg: err.message } : f)
        );
      });
    }
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadingFile = (id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    const errors: FieldErrors = {};
    if (!formData.name) errors.name = 'Name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.customerType) errors.customerType = 'Please select a customer type';
    if (!formData.country) errors.country = 'Please select a country/region';
    if (!formData.processType) errors.processType = 'Please select a process type';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setTouchedFields(['name', 'email', 'customerType', 'country', 'processType']);
      setSubmitError('Please fill in all required fields.');
      return;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) { setFieldErrors({ email: emailError }); setSubmitError('Please fix the errors below.'); return; }

    setIsSubmitting(true);

    const fullPhone = formData.phoneNumber ? `${formData.dialCode} ${formData.phoneNumber}` : undefined;

    try {
      const result = await submitMutation.mutateAsync({
        name: formData.name,
        email: formData.email,
        phone: fullPhone,
        customerType: formData.customerType as 'Company' | 'Individual',
        country: formData.country,
        processType: formData.processType,
        description: formData.description || undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles.map(f => ({ name: f.name, url: f.url, cacheKey: f.cacheKey })) : undefined,
      });

      setSubmitMessage(result.message);
      setFormData({ name: '', email: '', dialCode: '+1', phoneNumber: '', customerType: '', country: '', processType: '', description: '' });
      setUploadedFiles([]);
      setUploadingFiles([]);
      setFieldErrors({});
      setTouchedFields([]);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('Failed to submit form. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field?: string) =>
    `w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 text-gray-900 ${
      field && fieldErrors[field as keyof FieldErrors] && touchedFields.includes(field)
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-vertex-copper'
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gray-50 py-14 md:py-20">
          <div className="container">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">Get in touch with our team</p>
          </div>
        </section>

        {/* Form Section */}
        <section className="py-10 md:py-20">
          <div className="container max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-7 md:space-y-8">
              {submitMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded text-green-800">{submitMessage}</div>
              )}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">{submitError}</div>
              )}

              {/* Name & Customer Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    YOUR NAME <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} onBlur={handleBlur}
                    placeholder="John Smith"
                    className={inputClass('name')}
                  />
                  {fieldErrors.name && touchedFields.includes('name') && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    CUSTOMER TYPE <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="customerType" value={formData.customerType}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass('customerType')}
                  >
                    <option value=""></option>
                    <option value="Company">Company</option>
                    <option value="Individual">Individual</option>
                  </select>
                  {fieldErrors.customerType && touchedFields.includes('customerType') && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.customerType}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div ref={emailRef} className="relative">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  EMAIL ADDRESS <span className="text-red-500">*</span>
                </label>
                <input
                  type="email" name="email" value={formData.email}
                  onChange={handleEmailChange} onBlur={handleBlur}
                  placeholder="john@company.com"
                  className={inputClass('email')}
                  autoComplete="off"
                />
                {fieldErrors.email && touchedFields.includes('email') && (
                  <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                )}
                {showSuggestions && emailSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-lg mt-1">
                    {emailSuggestions.map((s) => (
                      <li
                        key={s}
                        className="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 cursor-pointer"
                        onMouseDown={() => selectEmailSuggestion(s)}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">PHONE NUMBER</label>
                <div className="flex gap-3">
                  <select
                    name="dialCode" value={formData.dialCode}
                    onChange={handleChange}
                    className="px-3 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vertex-copper text-gray-900 w-28 flex-shrink-0"
                  >
                    {DIAL_CODES.map((d) => (
                      <option key={d.country} value={d.code}>{d.code}</option>
                    ))}
                  </select>
                  <input
                    type="tel" name="phoneNumber" value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vertex-copper text-gray-900"
                  />
                </div>
              </div>

              {/* Country & Process Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    COUNTRY / REGION <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country" value={formData.country}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass('country')}
                  >
                    <option value=""></option>
                    {COUNTRIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {fieldErrors.country && touchedFields.includes('country') && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.country}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    PROCESS TYPE <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="processType" value={formData.processType}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass('processType')}
                  >
                    <option value=""></option>
                    {PROCESS_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {fieldErrors.processType && touchedFields.includes('processType') && (
                    <p className="text-red-500 text-sm mt-1">{fieldErrors.processType}</p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">PROJECT DESCRIPTION</label>
                <textarea
                  name="description" value={formData.description}
                  onChange={handleChange} rows={6}
                  placeholder="Tell us about your project requirements..."
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-vertex-copper text-gray-900"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">UPLOAD PROJECT FILES</label>
                <label
                  onDragEnter={handleDrag} onDragLeave={handleDrag}
                  onDragOver={handleDrag} onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded cursor-pointer transition-colors ${
                    dragActive ? 'border-vertex-copper bg-amber-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-700 font-medium">Drag and drop your files here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">Supported formats: STEP, STP, STL, PDF, DWG, ZIP (Max 200MB each)</p>
                  <input type="file" multiple onChange={handleFileInput} className="hidden" />
                </label>

                {/* Files currently uploading (with progress bars) */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {uploadingFiles.map((f) => (
                      <div key={f.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                              <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                            {f.status === 'uploading' && (
                              <span className="text-xs text-gray-500 font-medium">{f.progress}%</span>
                            )}
                            {f.status === 'done' && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                            {f.status === 'error' && (
                              <button
                                type="button"
                                onClick={() => removeUploadingFile(f.id)}
                                className="text-gray-400 hover:text-red-500"
                                title="Dismiss"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Progress bar */}
                        {f.status === 'uploading' && (
                          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-vertex-copper h-1.5 rounded-full transition-all duration-200"
                              style={{ width: `${f.progress}%` }}
                            />
                          </div>
                        )}
                        {f.status === 'done' && (
                          <div className="w-full bg-green-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full w-full" />
                          </div>
                        )}
                        {f.status === 'error' && (
                          <p className="text-xs text-red-500 mt-1">{f.errorMsg || 'Upload failed. Please try again.'}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Successfully uploaded files */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB · Uploaded</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => removeUploadedFile(index)} className="text-gray-400 hover:text-red-500">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full bg-vertex-sky hover:bg-blue-600 disabled:bg-gray-400 text-gray-900 font-semibold py-3 px-6 rounded transition-colors"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </span>
                ) : isUploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading files...
                  </span>
                ) : 'Submit Request'}
              </button>

              <p className="text-sm text-gray-600 text-center">
                We treat your information confidentially and will only use it to respond to your inquiry.
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
