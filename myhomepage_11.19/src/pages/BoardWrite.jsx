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

const BoardWrite = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    
    // 메인 이미지 관련
    const mainImgFileInputRef = useRef(null);
    const [uploadedMainBoardImageFile, setUploadedMainBoardImageFile] = useState(null);  // 실제 DB에 업로드하고, 파일 폴더에 저장할 이미지 파일
    const [boardMainImagePreview, setBoardMainImagePreview] = useState(null);  // 이미지 미리보기 URL

    // 상세 이미지 관련 (최대 5장)
    const 상세사진_새로고침해도_상태변화없도록_설정 = useRef(null);
    const [상세사진_이름들, set상세사진_이름들] = useState(null);
    const [상세사진들_미리보기, set상세사진들_미리보기] = useState([]);

    // js는 컴파일 형태가 아니기 때문에, 변수정의는 순차적으로 작업!!
    // user 를 먼저 호출하고 나서 user 관련된 데이터를 활용해야 함.

    // 상세 이미지 관련 (최대 5장)
    const [board, setBoard] = useState({
        title: '',
        content: '',
        writer: user?.memberEmail || '',
    });

    // 이미지 관련 상태
    // imageFile : 업로드할 이미지파일을 따로 저장
    // imageUrl  : 클라이언트가 input 창에 넣어준 데이터

    /**
     @board                상태 관리 변수, 기능 객체
                언제 사용하는가 : input, textarea 등에서 value={board.title} 형태로 화면에 표시할 때 사용
                업  데  이  트 : setBoard()를 통해 값 변경
                예         시 : 사용자가 제목을 입력하면 -> board.title 에 저장됨

     @boardUploadFormData   백엔드로 데이터를 전송하기 위한 특수 객체
                타         입 : 파일 업로드를 위한 HTML5 API
                언제 사용하는가 : axios.post() 로 서버에 데이터를 전송할 때 사용
                특         징 : JSON + 파일 데이터를 함께 전송 가능 (multipart/form-data)
                예         시 : 제목, 내용(JSON) + 이미지 파일을 한 번에 전송
     */
    const handleSubmit = async (e)  => {
        e.preventDefault(); //제출 일시 중지
        const boardUploadFormData = new FormData();  // 백엔드로 보낼 데이터 담을 board 생성

        const boardData = {
            title: board.title,
            content: board.content,
            writer: user?.memberEmail,
        };

        // 3. boardDataBlob
        const boardDataBlob = new Blob(
            [JSON.stringify(boardData)],
            {type:"application/json"}
        );

        // boardUploadFormData 에 board 데이터 추가
        boardUploadFormData.append("board", boardDataBlob);
        // 4. 이미지 파일이 있으면 board에 추가
        if(uploadedMainBoardImageFile) {
            boardUploadFormData.append("mainImage", uploadedMainBoardImageFile);  // 백엔드 Controller 파라미터와 이름 일치시킥4ㅣ
            // 여기의 imageFile 은 언제 상태변경이 이뤄지는거? -> commonService 의 handleChangeImage 에서 상태변경되어서 반환됨
            // => html에서 onChange(handleChangeImage(...))
        }
        // 상세 이미지들 추가
        if(상세사진_이름들 && 상세사진_이름들.length > 0) {
            // forEach 는 향상된 for문으로, 배열[]에서 한 장씩 꺼내어 추가.
            상세사진_이름들.forEach((사진한장씩) => {
                boardUploadFormData.append("detailImage", 사진한장씩);
            });
        }


        // 5. 백엔드 API 호출
        await boardSave(axios, boardUploadFormData, navigate);

    };

    const handleChange = (e) => {
        // const {name, value} = e.target;
        handleInputChange(e, setBoard);
    }

    // 상세 이미지 여러 장 변경 핸들러
    const handleDetailImagesChanges = (e) => {
        const files = Array.from(e.target.files);

        // 최대 5장 까지만 허용
        if(files.length > 5) {
            alert("상세 이미지는 최대 5장까지 업로드 가능합니닫.");
            return;
        }

        // 각 파일이 5MB가 넘는지 검증
        for(let f of files) {
            if(f.size > 5 * 1024 * 1024) {
                alert(`${f.name}의 크기가 5MB를 초과합니다.`);
                return;
            }

            if(!f.type.startsWith("image/")) {
                alert(`${f.name}은(는) 이미지 파일이 아닙니다.`);
                return;
            }
        }
        // for문을 통해 모든 사진에 대한 검증이 종료되면, 상세이미지 파일에 파일명칭 저장
        set상세사진_이름들(files);

        // 미리보기 생성
        const 미리보기할_상세사진들 = [];
        let 사진개수 = 0;

        files.forEach((file, 사진순서) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                미리보기할_상세사진들[사진순서] = reader.result;
                사진개수++;

                // 모든 파일 로드 완료 시
                if(사진개수 === files.length) {
                    // 미리보기 화면에서 보일 수 있도록 setter 를 이용하여 미리보기 변수에 저장
                    set상세사진들_미리보기(미리보기할_상세사진들);
                }
            };
            // 파일 하나씩 하나씩 미리보기 생성
            reader.readAsDataURL(file);
        })
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
                                   value={board.title}
                                   onChange={handleChange}
                                   placeholder="제목을 입력하세요."
                                   maxLength={200}
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
                                ref={mainImgFileInputRef}
                                onChange={handleChangeImage(setBoardMainImagePreview, setUploadedMainBoardImageFile, setBoard)}
                                accept="image/*"
                                style={{display: 'none'}}
                            />
                            <small className="form-hint">
                                &nbsp;게시물 이미지를 업로드 하세요. (최대 5MB, 이미지 파일만 가능)
                            </small>

                            {boardMainImagePreview && (
                                <div className="image-preview">
                                    <img
                                        src={boardMainImagePreview}
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

                        {/* 상세 이미지 여러 장 업로드 & 미리보기 */}
                        <div className="form-group">
                            <label htmlFor="detailImages" className="btn-upload">
                                상세 이미지 추가하기 (최대 5장)
                            </label>
                            <input type="file"
                                   id="detailImages"
                                   name="detailImages"
                                   ref={상세사진_새로고침해도_상태변화없도록_설정}
                                   onChange={handleDetailImagesChanges}
                                   accept="image/*"
                                   multiple
                                   style={{display: 'none'}}
                           />
                            <small className="form-hint">
                                &nbsp;상세 이미지를 업로드하세요. (최대 5개, 각5MB 이하)
                            </small>

                            {상세사진들_미리보기.length > 0 && (
                                <div className="multiple-images-preview">
                                    <p className="detail-images-selected-text">
                                        선택된 이미지: {상세사진들_미리보기.length}개
                                    </p>
                                    {상세사진들_미리보기.map((image, index) => (
                                        <div key={index} className="detail-image-item">
                                            <img src={image}
                                                 alt={`상세이미지 ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>

                            )}
                        </div>


                        <label>내용 :&nbsp;&nbsp;&nbsp;
                            <textarea
                                id="content"
                                name="content"
                                value={board.content}
                                onChange={handleChange}
                                placeholder="내용을 입력하세요."
                                rows={15}
                                required
                            />
                        </label>

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