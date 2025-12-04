import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {goToPage, renderLoading} from "../service/commonService";
import {fetchBoardDetail} from "../service/APIService";
import {render} from "@testing-library/react";

const BoardDetail = () => {
    const {id} = useParams(); //URL 에서 id 가져오기
    const navigate = useNavigate();
    const [board, setBoard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBoardDetail(axios, id, setBoard, navigate, setLoading);
    }, [id]);

    // 로딩중 일 때
    if (loading) return renderLoading("게시물을 불러오는 중");
    // 게시물을 찾을 수 없는 경우
    if (!board) {
        renderLoading("게시물을 찾을 수 없습니다.");
        goToPage(navigate, "/board");
    }

    // 1. 상세 이미지를 담을 배열 생성
    let 상세이미지들 = [];

    // 2. 상세 이미지가 존재한다면
    if(board.boardDetailImage) {
        // 3. String으로 받아온 상세이미지 URL들을 콤마(,) 기준으로 분리 -> 배열에 담기
        상세이미지들 = board.boardDetailImage.split(',');
    }

    return (
        <div className="page-container">
            <h1 className="board-detail-title">{board.title}</h1>
            <div className="board-detail-info">
                <span>작성자 : {board.writer}</span>
                <span>조회수 : {board.viewCount}</span>
                <span>작성일 : {board.createdAt}</span>
            </div>

            {/* 4. html에서 map으로 불러오기 */}
            {상세이미지들.map((이미지경로, 순번) => (
                <div key={순번}>
                    <img src={이미지경로} />
                </div>
            ))}

            <div className="board-detail-content">
                {board.content}
            </div>
            <button className="button" onClick={() => goToPage(navigate, '/board')}>
                목록으로
            </button>
        </div>
    );
};

export default BoardDetail;