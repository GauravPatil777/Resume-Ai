import { RouterProvider } from "react-router"
import { router } from './app.routes';
import { InterviewProvider } from "./features/interview/interview.context.jsx"
function App() {

  return (
   
      < InterviewProvider>
        <RouterProvider router={router} />
      </ InterviewProvider>

  )
}

export default App
