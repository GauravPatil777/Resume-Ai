import { createBrowserRouter, Navigate } from "react-router"
import Home from './features/interview/pages/Home';
import InterviewReport from "./features/interview/pages/InterviewReport";

export const router = createBrowserRouter([
     {
        path: "/",
        element:<Home/>
    },
     {
        path: "/interviewReport",
        element:<InterviewReport/>
    }
])