export const commonStyles = {
    button: {
        padding: '10px 20px',
        cursor: 'pointer',
        border: 'none',
        borderRadius: '5px'
    }
}

export const lightTheme = {
    main: {
        minHeight: '100vh',
        backgroundColor: '#fff',
        color:'#222',
        padding: '20px'
    },
    header : {
        container: {
            marginBottom: '30px'
        },
        title: {
            color: '#222'
        },
        button: {
            backgroundColor: '#ddd',
            color: '#222'
        }
    },
    content : {
        container: {
            marginBottom: '30px'
        },
        title: {
            color: '#222'
        },
        text: {
            color: '#222'
        }
    },
    footer : {
        container: {
            marginBottom: '50px',
            padding: '20px',
            borderTop: '2px solid #ddd'
        },
        text: {
            color: '#000'
        }
    }
}

export const darkTheme = {
    main: {
        minHeight: '100vh',
        backgroundColor: '#222',
        color:'#fff',
        padding: '20px'
    },
    header : {
        container: {
            marginBottom: '30px'
        },
        title: {
            color: '#fff'
        },
        button: {
            backgroundColor: '#444',
            color: '#fff'
        }
    },
    content : {
        container: {
            marginBottom: '30px'
        },
        title: {
            color: '#fff'
        },
        text: {
            color: '#fff'
        }
    },
    footer : {
        container: {
            marginBottom: '50px',
            padding: '20px',
            borderTop: '2px solid #ddd'
        },
        text: {
            color: '#fff'
        }
    }
}