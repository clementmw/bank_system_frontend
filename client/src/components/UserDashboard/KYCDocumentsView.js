import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Eye,
  Calendar,
  User,
  Shield,
  RefreshCw,
  File,
  X
} from 'lucide-react';
import { getKycdata, handleKycDocumentUpdate } from './Helper';

const KYCDocumentsView = () => {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    fetchKYCData();
  }, []);

  const fetchKYCData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getKycdata();

      if (response.status === 200) {
        setKycData(response.data);
      } else {
        setError('Failed to fetch KYC data');
      }
    } catch (error) {
      console.error('Error fetching KYC data:', error);
      setError('Unable to load KYC documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setNewFile(file);
      setError('');
    }
  };

  const handleReupload = async () => {
    if (!newFile || !selectedDocument) return;

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const formData = new FormData();
      formData.append('document_upload', newFile);
      formData.append('document_type', selectedDocument.document_type);

      const response = await handleKycDocumentUpdate(selectedDocument.id, formData);

      if (response.status === 200) {
        setSuccess('Document updated successfully! It will be reviewed shortly.');
        setShowUploadModal(false);
        setNewFile(null);
        setSelectedDocument(null);
        fetchKYCData(); // Refresh the data
        
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError('Failed to update document. Please try again.');
      }
    } catch (error) {
      console.error('Error updating document:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const openReuploadModal = (document) => {
    setSelectedDocument(document);
    setShowUploadModal(true);
    setNewFile(null);
    setError('');
  };

  const getStatusConfig = (status) => {
    const configs = {
      APPROVED: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        label: 'Approved',
        iconColor: 'text-green-600'
      },
      PENDING: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        label: 'Pending Review',
        iconColor: 'text-yellow-600'
      },
      REJECTED: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        label: 'Rejected',
        iconColor: 'text-red-600'
      },
      EXPIRED: {
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: AlertCircle,
        label: 'Expired',
        iconColor: 'text-gray-600'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const getVerificationStatusConfig = (status) => {
    const configs = {
      APPROVED: {
        color: 'bg-green-50 border-green-200',
        textColor: 'text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-600',
        label: 'Verified'
      },
      PENDING: {
        color: 'bg-yellow-50 border-yellow-200',
        textColor: 'text-yellow-800',
        icon: Clock,
        iconColor: 'text-yellow-600',
        label: 'Pending Verification'
      },
      REJECTED: {
        color: 'bg-red-50 border-red-200',
        textColor: 'text-red-800',
        icon: XCircle,
        iconColor: 'text-red-600',
        label: 'Verification Failed'
      }
    };
    return configs[status] || configs.PENDING;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDocumentType = (type) => {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return '🖼️';
    } else if (extension === 'pdf') {
      return '📄';
    }
    return '📎';
  };

  const downloadDocument = (documentUrl, fileName) => {
    // Construct full URL (adjust based on your backend URL)
    const fullUrl = `http://localhost:8000${documentUrl}`;
    const link = document.createElement('a');
    link.href = fullUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KYC documents...</p>
        </div>
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
        <Shield className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No KYC Data Found</h3>
        <p className="text-gray-600 mb-4">Please complete your KYC onboarding first</p>
      </div>
    );
  }

  const verificationConfig = getVerificationStatusConfig(kycData.verification_status);
  const VerificationIcon = verificationConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">KYC Documents</h1>
          <p className="text-gray-600 mt-1">View and manage your verification documents</p>
        </div>
        <button
          onClick={fetchKYCData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Verification Status Card */}
      <div className={`border-2 rounded-2xl p-6 ${verificationConfig.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl bg-white`}>
              <VerificationIcon className={verificationConfig.iconColor} size={32} />
            </div>
            <div>
              <h2 className={`text-xl font-bold ${verificationConfig.textColor} mb-1`}>
                {verificationConfig.label}
              </h2>
              <p className="text-gray-700 mb-3">
                Your KYC verification is currently {kycData.verification_status.toLowerCase()}
              </p>
              
              {kycData.review_notes && (
                <div className="bg-white rounded-lg p-3 mt-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Review Notes:</p>
                  <p className="text-sm text-gray-600">{kycData.review_notes}</p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User size={16} />
                  <span className="font-medium">Name:</span>
                  <span>{kycData.user_full_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar size={16} />
                  <span className="font-medium">Submitted:</span>
                  <span>{new Date(kycData.created_at).toLocaleDateString()}</span>
                </div>
                {kycData.verified_at && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={16} />
                    <span className="font-medium">Verified:</span>
                    <span>{new Date(kycData.verified_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Uploaded Documents ({kycData.documents.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kycData.documents.map((document) => {
            const statusConfig = getStatusConfig(document.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={document.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Document Header */}
                <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-4xl">{getFileIcon(document.file_name)}</div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                      <StatusIcon size={12} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {formatDocumentType(document.document_type)}
                  </h3>
                </div>

                {/* Document Details */}
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <File size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500">File Name</p>
                        <p className="text-sm text-gray-900 truncate" title={document.file_name}>
                          {document.file_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">Uploaded</p>
                        <p className="text-sm text-gray-900">
                          {new Date(document.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-500">File Size</p>
                        <p className="text-sm text-gray-900">
                          {formatFileSize(document.file_size)}
                        </p>
                      </div>
                    </div>

                    {document.reviewed_at && (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Reviewed</p>
                          <p className="text-sm text-gray-900">
                            {new Date(document.reviewed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    )}

                    {document.rejection_reason && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-2">
                        <p className="text-xs font-medium text-red-800 mb-1">
                          Rejection Reason:
                        </p>
                        <p className="text-xs text-red-700">{document.rejection_reason}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => downloadDocument(document.document_upload, document.file_name)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Download size={16} />
                      Download
                    </button>
                    <button
                      onClick={() => openReuploadModal(document)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      <Upload size={16} />
                      Re-upload
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Re-upload Modal */}
      {showUploadModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                Re-upload Document
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewFile(null);
                  setSelectedDocument(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Document Type</p>
                <p className="font-semibold text-gray-900">
                  {formatDocumentType(selectedDocument.document_type)}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Current File</p>
                <p className="text-sm text-gray-900">{selectedDocument.file_name}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>

              {newFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    ✓ Selected: {newFile.name} ({formatFileSize(newFile.size)})
                  </p>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> The new document will be submitted for review. 
                  Your account status may change to pending until approved.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setNewFile(null);
                  setSelectedDocument(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReupload}
                disabled={!newFile || uploading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KYCDocumentsView;