const api = 'http://localhost:5000' //!

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
async function onLoaded () {
  let currentUrl = window.location.toString()
  let userData
  // Create a URL object
  let url = new URL(currentUrl)

  // Get the protocol, hostname, and port
  let baseUrl = url.protocol + '//' + url.hostname
  // renderBlockPage(`${baseUrl}`)
  try {

    userData = await getUserCredentials();
    await checkURL(baseUrl, userData)
  } catch (err) {
    alert(err)
  }
}

// Getting user's Id and Token
const getUserCredentials = async () => {
  const tokenPromise = new Promise((resolve, reject) => {
    chrome.storage.local.get(['token', 'userId'], result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result.token)
      }
    })
  })

  const userIdPromise = new Promise((resolve, reject) => {
    chrome.storage.local.get(['userId'], result => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError)
      } else {
        resolve(result.userId)
      }
    })
  })

  const token = await tokenPromise
  const userId = await userIdPromise

  if (token === undefined || userId === undefined) {
    throw new Error('Unauthorized')
  }
  return { token, userId }
}

// Checking if URL exist in database,returns block page if webpage exist and not match to users configuration
async function checkURL (baseUrl, { userId, token }) {
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

  await fetch(`${api}/scanning/link`, options)
    .then(async response => {
      if (response.ok) {
        return await response.json()
      } else {
        alert('Error: ' + response.statusText)
      }
    })
    .then(async data => {
      if (!data.isExist) {
        await censureWebPage(userId, token)
      } else if (!data.isAllowed) {
        renderBlockPage(data.description)
      } else {
        await censureWebPage(userId, token)
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
  const htmlContent = document.documentElement.outerHTML
  const chunkSize = 10000 // Adjust the chunk size as needed
  const chunks = []
  for (let i = 0; i < htmlContent.length; i += chunkSize) {
    chunks.push(htmlContent.slice(i, i + chunkSize))
  }

  await Promise.all(
    chunks.map((chunk, index) => {
      const data = {
        webPageChunk: chunk,
        userId: userId,
        totalChunks: chunks.length,
        currentChunkIndex: index
      }

      const options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }

      return fetch(`${api}/scanning/text`, options).then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`)
        }
        return response.json()
      })
    })
  )
    .then(responses => {
      if (responses.some(r => r.isAllowed == false)) {
        renderBlockPage(responses.some(r => r.description))
      } else {
        const modifiedWebPage = responses[responses.length - 1].modifiedPage
        document.documentElement.innerHTML = modifiedWebPage
      }
    })
    .catch(error => {
      console.error('Error:', error.message)
      alert('An error occurred while sending the webpage to the API.')
    })
}

onLoaded()
