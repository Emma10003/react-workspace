import { useEffect, useState } from "react";
import axios from "axios";

const PopularBoards = () => {
    const API_BASE_URL = "http://localhost:8080";
    const [popBoards, setPopBoards] = useState([]);

    useEffect(() => {
        // axios.get 을 이용해서 인기 게시물 데이터 가져오기
        const response = axios
            .get(`${API_BASE_URL}/api/board/popular`)
            .then((response) => {
                setPopBoards(response.data);
                console.log(response.data);
            })
            .catch((err) => {
                alert("데이터를 가져오는 중 문제가 발생했습니다.");
            });
    }, []);

    return (
        <div>
            <h2>인기 게시물</h2>
            <ul>
                {popBoards.map((p) => (
                    <li>
                        <strong>{p.title} </strong>(작성일자: {p.createdAt})<br />
                        조회수: {p.viewCount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PopularBoards;
