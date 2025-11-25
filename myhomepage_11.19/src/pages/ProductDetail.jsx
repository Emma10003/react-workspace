import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {fetchProductDetail, renderLoading} from "../context/scripts";


const ProductDetail = () => {
    const {id} = useParams(); //URL 에서 id 가져오기
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductDetail(axios, id, setProduct, navigate, setLoading);
    }, [id]);  // id 값이 조회될 때 마다 상품 상세보기 데이터 조회

    const formatDate = (dateString) => {
        if(!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            date: 'numeric'
        });
    }

    if(loading) return renderLoading("게시물을 불러오는 중");

    if(!product) return renderLoading("상품을 찾을 수 없습니다.");

    return (
        <div className="page-container">
            <div className="product-detail-header">
                <h1>상품 상세정보</h1>
                <button className="btn-back"
                        onClick={() => navigate("/products")}>
                    ← 목록으로
                </button>
            </div>
            <div className="product-detail-image">
                {product.imageUrl
                    ? <img src={product.imageUrl} alt={product.productName}/>
                    : <img src="/static/img/default.png" alt="default"/>
                }
            </div>
            <div className="product-detail-info">
                <div className="product-detail-category">
                    {product.category}
                </div>

                <h2 className="product-detail-name">
                    {product.productName}
                </h2>
                
                <div className="product-detail-meta">
                    <div className="meta-item">
                        <span className="meta-label">상품코드</span>
                        <span className="meta-value">{product.productCode}</span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">제조사</span>
                        <span className="meta-value">{product.manufacturer || '-'}</span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">재고</span>
                        <span className={`meta-value ${product.stockQuantity < 10 ? 'low-stock' : ''}`}>
                            {product.stockQuantity < 10 ? '매진 임박' : product.stockQuantity} 개
                        </span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">판매상태</span>
                        <span className="meta-value">
                            {/* mysql 에서는 boolean 데이터로 가능, oracle 은 char 로 변경한 것 확인하기 */}
                            {product.isActive ? '판매중' : '판매중지'}
                        </span>
                    </div>

                    <div className="meta-item">
                        <span className="meta-label">등록일</span>
                        <span className="meta-value">
                            {formatDate(product.createdAt)}
                        </span>
                    </div>

                    {/* 수정일이 존재하고 && 수정일자가 생성일자와 다른 경우에만 && (이 ui를 표기하겠다) */}
                    {product.updatedAt && product.updatedAt !== product.createdAt && (
                        <div className="meta-item">
                            <span className="meta-label">수정일</span>
                            <span className="meta-value">
                                {formatDate(product.updatedAt)}
                            </span>
                        </div>
                    )}
                </div>

                {/* 상품설명이 존재할 경우에만 상품설명 ui를 보여주겠다. */}
                {product.description && (
                    <div className={"product-detail-description"}>
                        <h3>상품 설명</h3>
                        <p>{product.description}</p>
                    </div>
                )}

                {/* 아래 버튼은 로그인한 계정이 admin 일 경우 수정/삭제가 가능하게 표기하기 */}
                <div className="product-detail-buttons">
                    <button className="btn-edit"
                            onClick={() => navigate(`/product/edit/${id}`)}>
                        수정
                    </button>
                    <button className="btn-delete"
                            onClick={ () => {
                        if(window.confirm("정말 삭제하시겠습니까?")) {
                            alert("삭제 기능은 구현 예정입니다. 삭제 불가능합니다.");}
                        }}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;