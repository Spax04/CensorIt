document.addEventListener('DOMContentLoaded', () => {
  const api = 'http://localhost:5000'
  let token
  let userId
  let personalBlockPercentage
  chrome.storage.local.get(['token']).then(result => {
    token = result.token
  })
  chrome.storage.local.get(['userId']).then(result => {
    userId = result.userId
  })
  chrome.storage.local.get(['personalBlockPercentage']).then(result => {
    personalBlockPercentage = result.personalBlockPercentage
    setBlockLevelOption(personalBlockPercentage)
  })
  
  const setBlockLevelOption = (personalBlockProsent) => {
    const blockLevelSelect = document.getElementById('blockLevel');
    blockLevelSelect.value = personalBlockProsent.toString();
  };


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

  // Function to send the fetch request to update block level
  const updateBlockLevel = async (newPercentage) => {

    try {
      const response = await fetch(`${api}/user/${userId}/personal-block-percentage`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPercentage })
      });

      if (!response.ok) {
        throw new Error('Failed to update block level');
      }
      chrome.storage.local.set({ personalBlockPercentage: newPercentage })
      setBlockLevelOption(newPercentage)

    } catch (error) {
      console.error(error);
      alert('Failed to update block level. Please try again.');
    }
  };

  document.getElementById('blockLevel').addEventListener('change', function () {
    const newPercentage = this.value;
    
    updateBlockLevel(newPercentage);
  });


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
