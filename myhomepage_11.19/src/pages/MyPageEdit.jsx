import {toFormData} from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useState} from "react";

/*
과제 1: 새로 작성한 비밀번호와 비밀번호 확인이 일치하는지 여부 기능 완성
과제 2: 핸드폰번호 css 다른 input 창과 동일하게 스타일 설정
과제 3: 주소검색 창 띄우기 (Signup 에서 주소검색 기능 구현했던 거 참조)
 */

const MyPageEdit = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();

    const [formData, setFormData] = useState({
        memberName: '',
        memberEmail: '',
        memberPhone: '',
        memberAddress: '',
        newPassword: '',
        currentPassword: '',
        confirmPassword: '',
    })

    const [validation, setValidation] = useState({
        memberPhone: true,
        newPassword: true,
        confirmPassword: true,
    })

    const [messages, setMessages] = useState({
        memberPhone: '',
        newPassword: '',
        confirmPassword: '',
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleChange = () => {

    }

    // 게시물 작성, 수정, 상품 업로드 작성 수정, 마이페이지 수정에서 공통 사용
    // 인자값으로 msg, navigate, path 를 넣음.
    const handleCancel = () => {
        if(window.confirm("수정을 취소하시겠습니까? 변경사항은 저장되지 않습니다.")) {
            navigate("/mypage");
        }
    }

    const handleAddressSearch = () => {

    }

    return (
        <div className="page-container">
            <h1>회원정보 수정</h1>
            <form onSubmit={handleSubmit}>
                {/* 이메일 (읽기전용) : 수정 불가 */}
                <label>
                    이메일 <span className="required">*</span>
                    <input type="text"
                           name="memberEmail"
                           value={user?.memberEmail}
                           readOnly
                    />
                    <span className="form-hint">&nbsp;이메일은 변경할 수 없습니다.</span>
                </label>

                <label>
                    이름 <span className="required">*</span>
                    <input type="text"
                           name="memberName"
                           value={user?.memberName}
                           readOnly
                    />
                    <span className="form-hint">&nbsp;이름은 변경할 수 없습니다.</span>
                </label>

                <label>
                    연락처 <span className="required">*</span>
                    <input type="number"
                           name="memberPhone"
                           value={user?.memberPhone}
                           onChange={handleChange}
                    />
                </label>

                <label>
                    현재 비밀번호 <span className="required">*</span>
                    <input type="text"
                           name="currentPassword"
                           value={formData?.currentPassword}
                           onChange={handleChange}
                    />
                    <span className="form-hint">&nbsp;비밀번호를 변경하지 않으려면 비워두세요.</span>
                </label>
                <label>
                    새 비밀번호 <span className="required">*</span>
                    <input type="text"
                           name="newPassword"
                           value={formData?.newPassword}
                           onChange={handleChange}
                           placeholder="영어, 숫자 포함 8자 이상"
                    />
                </label>

                <label>
                    새 비밀번호 확인 <span className="required">*</span>
                    <input type="text"
                           name="confirmPassword"
                           value={formData?.confirmPassword}
                           onChange={handleChange}
                    />
                    <span className={
                        `signUp-message 
                        ${validation.confirmPassword 
                        && formData.confirmPassword ? 'confirm' : 'error'}`}
                    >
                        {messages.confirmPassword}
                    </span>
                </label>

                <label>
                    주소
                    <div className="signUp-input-area">
                        <input type="text"
                               id="memberPostCode"
                               name="memberPostCode"
                               value={formData?.memberAddress}
                               readOnly
                        />
                        <button type="button"
                                onClick={handleAddressSearch}>
                            주소검색
                        </button>
                    </div>
                </label>

                <div className="form-buttons">
                    <button className="btn-submit" disabled={isSubmitting}>
                        {isSubmitting ? '수정 중...' : '수정 완료'}
                    </button>
                    <button type="button"
                            className="btn-cancel"
                            onClick={handleCancel}
                            disabled={isSubmitting}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MyPageEdit;