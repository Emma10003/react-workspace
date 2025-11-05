const Child = () => {
    return (

    )
}

/* 2. 부모 컴포넌트 */
const Parent = () => {
    return (
        <>
            {/* Context 객체를 이용해서 하위 컴포넌트에 value 제공 */}
            <TestContext.Provider value='Parent에서 전달한 값'>
                <h1>Parent Component</h1>
                <Child/>
            </TestContext.Provider>
        </>
    );
};

export default Parent;