import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { InterviewContext } from "../interview.context";
import { generateReport } from "../services/interview.api";
import {
  Brain,
  Sparkles,
  Loader2,
  CheckCircle2,
  UploadCloud,
  FileText,
  AlertCircle,
} from "lucide-react";


const Home = () => {

  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const {
    setReport,
    jobDescription,
    setJobDescription,
    personalInfo,
    setPersonalInfo,
    resumeFile,
    setResumeFile,
  } = useContext(InterviewContext);

  const navigate = useNavigate();

  const loadingMessages = [
    "Analyzing job requirements...",
    "Understanding your professional profile...",
    "Identifying technical skill gaps...",
    "Generating interview questions...",
    "Creating your preparation roadmap...",
  ];

  // LOADING STAGES

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingStep((prev) =>
        prev < loadingMessages.length - 1 ? prev + 1 : prev
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [loading]);


  // GENERATE REPORT
  const handleGenerateReport = async () => {

    if (!jobDescription.trim()) {
      setError("Please enter the job description.");
      return;
    }

    if (!resumeFile && !personalInfo.trim()) {
      setError("Please upload a resume or enter your personal information.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await generateReport({
        jobDescription,
        personalInfo,
        resumeFile
      });

      setReport(response);

      navigate("/interviewReport");

    } catch (error) {

      console.error(error);

      setError(
        error.response?.data?.detail ||
        "Failed to generate interview report."
      );

    } finally {
      setLoading(false);
    }
  };

  // LOADING UI

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

        <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-8 md:p-10 text-center">

          {/* AI ICON */}

          <div className="relative w-20 h-20 mx-auto mb-6 ">

            <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>

            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>

            <div className="absolute inset-3 bg-blue-50 rounded-full flex items-center justify-center">
              <Brain size={35} className="text-blue-600" />
            </div>

            <Sparkles
              size={20}
              className="absolute -top-1 -right-1 text-yellow-500 animate-pulse"
            />

          </div>


          {/* HEADING */}

          <p className="text-xs font-bold tracking-widest text-blue-600">
            AI POWERED ANALYSIS
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-3">
            Building Your Interview Plan
          </h1>

          <p className="text-gray-500 text-sm mt-3 leading-6">
            Our AI is analyzing your job requirements and profile
            to create a personalized interview preparation strategy.
          </p>


          {/* PROGRESS BAR */}

          <div className="mt-9">

            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Generating your report</span>

              <span>
                {Math.round(((loadingStep + 1) / loadingMessages.length) * 100)}%
              </span>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">

              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-700"
                style={{
                  width: `${((loadingStep + 1) / loadingMessages.length) * 100}%`,
                }}
              />

            </div>

          </div>


          {/* LOADING STEPS */}

          <div className="mt-9 space-y-5 text-left">

            {loadingMessages.map((message, index) => {

              const completed = index < loadingStep;
              const active = index === loadingStep;

              return (

                <div key={index} className="flex items-center gap-4">

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${completed
                    ? "bg-green-100 text-green-600"
                    : active
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-400"
                    }`}>

                    {completed ? (
                      <CheckCircle2 size={17} />
                    ) : active ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <span className="text-xs font-semibold">
                        {index + 1}
                      </span>
                    )}

                  </div>

                  <span className={`text-sm ${completed
                    ? "text-green-600"
                    : active
                      ? "text-gray-900 font-semibold"
                      : "text-gray-400"
                    }`}>
                    {message}
                  </span>

                </div>

              );

            })}

          </div>


          <p className="text-xs text-gray-400 mt-9">
            This may take a few moments. Please don't refresh the page.
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-10">


      {/* HEADER */}


      <header className="text-center max-w-7xl mx-auto mb-10">

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white ">
            <Brain size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 text-left">
              Resume <span className="text-blue-600">AI</span>
            </h1>
            <p className="text-sm text-gray-500">Your AI Career Assistant</p>
          </div>
        </div>


        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-xs font-semibold mb-4">
          <Sparkles size={15} />
          AI POWERED INTERVIEW PREPARATION
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">

          Create Your Custom{" "}

          <span className="text-blue-600">
            Interview Plan
          </span>

        </h1>

        <p className="text-gray-600 mt-3">
          Let AI analyze the job requirements and your profile to build a
          winning interview strategy.
        </p>

      </header>


      {/* MAIN CARD */}

      <div className="max-w-6xl mx-auto bg-white
  shadow-[0_15px_35px_rgba(0,0,0,0.15)]
  border border-gray-100 rounded-2xl overflow-hidden">

        <div className="grid md:grid-cols-2">


          {/* JOB DESCRIPTION */}

          <div className="p-6 border-b md:border-b-0 md:border-r">

            <div className="flex items-center justify-between mb-3">

              <h2 className="font-bold text-lg">
                Target Job Description
              </h2>

              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                Required
              </span>

            </div>

            <textarea
              value={jobDescription}
              onChange={(e) => {
                setJobDescription(e.target.value);
                setError("");
              }
              }
              placeholder="Paste the job description here..."
              className="w-full h-64 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              maxLength={5000}
            />

            <div className="text-xs text-gray-400 mt-1">
              {jobDescription.length} / 5000 chars
            </div>

          </div>


          {/* PROFILE PANEL */}

          <div className="p-6">

            <h2 className="font-bold text-lg mb-4">
              Your Profile
            </h2>


            {/* RESUME UPLOAD */}

            <div className="mb-6">

              <label className="text-sm font-medium">
                Upload Resume

                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Best
                </span>

              </label>

              <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">

                <UploadCloud size={30} className="text-blue-500 mb-2" />
                {!resumeFile && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Click to Upload
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      PDF Only (Max 5MB)
                    </p>
                  </div>
                )}


                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(e) => {
                    setResumeFile(e.target.files?.[0] || null);
                  }}
                  className="hidden"
                />
                {resumeFile && (
                  <p className=" text-green-500 mt-2 font-bold">
                    {resumeFile.name}
                  </p>
                )}


              </label>

            </div>


            {/* OR */}

            <div className="flex items-center gap-3 mb-6">

              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-xs text-gray-400">OR</span>

              <div className="flex-1 h-px bg-gray-300"></div>

            </div>


            {/* PERSONAL INFORMATION */}

            <div className="mb-4">

              <label className="text-sm font-medium">
                Personal Information
              </label>

              <textarea
                value={personalInfo}
                onChange={(e) => {
                  setPersonalInfo(e.target.value);
                  setError("");
                }}
                className="w-full mt-2 border rounded-lg p-3 text-sm h-28 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder="Briefly describe your skills and experience..."
              />

            </div>


            {/* INFO BOX */}

            <div className="bg-blue-50 text-blue-700 text-xs p-3 rounded-lg flex gap-2">

              <FileText size={17} className="shrink-0" />

              <span>
                Either a <b>Resume</b> or a <b>Personal Information</b> is required
                to generate a personalized interview plan.
              </span>

            </div>

          </div>

        </div>


        {/* ERROR MESSAGE */}

        {error && (

          <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 flex items-center gap-2 text-sm">

            <AlertCircle size={18} />

            {error}

          </div>

        )}


        {/* FOOTER */}

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-4 border-t bg-gray-50">

          <span className="text-xs text-gray-500">
            AI-Powered Strategy Generation • ~30 seconds
          </span>

          <button
            onClick={() =>
             { localStorage.removeItem("tailoredResume");
              localStorage.removeItem("interviewReport");
              handleGenerateReport()}}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
          {loading ? "Generating..." : "Generate Interview Strategy"}
          <Sparkles size={16} />
        </button>

      </div>

    </div>


      {/* FOOTER */ }

  <footer className="text-center mt-12 text-sm text-gray-500 flex justify-center gap-6">

    <a href="#" className="hover:text-gray-800">
      Privacy Policy
    </a>

    <a href="#" className="hover:text-gray-800">
      Terms of Service
    </a>

    <a href="#" className="hover:text-gray-800">
      Help Center
    </a>

  </footer>

    </div >

  );

};

export default Home;
