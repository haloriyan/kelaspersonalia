import UserMiddleware from "../Middleware/User";
import Category from "./Category";
import EnrollCourse from "./EnrollCourse";
import Error from "./Error";
import Exam from "./Exam";
import Home from "./Home";
import Learn from "./Learn";
import MyCourse from "./MyCourse";
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

            <Route path="/my-course" element={<UserMiddleware><MyCourse /></UserMiddleware>} />
            <Route path="/learn/:enrollID" element={<UserMiddleware><Learn /></UserMiddleware>} />
            <Route path="/exam/:enrollID" element={<UserMiddleware><Exam /></UserMiddleware>} />
            <Route path="/search/" element={<UserMiddleware><Search /></UserMiddleware>} />
        </Routes>
    )
}

export default PageRouter;