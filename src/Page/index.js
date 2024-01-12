import UserMiddleware from "../Middleware/User";
import Login from "../partials/Login";
import Register from "../partials/Register";
import About from "./About";
import Auth from "./Auth";
import Category from "./Category";
import Contact from "./Contact";
import CourseForum from "./Course/Forum";
import Thread from "./Course/Thread";
import Enroll from "./Enroll";
import EnrollCourse from "./EnrollCourse";
import Error from "./Error";
import Exam from "./Exam";
import Home from "./Home";
import Learn from "./Learn";
import MyCourse from "./MyCourse";
import PdfViewer from "./PdfViewer";
import Privacy from "./Privacy";
import Profile from "./Profile";
import Search from "./Search";

const { Routes, Route } = require("react-router-dom")
const { default: Course } = require("./Course")

const PageRouter = () => {
    return (
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/pdf-view/:filename" Component={PdfViewer} />
            <Route path="/error/:code" Component={Error} />
            <Route path="/course/:id" Component={Course} />

            <Route path="/course/:id/forum" Component={CourseForum} />
            <Route path="/thread/:threadID" Component={Thread} />

            <Route path="/course/:courseID/enroll" Component={EnrollCourse} />
            <Route path="/category/:id" Component={Category} />
            <Route path="/search" Component={Search} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />

            <Route path="/auth/:action" Component={Auth} />

            <Route path="/my-course" element={<UserMiddleware><MyCourse /></UserMiddleware>} />
            <Route path="/profile" element={<UserMiddleware><Profile /></UserMiddleware>} />
            <Route path="/enroll/:enrollID" element={<UserMiddleware><Enroll /></UserMiddleware>} />
            <Route path="/enroll/:enrollID/learn/:modulID" element={<UserMiddleware><Learn /></UserMiddleware>} />
            <Route path="/exam/:enrollID" element={<UserMiddleware><Exam /></UserMiddleware>} />

            <Route path="/tentang"  Component={About} />
            <Route path="/hubungi-kami"  Component={Contact} />
            <Route path="/kebijakan"  Component={Privacy} />
        </Routes>
    )
}

export default PageRouter;