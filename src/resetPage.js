import { getTags, renderTagCheckBoxes } from "./index.js";

export function resetPage() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear image gallery

    // Re-fetch and render all available tags
    getTags().then(allTags => {
        renderTagCheckBoxes(allTags);
    });

    // Optionally clear any selected checkboxes
    const checkboxes = document.querySelectorAll('input[name="tag"]');
    checkboxes.forEach(cb => cb.checked = false);

    // Remove "Filtering by tags" message if exists
    const existing = document.getElementById('tagInfo');
    if (existing) existing.remove();
}