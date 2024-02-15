document.addEventListener('DOMContentLoaded', () => {
  let api = 'https://your-api-endpoint.com/whiteList'
  let token
  let userId

  chrome.storage.local.get(['token']).then(result => {
    token = result
  })

  chrome.storage.local.get(['userId']).then(result => {
    userId = result
  })

  document
    .getElementById('saveLinksBtn')
    .addEventListener('click', async () => {
      let link = document.getElementById('linkInput').value

      let sendingData = {
        userId: userId,
        link: link
      }
      await fetch(`${api}/link`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
      })
        .then(response => {
          if (!response.ok) {
            alert('Some error')
          }
          return response.json()
        })
        .then(data => {
          if (data.isSucceed) {
            alert('Link was successful added to white list')
          } else {
            alert('Try again')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          alert(error.message)
        })
    })

  document
    .getElementById('saveWordsBtn')
    .addEventListener('click', async () => {
      let word = document.getElementById('wordInput').value

      let sendingData = {
        userId: userId,
        word: word
      }
      await fetch(`${api}/word`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
      })
        .then(response => {
          if (!response.ok) {
            alert('Some error')
          }
          return response.json()
        })
        .then(data => {
          if (data.isSucceed) {
            alert('Word was successful added to white list')
          } else {
            alert('Try again')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          alert(error.message)
        })
    })

  document
    .getElementById('saveCategoryBtn')
    .addEventListener('click', async () => {
      var dropdown = document.getElementById('categorySelect')
      var selectedValue = dropdown.value

      let sendingData = {
        userId: userId,
        categoryId: selectedValue
      }
      await fetch(`${api}/category`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendingData)
      })
        .then(response => {
          if (!response.ok) {
            alert('Some error')
          }
          return response.json()
        })
        .then(data => {
          if (data.isSucceed) {
            alert('Category was successful added to white list')
          } else {
            alert('Try again')
          }
        })
        .catch(error => {
          console.error('Error:', error)
          alert(error.message)
        })
    })
})
