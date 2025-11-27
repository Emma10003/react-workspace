import axios, {toFormData} from "axios";
import {Form, useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import {useEffect, useRef, useState} from "react";
import {goToPage, handleChange, handleInputChange, validatePassword} from "../service/commonService";
import {fetchMypageEdit} from "../service/APIService";

/*
과제 1: 새로 작성한 비밀번호와 비밀번호 확인이 일치하는지 여부 기능 완성
과제 2: 핸드폰번호 css 다른 input 창과 동일하게 스타일 설정
과제 3: 주소검색 창 띄우기 (Signup 에서 주소검색 기능 구현했던 거 참조)
 */

const MyPageEdit = () => {
    const navigate = useNavigate();
    const {user, isAuthenticated} = useAuth();
    // 페이지가 리렌더링 될 때 현재 데이터를 그대로 유지하기 위해 사용
    // 새로고침 되어도 초기값으로 돌아가는 것이 아니라 현재 상태를 그대로 유지한다.
    const fileInputRef = useRef(null);

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login');
        }
    }, []);


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

    const [profileImage, setProfileImage] = useState(user?.memberProfileImage || '/img/profile/default-profile.svg')
    const [profileFile, setProfileFile] = useState(null);
    const [isUploading, setUploading] = useState(false);

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

        // 단순히 값이 존재하는지 확인하는 코드일 뿐!
        if(formData.currentPassword || formData.newPassword || formData.confirmPassword) {
            if(!formData.currentPassword) {
                alert("현재 비밀번호를 입력해주세요.");
                return;
            }
            if(!validation.newPassword) {
                alert("새 비밀번호를 입력해주세요.");
                return;
            }
            if(!validation.confirmPassword) {
                alert("비밀번호 확인을 입력해주세요.");
                return;
            }
        }

        setIsSubmitting(true);
        fetchMypageEdit(axios, formData, navigate, setIsSubmitting);
    }

/*
 업로드, 업데이트와 같은 모든 사이트에서 활용하는 공통 기능
 -> commonService.js 로 이동하여 상태관리를 진행하고, 재사용!
    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(p => ({
            ...p, [name]: value
        }))
    }
*/

    //  set해서 값을 추가하면서, 추가된 값이 일치하는가 확인.
    // handleInputChange 내부에 formData 를 활용.
    // formData 에 내장된 새 비밀번호와 비밀번호 확인이 일치하는지 체크
    const handleCheckChange = (e) => {
        const {name, value} = e.target;
        handleInputChange(e, setFormData);

        /**
         * 새 비밀번호 입력 후 비밀번호 확인까지 입력
         * 그 후에 새 비밀번호를 변경할 가능성이 있기 때문에
         * 새 비밀번호 = 비밀번호 확인 일치하는지 체크 후
         * 새 비밀번호를 변경하면 비밀번호 확인까지 변경할 수 있도록 세팅.
         */
        // 새 비밀번호 입력 시 -> 비밀번호 확인과 비교
        if(name === "newPassword") {
            const isMatch = value === formData.confirmPassword;

            setValidation(prev => ({
                ...prev,
                confirmPassword: isMatch
            }));

            setMessages(prev => ({
                ...prev,
                confirmPassword: formData.confirmPassword
                ? (isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.")
                : ""
            }));
        }

        if(name === "confirmPassword") {
            const isMatch = value === formData.newPassword;

            setValidation(prev => ({
                ...prev,
                confirmPassword: isMatch
            }));

            setMessages(prev => ({
                ...prev,
                confirmPassword: value
                ? (isMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다.")
                : ""
            }));
        }
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

    // 프로필 이미지 클릭 시 파일 선택
    const handleProfileClick = () => {
        fileInputRef.current?.click();
        // 새로고침하여 프로필 이미지가 초기화되는 것이 아니라,
        // 현재상태를 유지한 채로 클릭을 진행한다.
    }

    // 프로필 이미지 파일 선택
    const handleProfileChange = async (e) => {
        const file = e.target.files[0];
        if(!file) return;

        // 이미지 파일인지 확인, 이미지 파일이 아닌 경우
        if(!file.type.startsWith("image/")){
            alert("이미지 파일만 업로드 가능합니다.");
            return;
        }

        // 파일 크기 확인 (5MB)
        if(file.sie > 5 * 1024 * 1024) {
            alert("파일 크기는 5MB를 초과할 수 없습니다.");
            return;
        }

        // 미리보기 표시
        const reader = new FileReader();
        reader.onloadend = (e) => {
            setProfileImage(e.target.result);
        };
        reader.readAsDataURL(file);
        // 파일 저장
        setProfileFile(file);
        await uploadProfileImage(file);
    }

    const uploadProfileImage = async (file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("memberEmail", user.memberEmail);
            const res = await axios.post("/api/member/profile-image", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(res.data.success === true) {
                alert("프로필 이미지가 업데이트 되었습니다.");
                setProfileImage(res.data.imageUrl);
                // updateUser(useAuth 또한 업데이트 진행)
            }
        } catch(error) {
            alert(error);
            // 실패 시 원래 이미지로 복구
            setProfileImage(user?.memberProfileimage || '/static/img/profile/default-profile.svg');
        } finally {
            setUploading(false);
        }

    }

    return (
        <div className="page-container">
            <h1>회원정보 수정</h1>
            <form onSubmit={handleSubmit}>
                <div className="profile-image-section">
                    <label>프로필 이미지</label>
                    <div className="profile-image-container" onClick={handleProfileClick}>
                        <img src={profileImage}
                             className="profile-image"/>
                        <div className="profile-image-overlay">
                            {isUploading ? "업로드 중..." : "이미지 변경"}
                        </div>
                    </div>
                    <input type="file"
                           ref={fileInputRef}
                           onChange={handleProfileChange}
                           accept="image/*"
                           style={{display: 'none'}}
                    />
                    <span className="form-hint">이미지를 클릭하여 변경할 수 있습니다. (최대 5MB)</span>
                </div>
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
                    <input type="password"
                           name="currentPassword"
                           value={formData.currentPassword}
                           onChange={handleCheckChange}
                    />
                    <span className="form-hint">&nbsp;비밀번호를 변경하지 않으려면 비워두세요.</span>
                </label>

                <label>
                    새 비밀번호 <span className="required">*</span>
                    <input type="password"
                           name="newPassword"
                           value={formData.newPassword}
                           onChange={handleCheckChange}
                           placeholder="영어, 숫자 포함 8자 이상"
                    />
                </label>

                <label>
                    새 비밀번호 확인 <span className="required">*</span>
                    <input type="password"
                           name="confirmPassword"
                           value={formData?.confirmPassword}
                           onChange={handleCheckChange}
                    />
                    <span className={
                        `signUp-message 
                        ${validation.confirmPassword 
                        && formData.confirmPassword
                            ? 'confirm' : 'error'}`}
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