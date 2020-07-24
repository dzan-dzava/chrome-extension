const timinatorPopup = document.getElementById('timinator-popup');
let authorized = false;
let token = '';

chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
  const activeTabUrl = tabs[0].url;

  if (activeTabUrl.includes('wandio.atlassian.net')) {
    chrome.cookies.get({ url: activeTabUrl, name: 'token' }, function(cookie) {
      if (cookie) {
        token = cookie.value;
        console.log(token);
        
      } else {
        const title = document.createElement('h3');
        title.textContent = 'timinator not connected';
        const desc = document.createElement('p');
        desc.textContent = 'Please connect to start tracking your work in Timinator.';
        const connectButton = document.createElement('button');
        connectButton.textContent = 'Connect to Timinator';
        timinatorPopup.append(title, desc, connectButton);
      }
    });
  } else {
    const title = document.createElement('h3');
    title.textContent = 'timinator not connected';
    const desc = document.createElement('p');
    desc.textContent = 'Please navigate to Wandio Jira website to connect.';
    timinatorPopup.append(title, desc);
  }
});