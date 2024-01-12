import { Routes, Route, Navigate } from "react-router-dom";
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
import CourseExam from "./Master/Course/Exam";
import CourseSettings from "./Master/Course/Settings";

import Category from "./Master/Category";
import Coupon from "./Master/Coupon";
import Peserta from "./Master/Peserta";
import Enroll from "./Statistic/Enroll";
import CourseCertificate from "./Master/Course/Certificate";
import CourseEvent from "./Master/Course/Event";
import CoursePengajar from "./Master/Course/Pengajar";
import CourseModul from "./Master/Course/Modul";
import CourseBatch from "./Master/Course/Batch";
import Berita from "./Master/Berita";
import ExamAnswer from "./Master/Course/ExamAnswer";
import ContactMessage from "./ContactMessage";

const AdminRouter = () => {
    return (
        <Routes>
            <Route path="/admin" element={<Navigate to={'/admin/login'} />} />
            <Route path="/admin/login" Component={Login} />
            <Route path="/admin/logout" Component={Logout} />
            
            <Route path="/admin/dashboard" element={<AdminMiddleware><Dashboard /></AdminMiddleware>} />
            <Route path="/admin/master/course" element={<AdminMiddleware><Course /></AdminMiddleware>} />
            <Route path="/admin/master/course/create" element={<AdminMiddleware><CourseCreate /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/detail" element={<AdminMiddleware><CourseDetail /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/pengajar" element={<AdminMiddleware><CoursePengajar /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/materi" element={<AdminMiddleware><CourseMaterial /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/modul" element={<AdminMiddleware><CourseModul /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/batch" element={<AdminMiddleware><CourseBatch /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/peserta" element={<AdminMiddleware><CourseParticipant /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/media" element={<AdminMiddleware><CourseMedia /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/certificate" element={<AdminMiddleware><CourseCertificate /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/event" element={<AdminMiddleware><CourseEvent /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/settings" element={<AdminMiddleware><CourseSettings /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/exam" element={<AdminMiddleware><CourseExam /></AdminMiddleware>} />
            <Route path="/admin/master/course/:id/exam/answer" element={<AdminMiddleware><ExamAnswer /></AdminMiddleware>} />
            
            <Route path="/admin/master/category" element={<AdminMiddleware><Category /></AdminMiddleware>} />
            
            <Route path="/admin/master/coupon" element={<AdminMiddleware><Coupon /></AdminMiddleware>} />
            <Route path="/admin/master/peserta" element={<AdminMiddleware><Peserta /></AdminMiddleware>} />
            <Route path="/admin/master/berita" element={<AdminMiddleware><Berita /></AdminMiddleware>} />

            <Route path="/admin/statistic/enroll" element={<AdminMiddleware><Enroll /></AdminMiddleware>} />

            <Route path="/admin/contact-message" element={<AdminMiddleware><ContactMessage /></AdminMiddleware>} />
        </Routes>
    )
}

export default AdminRouter;