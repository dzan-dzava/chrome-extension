let trackerUser;
const trackerList = [];

// create layout main elements
const timinatorTrackersEl = document.createElement('div');
const timinatorContainerEl = document.createElement('div');
const trackerButtonsEl = document.createElement('div');
const trackerListEl = document.createElement('div');

// add id and class to elements
timinatorTrackersEl.id = 'timinator-trackers';
timinatorContainerEl.id = 'timinator-container';
trackerButtonsEl.classList.add('tracker-buttons');
trackerListEl.classList.add('tracker-list');

// setup content initial state
trackerButtonsInit();
trackerUserInit();

// add elements to parents
timinatorContainerEl.appendChild(trackerButtonsEl);
timinatorContainerEl.appendChild(trackerListEl);
timinatorTrackersEl.appendChild(timinatorContainerEl);

// at last append main element to body
document.body.appendChild(timinatorTrackersEl);

function trackerButtonsInit() {
  const addTracker = document.createElement('div');
  addTracker.classList.add('add-tracker');
  const addIcon = document.createElement('img');
  addIcon.src = chrome.extension.getURL('images/add.svg');
  addTracker.appendChild(addIcon);
  trackerButtonsEl.appendChild(addTracker);

  addTracker.addEventListener('click', function() {
    const newTracker = new Tracker(new Date().getTime(), true, 0, 0, 0, 0, null);

    trackerList.push(newTracker);
    trackerListEl.appendChild(createNewTracker(newTracker));
  });
}

function trackerUserInit() {
  fetch('https://wandio.atlassian.net/rest/api/3/myself')
    .then(res => res.json())
    .then(res => {
      trackerUser = new User(res.accountId, res.displayName);
    });
}

function User(id, displayName) {
  this.id = id;
  this.displayName = displayName;
}

function createNewTracker(tracker) {
  const trackerEl = document.createElement('div');
  trackerEl.classList.add('tracker');

  // tracker header
  const trackerHeader = document.createElement('div');
  trackerHeader.classList.add('tracker-header');

  const trackerControls = document.createElement('span');
  trackerControls.classList.add('tracker-controls')
  const controlsIcon = document.createElement('img');
  const controlsTimer = document.createElement('span');
  controlsTimer.textContent = '00h 00m 00s';
  tracker.interval = setInterval(timer.bind(null, tracker, controlsTimer), 10);

  if (tracker.tracking) {
    trackerEl.classList.add('is-tracking');
    controlsIcon.src = chrome.extension.getURL('images/pause.svg');
  } else {
    controlsIcon.src = chrome.extension.getURL('images/play.svg');
  }

  trackerControls.addEventListener('click', function() {
    if (tracker.tracking) {
      trackerEl.classList.remove('is-tracking');
      controlsIcon.src = chrome.extension.getURL('images/play.svg')
      clearInterval(tracker.interval);
      tracker.interval = null;
    } else {
      trackerEl.classList.add('is-tracking');
      controlsIcon.src = chrome.extension.getURL('images/pause.svg')
      tracker.interval = setInterval(timer.bind(null, tracker, controlsTimer), 10);
    }
    
    tracker.tracking = !tracker.tracking;
  });

  trackerControls.appendChild(controlsIcon);
  trackerControls.appendChild(controlsTimer);
  trackerHeader.appendChild(trackerControls);

  const trackerToggle = document.createElement('div');
  trackerToggle.classList.add('tracker-toggle');
  const toggleIcon = document.createElement('img');
  toggleIcon.src = chrome.extension.getURL('images/toggle.svg');

  trackerToggle.addEventListener('click', function() {
    trackerDetails.classList.toggle('hidden');
    toggleIcon.classList.toggle('rotate');
  });

  trackerToggle.appendChild(toggleIcon);
  trackerHeader.appendChild(trackerToggle);

  // tracker content
  const trackerDetails = document.createElement('div');
  trackerDetails.classList.add('tracker-details', 'hidden');

  const detailsTextarea = document.createElement('textarea');
  detailsTextarea.placeholder = 'Enter description';
  
  trackerDetails.appendChild(detailsTextarea);

  const detailsControls = document.createElement('div');
  detailsControls.classList.add('details-controls');
  const logTracker = document.createElement('img');
  logTracker.src = chrome.extension.getURL('images/log.svg');
  const deleteTracker = document.createElement('img');
  deleteTracker.src = chrome.extension.getURL('images/delete.svg');

  deleteTracker.addEventListener('click', function() {
    const index = trackerList.findIndex(x => x.id === tracker.id);
    trackerList.splice(index, 1);
    trackerListEl.removeChild(trackerEl);
  });
  
  detailsControls.appendChild(logTracker);
  detailsControls.appendChild(deleteTracker);
  trackerDetails.appendChild(detailsControls);

  trackerEl.appendChild(trackerHeader);
  trackerEl.appendChild(trackerDetails);

  return trackerEl;
}

function Tracker(id, tracking, hours, minutes, seconds, millisecond, interval) {
  this.id = id;
  this.tracking = tracking;
  this.hours = hours;
  this.minutes = minutes;
  this.seconds = seconds;
  this.millisecond = millisecond;
  this.interval = interval;
}

function timer(tracker, timerEl) {
  tracker.millisecond += 10;

  if (tracker.millisecond >= 1000) {
    tracker.millisecond = 0;
    tracker.seconds++;

    if (tracker.seconds >= 60) {
      tracker.seconds = 0;
      tracker.minutes++;

      if (tracker.minutes >= 60) {
        tracker.minutes = 0;
        tracker.hours++;
      }
    }
  }

  timerEl.textContent = (tracker.hours ? (tracker.hours > 9 ? tracker.hours + 'h' : '0' + tracker.hours + 'h') : '00h') +
    ' ' + (tracker.minutes ? (tracker.minutes > 9 ? tracker.minutes + 'm' : '0' + tracker.minutes + 'm') : '00m') +
    ' ' + (tracker.seconds ? (tracker.seconds > 9 ? tracker.seconds + 's' : '0' + tracker.seconds + 's') : '00s');
}