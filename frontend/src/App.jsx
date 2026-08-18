import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setComplaint, clearComplaint } from "./store/complaintSlice";
import ComplaintForm from "./components/ComplaintForm";
import CopilotPanel from "./components/CopilotPanel";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

function App() {
  const complaint = useSelector((state) => state.complaint);
  const dispatch = useDispatch();

  const [complaintText, setComplaintText] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "initial-assistant-msg",
      sender: "ai",
      text: "Upload a complaint document or paste text above. I will automatically extract the details and populate the form for you.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const hasExistingComplaint = Boolean(
    complaint.customer_name ||
    complaint.product_name ||
    complaint.batch_number ||
    complaint.complaint_description
  );

  const getTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // POST /complaint/upload (Document File Upload Workflow: PDF, DOCX, TXT, EML)
  const handleFileUpload = async (file) => {
    if (!file) return;

    // 1. Validate file size (10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const errorStr = `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed 10 MB limit.`;
      setErrorMessage(errorStr);
      const errorMsg = {
        id: `err-${Date.now()}`,
        type: "error",
        text: errorStr,
        details: "Please upload a document smaller than 10 MB.",
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    setSelectedFile({
      name: file.name,
      size: file.size,
      type: file.type,
    });
    setErrorMessage("");

    const time = getTimestamp();
    const userMsg = {
      id: `user-upload-${Date.now()}`,
      sender: "user",
      text: `Uploaded Document: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setProgress(15);

    // Progress tick interval
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + 25;
      });
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_BASE_URL}/complaint/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      clearInterval(progressInterval);
      setProgress(100);

      const extractedData = response.data;
      dispatch(setComplaint(extractedData));

      const aiMsg = {
        id: `ai-upload-${Date.now()}`,
        sender: "ai",
        text: `Extracted complaint details from ${file.name} for ${
          extractedData.product_name || "product"
        } (Batch: ${extractedData.batch_number || "N/A"}). Severity assigned: ${
          extractedData.risk_assessment?.severity || "Standard"
        }. The read-only audit form has been updated automatically.`,
        extractedData: extractedData,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      clearInterval(progressInterval);
      setProgress(0);
      console.error("Document Upload Extraction Error:", error);

      const errorDetail =
        error.response?.data?.detail ||
        error.message ||
        "Backend server is unreachable";

      setErrorMessage(
        `Failed to process document '${file.name}': ${errorDetail}`
      );

      const errorMsg = {
        id: `err-${Date.now()}`,
        type: "error",
        text: `Error processing '${file.name}'.`,
        details: errorDetail,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 4000);
    }
  };

  // POST /complaint (Text Analysis)
  const analyzeComplaintText = async (textToAnalyze) => {
    const rawText = (textToAnalyze || complaintText).trim();
    if (!rawText || loading) return;

    const time = getTimestamp();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: rawText,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setProgress(15);
    setErrorMessage("");

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) return prev;
        return prev + 20;
      });
    }, 350);

    try {
      const response = await axios.post(`${API_BASE_URL}/complaint`, {
        complaint: rawText,
      });

      clearInterval(interval);
      setProgress(100);

      const extractedData = response.data;
      dispatch(setComplaint(extractedData));

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Extracted complaint details for ${
          extractedData.product_name || "product"
        } (Batch: ${extractedData.batch_number || "N/A"}). Severity: ${
          extractedData.risk_assessment?.severity || "Standard"
        }. Form populated successfully.`,
        extractedData: extractedData,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setComplaintText("");
    } catch (error) {
      clearInterval(interval);
      setProgress(0);
      console.error("Analysis Error:", error);
      const errorDetail =
        error.response?.data?.detail ||
        error.message ||
        "Backend server is unreachable";

      setErrorMessage(
        `Failed to connect to backend at ${API_BASE_URL}. Ensure FastAPI is running.`
      );

      const errorMsg = {
        id: `err-${Date.now()}`,
        type: "error",
        text: "Could not complete extraction. Connection to backend failed.",
        details: errorDetail,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 4000);
    }
  };

  // POST /complaint/edit (Correction / Triage Update)
  const editComplaint = async () => {
    if (!complaintText.trim() || loading) return;

    const correctionText = complaintText.trim();
    const time = getTimestamp();

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: `Correction: ${correctionText}`,
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setProgress(30);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_BASE_URL}/complaint/edit`, {
        current_data: complaint,
        correction: correctionText,
      });

      setProgress(100);
      const updatedData = response.data;
      dispatch(setComplaint(updatedData));

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: `Applied correction and updated audit record. Risk profile reassessed.`,
        extractedData: updatedData,
        timestamp: getTimestamp(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setComplaintText("");
    } catch (error) {
      console.error("Edit Error:", error);
      const errorDetail =
        error.response?.data?.detail ||
        error.message ||
        "Backend server is unreachable";

      setErrorMessage(
        `Failed to apply complaint correction. Check backend connectivity.`
      );

      const errorMsg = {
        id: `err-${Date.now()}`,
        type: "error",
        text: "Could not apply correction to existing complaint.",
        details: errorDetail,
        timestamp: getTimestamp(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 3000);
    }
  };

  const handleReset = () => {
    dispatch(clearComplaint());
    setSelectedFile(null);
    setComplaintText("");
    setProgress(0);
    setErrorMessage("");
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "ai",
        text: "Form reset. Upload a complaint document or paste text above to begin triage.",
        timestamp: getTimestamp(),
      },
    ]);
  };

  return (
    <div className="reference-app-root">
      <div className="reference-split-container">
        {/* LEFT PANEL: Log Customer Complaint */}
        <ComplaintForm
          complaint={complaint}
          onReset={handleReset}
        />

        {/* RIGHT PANEL: AI Complaint Intake Assistant */}
        <CopilotPanel
          messages={messages}
          complaintText={complaintText}
          setComplaintText={setComplaintText}
          loading={loading}
          progress={progress}
          onAnalyze={() => analyzeComplaintText()}
          onEdit={editComplaint}
          hasExistingComplaint={hasExistingComplaint}
          errorMessage={errorMessage}
          onDismissError={() => setErrorMessage("")}
          onFileUpload={handleFileUpload}
          selectedFile={selectedFile}
          onClearFile={() => setSelectedFile(null)}
        />
      </div>
    </div>
  );
}

export default App;