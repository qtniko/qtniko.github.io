function setImage(url) {
  const container = document.querySelector('.image-container');
  container.innerHTML = '';

  if (!url.match(/\.(png|gif)$/i)) {
    console.error('hello :3');
    return;
  }

  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Awesome Emoji That U Cannot See';
  img.style.maxWidth = '100%';
  img.style.maxHeight = '100%';

  container.appendChild(img);
  container.dataset.imageUrl = url;
  setDownloadButtonState(true);
}

function setDownloadButtonState(state) {
  const button = document.querySelector('.download-button');
  button.disabled = !state;

  if (state) {
    button.classList.add('enabled');
  } else {
    button.classList.remove('enabled');
  }
}

async function resolveEmojiUrl(emojiId) {
  const base = `https://cdn.discordapp.com/emojis/${emojiId}`;
  const gifUrl = `${base}.gif`;
  const pngUrl = `${base}.png`;

  try {
    const gifResponse = await fetch(gifUrl, { method: 'HEAD' });
    if (gifResponse.ok) return gifUrl;
  } catch (e) {
    console.warn('GIF fetch failed:', e);
  }

  try {
    const pngResponse = await fetch(pngUrl, { method: 'HEAD' });
    if (pngResponse.ok) return pngUrl;
  } catch (e) {
    console.warn('PNG fetch failed:', e);
  }

  return undefined;
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.input-box');
  const button = document.querySelector('.download-button');
  const container = document.querySelector('.image-container');

  // Handle input changes
  input.addEventListener('input', async () => {
    const value = input.value.trim();

    if (!value) {
      setDownloadButtonState(false);
      container.innerHTML = '<span>No image yet</span>';
      return;
    }

    const url = await resolveEmojiUrl(value);

    if (url) {
      setImage(url);
    } else {
      setDownloadButtonState(false);
      container.innerHTML = '<span>Invalid or missing emoji</span>';
    }
  });

  // Handle download button click
  button.addEventListener('click', async () => {
    const imageUrl = container.dataset.imageUrl;
  
    if (!imageUrl) {
      console.error('No image available to download.');
      return;
    }
  
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      if (!response.ok) throw new Error('Failed to fetch image.');
  
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `emoji.${imageUrl.endsWith('.gif') ? 'gif' : 'png'}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Download failed:', err);
    }
  });
});
