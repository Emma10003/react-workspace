/* =========================================
 컴포넌트에서 공통으로 사용하는 기능 작성용 js
========================================= */

// 기능을 나눌 때 여러 UI 태그에서 반복적으로 사용하는 기능인가? 확인
// 로딩 기능
// ==================[ 로딩 관련 함수 ]==================
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
// 로딩 후 데이터가 존재하지 않을 경우
export const renderNoData = (message = '데이터가 없습니다.') => {
    return (
        <div className="no-data">
            <p>{message}</p>
        </div>
    )
}
// 로딩 후 상태 관리 래퍼 함수.
// abc에 해당하는 데이터 가져오기 기능을 수행하고,
// 데이터가 무사히 들어오면 로딩 멈춤.
export const withLoading = async (abc, setLoading) => {
    if(setLoading) setLoading(true);
    try{
        await abc();
    } finally {
        if(setLoading) setLoading(false);
    }
}

// navigate

// fetchProduct

// 날짜 포맷팅

// 가격 포맷팅

// 카테고리
