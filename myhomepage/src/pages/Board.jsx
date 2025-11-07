// 전체 게시판
// 1. const Board = () => () -> 소괄호를 중괄호로 변경
// 2. useEffect 이용해서 8085/api/board/all 데이터 가져오기 (axios.get 이용)
// 3. const [boards, setBoards] = useState([]); 로 받고
//    boards 에 백엔드에서 가져온 데이터 추가
// 4.
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Board = () => {
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:8085/api/board/all")
            .then(res => {
                console.log("boards: ", boards);  // res.data 백엔드에서 가져온 데이터를 boards 에 넣어주기 전 이므로,
                                                  // 데이터 length가 0인 상태가 맞음
                console.log("백엔드에서 가져온 데이터: ", res.data)
                console.log("빅엔드에서 가온 데이터를 boards에 저장: ", setBoards(res.data))
                setBoards(res.data);  // boards 변수명에 데이터 저장기능 실행
                console.log("setBoard 이후 boards: ", boards);
            })
            .catch(err => alert("백엔드에서 데이터를 불러오지 못했습니다."))  // {} 생략
    }, []);

    const handleIdClick = (id) => {
        navigate(`/board/${id}`);
    }

    return (
        <div className="page-container">
            <div className="board-header">
                <h1>게시판</h1>
                <button className="button">
                    글쓰기
                </button>
            </div>

            <div className="board-info">
                <p>전체 게시물: {boards.length}개</p>
            </div>

            <table className="board-table">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                </tr>
                </thead>
                <tbody>
                {/*
                    content:"nice to meet you"
                    createdAt: "2025-11-07 11:53:11"
                    id: 11
                    popularUpdateAt: null
                    ranking: null
                    title: "hello"
                    updatedAt: "2025-11-07 11:53:11"
                    viewCount: 0
                    writer: "user1"
                */}
                {boards.map((b) => (
                    <tr>
                        <th onClick={() => handleIdClick(b.id)}>{b.id}</th>
                        <th>{b.title}</th>
                        <th>{b.writer}</th>
                        <th>{b.viewCount}</th>
                        <th>{b.createdAt}</th> {/* 2025-11-07 11:53:11 -> 2025-11-07 */}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Board;