import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { signInWithGoogle } from "../lib/auth";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Automatically redirect authenticated users
  useEffect(() => {
    if (!loading && user) {
      navigate("/upload");
    }
  }, [loading, user, navigate]);

  const handleGetStarted = async () => {
    try {
      // Already logged in
      if (user) {
        navigate("/upload");
        return;
      }

      const { error } = await signInWithGoogle();

      if (error) {
        console.error("Google Sign-In Error:", error.message);
      }

      // No navigate() here.
      // Supabase redirects to Google and comes back automatically.
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
        }}
      >
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      }}
    >
      <Navbar />

      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center px-4">
        <div
          className="mb-6 px-4 py-2 rounded-full text-sm font-semibold"
          style={{
            background: "rgba(255,255,255,0.1)",
            color: "#a78bfa",
            border: "1px solid rgba(167,139,250,0.3)",
          }}
        >
          ✨ AI-Powered Resume Analysis
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Land Your{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dream Job
          </span>
        </h1>

        <p
          className="text-lg md:text-xl mb-10 max-w-2xl"
          style={{ color: "rgba(255,255,255,0.65)" }}
        >
          Upload your CV and get instant AI feedback, ATS score, keyword
          matches, and tailored improvement tips — all in seconds.
        </p>

        <button
          onClick={handleGetStarted}
          className="px-10 py-4 rounded-2xl text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #ec4899)",
            boxShadow: "0 0 40px rgba(124,58,237,0.4)",
          }}
        >
          {user ? "Continue to Upload →" : "Analyze My CV for Free →"}
        </button>

        <div className="flex gap-8 mt-16 flex-wrap justify-center">
          {[
            { value: "98%", label: "Accuracy Rate" },
            { value: "10s", label: "Analysis Time" },
            { value: "Free", label: "No Credit Card" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p
                className="text-sm mt-1"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full px-4">
          {[
            {
              icon: "🎯",
              title: "ATS Score",
              desc: "Know exactly how recruiters' systems rate your CV",
            },
            {
              icon: "🔑",
              title: "Keyword Match",
              desc: "See which job keywords you're missing or nailing",
            },
            {
              icon: "💡",
              title: "Smart Tips",
              desc: "Get personalized suggestions to improve your CV",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-6 text-left transition-all duration-300 hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>

              <h3 className="text-white font-bold text-lg mb-2">
                {card.title}
              </h3>

              <p
                className="text-sm"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
