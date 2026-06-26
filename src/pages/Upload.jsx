import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, storage } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Navbar from "../components/Navbar";
import FileUploader from "../components/FileUploader";
import { convertPdfToImage } from "../lib/pdf2img";
import { analyzeResume } from "../lib/analyzeResume";

// Simple unique ID generator
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export default function Upload() {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please upload a CV");

    setIsProcessing(true);

    try {
      // 1. Convert PDF to image
      setStatusText("Converting CV to image...");
      const { file: imageFile, error: imgError } =
        await convertPdfToImage(file);
      if (imgError) throw new Error(imgError);

      // 2. Upload original PDF to Firebase Storage
      setStatusText("Uploading your CV...");
      const pdfRef = ref(storage, `resumes/${user.uid}/${file.name}`);
      await uploadBytes(pdfRef, file);
      const pdfUrl = await getDownloadURL(pdfRef);

      // 3. Upload image to Firebase Storage
      setStatusText("Uploading preview image...");
      const imgRef = ref(storage, `previews/${user.uid}/${imageFile.name}`);
      await uploadBytes(imgRef, imageFile);
      const imageUrl = await getDownloadURL(imgRef);

      // 4. Analyze with Gemini AI
      setStatusText("Analyzing your CV with AI... (this may take a moment)");
      const { feedback, error: aiError } = await analyzeResume({
        file,
        jobTitle,
        jobDescription,
        companyName,
      });
      if (aiError) throw new Error(aiError);

      // 5. Save everything to Firestore
      setStatusText("Saving results...");
      const id = generateId();
      await setDoc(doc(db, "resumes", id), {
        id,
        userId: user.uid,
        companyName,
        jobTitle,
        jobDescription,
        pdfUrl,
        imageUrl,
        feedback,
        createdAt: new Date().toISOString(),
      });

      // 6. Go to results page
      navigate(`/results/${id}`);
    } catch (err) {
      setStatusText(`❌ Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Analyze Your CV
        </h1>
        <p className="text-gray-500 mb-8">
          Fill in the job details and upload your CV
        </p>

        {isProcessing ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-lg text-blue-600 font-medium">{statusText}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Google"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Job Title
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Frontend Developer"
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={5}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Upload CV
              </label>
              <FileUploader onFileSelect={setFile} />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Analyze My CV
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
