export function setSession(user) {
    localStorage.setItem('session', JSON.stringify(user));
};

export function login(email, password) {
    let users = JSON.parse(localStorage.getItem('users'));
    let value = {
        success: false,
        message: 'Invalid Credentials'
    };
    users.forEach(user => {
        if (user.email === email && user.password === password) { value = { success: true, type: user.type, email: user.email }; return; }
    });
    if (value.success === true) {
        setSession({
            isLoggedIn: true,
            email: value.email,
            type: value.type
        });
    }
    return value
};

export function getLoginStatus() {
    let user = JSON.parse(localStorage.getItem('session'));
    if (user.isLoggedIn)
        return user;
    return false;
}

export function firstTime() {
    return localStorage.getItem("firstTime") ? true : false;
}

export function setFirstTime() {
    localStorage.setItem('firstTime', JSON.stringify({ first: true }))
}

export function getUsers() {
    let users = JSON.parse(localStorage.getItem('users'));
    return users || [];
}