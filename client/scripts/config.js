document.addEventListener('DOMContentLoaded', () => {
  const api = 'http://localhost:5000'
  let token
  let userId
  chrome.storage.local.get(['token']).then(result => {
    token = result.token
  })
  chrome.storage.local.get(['userId']).then(result => {
    userId = result.userId
  })

  document.getElementById('lockBtn').addEventListener('click', function () {
    let unlockForm = document.getElementById('unlockForm')
    let blockLevelSelect = document.getElementById('blockLevel')
    let logoutBtn = document.getElementById('logout-btn')
    let whiteList = document.getElementById('whiteList')

    if (unlockForm.style.display === 'none') {
      unlockForm.style.display = 'block'
      blockLevelSelect.disabled = true
      this.style.display = 'none'
      logoutBtn.style.display = 'none'

      whiteList.style.display = 'none'
    } else {
      unlockForm.style.display = 'none'
      blockLevelSelect.disabled = false
      this.value = 'Lock'
    }
  })

  document.getElementById('unlockBtn').addEventListener('click',async function () {
    let unlockPassword = document.getElementById('unlockPassword').value

    await fetch(`${api}/auth/passCheck`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,

        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, password: unlockPassword })
    })
      .then(response => {
        if (!response.ok) {
          alert('Login failed. Please check your credentials and try again.')
        }
        return response.json()
      })
      .then(data => {
        if (data.isCorrect) {
          var unlockForm = document.getElementById('unlockForm')
          var blockLevelSelect = document.getElementById('blockLevel')

          unlockForm.style.display = 'none'
          blockLevelSelect.disabled = false

          // Optionally, reset the password input field
          document.getElementById('unlockPassword').value = ''

          // Change the Lock button back to its original state
          document.getElementById('lockBtn').style.display = 'block'
          document.getElementById('logout-btn').style.display = 'block'
          document.getElementById('whiteList').style.display = 'block'
        } else {
          alert('Incorrect password. Please try again.')
        }
      })
      .catch(error => {
        console.log(error)
      })
  })

  document.getElementById('whiteList').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('../pages/settings.html') })
  })

  document.getElementById('logout-btn').addEventListener('click', () => {
    chrome.storage.local.clear(function () {
      let error = chrome.runtime.lastError
      if (error) {
        console.error(error)
      }
    })
    window.location.href = '../pages/login.html'
  })
})
