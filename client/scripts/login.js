document.addEventListener('DOMContentLoaded', function () {

  const api = 'https://your-api-endpoint.com/auth'
  // Check if a token already exists in localStorage
  let token
  chrome.storage.local.get(['token']).then(result => {
    token = result
  })
  if (token) {
    // Redirect to the configuration page
    window.location.href = '../pages/config.html'
  }

  // login submit function
  document
    .getElementById('loginForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault() // Prevent the default form submission
  
      // Get the username and password from the form
      let username = document.getElementById('username').value
      let password = document.getElementById('password').value
  
      // Make a fetch request to your API endpoint
      //await fetch('${api}/signin', {
      //     method: "POST",
      //     headers: {
      //         "Content-Type": "application/json"
      //     },
      //     body: JSON.stringify({ username: username, password: password })
      // })
      // .then(response => {
      //     if (!response.ok) {
      //         alert("Login failed. Please check your credentials and try again.");
      //     }
      //     return response.json();
      // })
      // .then(data => {
      //     let token = data.token;
      //     let userId = data.userId
      //     chrome.storage.local.set({ "token": token });
      //     chrome.storage.local.set({ "userId": userId });
  
      //     window.location.href = "../pages/config.html";
      // })
      // .catch(error => {
      //    
      //     console.error("Error:", error);
      //     alert(error.message);
      // });
  
      window.location.href = '../pages/config.html'
    })
})

