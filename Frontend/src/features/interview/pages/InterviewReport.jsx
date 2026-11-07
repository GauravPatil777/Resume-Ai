import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";
import { generateTailoredResume } from "../services/interview.api";
import {
  Brain,
  Code2,
  MessageSquare,
  Target,
  BookOpen,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";


const InterviewReport = () => {

  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("overview");

  const {
    report,
    jobDescription,
    personalInfo,
    resumeFile,
  } = useContext(InterviewContext);

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

        <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">

          <Brain size={45} className="text-blue-600 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-gray-900">
            No Interview Report Found
          </h2>

          <p className="text-gray-500 mt-3">
            Please generate your interview report first.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>

        </div>

      </div>
    );
  }



  const [generatingResume, setGeneratingResume] = useState(false);

  const handleGenerateTailoredResume = async () => {
    try {
      setGeneratingResume(true);
      let blob;

      if (localStorage.getItem("tailoredResume")) {

        const base64 = localStorage.getItem("tailoredResume");

        const response = await fetch(
          `data:application/pdf;base64,${base64}`
        );

        blob = await response.blob();

      } else {

        blob = await generateTailoredResume({
          jobDescription,
          personalInfo,
          resumeFile
        });

        // Convert Blob to Base64
        const reader = new FileReader();

        const base64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => {
            resolve(reader.result.split(",")[1]);
          };

          reader.onerror = reject;

          reader.readAsDataURL(blob);
        });

        localStorage.setItem("tailoredResume", base64);
      }



      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "tailored_resume.pdf";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    }
    catch (error) {
      console.error("Resume generation failed:", error);
      alert("Unable to generate tailored resume.");
    }
    finally {
      setGeneratingResume(false);
    }
  };

  const score = report.matchedScore;

  const scoreStatus =
    score >= 80
      ? {
        color: "text-green-600",
        message: "Excellent match for this role",
        bg: "bg-green-50",
      }
      : score >= 60
        ? {
          color: "text-blue-600",
          message: "Good match for this role",
          bg: "bg-blue-50",
        }
        : score >= 40
          ? {
            color: "text-yellow-600",
            message: "Moderate match – some skills need improvement",
            bg: "bg-yellow-50",
          }
          : {
            color: "text-red-600",
            message: "Low match – significant preparation needed",
            bg: "bg-red-50",
          };

  const {
    technicalQuestions = {},
    behavioralQuestions = {},
    skillGap = {},
    preparationPlan = {},
  } = report;


  // NAVIGATION SECTIONS

  const navigation = [

    {
      id: "overview",
      title: "Overview",
      icon: LayoutDashboard,
    },

    {
      id: "technical",
      title: "Technical Questions",
      icon: Code2,
      count: Object.keys(technicalQuestions).length,
    },

    {
      id: "behavioral",
      title: "Behavioral Questions",
      icon: MessageSquare,
      count: Object.keys(behavioralQuestions).length,
    },

    {
      id: "skills",
      title: "Skill Gap Analysis",
      icon: Target,
      count: Object.keys(skillGap).length,
    },

    {
      id: "roadmap",
      title: "Preparation Roadmap",
      icon: BookOpen,
      count: Object.keys(preparationPlan).length,
    },

  ];


  // SUMMARY CARDS

  const metrics = [

    {
      title: "Technical Questions",
      count: Object.keys(technicalQuestions).length,
      icon: Code2,
      color: "text-blue-600",
      bg: "bg-blue-100",
      section: "technical",
    },

    {
      title: "Behavioral Questions",
      count: Object.keys(behavioralQuestions).length,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100",
      section: "behavioral",
    },

    {
      title: "Identified Skill Gaps",
      count: Object.keys(skillGap).length,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-100",
      section: "skills",
    },

    {
      title: "Preparation Tasks",
      count: Object.keys(preparationPlan).length,
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-100",
      section: "roadmap",
    },

  ];


  return (

    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-10">

      {/* HEADER */}

      <header className="max-w-7xl mx-auto mb-10">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
              <Brain size={30} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 text-left">
                Resume <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-sm text-gray-500">Your AI Career Assistant</p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft size={17} />
            Back to Home
          </button>

        </div>

      </header>

      <div className="max-w-7xl mx-auto">


        {/* PAGE TITLE */}

        <div className="display flex justify-between m-5 ">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-bold tracking-widest">
              <Sparkles size={15} />
              AI GENERATED REPORT
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
              Your Interview Preparation Report
            </h1>

            <p className="text-gray-500 mt-3">
              Personalized interview questions, skill analysis and preparation roadmap.
            </p>
          </div>



          <div className={`${scoreStatus.bg} shadow rounded-xl p-6 text-center m-2`}>
            <p className="text-xl font-bold text-gray-900 mb-2">
              Match Score
            </p>

            <div className={`text-4xl font-bold ${scoreStatus.color}`}>
              {score}%
            </div>

            <p className={`text-sm mt-2 font-medium ${scoreStatus.color}`}>
              {scoreStatus.message}
            </p>
          </div>

        </div>

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateTailoredResume}
            disabled={generatingResume}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white
             hover:bg-blue-700 disabled:opacity-50"
          >
            {generatingResume
              ? "Generating Resume..."
              : "Generate Tailored Resume"}
          </button>
        </div>
        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          {metrics.map((item, index) => {

            const Icon = item.icon;

            return (

              <button
                key={index}
                onClick={() => {
                  setActiveSection(item.section);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 text-left hover:shadow-md hover:border-blue-300 transition"
              >

                <div className="flex justify-between items-center">

                  <div className={`w-11 h-11 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <Icon size={22} className={item.color} />
                  </div>

                  <ChevronRight size={18} className="text-gray-400" />

                </div>

                <h2 className="text-3xl font-bold text-gray-900 mt-4">
                  {item.count}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {item.title}
                </p>

                <p className="text-xs text-blue-600 mt-3 font-medium">
                  View Details →
                </p>

              </button>

            );

          })}

        </div>


        {/* MAIN CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">


          {/* SIDEBAR */}

          <aside className="bg-white border border-gray-200 rounded-xl p-5 h-fit shadow-sm lg:sticky lg:top-6">

            <h3 className="text-xs font-bold text-gray-400 tracking-widest mb-5 px-3">
              REPORT SECTIONS
            </h3>

            <div className="space-y-2">

              {navigation.map((item) => {

                const Icon = item.icon;
                const active = activeSection === item.id;

                return (

                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-3 rounded-lg text-sm transition ${active
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                  >

                    <div className="flex items-center gap-3">

                      <Icon size={18} />

                      <span className="font-medium">
                        {item.title}
                      </span>

                    </div>

                    {item.count !== undefined && (

                      <span className={`text-xs px-2 py-1 rounded-md ${active
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-500"
                        }`}>
                        {item.count}
                      </span>

                    )}

                  </button>

                );

              })}

            </div>


            {/* TIP CARD */}

            <div className="mt-8 bg-blue-50 rounded-xl p-4">

              <Sparkles size={20} className="text-blue-600 mb-3" />

              <h4 className="font-semibold text-sm text-blue-900">
                Preparation Tip
              </h4>

              <p className="text-xs text-blue-700 leading-6 mt-2">
                Focus on understanding concepts and explaining your projects
                clearly instead of memorizing answers.
              </p>

            </div>

          </aside>


          {/* DYNAMIC CONTENT */}

          <main className="min-w-0">


            {/* OVERVIEW */}

            {activeSection === "overview" && (

              <div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-7 md:p-9 mb-6">

                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold">
                    <Sparkles size={16} />
                    PERSONALIZED AI ANALYSIS
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mt-4">
                    Your Interview Strategy is Ready!
                  </h2>

                  <p className="text-gray-600 mt-3 leading-7">
                    Your profile has been analyzed against the target
                    job requirements. Explore your interview questions,
                    identified skill gaps, and preparation roadmap.
                  </p>

                  <button
                    onClick={() => setActiveSection("technical")}
                    className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                  >
                    Start Preparation
                    <ChevronRight size={17} />
                  </button>

                </div>


                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">

                  <h3 className="font-bold text-lg text-gray-900 mb-5">
                    Preparation Summary
                  </h3>

                  <div className="space-y-3">

                    {navigation.slice(1).map((item) => {

                      const Icon = item.icon;

                      return (

                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition text-left"
                        >

                          <div className="flex items-center gap-3">

                            <Icon size={20} className="text-blue-600" />

                            <span className="text-sm font-medium text-gray-700">
                              {item.title}
                            </span>

                          </div>

                          <div className="flex items-center gap-3">

                            <span className="text-xs text-gray-500">
                              {item.count} items
                            </span>

                            <ChevronRight size={17} className="text-gray-400" />

                          </div>

                        </button>

                      );

                    })}

                  </div>

                </div>

              </div>

            )}


            {/* TECHNICAL QUESTIONS */}

            {activeSection === "technical" && (

              <ReportSection
                title="Technical Interview Questions"
                subtitle="Prepare for technical discussions based on your target role."
                icon={<Code2 size={22} />}
              >

                <QuestionList questions={technicalQuestions} />

              </ReportSection>

            )}


            {/* BEHAVIORAL QUESTIONS */}

            {activeSection === "behavioral" && (

              <ReportSection
                title="Behavioral Interview Questions"
                subtitle="Prepare for HR rounds and situational interview discussions."
                icon={<MessageSquare size={22} />}
              >

                <QuestionList questions={behavioralQuestions} />

              </ReportSection>

            )}


            {/* SKILL GAP */}

            {activeSection === "skills" && (

              <ReportSection
                title="Skill Gap Analysis"
                subtitle="Identify the skills that need additional preparation."
                icon={<Target size={22} />}
              >

                {Object.keys(skillGap).length > 0 ? (

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {Object.entries(skillGap).map(([skill, severity]) => (

                      <div
                        key={skill}
                        className="bg-white border border-gray-200 rounded-xl p-5 flex justify-between items-center shadow-sm"
                      >

                        <div className="flex items-center gap-3">

                          <AlertTriangle size={19} className="text-orange-500" />

                          <h3 className="font-semibold text-gray-800 text-sm">
                            {skill}
                          </h3>

                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityStyle(severity)}`}>
                          {String(severity)}
                        </span>

                      </div>

                    ))}

                  </div>

                ) : <EmptyState />}

              </ReportSection>

            )}


            {/* PREPARATION ROADMAP */}

            {activeSection === "roadmap" && (

              <ReportSection
                title="Preparation Roadmap"
                subtitle="Follow these recommended steps to improve your interview readiness."
                icon={<BookOpen size={22} />}
              >

                {Object.keys(preparationPlan).length > 0 ? (

                  <div className="space-y-4">

                    {Object.entries(preparationPlan).map(([skill, plan], index) => (

                      <div
                        key={skill}
                        className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
                      >

                        <div className="flex items-center gap-3 mb-4">

                          <span className="bg-blue-100 text-blue-600 rounded-lg w-10 h-10 flex items-center justify-center font-bold">
                            {index + 1}
                          </span>

                          <h3 className="font-semibold text-gray-900">
                            {skill}
                          </h3>

                        </div>

                        <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
                          {typeof plan === "string"
                            ? plan
                            : JSON.stringify(plan, null, 2)}
                        </p>

                      </div>

                    ))}

                  </div>

                ) : <EmptyState />}

              </ReportSection>

            )}

          </main>

        </div>


        {/* FOOTER */}

        <footer className="text-center text-sm text-gray-400 mt-12">
          © 2026 Resume AI • AI-Powered Interview Preparation
        </footer>

      </div>

    </div >

  );

};


