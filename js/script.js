// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

const gallery = document.getElementById('gallery');
const getImagesButton = document.querySelector('.filters button');
const apiKey = window.NASA_API_KEY || 'DEMO_KEY';

// Build the details dialog once, then update it each time a gallery item is selected.
const modal = document.createElement('dialog');
modal.className = 'apod-modal';

const modalContent = document.createElement('div');
modalContent.className = 'modal-content';

const closeButton = document.createElement('button');
closeButton.className = 'modal-close';
closeButton.type = 'button';
closeButton.setAttribute('aria-label', 'Close image details');
closeButton.textContent = '×';

const modalTitle = document.createElement('h2');
const modalDate = document.createElement('p');
modalDate.className = 'modal-date';

const modalMedia = document.createElement('div');
modalMedia.className = 'modal-media';

const modalExplanation = document.createElement('p');
modalExplanation.className = 'modal-explanation';

modalContent.append(closeButton, modalTitle, modalDate, modalMedia, modalExplanation);
modal.append(modalContent);
document.body.append(modal);

function showGalleryMessage(message, isError = false) {
  const status = document.createElement('p');
  status.className = isError ? 'gallery-status error' : 'gallery-status';
  status.setAttribute('role', isError ? 'alert' : 'status');
  status.textContent = message;
  gallery.replaceChildren(status);
}

function openApodModal(item) {
  modalTitle.textContent = item.title || 'Untitled space photo';
  modalDate.textContent = item.date || '';
  modalExplanation.textContent = item.explanation || 'No explanation is available for this item.';
  modalMedia.replaceChildren();

  if (item.media_type === 'image' && item.url) {
    const image = document.createElement('img');
    image.src = item.hdurl || item.url;
    image.alt = item.title || 'Astronomy Picture of the Day';
    modalMedia.append(image);
  } else if (item.url) {
    const videoLink = document.createElement('a');
    videoLink.href = item.url;
    videoLink.target = '_blank';
    videoLink.rel = 'noopener noreferrer';
    videoLink.textContent = 'Open this NASA video in a new tab';
    modalMedia.append(videoLink);
  }

  modal.showModal();
}

function createGalleryItem(item) {
  const card = document.createElement('button');
  card.className = 'gallery-item';
  card.type = 'button';
  card.setAttribute('aria-label', `View ${item.title || 'space photo'} from ${item.date || 'an unknown date'}`);

  if (item.media_type === 'image' && item.url) {
    const image = document.createElement('img');
    image.src = item.url;
    image.alt = item.title || 'Astronomy Picture of the Day';
    image.loading = 'lazy';
    card.append(image);
  } else if (item.thumbnail_url) {
    const image = document.createElement('img');
    image.src = item.thumbnail_url;
    image.alt = `Video preview: ${item.title || 'Astronomy Picture of the Day'}`;
    image.loading = 'lazy';
    card.append(image);
  } else {
    const videoPreview = document.createElement('span');
    videoPreview.className = 'video-preview';
    videoPreview.textContent = 'NASA video';
    card.append(videoPreview);
  }

  const title = document.createElement('p');
  title.className = 'gallery-title';
  title.textContent = item.title || 'Untitled space photo';

  const date = document.createElement('p');
  date.className = 'gallery-date';
  date.textContent = item.date || '';

  card.append(title, date);
  card.addEventListener('click', () => openApodModal(item));
  return card;
}

async function loadSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;
  const startTime = Date.parse(`${startDate}T00:00:00Z`);
  const endTime = Date.parse(`${endDate}T00:00:00Z`);

  if (!startDate || !endDate) {
    showGalleryMessage('Choose both a start date and an end date.', true);
    return;
  }

  if (startTime > endTime) {
    showGalleryMessage('The start date must be on or before the end date.', true);
    return;
  }

  const dayCount = Math.floor((endTime - startTime) / 86400000) + 1;
  if (dayCount > 1000) {
    showGalleryMessage('Choose a date range of 1,000 days or fewer.', true);
    return;
  }

  getImagesButton.disabled = true;
  showGalleryMessage('🔄 Loading space photos…');

  try {
    const params = new URLSearchParams({
      start_date: startDate,
      end_date: endDate,
      api_key: apiKey,
      thumbs: 'true'
    });
    const response = await fetch(`https://api.nasa.gov/planetary/apod?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || `NASA API request failed (${response.status}).`);
    }

    if (!Array.isArray(data)) {
      throw new Error('NASA returned an unexpected response. Please try again.');
    }

    if (data.length === 0) {
      showGalleryMessage('No space photos were found for that date range.');
      return;
    }

    gallery.replaceChildren(...data.map(createGalleryItem));
  } catch (error) {
    showGalleryMessage(`Unable to load space photos: ${error.message}`, true);
  } finally {
    getImagesButton.disabled = false;
  }
}

getImagesButton.addEventListener('click', loadSpaceImages);
closeButton.addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.close();
  }
});
