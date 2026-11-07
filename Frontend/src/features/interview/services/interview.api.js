import axios from "axios";

const API=axios.create({
   baseURL: import.meta.env.VITE_API_URL
});

export const generateReport = async ({jobDescription, personalInfo="", resumeFile=null}) => {

    try {

        const formData = new FormData();

        formData.append("role_description", jobDescription);

        if (personalInfo?.trim()) {
            formData.append("personal_info", personalInfo);
        }

        if (resumeFile) {
            formData.append("resume", resumeFile);
        }
       
        const response = await API.post(
            "/generate_interview_report",
            formData
        );
        localStorage.setItem("interviewReport", JSON.stringify(response.data));
        return response.data;

    } catch (error) {
        console.error("API Error:", error);
        console.log("Backend response:", error.response?.data);
        console.log("Status:", error.response?.status);

        throw error;
    }
};

export const generateTailoredResume = async ({jobDescription, personalInfo="", resumeFile=null}) => {
    try {

        const formData = new FormData();

        formData.append("role_description", jobDescription);

        if (personalInfo) {
            formData.append("personal_info", personalInfo);
        }

        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        const response = await API.post(
            "/generate_tailored_resume",
            formData,
            {
                responseType: "blob",
            }
        );
        return response.data;


    } catch (error) {
        console.error("Resume generation failed:", error);
        throw error;
    }
};


