import UserMiddleware from "../Middleware/User";
import Login from "../partials/Login";
import Register from "../partials/Register";
import Auth from "./Auth";
import Category from "./Category";
import EnrollCourse from "./EnrollCourse";
import Error from "./Error";
import Exam from "./Exam";
import Home from "./Home";
import Learn from "./Learn";
import MyCourse from "./MyCourse";
import Profile from "./Profile";
import Search from "./Search";

const { Routes, Route } = require("react-router-dom")
const { default: Course } = require("./Course")

const PageRouter = () => {
    return (
        <Routes>
            <Route path="/" Component={Home} />
            <Route path="/error/:code" Component={Error} />
            <Route path="/course/:id" Component={Course} />
            <Route path="/course/:courseID/enroll" Component={EnrollCourse} />
            <Route path="/category/:id" Component={Category} />
            <Route path="/search" Component={Search} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />

            <Route path="/auth/:action" Component={Auth} />

            <Route path="/my-course" element={<UserMiddleware><MyCourse /></UserMiddleware>} />
            <Route path="/profile" element={<UserMiddleware><Profile /></UserMiddleware>} />
            <Route path="/learn/:enrollID" element={<UserMiddleware><Learn /></UserMiddleware>} />
            <Route path="/exam/:enrollID" element={<UserMiddleware><Exam /></UserMiddleware>} />
        </Routes>
    )
}

export default PageRouter;