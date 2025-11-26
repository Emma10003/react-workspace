import {toFormData} from "axios";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useState} from "react";
import {handleChange, handleInputChange} from "../context/scripts";

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
        memberPostCode: '',
        memberAddress: '',
        memberDetailAddress: '',
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

        if(formData.currentPassword || formData.newPassword || formData.confirmPassword) {
            if(!formData.currentPassword) {
                alert("현재 비밀번호를 입력해주세요.");
                return;
            }
            if(!validation.newPassword) {
                alert("비밀번호 형식이 올바르지 않습니다.");
                return;
            }
            if(!validation.confirmPassword) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
        }

        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            alert("회원정보가 수정되었습니다.");
            navigate('/mypage');
        }, 1000);
    }

/*
 업로드, 업데이트와 같은 모든 사이트에서 활용하는 공통 기능
 -> scripts.js 로 이동하여 상태관리를 진행하고, 재사용!
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(p => ({
            ...p, [name]: value
        }))
    }
*/

    const handleCheckChange = (e) => {
        // const {name, value} = e.target;
        handleInputChange(e, setFormData);
    }

    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function (data) {
                var addr = '';

                // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
                if(data.userSelectedType === 'R') {  // 사용자가 도로명 주소를 사용할 경우 Road
                    addr = data.roadAddress;
                } else {  // === 'J' Jibun 을 선택했을 경우 지번주소를 가져온다.
                    addr = data.jibunAddress;
                }

                setFormData(p => ({
                    ...p,
                    memberPostCode: data.zonecode,
                    memberAddress: addr
                }))
                /*
                아래 코드 (순수 javascript)를
                document.getElementById('postcode').value = data.zonecode;
                document.getElementById('address').value = addr;

                React에서는 다음과 같이 사용.
                memberPostCode: data.zonecode,
                memberAddress: addr
                (formData 를 복사해서 memberPostCode, memberAddress 수정.)
                */
                document.getElementById("detailAddress")?.focus();
            }
        }).open();
    }

    // 게시물 작성, 수정, 상품 업로드 작성 수정, 마이페이지 수정에서 공통 사용
    // 인자값으로 msg, navigate, path 를 넣음.
    const handleCancel = () => {
        if(window.confirm("수정을 취소하시겠습니까? 변경사항은 저장되지 않습니다.")) {
            navigate("/mypage");
        }
    }

    return (
        <div className="page-container">
            <h1>회원정보 수정</h1>
            <form onSubmit={handleSubmit}>
                {/* 이름 / 이메일 (읽기전용) : 수정 불가 */}
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
                    이메일 <span className="required">*</span>
                    <input type="text"
                           name="memberEmail"
                           value={user?.memberEmail}
                           readOnly
                    />
                    <span className="form-hint">&nbsp;이메일은 변경할 수 없습니다.</span>
                </label>

                <label>
                    {/*
                    type = number
                    int, byte, short, long 과 같은 숫자 꼐열은
                    맨 앞에 있는 0을 생략한 상태로 값을 저장하기 때문에
                    주민등록번호에서 00년생 ~ 09년생의 경우 앞에 있는 0이 자동으로 생략됨.
                    -> type = text 로 받는다!
                    */}
                    연락처 <span className="required">*</span>
                    <input type="text"
                           name="memberPhone"
                           value={user?.memberPhone}
                           onChange={handleCheckChange}
                    />
                </label>

                <label>
                    현재 비밀번호 <span className="required">*</span>
                    <input type="text"
                           name="currentPassword"
                           value={formData.currentPassword}
                           onChange={handleCheckChange}
                    />
                    <span className="form-hint">&nbsp;비밀번호를 변경하지 않으려면 비워두세요.</span>
                </label>

                <label>
                    새 비밀번호 <span className="required">*</span>
                    <input type="text"
                           name="newPassword"
                           value={formData.newPassword}
                           onChange={handleCheckChange}
                           placeholder="영어, 숫자 포함 8자 이상"
                    />
                </label>

                <label>
                    새 비밀번호 확인 <span className="required">*</span>
                    <input type="text"
                           name="confirmPassword"
                           value={formData?.confirmPassword}
                           onChange={handleCheckChange}
                    />
                    <span className={
                        `signUp-message 
                        ${validation.confirmPassword 
                        && formData.confirmPassword
                        && isCorrect ? 'confirm' : 'error'}`}
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
                               value={formData.memberAddress}
                               placeholder="주소 검색을 클릭하세요."
                               onClick={handleAddressSearch}
                               readOnly
                        />
                        <button type="button"
                                onClick={handleAddressSearch}>
                            주소검색
                        </button>
                    </div>
                    <div className="signUp-input-area">
                        <input type="text"
                               id="memberAddress"
                               name="memberAddress"
                               value={formData.memberAddress}
                               placeholder="도로명/지번 주소"
                               onClick={handleAddressSearch}
                               readOnly
                        />
                    </div>
                    <div className="signUp-input-area">
                        <input type="text"
                               id="memberDetailAddress"
                               name="memberDetailAddress"
                               value={formData.memberDetailAddress}
                               placeholder="상세주소를 입력하세요 (예: 101동 101호)"
                               onChange={handleCheckChange}
                               required
                        />
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