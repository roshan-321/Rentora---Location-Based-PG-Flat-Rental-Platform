
const form = document.getElementById("selectRoleForm");
const errorMessage = document.getElementById("errorMessage");
const continueBtn = document.getElementById("continueBtn");

const selectionCards = document.querySelectorAll(".selection-card");

// Handle card selection styling
selectionCards.forEach(card => {
    const input = card.querySelector('input[type="radio"]');

    input.addEventListener("change", () => {
        const group = card.parentElement;

        group.querySelectorAll(".selection-card").forEach(item => {
            item.classList.remove("selected");
        });

        card.classList.add("selected");
    });
});

// Submit role selection
form.addEventListener("submit", async function (event) {
    event.preventDefault();

    errorMessage.textContent = "";

    const token = localStorage.getItem("access");

    if (!token) {
        window.location.href = "/accounts/user/signin";
        return;
    }

    const role = document.querySelector(
        'input[name="role"]:checked'
    )?.value;

    const gender = document.querySelector(
        'input[name="gender"]:checked'
    )?.value;

    if (!role || !gender) {
        errorMessage.textContent =
            "Please select your gender and role.";
        return;
    }

    continueBtn.disabled = true;
    continueBtn.querySelector("span").textContent = "Please wait...";

    try {
        const response = await fetch("/api/accounts/user/role", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                role: role,
                gender: gender
            })
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");

                window.location.href = "/accounts/user/signin";
                return;
            }

            errorMessage.textContent =
                data.error || "Unable to complete your profile.";
            return;
        }

        // Role saved successfully
        window.location.href = "/";

    } catch (error) {
        console.error("Role selection error:", error);

        errorMessage.textContent =
            "Something went wrong. Please try again.";

    } finally {
        continueBtn.disabled = false;
        continueBtn.querySelector("span").textContent = "Continue";
    }
});