const publicPages = [
    "/",
    "/accounts/user/signin",
    "/accounts/user/signup",
    "/about",
    "/properties/list"
];


let userData;


const currentPath = window.location.pathname;

const isPublicRoute =
    publicPages.includes(currentPath) ||
    currentPath.startsWith("/properties/view/");


const isProtectedRoute = !isPublicRoute;


const accessToken = localStorage.getItem("access");


if (!accessToken && isProtectedRoute) {

    showtoastMessage("please login first!");

    setTimeout(() => {
        window.location.href = "/accounts/user/signin";
    }, 2000);

}


        if (!accessToken) {

            const addProperty =
                document.getElementById("add-property");


            if (addProperty) {

                addProperty.setAttribute(
                    "style",
                    "display: none;"
                );

            }

        }


else if (accessToken) {

    fetch("/api/accounts/auth/", {
        method: "GET",

        headers: {
            "Authorization": "Bearer " + accessToken
        }
    })

    .then(response => {

        if (response.status === 401 && isProtectedRoute) {

            showtoastMessage("Please login first!");

            localStorage.removeItem("access");

            setTimeout(() => {
                window.location.href = "/accounts/user/signin";
            }, 2000);

            return;
        }


        if (response.status === 200) {
            return response.json();
        }

    })

    .then(data => {

       

        userData = data;

        console.log("User data:", data);

        if (!data) {
            return;
        }


        document.getElementById("logout-item")
            .setAttribute("style", "display: block;");


        document.getElementById("register-item")
            .setAttribute("style", "display: none;"); 

        document.getElementById("signup-item")
            .setAttribute("style", "display: none;");


        document.getElementById("profile-item")
            .setAttribute("style", "display: block;");


        const profileLink = document.getElementById("profile-link");


        if (profileLink) {

            profileLink.href = `/accounts/user/profile/${data.id}`;

        }

        const editProfileLink = document.getElementById("edit-profile-link");

        if (editProfileLink) {
           editProfileLink.href =  `/accounts/user/profile/edit/${data.id}`;
        }


        try {

            validatePermissions();

        } catch (error) {

            console.log(error);

        }


        if (data.role == "tenant") {

            const addProperty =
                document.getElementById("add-property");


            if (addProperty) {

                addProperty.setAttribute("style","display: none;");
            }

        }

        if (data.is_superuser) {

            const userList =
                document.getElementById("users-item");


            if (userList) {

                userList.setAttribute("style","display: block;");
            }

        }

        document.dispatchEvent(
            new Event("userDataLoaded")
        );

    });

}


else {

    document.dispatchEvent(
        new Event("userDataLoaded")
    );

}