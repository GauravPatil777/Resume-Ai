import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [report, setReport] = useState(()=>{
        const savedReport = localStorage.getItem("interviewReport");
        return savedReport ? JSON.parse(savedReport) : null;
    })
    const [jobDescription, setJobDescription] = useState("");
    const [personalInfo, setPersonalInfo] = useState("");
    const [resumeFile, setResumeFile] = useState(null);

    return (
        <InterviewContext.Provider value={{
            report,
            setReport,
            jobDescription,
            setJobDescription,
            personalInfo,
            setPersonalInfo,
            resumeFile,
            setResumeFile,
        }}>
            {children}
        </InterviewContext.Provider>
    )

}