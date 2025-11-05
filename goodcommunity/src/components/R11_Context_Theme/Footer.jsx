import {useContext} from "react";
import {ThemeContext} from "../../Main_Theme";

const Footer = () => {
    const {isDark} = useContext(ThemeContext);

    return (
        <footer style={{
            marginTop: '50px',
            padding: '20px',
            borderTop: `2px sold ${isDark ? '#444' : '#ddd'}`
        }}>
            <hr/>
            <p>&copy; 2025 - {isDark ? '다크 모드' : '라이트 모드'}</p>
        </footer>
    );
};

export default Footer;