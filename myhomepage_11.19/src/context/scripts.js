/* =========================================
 컴포넌트에서 공통으로 사용하는 기능 작성용 js
========================================= */

// 기능을 나눌 때 여러 UI 태그에서 반복적으로 사용하는 기능인가? 확인
import {useNavigate} from "react-router-dom";
import axios from "axios";

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

// ==================[ navigate 관련 함수 ]==================
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

// navigateToBoard, navigateToProduct 는
// goToPage 만 있으면 필요 없음!
export const goToPage = (navigate, path) => {
    navigate(path);
}

// goToPage 나 pageClickHandler 둘 중 하나만 있어도 O
/*
export const pageClickHandler = (navigate, basePath) => {
    return (id) => {
        navigate(`${basePath}/${id}`)
    }
}
*/

export const goBack = (navigate, confirmMessage = null) => {
    if(confirmMessage) {
        if(window.confirm(confirmMessage)) navigate(-1);  // 한 단계 뒤로 이동
    } else {
        navigate(-1);
    }
}

// ==================[ API 데이터 페칭 관련 함수 ]==================
/*
const API_URL 의 경우 내부에서만 사용할 수 있도록 설정된 상태
외부에서 사용 가능한 형태로 변경하길 원한다면
export const API_URL 로 export 를 추가하면 된다.

export const API_URLS 의 경우 외부/내부 어디서든 활용 가능하도록 설정한 것.
내부에서만 사용 가능한 형태로 변경하길 원한다면
export 를 제거한다.
 */
const API_URL = 'http://localhost:8085'
export const API_URLS = {
    AUTH : `${API_URL}/api/auth`,
    BOARD : `${API_URL}/api/board`,
    PRODUCT : `${API_URL}/api/product`,
    EMAIL : `${API_URL}/api/email`
}

export const fetchAllProducts = async (axios, setProducts, setLoading=null) => {
    try{
        const res = await axios.get(`${API_URLS.PRODUCT}/all`, {});
        setProducts(res.data);
    } catch(error) {
        alert("데이터를 가져올 수 없습니다.");
    } finally {
        if(setLoading) setLoading(false);
    }
}

export const fetchProductDetail = async (axios, id, setProduct, navigate, setLoading=null) => {
    try{
        const res = await axios.get(`${API_URLS.PRODUCT}/${id}`, {});
        setProduct(res.data);
    } catch(error) {
        alert("상품 정보를 불러올 수 없습니다.");
        navigate("/products");
    } finally {
        if(setLoading) setLoading(false);
    }
}

// 상품 비활성화
export const deleteProduct = async (axios, id, navigate) => {
    try{
        const res = await axios.delete(`${API_URLS.PRODUCT}/${id}`);
        alert("상품이 삭제되었습니다.");
        navigate("/products");
    } catch(error) {
        alert("상품 삭제에 실패했습니다.");
    }
}

export const fetchAllBoards = async (axios, setBoards, setLoading=null) => {
    try{
        const res = await axios.get(`${API_URLS.BOARD}/all`, {});
        setBoards(res.data);
    } catch(error) {
        alert("데이터를 가져올 수 없습니다.");
    } finally {
        if(setLoading) setLoading(false);
    }
}

export const fetchAllPopularBoards = async (axios, setBoard, limit=6, setLoading=null) => {
    try{
        const res = await axios.get(`${API_URLS.BOARD}/popular`, {});
        setBoard(res.data);
    } catch(error) {
        alert("데이터를 가져올 수 없습니다.");
    } finally {
        if(setLoading) setLoading(false);
    }
}

export const fetchBoardDetail = async (axios, id, setBoard, navigate, setLoading=null) => {
    try{
        const res = await axios.get(`${API_URLS.BOARD}/${id}`, {});
        setBoard(res.data);
    } catch(error) {
        alert("게시물 정보를 불러올 수 없습니다.");
        navigate("/board");
    } finally {
        if(setLoading) setLoading(false);
    }
}

export const boardSave = async (axios, navigate, formData) => {
    try{
        const res = await axios.post(`${API_URLS.BOARD}`, formData);
        alert("글이 작성되었습니다.");
        navigate("/board");
    } catch (error) {
        alert("게시글 작성 페이지에 접근이 불가합니다.");
        navigate("/board");
    }
}

// ==================[ 날짜 포맷팅 관련 함수 ]==================
export const formatDate = (dateString) => {
    if(!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        date: 'numeric'
    })
}

// ==================[ 가격 포맷팅 관련 함수 ]==================
export const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price);
}

// 카테고리
