import {useContext} from "react";
import {ThemeContext} from "../../Main_Theme";

const Header = () => {
    const {isDark, toggleTheme} = useContext(ThemeContext);

    return (
        <header style={{marginBottom: '30px'}}>
            <h1>웹사이트</h1>
            <button onClick={toggleTheme}
                    style={{
                        padding:'10px 20px',
                        cursor: 'pointer',
                        backgroundColor: isDark ? '#555' : '#ddd',
                        color: isDark ? '#fff' : '#000',
                        border: 'none',
                        borderRadius: '5px'
                    }}>
                {isDark ? '라이트 모드' : '다크모드'}
            </button>
        </header>
    );
};

export default Header;