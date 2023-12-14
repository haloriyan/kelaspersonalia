import { Route, Routes } from "react-router-dom";
import Home from "./Home";

const prefix = "/influencer";

const InfluencerRouter = () => (
    <Routes>
        <Route path={`${prefix}/home`} Component={Home} />
    </Routes>
)

export default InfluencerRouter;