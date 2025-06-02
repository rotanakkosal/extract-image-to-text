"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Upload,
  FileText,
  Copy,
  Download,
  Trash2,
  Eye,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function ImageDropzoneUpload() {
  const inputRef = useRef();
  const textareaRef = useRef();

  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto"; // reset
    textarea.style.height = textarea.scrollHeight + "px";
  }, [result]);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  // Handle browse/select
  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // Display preview and store file
  function handleFile(file) {
    setFile(file);
    setResult(""); // Clear previous results
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }

  // Upload and get extracted text
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setResult("");
    const formData = new FormData();
    formData.append("file", file);

    let data;
    let text;
    try {
      const res = await fetch("/api/vision", {
        method: "POST",
        body: formData,
      });
      const raw = await res.text();
      try {
        data = JSON.parse(raw);
      } catch {
        setResult(`Server returned invalid JSON:\n${raw}`);
        setLoading(false);
        return;
      }
      text = data.text || data.error || "No text extracted.";
    } catch (err) {
      text = `Error: ${err.message}`;
    }
    setResult(text);
    setLoading(false);
  }

  // Copy text to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  // Download text as file
  const downloadText = () => {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `extracted-text-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const clearAll = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Text Extractor
          </h1>
        </div>

        {/* Row: Upload + Preview */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Upload Image */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-blue-600" />
                  Upload Image
                </h2>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 cursor-pointer group ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50 scale-105"
                      : "border-blue-300 hover:border-blue-400 hover:bg-blue-50/50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    ref={inputRef}
                    onChange={handleInputChange}
                  />
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      <span>Drag and drop your image here</span>
                    </h3>
                    <p className="text-blue-600 font-medium mb-2">
                      or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PNG, JPG, GIF, WebP up to 10MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Image Preview + Extract Btn */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden flex-1 flex flex-col justify-center items-center p-6">
              <div className="flex justify-between items-center w-full mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Eye className="mr-2 h-5 w-5 text-green-600" />
                  Image Preview
                </h3>
                {/* Clear button */}
                {file && (
                  <button
                    onClick={clearAll}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Clear all"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div className="relative rounded-xl overflow-hidden bg-gray-50 border-2 border-gray-200 w-full flex justify-center items-center min-h-[300px]">
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-300">
                    <Eye className="h-16 w-16 mb-4" />
                    <span className="text-lg">No image selected</span>
                  </div>
                )}
              </div>
              {/* {file && (
              <div className="bg-gray-50 rounded-lg p-3 border mt-4 w-full">
                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              </div>
            )} */}
              {/* Extract Text Button INSIDE Image Preview */}
              {file && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="mt-6 w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Extracting Text...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-5 w-5" />
                      <span>Extract Text from Image</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Extracted Text spans the full width below */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden w-full">
            <div className="p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-purple-600" />
                  Extracted Text
                </h3>
                {result && (
                  <div className="flex space-x-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative"
                      title="Copy to clipboard"
                    >
                      {copySuccess ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      onClick={downloadText}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Download as text file"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 min-h-0">
                {result ? (
                  <div className="h-full flex flex-col">
                    <div className="flex-1 min-h-0">
                      <textarea
                        ref={textareaRef}
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 leading-relaxed text-sm transition-all duration-200"
                        style={{ overflow: "hidden", minHeight: "120px" }}
                        placeholder="Extracted text will appear here..."
                      />
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                      <span>{result.length} characters</span>
                      <span>{result.split("\n").length} lines</span>
                    </div>
                    {copySuccess && (
                      <div className="mt-2 flex items-center text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span>Copied to clipboard!</span>
                      </div>
                    )}
                  </div>
                ) : loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 text-blue-600 animate-spin" />
                      <p className="text-lg font-medium text-gray-700">
                        Processing Image...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-center">
                    <div className="text-gray-400">
                      <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">
                        No text extracted yet
                      </p>
                      <p className="text-sm mt-2">
                        Upload an image and click "Extract Text" to see results
                        here
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
