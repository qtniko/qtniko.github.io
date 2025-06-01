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

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.download-button');

  button.addEventListener('click', () => {
    const container = document.querySelector('.image-container');
    const imageUrl = container.dataset.imageUrl;

    if (!imageUrl) {
      console.error('No image available to download.');
      return;
    }

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `image.${imageUrl.endsWith('.gif') ? 'gif' : 'png'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
});
