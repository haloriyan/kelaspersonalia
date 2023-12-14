import UserMiddleware from "../Middleware/User";
import Category from "./Category";
import EnrollCourse from "./EnrollCourse";
import Error from "./Error";
import Home from "./Home";
import Learn from "./Learn";
import MyCourse from "./MyCourse";

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
        </Routes>
    )
}

export default PageRouter;