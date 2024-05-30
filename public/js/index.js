/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/*disable eslint*/

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
const showAlert = (type, message) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 5000);
};

const login = async (email, password) => {
  try {
    document.body.style.cursor = "wait";
    const res = await axios({
      method: "POST",
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/login`,
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged in successfully!");
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  } finally {
    document.body.style.cursor = "auto";
  }
};

if (document.querySelector(".form--login")) {
  document.querySelector(".form--login").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
    //console.log(email, password);
  });
}

const logout = async () => {
  try {
    document.body.style.cursor = "wait";
    const res = await axios({
      method: "GET",
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/logout`,
    });
    if (res.data.status === "success") {
      showAlert("success", "Logged out successfully!");
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign("/");
      }, 1000);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  } finally {
    document.body.style.cursor = "auto";
  }
};

if (document.querySelector(".logout")) {
  document.querySelector(".logout").addEventListener("click", (e) => {
    e.preventDefault();
    logout();
  });
}

const updateUserData = async (formData) => {
  try {
    document.body.style.cursor = "wait";
    const data = {};
    if (formData.get("name")) {
      data.name = formData.get("name");
    }
    if (formData.get("email")) {
      data.email = formData.get("email");
    }
    if (formData.get("photo")) {
      data.photo = formData.get("photo");
    }
    if (Object.keys(data).length === 0) {
      showAlert("error", "Please atleast change some feilds before submit.");
      return;
    }
    const userData = await axios({
      method: "GET",
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/myData`,
    });
    const res = await axios({
      method: "PATCH",
      url: `${window.location.protocol}//${window.location.host}/api/v1/users/myData`,
      data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Data updated successfully!");

      if (
        userData.data.data.user.email !== data.email &&
        formData.get("email")
      ) {
        showAlert("success", "Please login with new email!");
        const res1 = await axios({
          method: "GET",
          url: `${window.location.protocol}//${window.location.host}/api/v1/users/logout`,
        });
        if (res1.data.status === "success") {
          window.setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            location.assign("/login");
          }, 1500);
        } else {
          throw new Error("Something went wrong!");
        }
      } else {
        window.setTimeout(() => {
          // eslint-disable-next-line no-restricted-globals
          location.assign("/me");
        }, 1500);
      }
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  } finally {
    document.body.style.cursor = "auto";
  }
};

const updatePassword = async (currentPassword, password, passwordConfirm) => {
  const url = `${window.location.protocol}//${window.location.host}/api/v1/users/updateMyPassword`;
  try {
    document.body.style.cursor = "wait";
    const res = await axios({
      method: "PATCH",
      url,
      data: {
        passwordCurrent: currentPassword,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Password updated successfully!");
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign("/login");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  } finally {
    document.body.style.cursor = "auto";
  }
};

if (document.querySelector(".form-user-settings")) {
  document
    .querySelector(".form-user-settings")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const currentPassword = document.getElementById("password-current").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;
      await updatePassword(currentPassword, password, passwordConfirm);
      document.getElementById("password-current").value = "";
      document.getElementById("password").value = "";
      document.getElementById("password-confirm").value = "";
    });
}

let name;
let email;
let photo;
if (document.getElementById("name")) {
  document.getElementById("name").addEventListener("change", (event) => {
    name = event.target.value;
  });
}

if (document.getElementById("email")) {
  document.getElementById("email").addEventListener("change", (event) => {
    email = event.target.value;
  });
}

if (document.getElementById("photo")) {
  document.getElementById("photo").addEventListener("change", (event) => {
    photo = event.target.files[0];

    // Create a new FileReader instance
    const reader = new FileReader();

    // Set the onload function to update the image src with the data URL
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 500;
        canvas.height = 500;
        ctx.drawImage(img, 0, 0, 500, 500);
        const resizedImage = canvas.toDataURL();
        document.querySelector(".form__user-photo").src = resizedImage;
      };
      img.src = e.target.result;
    };

    // Read the file as a data URL
    reader.readAsDataURL(photo);
  });
}

if (document.querySelector(".form-user-data")) {
  document.querySelector(".form-user-data").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (email) formData.append("email", email);
    if (photo) formData.append("photo", photo);
    updateUserData(formData);
  });
}

// Stripe

const bookTour = async (tourId) => {
  const stripe = Stripe(
    "pk_test_51PLlVEERM987bWc2Cc41lzrQQlfiYUZlPAykrF466sp7ayfiSZGYucoR9jn85t4XjYOj9tNuiKifDdRzdGUUaiJn00VQryjfLi"
  );
  try {
    const session = await axios({
      method: "GET",
      url: `${window.location.protocol}//${window.location.host}/api/v1/bookings/checkout-session/${tourId}`,
    });
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

if (document.getElementById("book-tour")) {
  document.getElementById("book-tour").addEventListener("click", (e) => {
    e.target.textContent = "Processing...";
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}

// Sign Up
if (document.querySelector(".form--signup")) {
  document
    .querySelector(".form--signup")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const signUpName = document.getElementById("name").value;
      const signUpEmail = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;
      try {
        document.body.style.cursor = "wait";
        const res = await axios({
          method: "POST",
          url: `${window.location.protocol}//${window.location.host}/api/v1/users/signup`,
          data: {
            name: signUpName,
            email: signUpEmail,
            password,
            passwordConfirm,
          },
        });
        if (res.data.status === "success") {
          showAlert("success", "Account created successfully!");
          window.setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            location.assign("/login");
          }, 1500);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      } finally {
        document.body.style.cursor = "auto";
      }
    });
}

// Forget password
if (document.querySelector(".form--passwordReset")) {
  document
    .querySelector(".form--passwordReset")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const resetEmail = document.getElementById("email").value;
      try {
        document.body.style.cursor = "wait";
        const res = await axios({
          method: "POST",
          url: `${window.location.protocol}//${window.location.host}/api/v1/users/forgetPassword`,
          data: {
            email: resetEmail,
          },
        });
        if (res.data.status === "success") {
          showAlert(
            "success",
            "Email sent successfully! Check your email for next instructions."
          );
          window.setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            location.assign("/login");
          }, 2500);
        } else {
          showAlert("error", res.data.message);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      } finally {
        document.body.style.cursor = "auto";
      }
    });
}

// Reset Password

if (document.querySelector(".form--resetPassword")) {
  document
    .querySelector(".form--resetPassword")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("password").value;
      const passwordConfirm = document.getElementById("password-confirm").value;
      const resetToken = window.location.pathname.split("/")[2];
      try {
        document.body.style.cursor = "wait";
        const res = await axios({
          method: "PATCH",
          url: `${window.location.protocol}//${window.location.host}/api/v1/users/resetPassword/${resetToken}`,
          data: {
            password,
            passwordConfirm,
          },
        });
        if (res.data.status === "success") {
          showAlert("success", "Password reset successfully!");
          window.setTimeout(() => {
            // eslint-disable-next-line no-restricted-globals
            location.assign("/login");
          }, 1500);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      } finally {
        document.body.style.cursor = "auto";
      }
    });
}
