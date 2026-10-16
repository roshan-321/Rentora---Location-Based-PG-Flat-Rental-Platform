
console.log("Google Callback JS Loaded");

const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (!code) {
    window.location.replace("/accounts/user/signin");
} else {
    fetch(`/api/accounts/google/callback/?code=${encodeURIComponent(code)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Google authentication failed");
            }
            return response.json();
        })
        .then(data => {
            if (!data.access || !data.refresh) {
                throw new Error("JWT tokens not received");
            }

            // Save JWT tokens
            localStorage.setItem("access", data.access);
            localStorage.setItem("refresh", data.refresh);

            // Fetch authenticated user details
            return fetch("/api/accounts/auth/", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${data.access}`
                }
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to fetch user details");
            }
            return response.json();
        })
        .then(user => {
            console.log("User details:", user);
            console.log("Role:", user.role);
            console.log("Gender:", user.gender);

            // Existing user goes to home
            if (user.role && user.gender) {
                window.location.replace("/");
            } else {
                // New user completes onboarding
                window.location.replace("/accounts/user/role");
            }
        })
        .catch(error => {
            console.error("Google login error:", error);
            window.location.replace("/accounts/user/signin");
        });
}
