import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FileUpload({ onUploadStart, onUploadSuccess, onUploadError, isUploading }) {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isUploading
  });

  const handleUpload = async () => {
    if (!file) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      onUploadError('Please login to upload documents');
      navigate('/login');
      return;
    }
    
    onUploadStart();
    setUploadProgress(0);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:4000/api/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });
      
      // For demo purposes, we'll use a timeout to simulate processing time
      setTimeout(() => {
        const fileIdentifier = response?.data?.filename 
          || response?.data?.fileName 
          || response?.data?.storedFilename 
          || file.name;
        onUploadSuccess(fileIdentifier);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError('Failed to upload document. Please try again.');
    }
  };

  return (
    <div className="mb-5">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-3" 
            stroke="currentColor" 
            fill="none" 
            viewBox="0 0 48 48" 
            aria-hidden="true"
          >
            <path 
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
              strokeWidth={2} 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </svg>
          <p className="text-sm text-gray-600">
            {isDragActive 
              ? 'Drop the file here' 
              : 'Drag and drop your document here, or click to select a file'}
          </p>
          <p className="text-xs text-gray-500 mt-1">PDF, Word, or image files up to 10MB</p>
        </div>
      </div>
      
      {file && (
        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md mt-4">
          <div className="flex items-center">
            <svg className="h-6 w-6 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-sm font-medium text-gray-700 truncate max-w-xs">
              {file.name}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </span>
        </div>
      )}
      
      {isUploading ? (
        <div className="mt-4 space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 text-center">
            {uploadProgress < 100 
              ? `Uploading... ${uploadProgress}%` 
              : 'Processing document...'}
          </p>
        </div>
      ) : (
        <button
          onClick={handleUpload}
          disabled={!file}
          className={`w-full py-2 px-4 rounded-md text-white font-medium mt-4 ${
            file 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Upload and Analyze
        </button>
      )}
    </div>
  );
}

export default FileUpload;