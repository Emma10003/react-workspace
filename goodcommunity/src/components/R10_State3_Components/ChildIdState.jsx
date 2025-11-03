import {useState} from "react";

const ChildIdState = (props) => {
    const {handler} = props;  // const handler = props.handler;

    console.log(handler);     // handler 확인
    return (
        <div className="wrapper">
            {/* htmlFor == for 속성 */}
            <label htmlFor="inputId">ID</label>
            {/* onChange : 값이 바뀌었을 때 */}
            <input type="text" id="inputId" onChange={handler}/>
            {/* input에 값이 바뀌었을 때
                부모로부터 전달받은 함수 handler 수행
                자식 쪽에서 이벤트 발생
            */}
        </div>
    )
}

export default ChildIdState;