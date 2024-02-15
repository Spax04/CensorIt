const api = 'https://example.com/' //!

function renderBlockPage (description) {
  const newContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>CensureIt</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f5f5f5;
              }
  
              .container {
                  max-width: 800px;
                  margin: 50px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
  
              .content {
                  margin-top: 20px;
              }
  
              img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 8px;
              }
  
              .about {
                  background-color: #f9f9f9;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              }
  
              .about h2 {
                  color: #333;
                  font-size: 24px;
                  margin-bottom: 10px;
              }
  
              .about p {
                  color: #666;
                  font-size: 16px;
                  line-height: 1.6;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h1>This page was blocked!</h1>
              <img src="https://www.pngall.com/wp-content/uploads/13/Censored-PNG.png" alt="Placeholder Image">
              <div class="content">
                  <div class="about">
                      <h2>Why this page was blocked?</h2>
                      <p> ${description}</p>
                  </div>
              </div>
          </div>


      </body>
      </html>
    `

  // Replace the content of the entire page with newContent
  document.documentElement.innerHTML = newContent
}

// Extention starter function
function onLoaded () {
  let currentUrl = window.location.toString()
  let userData
  // Create a URL object
  let url = new URL(currentUrl)

  // Get the protocol, hostname, and port
  let baseUrl = url.protocol + '//' + url.hostname
  // renderBlockPage(`${baseUrl}`)
  try {
    userData = getUserCredentials()
    checkURL(baseUrl, userData, censureWebPage)
  } catch {}
}

// Getting user's Id and Token
const getUserCredentials = () => {
  let token
  let userId
  try {
    chrome.storage.local.get(['token']).then(result => {
      token = result
    })
    chrome.storage.local.get(['userId']).then(result => {
      userId = result
    })
    return { token, userId }
  } catch {
    alert('User Unauthorized')
  }
}

// Checking if URL exist in database,returns block page if webpage exist and not match to users configuration
async function checkURL (baseUrl, { userId, token }, callback) {
  const data = {
    link: baseUrl,
    userId: userId
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch(`${api}/scan/link`, options)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        alert('Error: ' + response.statusText)
      }
    })
    .then(data => {
      if (!data.isExist) {
        callback(userId, token)
      } else if (!data.isAllowed) {
        renderBlockPage(data.description)
      }
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error.message)
      // Display error to user or perform other error handling tasks
    })
}

// Censuring currend DOM,replacing dyrtes words to "****"
async function censureWebPage (userId, token) {

  const data = {
    webPage: htmlContent,
    userId: userId
  }

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }

  await fetch(`${api}/scan/text`, options)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        alert('Error: ' + response.statusText)
      }
    })
    .then(data => {
      if (!data.isAllowed) {
        renderBlockPage(data.description)
      } else {
        document.documentElement.innerHTML = data.censuredWebPage
      }
    })
    .catch(error => {
      console.error('Error:', error.message)
    })
}

//* Extention starts here
onLoaded()
