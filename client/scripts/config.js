document.addEventListener('DOMContentLoaded', () => {
  const api = 'https://your-api-endpoint.com'
  let token
  chrome.storage.local.get(['token']).then(result => {
    token = result
  })

  document.getElementById('lockBtn').addEventListener('click', function () {
    let unlockForm = document.getElementById('unlockForm')
    let blockLevelSelect = document.getElementById('blockLevel')
    let logoutBtn = document.getElementById('logout-btn')
    let whiteList = document.getElementById('whiteList');

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

  document.getElementById('unlockBtn').addEventListener('click', function () {
    let unlockPassword = document.getElementById('unlockPassword').value

    // fetch(`{api}/auth/passCheck`, {
    //     method: "POST",
    //     headers: {
    // Authorization: `Bearer ${token}`,

    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({  password: unlockPassword })
    // })
    // .then(response => {
    //     if (!response.ok) {
    //         alert("Login failed. Please check your credentials and try again.");
    //     }
    //     return response.json();
    // })
    // .then(data => {
    //     if(data.isCorrect){

    //         var unlockForm = document.getElementById("unlockForm");
    //         var blockLevelSelect = document.getElementById("blockLevel");

    //         unlockForm.style.display = "none";
    //         blockLevelSelect.disabled = false;
   // 
    //         // Optionally, reset the password input field
    //         document.getElementById("unlockPassword").value = "";

    //         // Change the Lock button back to its original state
    //         document.getElementById("lockBtn").style.display = "block";
    //         document.getElementById('logout-btn').style.display = "block";
    //         document.getElementById('whiteList').style.display = "block";
    //     }else{
    //         alert("Incorrect password. Please try again.");
    //     }
    // })
    // .catch(error => {
    //     console.log(error);
    // });

    //! TEST SECTION

    let unlockForm = document.getElementById('unlockForm')
    let blockLevelSelect = document.getElementById('blockLevel')

    unlockForm.style.display = 'none'
    blockLevelSelect.disabled = false

    // Optionally, reset the password input field
    document.getElementById('unlockPassword').value = ''

    // Change the Lock button back to its original state
    document.getElementById('lockBtn').style.display = 'block'
    document.getElementById('logout-btn').style.display = 'block'
    document.getElementById('whiteList').style.display = "block";
  })

  document.getElementById('whiteList').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('../pages/settings.html') })
  })

  document.getElementById('logout-btn').addEventListener('click', () => {
    window.location.href = '../pages/login.html'
  })
})
