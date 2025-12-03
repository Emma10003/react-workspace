// 글쓰기
import React, {useRef, useState} from "react";
import axios from "axios";
import {Form, NavLink, useNavigate} from "react-router-dom";
import {handleChangeImage, handleInputChange} from "../service/commonService";
import {boardSave} from "../service/APIService";
import {useAuth} from "../context/AuthContext";

/*
user?.memberEmail (삼항연산자의 줄임표현)
user 객체가 존재하면     user.memberEmail 을 반환
user 객체가 null 이면   에러 없이 undefined 반환

const email = user.memberEmail;
    => user 가 null 일 경우 error 발생
const email = user?.memberEmail;
    => user 가 null 일 경우 undefined 발생.

---------------------------------------------------
user?.memberEmail 은 아래 코드와 동일하게 작동.

user ? user.memberEmail : undefined;

또는

let email;
if (user) {
    email = user.memberEmail;
} else {
    email = undefined;
}
 */

/*
 TODO : 게시물 작성하기에서 게시물 관련 이미지 추가 넣기
 // 1. 게시물 작성할 때, 게시물 이미지 추가하기 와 같은 라벨 추가
 // 2. 라벨을 선택했을 때 이미지만 선택 가능하도록 input 설정
 // 3. input = display none
 // 4. 이미지 추가하기 클릭하면 새롭게 클릭된 이미지로 변경 (미리보기)


 // 등록하기 했을 경우에만 추가하기 가능!
 */

const BoardWrite = () => {


    // form 데이터 내부 초기값
    // 작성자 -> 나중에 로그인한 아이디로 박제 변경불가하게
    // react-router-dom 에 존재하는 path 주소 변경 기능 사용
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    const boardImgFileInputRef = useRef(null);

    // js는 컴파일 형태가 아니기 때문에, 변수정의는 순차적으로 작업!!
    // user 를 먼저 호출하고 나서 user 관련된 데이터를 활용해야 함.
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        writer: user?.memberName || '',
        imageUrl : ''
    });

    // 이미지 관련 상태
    // imageFile : 업로드할 이미지파일을 따로 저장
    // imageUrl  : 클라이언트가 input 창에 넣어준 데이터
    const [uploadedBoardImageFile, setUploadedBoardImageFile] = useState(null);  // 실제 DB에 업로드하고, 파일 폴더에 저장할 이미지 파일
    const [boardImagePreview, setBoardImagePreview] = useState(null);  // 이미지 미리보기 URL


    const handleSubmit = async (e)  => {
        e.preventDefault(); //제출 일시 중지

        try {
            const boardUploadFormData = new FormData();  // 백엔드로 보낼 데이터 담을 formData 생성

            // 1. imageUrl 을 제외한 나머지 데이터를 JSON 으로 변환
            const {imageUrl, ...boardDataWithoutImage} = formData;
            // 2. 게시물 작성자에 user 로 로그인했을 때 멤버 아이디 넣기
            boardDataWithoutImage.writer = user?.memberEmail;

            // 3. boardDataBlob
            const boardDataBlob = new Blob(
                [JSON.stringify(boardDataWithoutImage)],
                {type:"application/json"}
            );

            // formData 에 board 데이터 추가
            boardUploadFormData.append("board", boardDataBlob);
            // 4. 이미지 파일이 있으면 formData에 추가
            if(uploadedBoardImageFile) {
                boardUploadFormData.append("imageFile", uploadedBoardImageFile);
                // 여기의 imageFile 은 언제 상태변경이 이뤄지는거? -> commonService 의 handleChangeImage 에서 상태변경되어서 반환됨
                // => html에서 onChange(handleChangeImage(...))
            }

            // 5. 백엔드 API 호출
            boardSave(axios,
                {...formData, writer:user?.memberName},
                navigate);

        } catch (err) {
            alert("서버에 문제가 발생했습니다.");
        }

    };

    const handleChange = (e) => {
        // const {name, value} = e.target;
        handleInputChange(e, setFormData);
    }

    // ok를 할 경우 게시물 목록으로 돌려보내기   기능이 하나이기 때문에 if 다음 navigate 는 {} 생략 후 작성
    const handleCancel = () => {
        if (window.confirm("작성을 취소하시겠습니까?")) navigate('/board');
    }

    return (
        <div className="page-container">
            {isAuthenticated ? /* return 이 생략된 형태 */(
                <>
                    <h1>글쓰기</h1>
                    <form onSubmit={handleSubmit}>
                        {/*
                        로그인 상태에 따라 다른 메뉴 표시
                        formData.writer 에 user?.memberEmail 데이터를 전달하기
                        */}
                        <div className="writer-section">
                            <label>작성자 :</label>
                            <div className="writer-display">
                                <span className="writer-email">
                                    {user?.memberName}
                                </span>
                            </div>
                        </div>

                        <label>제목 :&nbsp;&nbsp;&nbsp;
                            <input type="text"
                                   id="title"
                                   name="title"
                                   value={formData.title}
                                   onChange={handleChange}
                                   placeholder="제목을 입력하세요."
                                   maxLength={200}
                                   required
                            />
                        </label>

                        <label>내용 :&nbsp;&nbsp;&nbsp;
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="내용을 입력하세요."
                                rows={15}
                                required
                            />
                        </label>

                        <div className="form-group">
                            <label htmlFor="imageUrl" className="btn-upload">
                                게시물 이미지 추가하기
                            </label>
                            <input
                                type="file"
                                id="imageUrl"
                                name="imageUrl"
                                ref={boardImgFileInputRef}
                                onChange={handleChangeImage(setBoardImagePreview, setUploadedBoardImageFile, setFormData)}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <small className="form-hint">
                                게시물 이미지를 업로드 하세요. (최대 5MB, 이미지 파일만 가능)
                            </small>

                            {boardImagePreview && (
                                <div className="image-preview">
                                    <img
                                        src={boardImagePreview}
                                        alt="미리보기"
                                        style={{
                                            maxWidth: '100%',
                                            maxHeight: '400px',
                                            marginTop: '10px',
                                            border: '1px solid #ddd',
                                            borderRadius: '5px',
                                            padding: '5px'
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div className="form-buttons">
                            <button type="submit"
                                    className="btn-submit">
                                작성하기
                            </button>

                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={handleCancel}
                            >
                                돌아가기
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                navigate('/login')  // 로그인하지 않으면 돌려보내기
            )}
        </div>
    )
};


// 소괄호 내에는 js 작성불가 단순 html 만 작성 가능        지양
const 소괄호 = (props) => (
    <div className="page-container">
        <h1>글쓰기</h1>
        {/*
        예외적으로 js가 필요할 경우
        html 내부에서 js 를 작성가능
        정말 급할 때 이외에는 추천하지 않는 방법
        Parent 에서 매개변수로 props 를 전달받고,
        전달받은 props 데이터 변수명칭을 단순히 사용하기만 할 때 사용
        */}
        <p>새 게시물 작성 폼</p>
        <p>{props}</p>
    </div>
);
// { 시작하고 return 전에 js 사용 가능 가장 많이 사용하는 형태
// {}
const 중괄호 = () => {
    // js 기능 작성 가능 하다
    return (
        <div className="page-container">
            <h1>글쓰기</h1>
            <p>새 게시물 작성 폼</p>
        </div>
    )

};
export default BoardWrite;