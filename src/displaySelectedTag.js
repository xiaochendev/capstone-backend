export function displaySelectedTags(tags) {
    const gallery = document.getElementById('gallery');

    const existing = document.getElementById('tagInfo');
    // remove previous, clear tag notice when no filter
    if (existing) existing.remove(); 

    if (tags.length === 0) return;

    // create tag notice when select tags
    const tagInfo = document.createElement('p');
    tagInfo.textContent = `Filtering by tags: ${tags.join(', ')}`;
    tagInfo.style.fontStyle = 'italic';

    gallery.insertBefore(tagInfo, gallery.firstChild);
}