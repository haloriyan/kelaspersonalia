import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import AdminMiddleware from "../Middleware/Admin";
import Logout from "./Logout";

import Course from "./Master/Course";
import CourseCreate from "./Master/CourseCreate";
import CourseDetail from "./Master/CourseDetail";
import CourseMaterial from "./Master/Course/Material";
import CourseParticipant from "./Master/Course/Participant";
import CourseMedia from "./Master/Course/Media";
import CourseSettings from "./Master/Course/Settings";

import Category from "./Master/Category";
import Coupon from "./Master/Coupon";
import Peserta from "./Master/Peserta";

const AdminRouter = () => {
    return (
        <Routes>
            <Route path="/admin/login" Component={Login} />
            <Route path="/admin/logout" Component={Logout} />
            
            <Route path="/admin/dashboard" element={<AdminMiddleware><Dashboard /></AdminMiddleware>} />
            <Route path="/admin/master/course" element={<AdminMiddleware><Course /></AdminMiddleware>} />
            <Route path="/admin/master/course/create" element={<AdminMiddleware><CourseCreate /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/detail" element={<AdminMiddleware><CourseDetail /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/materi" element={<AdminMiddleware><CourseMaterial /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/peserta" element={<AdminMiddleware><CourseParticipant /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/media" element={<AdminMiddleware><CourseMedia /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/settings" element={<AdminMiddleware><CourseSettings /></AdminMiddleware>} />
            
            <Route path="/admin/master/category" element={<AdminMiddleware><Category /></AdminMiddleware>} />
            
            <Route path="/admin/master/coupon" element={<AdminMiddleware><Coupon /></AdminMiddleware>} />
            <Route path="/admin/master/peserta" element={<AdminMiddleware><Peserta /></AdminMiddleware>} />
        </Routes>
    )
}

export default AdminRouter;