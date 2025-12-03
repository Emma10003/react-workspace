/* =========================================
 컴포넌트에서 공통으로 사용하는 기능 작성용 js
========================================= */


// 기능을 나눌 때 여러 UI 태그에서 반복적으로 사용하는 기능인가? 확인

/* ===========================================================
                        로딩 관련 함수
=========================================================== */
/**
 * 로딩상태 ui 컴포넌트 함수
 * @param message 초기값은 '로딩 중'
 * @returns {JSX.Element} 인자값으로 전달받은 message가 존재한다면
 * 인자값을 활용한 ui 반환
 */
export const renderLoading = (message = "로딩중") => {
    return (
        <div className="page-container">
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>{message}</p>
            </div>
        </div>
    )
}

/**
 * 로딩 후 데이터가 존재하지 않을 경우 보여주는 ui 컴포넌트 함수
 * @param message 초기값은 '데이터가 없습니다'
 * @returns {JSX.Element} 인자값으로 전달받은 message가 존재한다면 인자값을 활용한 ui 반환
 */
export const renderNoData = (message = '데이터가 없습니다.') => {
    return (
        <div className="no-data">
            <p>{message}</p>
        </div>
    )
}


/* ===========================================================
                    navigate 관련 함수
=========================================================== */
// navigateToBoard, navigateToProduct 는
// goToPage 만 있으면 필요 없음
// 게시글 상세보기로 이동
// goToPage 하나면 navigateToBoard, navigateToProduct 필요 X
/*
export const navigateToBoard = (navigate, boardId) => {
    navigate(`/board/${boardId}`);
}

export const navigateToProduct = (navigate, productId) => {
    navigate(`/product/${productId}`);
}
*/

// goToPage 나 pageClickHandler 둘 중 하나만 있어도 O
/*
export const pageClickHandler = (navigate, basePath) => {
    return (id) => {
        navigate(`${basePath}/${id}`)
    }
}
*/
/**
 * 페이지 이동 함수
 * @param navigate 인자값으로 들어오는 useNavigate() 기능 활용
 * @param path 인자값으로 들어오는 경로 활용하여 페이지 이동 처리<br>
 * 만일 path 자리에 -1 을 작성하면 뒤로가기 버튼으로 사용할 수 있다.
 */
export const goToPage = (navigate, path) => {
    navigate(path);
}


/* ===========================================================
                    날짜, 가격 포맷팅 함수
=========================================================== */
/**
 * 날짜 포맷팅 함수
 * @param dateString 백엔드로 가져오거나, 작성해놓은 특정 날짜 데이터를 매개변수(=인자값)으로 가져오기
 * @returns {string} 백엔드로 가져오거나, 작성해놓은 특정 날짜가 null 값으로 존재하지 않을 경우
 * @'-' 형태로 존재하지 않는 날짜입니다. 대신 표기
 * @특정 날짜 데이터를 dateString 으로 가져와 사용할 수 있다면 날짜를 한국 기준으로 포맷팅하여 반환
 */
export const formatDate = (dateString) => {
    if(!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        date: 'numeric'
    })
}

/**
 * 가격 포맷팅 함수
 * @param price 백엔드로 가져오거나, 작성해놓은 특정 가격 데이터를 매개변수(=인자값)으로 가져오기
 * @returns {string} 백엔드로 가져오거나, 작성해놓은 특정 가격이 null 값으로 존재하지 않을 경우
 * @'-' 형태로 존재하지 않는 가격입니다. 대신 표기
 * @특정 가격 데이터를 price 로 가져와 사용할 수 있다면 가격을 한국 기준으로 포맷팅하여 반환
 * @ 만일 한국이 아니라 전세계를 기준으로 판매하길 원한다면
 * @return new Intl.NumberFormat("특정 나라 ip를 조회하여, 나라에 맞는 가격으로 보일 수 있도록 세팅").format(price);
 * ex) 넷플릯, 유튜브, 구글 결제 등 다양한 회사에서 활용
 */
