document.addEventListener('DOMContentLoaded', async () => {
  let api = 'http://localhost:5000'
  let token
  let userId
  let websiteList = [] // Array to store added website links
  let wordList = [] // Array to store added words
  let categoryList = [] // Array to store added categories

  await getUserCredentials()

  await getUserWhiteLists()

  function validateLink(link) {
    // Regular expression to check if the link ends with a slash '/'
    const regex = /\/$/;
    return !regex.test(link); // Returns true if the link does not end with '/'
  }

  document.getElementById('addLinkBtn').addEventListener('click', () => {
    let linkInput = document.getElementById('linkInput');
    let link = linkInput.value.trim(); // Trim whitespace from the input
    if (link && validateLink(link)) { // Check if link is not empty and passes validation
      let link = { link: linkInput.value };
      websiteList.push(link);

      linkInput.value = '';

      populateWebsiteList(websiteList);
    } else {
      alert('Please enter a valid link without "/" at the end.');
    }
  });

  document.getElementById('addWordsBtn').addEventListener('click', () => {
    let word = document.getElementById('wordInput')
    let newWord = { content: word.value }
    wordList.push(newWord)
    word.value = ''

    populateWordList(wordList)
  })
  // document.getElementById('addCategoryBtn').addEventListener('click', () => {
  //   let category = document.getElementById('categoryInput')
  //   let newCategory = {name:category.value}
  //   categoryList.push(newCategory)

  //   populateCategoryList(categoryList)
  // })

  document
    .getElementById('saveLinksBtn')
    .addEventListener('click', async () => {
      let sendingData = {
        newWebsiteList: websiteList
      }
      await fetch(`${api}/user/${userId}/white-website`, {
        method: 'PUT',
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
      let sendingData = {
        newWordList: wordList
      }
      alert(wordList)
      await fetch(`${api}/user/${userId}/white-word`, {
        method: 'PUT',
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

  // document
  //   .getElementById('saveCategoryBtn')
  //   .addEventListener('click', async () => {
  //     let sendingData = {
  //       newCategoryList: categoryList
  //     }
  //     await fetch(`${api}/user/${userId}/white-category`, {
  //       method: 'PUT',
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(sendingData)
  //     })
  //       .then(response => {
  //         if (!response.ok) {
  //           alert('Some error')
  //         }
  //         return response.json()
  //       })
  //       .then(data => {
  //         if (data.isSucceed) {
  //           alert('Category was successful added to white list')
  //         } else {
  //           alert('Try again')
  //         }
  //       })
  //       .catch(error => {
  //         console.error('Error:', error)
  //         alert(error.message)
  //       })
  //   })

  async function getUserWhiteLists () {
    if (userId != undefined) {
      await fetch(`${api}/user/${userId}/white-lists`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user white lists')
          }
          return response.json()
        })
        .then(data => {
          websiteList = data.websiteList
          wordList = data.wordList
          categoryList = data.categoryList
          populateWordList(data.wordList)
          populateWebsiteList(data.websiteList)
          populateCategoryList(data.categoryList)
        })
        .catch(error => {
          console.error('Error:', error)
          alert(error.message)
        })
    }
  }
  function populateWebsiteList (items) {
    const list = document.getElementById('linksList')
    list.innerHTML = ''
    items.forEach(item => {
      const li = document.createElement('li')
      
      // Create the remove button image
      const removeBtnImg = document.createElement('img');
      removeBtnImg.src = '../images/delete.png';
      removeBtnImg.classList.add('removeLinkBtn'); // Adding class 'removeWordBtn'
      removeBtnImg.alt = 'Remove'; // Optionally add alt text for accessibility
      
      // Append the remove button image to the list item
      li.appendChild(removeBtnImg);
      
      // Add text content after the image
      li.appendChild(document.createTextNode(item.link));
      list.appendChild(li)
    })
  }

  function populateWordList(items) {
    const list = document.getElementById('wordsList');
    list.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      
      // Create the remove button image
      const removeBtnImg = document.createElement('img');
      removeBtnImg.src = '../images/delete.png';
      removeBtnImg.classList.add('removeWordBtn'); // Adding class 'removeWordBtn'
      removeBtnImg.alt = 'Remove'; // Optionally add alt text for accessibility
      
      // Append the remove button image to the list item
      li.appendChild(removeBtnImg);
      
      // Add text content after the image
      li.appendChild(document.createTextNode(item.content));
      
      // Append the list item to the list
      list.appendChild(li);
    });
  }

  function removeItemFromList(array, index,callback) {
    array.splice(index, 1);
    callback(array); // Update UI
  }

  // Add event listener for removing words
  document.getElementById('wordsList').addEventListener('click', (event) => {
    if (event.target.classList.contains('removeWordBtn')) {
      const listItem = event.target.closest('li');
      const index = Array.from(listItem.parentNode.children).indexOf(listItem);
      removeItemFromList(wordList, index,populateWordList);
    }
  });

  document.getElementById("linksList").addEventListener('click',(event)=>{
    if (event.target.classList.contains('removeLinkBtn')) {
      const listItem = event.target.closest('li');
      const index = Array.from(listItem.parentNode.children).indexOf(listItem);
      removeItemFromList(websiteList, index,populateWebsiteList);
    }
  })
  

  function populateCategoryList (categories) {
    const list = document.getElementById('categoryItemsList')
    list.innerHTML = ''
    categories.forEach(category => {
      const li = document.createElement('li')
      li.textContent = category.name
      list.appendChild(li)
    })
  }

  async function getUserCredentials () {
    const result = await new Promise(resolve => {
      chrome.storage.local.get(['token', 'userId'], resolve)
    })
    token = result.token
    userId = result.userId
  }
})
