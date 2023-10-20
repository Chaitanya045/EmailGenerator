function generateEmail() {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://www.1secmail.com/api/v1/?action=genRandomMailbox', true);
      xhr.onload = function () {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } else {
          reject(xhr.statusText);
        }
      };
      xhr.onerror = function () {
        reject(xhr.statusText);
      };
      xhr.send();
    });
  }
  
  function generateAndDisplayEmail() {
    generateEmail()
      .then(data => {
        const emailDisplay = document.getElementById('emailDisplay');
        emailDisplay.innerText = `Generated Email: ${data}`;
      })
      .catch(error => console.error('Error:', error));
  }
  
  function fetchInboxMails() {
    const email = document.getElementById('emailInput').value;
    const inboxMails = document.getElementById('inboxMails');
    inboxMails.innerHTML = ""; // Clearing previous inbox mails
  
    if (email) {
      fetch(`https://www.1secmail.com/api/v1/?action=getMessages&login=${email.split('@')[0]}&domain=${email.split('@')[1]}`)
        .then(response => response.json())
        .then(data => {
          data.forEach(mail => {
            const listItem = document.createElement('li');
            listItem.innerText = `From: ${mail.from} - Subject: ${mail.subject}`;
            listItem.addEventListener('click', () => fetchEmailContent(email, mail.id));
            inboxMails.appendChild(listItem);
          });
        })
        .catch(error => console.error('Error:', error));
    }
  }
  
  function fetchEmailContent(email, id) {
    fetch(`https://www.1secmail.com/api/v1/?action=readMessage&login=${email.split('@')[0]}&domain=${email.split('@')[1]}&id=${id}`)
      .then(response => response.json())
      .then(data => {
        const emailContentDiv = document.getElementById('emailContent');
        console.log(data)
        emailContentDiv.innerHTML = `
          <h3>From: ${data.from}</h3>
          <h4>To: ${data.to}</h4>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Body:</strong></p>
          <p>${data.htmlBody}</p>
        `;
      })
      .catch(error => console.error('Error:', error));
  }
  