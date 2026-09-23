
const publicPages = [
    "/",
    "/accounts/user/signin",
    "/accounts/user/signup"
];

const currentPath = window.location.pathname;

const isProtectedRoute = !publicPages.includes(currentPath);

const accessToken = localStorage.getItem("access");

if (!accessToken && isProtectedRoute) {
    window.location.href = "/accounts/user/signin";
}

fetch("/api/accounts/auth/", {
    method: "GET",
    headers: {
        "Authorization": "Bearer " + accessToken
    }
})
.then(response => {

    if (response.status === 401 && isProtectedRoute) {
        localStorage.removeItem("access");
        window.location.href = "/accounts/user/signin";
        return;
    }

    if (response.status === 200) {
        document.getElementById("logout-item").setAttribute("style", "display: block;")
        document.getElementById("register-item").setAttribute("style", "display: none !important;")
        return;
    }

})
.catch(error => {
    console.log(error);
});