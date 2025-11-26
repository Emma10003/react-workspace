// 마이페이지
/*
1. 로그인 상태일 때만 접근 가능
2. 로그인 후, 유저 정보 <p> 태그로 가져오기
3. 수정하기 버튼 누르면 마이페이지 수정으로 이동하기 위해 수정 버튼만 만들기. (navigate 안함!)
*/

// default export = AuthContext
// 일반    export = {useAuth} 형태로 사용할 수 있다.
import AuthContext, {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {renderLoading} from "../context/scripts";

const MyPage = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated, loading} = useAuth();

    // 로그인 상태 확인 후 navigate 를 이용해서 /login 으로 보내기
    // 방법 1) useEffect 활용해서 로그인 상태가 아닐 경우 navigate("/login") 처리
    useEffect(() => {
        // 로딩 상태가 종료되었고, 백엔드에서 로그인한 결과가 존재하지 않는 게 맞다면
        if (!loading && !isAuthenticated) navigate("/login");
    }, [loading, isAuthenticated, navigate]); // 로그인 여부가 바뀌었을 때나, 페이지 접근이 감지되었을 때
    
    // 방법 2) page-container 를 삼항연산자로 감싸서 처리
    // -> BoardWrite 참조
    // {isAuthenticated ? (<>마이페이지 정보 보여주기</>) : (navigate('/login'))}

    if(loading) return renderLoading('로딩 중');
    // js는 매개변수를 모두 작성하지 않아도 동작!
    // -> renderLoading () 내부에 작성하지 않아도 동작한다.

    // 인증된 유저인데 로그인에 대한 정보가 없을 경우
    if(!user) {
        return null;
    }

    const handleClick = () => {
        navigate("/mypage/edit");
    }

    return (
        <div className="page-container">
            <h1>마이페이지</h1>

            <div className="mypage-container">
                <div className="mypage-section">
                    <h2>회원 정보</h2>

                    <div className="info-group">
                        <div className="info-item">
                            <span className="info-label">이메일</span>
                            <span className="info-value">{user.memberEmail || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">이름</span>
                            <span className="info-value">{user.memberName || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">전화번호</span>
                            <span className="info-value">{user.memberPhone || '-'}</span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">주소</span>
                            <span className="info-value">
                                {user.memberAddress ? (
                                    <>
                                        ({user.memberPostcode || '-'}) {user.memberAddress}
                                        {user.memberDetailAddress && ` ${user.memberDetailAddress}`}
                                    </>
                                ) : '-'}
                            </span>
                        </div>

                        <div className="info-item">
                            <span className="info-label">가입일</span>
                            <span className="info-value">
                                {user.memberCreatedAt
                                    ? new Date(user.memberCreatedAt).toLocaleDateString('ko-KR')
                                    : '-'}
                            </span>
                        </div>
                    </div>

                    <div className="mypage-actions">
                        <button
                            className="button btn-edit"
                            onClick={handleClick}
                        >
                            회원정보 수정
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPage;