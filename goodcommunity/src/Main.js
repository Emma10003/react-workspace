import {BrowserRouter, Routes, Route, Link, useNavigate, useParams} from 'react-router-dom';
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import UserProfile from "./components/pages/UserProfile";
import NotFound from "./components/pages/NotFound";
import {navStyles} from "./components/pages/styles";

function Main() {
    return(
        <BrowserRouter>
            <nav style={navStyles.nav}>
                <Link to="/" style={navStyles.link}>홈</Link>
                <Link to="/about" style={navStyles.link}>소개</Link>
                <Link to="/contact" style={navStyles.link}>연락처</Link>
                <Link to="/user/123"style={navStyles.link}>사용자 프로필</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/contact" element={<Contact/>}/>
                <Route path="/user/:userId" element={<UserProfile/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default Main;