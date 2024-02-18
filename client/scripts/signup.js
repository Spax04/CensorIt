document.addEventListener('DOMContentLoaded', function () {
  const api = 'http://localhost:5000/auth/signUp'

  // signup submit function
  document
    .getElementById('signupForm')
    .addEventListener('submit', async function (event) {
      event.preventDefault() // Prevent the default form submission

      // Get the username, email, password, and confirm password from the form
      let email = document.getElementById('email').value
      let password = document.getElementById('password').value
      let confirmPassword = document.getElementById('confirmPassword').value

      // Basic client-side validation
      if (!email || !password || !confirmPassword) {
        alert('All fields are required.')
        return
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.')
        return
      }

      // Make a fetch request to your API endpoint for signup
      await fetch(api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: { address: email }, password: password })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(
              'Signup failed. Please check your credentials and try again.'
            )
          }
          return response.json()
        })
        .then(data => {
          let token = data.token
          let userId = data.userId

          chrome.storage.local.set({ token: token })
          chrome.storage.local.set({ userId: userId })

          // Redirect to the configuration page
          window.location.href = '../pages/config.html'
        })
        .catch(error => {
          console.error('Error:', error)
          alert(error.message)
        })
    })
})
