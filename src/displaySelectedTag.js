export function displaySelectedTags(tags) {
    const existing = document.getElementById('tagInfo');
    // remove previous tagInfo, clear tag notice when no filter
    if (existing) {
        existing.remove(); 
    }

    if (tags.length === 0) return;

    // create tag notice when select tags
    const tagInfo = document.createElement('p');
    tagInfo.id = 'tagInfo';     // add id to DOM, so it won't break logic when clear
    tagInfo.textContent = `Filtering by tags: ${tags.join(', ')}`;
    tagInfo.style.fontStyle = 'italic';

    // Insert tagInfo BEFORE the gallery
    const gallery = document.getElementById('gallery');
    gallery.parentNode.insertBefore(tagInfo, gallery);
}