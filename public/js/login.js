/* eslint-disable no-alert */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
/*disable eslint*/

const login = async (email, password) => {
  try {
    document.body.style.cursor = "wait";
    const res = await axios({
      method: "POST",
      url: "http://127.0.0.1:8080/api/v1/users/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      alert("Logged in successfully!");
      window.setTimeout(() => {
        // eslint-disable-next-line no-restricted-globals
        location.assign("/");
      }, 1500);
    }
  } catch (err) {
    alert(err.response.data.message);
  } finally {
    document.body.style.cursor = "auto";
  }
};

document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  login(email, password);
  //console.log(email, password);
});