export const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
}

 /**
 * input 태그 상태관리 함수
 * @param e 특정 input 에 이벤트(=행동)이 감지되면 동작
 * @param setFormData 백엔드로 전달할 formData 는 setter 를 이용해 데이터 변환을 추가
 * @logic const {name, value} = e.target; 행동 감지된 input 타겟의 name과 value 데이터를 가져와서 name = 키 명칭, value = 데이터 가져오기
 * @logic p => ({...p, [name]:value}) 기존에 존재햐던 formData 를 p 변수명에 그대로 복제하여 담아둔 후
 * 변화가 감지된 키의 데이터를 p 변수에 추가하고, 키 명칭이 존재한다면 데이터 수정 / 키 명칭이 존재하지 않는다면 키:데이터 형태로 추가.
 * 변화된 p 전체 데이터는 setter 를 이용해서 formData 에 저장.
 * @id js 상태관리 할 때 주로 사용. @name은 백엔드로 데이터를 주고받을 때 사용.
 * @className 스타일 세팅할 때 사용
 *
 */
export const handleInputChange = (e, setFormData) => {
    // id 키 명칭에 해당하는 데이터를 갖고오길 원한다면 name 대신 id 활용
    const {name, value} = e.target;
    setFormData(p => ({
        ...p, [name]: value
    }))
}


// export const handleChangeImage = (e, setPreviewImage, setImageFile, setProduct) => {
// 이 방법은
// onChange={handleChangeImage(e, setPreviewImage, setImageFile, setProduct)}  불가능
// onChange={(e) => handleChangeImage(e, setPreviewImage, setImageFile, setProduct)} 사용 가능

// jsx 에서 e를 생략하고 작성할 수 있다. (현대적인 방법)
// onChange={handleChangeImage(setPreviewImage, setImageFile, setProduct)}
export const handleChangeImage = (setPreviewImage, setImageFile, setProduct) => (e) => {
    // type=file 은 이미지 이외에도 항시 1개 이상의 데이터를 가져온다.
    // 가 기본적으로 전제된 속성임. -> multipart 를 작성하지 않아 input 에서 하나의 이미지만 가져온다 하더라도
    // 항시 [0]번째의 데이터를 가져온다. 로 작성해야 함!
    const html에서가져온이미지첫번째파일 = e.target.files[0];
    console.log("✉️ imageFile: ", html에서가져온이미지첫번째파일);

    if(html에서가져온이미지첫번째파일) {
        if(!html에서가져온이미지첫번째파일.type.startsWith('image/')) {
            alert("이미지 파일만 업로드 가능합니다.");
            e.target.value ="";  // 한 번 더 안정적으로 input 내의 데이터 제거.
            return;
        }

        // 파일 크기 검증 (예: 5MB 제한)
        const maxSize = 5 * 1024 * 1024;
        if(html에서가져온이미지첫번째파일.size > maxSize) {
            alert("파일 크기는 5MB 이하여야 합니다.");
            e.target.value = "";
            return;
        }

        // FileReader 라는 자바스크립트에 내장된 읽기 기능을 사용해서
        // 파일 미리보기 생성
        const reader = new FileReader();
        reader.onload = (event) => {
            // FileReader 를 만든 개발자가 target.value 나 files[인덱스] 대신
            // 가져온 것에 대한 결과라는 변수명을 사용했기 때문에 result 를 사용함.
            setPreviewImage(event.target.result);
        };
        // URL 에 존재하는 데이터를 읽겠ㄷ다. reader 에서
        reader.readAsDataURL(html에서가져온이미지첫번째파일);

        setImageFile(html에서가져온이미지첫번째파일);

        setProduct(prev => ({
            ...prev,
            imageUrl: html에서가져온이미지첫번째파일
        }))
    }
}


/* ===========================================================
                       유효성 검사 함수
=========================================================== */
const regexPw= /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const regexPhone = /^01[0-9]{8,9}$/;

export const validatePassword = (password) => {
    if(!password) return true;  // 비밀번호가 존재하지 않는 게 맞다면 유효성검사 하지 않음.
    return regexPw.test(password);
}

export const validatePhone = (phone) => {
    if(!phone) return true;  // 연락처가 존재하지 않는 게 맞다면 유효성검사 하지 않음.
    return regexPhone.test(phone);
}

// 비밀번호 형식 확인
// 카테고리
