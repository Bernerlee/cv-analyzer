import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import Navbar from "../components/Navbar";

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "resumes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading results...</div>;
  if (!data) return <div className="text-center py-20">Results not found.</div>;

  const { feedback, companyName, jobTitle, imageUrl } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your CV Analysis</h1>
          <p className="text-gray-500">{jobTitle} at {companyName}</p>
        </div>

        {/* CV Preview */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="CV Preview"
            className="w-full rounded-xl shadow mb-8 border"
          />
        )}

        {/* ATS Score */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
          <p className="text-gray-500 text-sm mb-1">ATS Score</p>
          <p className={`text-6xl font-bold ${feedback.atsScore >= 70 ? "text-green-500" : feedback.atsScore >= 40 ? "text-yellow-500" : "text-red-500"}`}>
            {feedback.atsScore}
            <span className="text-2xl text-gray-400">/100</span>
          </p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Summary</h2>
          <p className="text-gray-600">{feedback.summary}</p>
        </div>

        {/* Strengths */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-green-600 mb-3">✅ Strengths</h2>
          <ul className="flex flex-col gap-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-gray-600 flex gap-2">
                <span>•</span> {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-red-500 mb-3">🔧 Areas to Improve</h2>
          <ul className="flex flex-col gap-2">
            {feedback.improvements.map((item, i) => (
              <li key={i} className="text-gray-600 flex gap-2">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Keywords */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">🔑 Keywords</h2>
          <div className="mb-3">
            <p className="text-sm text-green-600 font-medium mb-2">Matched</p>
            <div className="flex flex-wrap gap-2">
              {feedback.keywords.matched.map((k, i) => (
                <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">{k}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-red-500 font-medium mb-2">Missing</p>
            <div className="flex flex-wrap gap-2">
              {feedback.keywords.missing.map((k, i) => (
                <span key={i} className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">{k}</span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/upload")}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          Analyze Another CV
        </button>
      </div>
    </div>
  );
}