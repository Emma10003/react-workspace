import {useContext} from "react";
import {ThemeContext} from "../../Main_Theme";

const Content = () => {
    const {isDark} = useContext(ThemeContext)
    
    return (
        <main style={{marginBottom:'30px'}}>
            <h2>본문 내용</h2>
            <p>현재 모드 : {isDark ? '다크 모드' : '라이트 모드'}</p>
            <p>Context를 사용하면 props 전달 없이 테마 정보를 바로 가져올 수 있다.</p>
        </main>
    );
};

export default Content;