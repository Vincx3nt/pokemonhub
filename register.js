document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  const fullName = document.getElementById("fullName");
  const username = document.getElementById("username");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const favoriteType = document.getElementById("favoriteType");
  const experience = document.getElementById("experience");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirmPassword");
  const bio = document.getElementById("bio");
  const newsletter = document.getElementById("newsletter");
  const terms = document.getElementById("terms");
  const togglePassword = document.getElementById("togglePassword");
  const strengthBar = document.getElementById("strengthBar");
  const clearBtn = document.getElementById("clearBtn");
  const successMessage = document.getElementById("successMessage");

  const fields = [
    "fullName",
    "username",
    "email",
    "phone",
    "favoriteType",
    "experience",
    "password",
    "confirmPassword",
    "bio",
    "newsletter"
  ];

  loadSavedData();

  togglePassword.addEventListener("click", function () {
    const isPassword = password.type === "password";
    password.type = isPassword ? "text" : "password";
    confirmPassword.type = isPassword ? "text" : "password";
    togglePassword.textContent = isPassword ? "Hide" : "Show";
  });

  password.addEventListener("input", updatePasswordStrength);

  clearBtn.addEventListener("click", function () {
    form.reset();
    clearErrors();
    resetStrengthBar();
    successMessage.style.display = "none";
    localStorage.removeItem("trainerRegistration");
  });

  fields.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener("input", saveDraft);
      element.addEventListener("change", saveDraft);
    }
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearErrors();
    successMessage.style.display = "none";

    let isValid = true;

    if (fullName.value.trim() === "") {
      showError("fullNameError", "Full name is required.");
      isValid = false;
    }

    if (username.value.trim() === "") {
      showError("usernameError", "Trainer username is required.");
      isValid = false;
    } else if (username.value.trim().length < 4) {
      showError("usernameError", "Username must be at least 4 characters.");
      isValid = false;
    }

    if (email.value.trim() === "") {
      showError("emailError", "Email address is required.");
      isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
      showError("emailError", "Please enter a valid email address.");
      isValid = false;
    }

    if (phone.value.trim() === "") {
      showError("phoneError", "Phone number is required.");
      isValid = false;
    } else if (!/^[0-9+\-\s]{8,15}$/.test(phone.value.trim())) {
      showError("phoneError", "Please enter a valid phone number.");
      isValid = false;
    }

    if (favoriteType.value === "") {
      showError("favoriteTypeError", "Please select your favorite Pokemon type.");
      isValid = false;
    }

    if (experience.value === "") {
      showError("experienceError", "Please select your experience level.");
      isValid = false;
    }

    if (password.value.trim() === "") {
      showError("passwordError", "Password is required.");
      isValid = false;
    } else if (!isStrongPassword(password.value.trim())) {
      showError("passwordError", "Password must be at least 8 characters and include letters and numbers.");
      isValid = false;
    }

    if (confirmPassword.value.trim() === "") {
      showError("confirmPasswordError", "Please confirm your password.");
      isValid = false;
    } else if (confirmPassword.value !== password.value) {
      showError("confirmPasswordError", "Passwords do not match.");
      isValid = false;
    }

    if (bio.value.trim() === "") {
      showError("bioError", "Please write a short bio.");
      isValid = false;
    } else if (bio.value.trim().length < 15) {
      showError("bioError", "Bio must be at least 15 characters.");
      isValid = false;
    }

    if (!terms.checked) {
      showError("termsError", "You must agree to the terms and conditions.");
      isValid = false;
    }

    if (isValid) {
      const registrationData = {
        fullName: fullName.value.trim(),
        username: username.value.trim(),
        email: email.value.trim(),
        phone: phone.value.trim(),
        favoriteType: favoriteType.value,
        experience: experience.value,
        bio: bio.value.trim(),
        newsletter: newsletter.checked
      };

      localStorage.setItem("trainerRegistration", JSON.stringify(registrationData));

      successMessage.style.display = "block";
      successMessage.textContent = "Registration successful. Welcome to the Pokemon TCG community, " + username.value.trim() + "!";

      form.reset();
      resetStrengthBar();
    }
  });

  function showError(id, message) {
    document.getElementById(id).textContent = message;
  }

  function clearErrors() {
    const errors = document.querySelectorAll(".error");
    errors.forEach((error) => {
      error.textContent = "";
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function isStrongPassword(value) {
    return value.length >= 8 && /[A-Za-z]/.test(value) && /[0-9]/.test(value);
  }

  function updatePasswordStrength() {
    const value = password.value;
    let strength = 0;

    if (value.length >= 8) strength++;
    if (/[A-Z]/.test(value) || /[a-z]/.test(value)) strength++;
    if (/[0-9]/.test(value)) strength++;
    if (/[^A-Za-z0-9]/.test(value)) strength++;

    if (strength === 0) {
      strengthBar.style.width = "0%";
      strengthBar.style.background = "red";
    } else if (strength === 1) {
      strengthBar.style.width = "25%";
      strengthBar.style.background = "#ff4d4d";
    } else if (strength === 2) {
      strengthBar.style.width = "50%";
      strengthBar.style.background = "#ffa500";
    } else if (strength === 3) {
      strengthBar.style.width = "75%";
      strengthBar.style.background = "#ffd700";
    } else {
      strengthBar.style.width = "100%";
      strengthBar.style.background = "#28a745";
    }
  }

  function resetStrengthBar() {
    strengthBar.style.width = "0%";
    strengthBar.style.background = "red";
  }

  function saveDraft() {
    const draftData = {
      fullName: fullName.value,
      username: username.value,
      email: email.value,
      phone: phone.value,
      favoriteType: favoriteType.value,
      experience: experience.value,
      bio: bio.value,
      newsletter: newsletter.checked
    };

    localStorage.setItem("trainerDraft", JSON.stringify(draftData));
  }

  function loadSavedData() {
    const savedDraft = localStorage.getItem("trainerDraft");
    if (savedDraft) {
      const data = JSON.parse(savedDraft);
      fullName.value = data.fullName || "";
      username.value = data.username || "";
      email.value = data.email || "";
      phone.value = data.phone || "";
      favoriteType.value = data.favoriteType || "";
      experience.value = data.experience || "";
      bio.value = data.bio || "";
      newsletter.checked = data.newsletter || false;
    }
  }
});