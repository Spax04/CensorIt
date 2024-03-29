document.addEventListener('DOMContentLoaded', function () {
  const api = 'http://localhost:5000/auth'
  // Check if a token already exists in localStorage
  let token
  chrome.storage.local.get(['token']).then(result => {
    token = result.token
    if (token) {
      // Redirect to the configuration page
      window.location.href = '../pages/config.html'
    }
  })

  // login submit function
  document
    .getElementById('loginForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault() // Prevent the default form submission

      // Get the username and password from the form
      let username = document.getElementById('username').value
      let password = document.getElementById('password').value

      // Make a fetch request to your API endpoint
      await fetch(`${api}/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: { address: username },
          password: password
        })
      })
        .then(response => {
          if (!response.ok) {
            alert('Login failed. Please check your credentials and try again.')
          }
          return response.json()
        })
        .then(data => {
          let token = data.token
          let userId = data.userId
          let personalBlockPercentage = data.personalBlockPercentage

          chrome.storage.local.set({ token: token })
          chrome.storage.local.set({ userId: userId })
          chrome.storage.local.set({ personalBlockPercentage: personalBlockPercentage })

          window.location.href = '../pages/config.html'
        })
        .catch(error => {
          console.error('Error:', error)
        })
    })
})
