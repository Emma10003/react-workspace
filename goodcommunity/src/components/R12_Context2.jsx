import {createContext, useContext, useState} from "react";

/* 1. Context 객체 생성 -> props 없이 상태값이나 데이터 사용 가능
      중간다리 역할을 하는 js/jsx를 건너뛰고, 필요한 js/jsx에서
      '나 부모에서 만들어놓은 상태나 데이터 사용하겠어!' 라는
      useContext(Context명칭) 을 component 내부에 선언하면
      어디서든 사용 가능한 hook.
 */
const TestContext = createContext();


const GrandChild = () => {
    // TestContext.Provider 로 제공된 값을 여기서 사용할 것
    const {number, setNumber} = useContext(TestContext);

    return (
        <>
            <h3>GrandChild Component</h3>
            <input type='number'
                   value={number}
                   onChange={e => {setNumber(e.target.value)}}
            />
            <h4>{number}</h4>
        </>
    )
}

/* 3. 자식 컴포넌트 - Context 를 사용하지 않고,
      GrandChild를 포함하고 있는 컴포넌트임을 명시하기 위해 작성한 Child 컴포넌트 (여기에선 실제로 하는 일 X)
*/
const Child = () => {
    return (
        <>
            <h2>Child Component</h2>
            <GrandChild />
        </>
    )
}

/* 2. 부모 컴포넌트 */
const Parent = () => {
    // 상태 변수 선언
    const [number, setNumber] = useState(0);
    return (
        // Context 는 값을 1개만 제공할 수 있다.
        // -> 여러 개 제공하고 싶으면 {}, []로 묶기.
        // React에서 {number, setNumber} 작성하면 아래와 같이 변환됨
        // {"number": number, "setNumber": setNumber}
        <TestContext.Provider value={{number, setNumber}}>
            <h1>
                Parent Component:
                {/* Parent 컴포넌트의 상태값 출력 */}
                <span className='red'>{number}</span>
            </h1>
            <Child />
        </TestContext.Provider>
    );
};

export default Parent;