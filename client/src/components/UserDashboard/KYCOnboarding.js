import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowRight, ArrowLeft, User, FileText } from 'lucide-react';
import { handleKycUpload } from './Helper';
import { useNavigate } from 'react-router-dom';

const KYCOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedDocs, setUploadedDocs] = useState({});
  
  const [formData, setFormData] = useState({
    id_no: '',
    kin_name: '',
    kin_contact: '',
    occupation: '',
    dob: '',
    address: ''
  });
  const navigate = useNavigate()

  const documentTypes = [
    { key: 'NATIONAL_ID', label: 'National ID', required: true },
    { key: 'PASSPORT', label: 'Passport Photo', required: true },
    { key: 'PROOF_OF_RESIDENCE', label: 'Proof of Residence', required: false },
    { key: 'EMPLOYMENT_LETTER', label: 'Employment Letter', required: false }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (docType, file) => {
    if (file) {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, [docType]: 'File size exceeds 5MB limit' }));
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, [docType]: 'Invalid file type. Use PDF, JPG, PNG, DOC, or DOCX' }));
        return;
      }

      setUploadedDocs(prev => ({ ...prev, [docType]: file }));
      setErrors(prev => ({ ...prev, [docType]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.id_no.trim()) newErrors.id_no = 'National ID is required';
    if (!formData.kin_name.trim()) newErrors.kin_name = 'Next of kin name is required';
    if (!formData.kin_contact.trim()) newErrors.kin_contact = 'Next of kin contact is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    const requiredDocs = documentTypes.filter(doc => doc.required);
    
    requiredDocs.forEach(doc => {
      if (!uploadedDocs[doc.key]) {
        newErrors[doc.key] = `${doc.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const documentTypesList = [];
      const documentFilesList = [];

      Object.entries(uploadedDocs).forEach(([docType, file]) => {
        documentTypesList.push(docType);
        documentFilesList.push(file);
      });

      documentTypesList.forEach(type => formDataToSend.append('document_types', type));
      documentFilesList.forEach(file => formDataToSend.append('documents', file));

      const token = localStorage.getItem('user');
      const response = await handleKycUpload(
        formDataToSend
      )

      const data = await response.json();
      
      console.log(data)

      if (response.data.status === 200) {
        alert('KYC submitted successfully! Your documents are under review.');
        navigate('/user/dashboard/')
      } else {
        setErrors({ submit: data.error || 'Submission failed' });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const removeDocument = (docType) => {
    setUploadedDocs(prev => {
      const updated = { ...prev };
      delete updated[docType];
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2].map(step => (
              <div key={step} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle size={20} /> : step}
                </div>
                {step < 2 && (
                  <div className={`flex-1 h-1 mx-4 ${
                    currentStep > step ? 'bg-indigo-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-gray-700">Personal Info</span>
            <span className="text-sm font-medium text-gray-700">Documents</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <User className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                  <p className="text-gray-600">Please provide your personal details</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    National ID Number *
                  </label>
                  <input
                    type="text"
                    name="id_no"
                    value={formData.id_no}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your national ID number"
                  />
                  {errors.id_no && <p className="mt-1 text-sm text-red-600">{errors.id_no}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Name *
                  </label>
                  <input
                    type="text"
                    name="kin_name"
                    value={formData.kin_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Full name"
                  />
                  {errors.kin_name && <p className="mt-1 text-sm text-red-600">{errors.kin_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Next of Kin Contact *
                  </label>
                  <input
                    type="tel"
                    name="kin_contact"
                    value={formData.kin_contact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="+254..."
                  />
                  {errors.kin_contact && <p className="mt-1 text-sm text-red-600">{errors.kin_contact}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation *
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Your occupation"
                  />
                  {errors.occupation && <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your physical address"
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <FileText className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upload Documents</h2>
                  <p className="text-gray-600">Please upload the required documents (max 5MB each)</p>
                </div>
              </div>

              <div className="space-y-4">
                {documentTypes.map(doc => (
                  <div key={doc.key} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        {doc.label} {doc.required && <span className="text-red-500">*</span>}
                      </label>
                      {uploadedDocs[doc.key] && (
                        <button
                          type="button"
                          onClick={() => removeDocument(doc.key)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    {!uploadedDocs[doc.key] ? (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <Upload className="text-gray-400 mb-2" size={32} />
                        <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                        <span className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, DOC (max 5MB)</span>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileChange(doc.key, e.target.files[0])}
                        />
                      </label>
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="text-green-600" size={20} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{uploadedDocs[doc.key].name}</p>
                          <p className="text-xs text-gray-500">
                            {(uploadedDocs[doc.key].size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    )}

                    {errors[doc.key] && (
                      <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                        <AlertCircle size={16} />
                        {errors[doc.key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
                  <AlertCircle className="text-red-600" size={20} />
                  <p className="text-sm text-red-800">{errors.submit}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit KYC'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Important Information</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>All documents must be clear and readable</li>
                <li>Maximum file size per document is 5MB</li>
                <li>Your information will be reviewed within 24-48 hours</li>
                <li>You'll receive an email notification once verified</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCOnboarding;