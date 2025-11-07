import {Link, NavLink, Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import Board from "./pages/Board";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import Write from "./pages/Write";
import "./App.css";  // 단순히 가져와서 적용할 때는 from 생략 

function App() {

    return (
        <div className="App">
            {/* --- 5. 공통 내비게이션 바 --- */}
            <nav className="navbar">
                <Link to="/" className="logo">myhomepage</Link>
                <div className="nav-links">
                    <NavLink to="/">메인</NavLink>
                    <NavLink to="/board">게시판</NavLink>
                    <NavLink to="/write">글쓰기</NavLink>
                </div>

            </nav>

            {/* --- 6. 페이지가 렌더링될 영역 --- */}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/board" element={<Board />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<Mypage/>} />
                <Route path="/write" element={<Write/>} />
            </Routes>
        </div>
    );
}

export default App;