// REUSABLE COMPONENTS


const ReportSection = ({ title, subtitle, icon, children }) => (

  <section>

    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-6">

      <div className="flex items-center gap-4">

        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
          {icon}
        </div>

        <div>

          <h2 className="text-xl font-bold text-gray-900">
            {title}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>

        </div>

      </div>

    </div>

    {children}

  </section>

);


const QuestionList = ({ questions }) => {

  const [expanded, setExpanded] = useState(null);

  if (Object.keys(questions).length === 0) {
    return <EmptyState />;
  }

  return (

    <div className="space-y-4">

      {Object.entries(questions).map(([question, answer], index) => {

        const isOpen = expanded === index;

        return (

          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
          >

            <button
              onClick={() => setExpanded(isOpen ? null : index)}
              className="w-full p-5 flex items-center justify-between gap-4 text-left"
            >

              <div className="flex items-start gap-4">

                <span className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold shrink-0">
                  Q{index + 1}
                </span>

                <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-7">
                  {question}
                </h3>

              </div>

              <ChevronRight
                size={20}
                className={`text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""
                  }`}
              />

            </button>


            {isOpen && (

              <div className="px-5 pb-5">

                <div className="bg-blue-50 rounded-lg p-5">

                  <div className="flex items-center gap-2 mb-3">

                    <Sparkles size={15} className="text-blue-600" />

                    <span className="text-xs font-bold text-blue-600 tracking-wider">
                      SUGGESTED ANSWER
                    </span>

                  </div>

                  <p className="text-sm text-gray-700 leading-7 whitespace-pre-line">
                    {typeof answer === "string"
                      ? answer
                      : JSON.stringify(answer, null, 2)}
                  </p>

                </div>

              </div>

            )}

          </div>

        );

      })}

    </div>

  );

};


const EmptyState = () => (

  <div className="bg-white border border-dashed border-gray-300 rounded-xl p-10 text-center">

    <ClipboardList size={35} className="text-gray-400 mx-auto mb-4" />

    <h3 className="font-semibold text-gray-700">
      No Information Available
    </h3>

    <p className="text-sm text-gray-400 mt-2">
      No generated information is available in this section.
    </p>

  </div>

);


const getSeverityStyle = (severity) => {

  switch (String(severity).toLowerCase()) {

    case "high":
      return "bg-red-100 text-red-700";

    case "medium":
      return "bg-yellow-100 text-yellow-700";

    case "low":
      return "bg-green-100 text-green-700";

    default:
      return "bg-gray-100 text-gray-700";

  }

};


export default InterviewReport;
