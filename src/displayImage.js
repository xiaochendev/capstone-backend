export function displayImages(images){
    if (!images || !Array.isArray(images)) {
        console.error('displayImages expects an array of images, got:', images);
        return;
    }

    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    images.forEach(image => {
        const card = document.createElement('div');
        card.className = 'waifu-card';

        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.tags.map(t => t.name).join(', ');
        img.style.maxWidth = '300px';
        img.style.borderRadius = '10px';
        img.style.display = 'block';
        img.style.marginBottom = '10px';

        const info = document.createElement('div');
        info.className = 'info';  

        const artist = image.artist?.name ?? 'Unknown';
        info.innerHTML = `
            <strong>Artist:</strong> ${artist}<br>
            <strong>Size:</strong> ${image.width} X ${image.height}<br>
            <strong>Tags:</strong> ${image.tags.map(t => t.name).join(', ')}
        `;

        card.appendChild(img);
        card.appendChild(info);
        gallery.appendChild(card);
    });
}