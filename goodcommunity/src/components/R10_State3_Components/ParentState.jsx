import {useState} from "react";
import ChildIdState from "./ChildIdState";
import ChildPwState from "./ChildPwState";

const ParentState = () => {

    const [id, setId] = useState('');
    const [pw, setPw] = useState('');

    const idHandler = (e) => {
        setId(e.target.value);
    };

    const pwHandler = (e) => {
        setPw(e.target.value);
    };

    return (
        <>
            {/*
            props 이용해 이벤트 핸들러 함수를
            자식 컴포넌트에게 전달
            */}
            <ChildIdState handler={idHandler}/>
            <ChildPwState handler={pwHandler}/>
            <div className="wrapper">
                {/* ID, PW 가 입력되지 않으면 버튼 비활성화 */}
                <button disabled={id.length === 0 || pw.length === 0}>
                    Login
                </button>
            </div>
        </>
    );
};

export default ParentState;