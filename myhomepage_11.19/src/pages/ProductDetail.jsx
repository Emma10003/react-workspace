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
        fetchProductDetail(axios, id, setProduct, navigate);
    }, [id]);  // id 값이 조회될 때 마다 상품 상세보기 데이터 조회

    const formatPrice = (price) => {
        return new Intl.NumberFormat("ko-KR").format(price);
    }

    if(loading) return renderLoading("");
    if(!product) return renderLoading("");

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
                        <div className="meta-label">상품코드</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;