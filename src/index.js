// Use the fetch API or Axios to communicate with an external web API. 
// Create user interaction with the API through a search feature, paginated gallery, or similar.
// Make use of Promises and async/await syntax as appropriate.
// Organize your JavaScript code into at least three (3) different module files;
// Create an engaging user experience through the use of HTML and CSS.

// |--------------------------------------------III: Makes it Nice/reasonable when displayed--------------------------------------------------|

import { resetPage } from "./resetPage.js";
import { displaySelectedTags } from "./displaySelectedTag.js";
import { displayImages } from "./displayImage.js";

export async function getTags(){
    try {
        // Fetch tag list from API on load
        const res = await fetch('https://api.waifu.im/tags');
        const data = await res.json();
        // console.log(data);
        const sfwTags = data.versatile || [];           // got sfw[safe-for-work] tags
        // const nsfwTags = data.nsfw || [];

        // const alltags = [...sfwTags, ...nsfwTags];          //merged both groups;
        // console.log(alltags);
        return sfwTags;           
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

export function renderTagCheckBoxes(tags) {
    const container = document.getElementById("tagContainer");
    container.innerHTML = ''; // Clear existing 

    tags.forEach(tag => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.name = "tag";
        checkbox.value = tag; 

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${tag}`));

        container.appendChild(label);
    }); 
}

async function handleSearchBtn() {
    const allTags = await getTags();        // wait for tags before using

    document.getElementById('searchBtn').addEventListener('click', async () => {
        const gallery = document.getElementById('gallery');
        const selectedTags = Array.from(document.querySelectorAll(('input[name="tag"]:checked')))
                                .map(cb => cb.value);

        const input = document.getElementById('searchInput').value.trim().toLowerCase();
        // Clear input immediately 
        document.getElementById('searchInput').value = '';

        let tagsToSearch = [];

        if (input){
            // filter tags base on inpput
            const matchingTags = allTags.filter(tag => tag.toLowerCase().includes(input));

            if (matchingTags.length === 0) {
                gallery.innerHTML = '<p>💔💔💔 No Waifu been found according to your tags</p>';
                return;
            }
            tagsToSearch = matchingTags;
        } else if(selectedTags.length > 0) {
            tagsToSearch = selectedTags;
        }

        gallery.innerHTML = '<p>Loading...</p>';

        // try to fetch with multiple tags first, then fallback
        let fetchedImages = await tryFetchWithFallback(tagsToSearch);

        if (!fetchedImages || fetchedImages.length === 0) {
            gallery.innerHTML = '<p>💔💔💔 No Waifu found with selected tags.</p>';
            return;
        }

        displayImages(fetchedImages);

        // show "Filtering by tags: ..." msg
        displaySelectedTags(tagsToSearch);

        // renderTagCheckBoxes(matchingTags); // show related tag checkboxes
        const uniqueTagsSet = new Set();
        fetchedImages.forEach(image => {
            image.tags.forEach(tag => uniqueTagsSet.add(tag.name));
        });
        
        const uniqueTags = Array.from(uniqueTagsSet).sort();
        
        renderTagCheckBoxes(uniqueTags);    // show all relevant tags as checkboxes

        // attach filter event again with local scope
        attachFilterEventCheckboxHandler(fetchedImages);
    });
};

async function tryFetchWithFallback(tagsToSearch) {
    // if no tags provided, fetch random
    if (!tagsToSearch || tagsToSearch.length === 0) {
        try {
            const res = await fetch('https://api.waifu.im/search?many=true');
            if (res.ok) {
                const data = await res.json();
                return data.images;
            }
        } catch (e) {
            console.error('Random waifu fetch failed:', e);
        }
        return [];
    }

    // Try full combination first (if 1-2 tags)
    if (tagsToSearch.length > 0 && tagsToSearch.length <= 2) {
        const comboParams = new URLSearchParams();
        tagsToSearch.forEach(tag => comboParams.append('included_tags', tag));
        comboParams.append('many', 'true');

        const comboUrl = `https://api.waifu.im/search?${comboParams.toString()}`;

        try {
            const comboRes = await fetch(comboUrl);
            if (comboRes.ok) {
                const comboData = await comboRes.json();
                if (comboData.images.length > 0) {
                    return comboData.images;
                }
            }
        } catch (e) {
            console.warn('⁉️ Combo search failed:', e);
        }
    }

    // Fallback: try each tag individually
    for (let tag of tagsToSearch) {
        const singleParams = new URLSearchParams();
        singleParams.append('included_tags', tag);
        singleParams.append('many', 'true');

        const singleUrl = `https://api.waifu.im/search?${singleParams.toString()}`;

        try {
            const res = await fetch(singleUrl);
            if (res.ok) {
                const data = await res.json();
                if (data.images.length > 0) {
                    return data.images;
                }
            }
        } catch (e) {
            console.warn(`Fallback failed for tag: ${tag}`);
        }
    }

    return [];
}

// Instead of a global variable, use attachFilterCheckboxHandler func to track selected tags
function attachFilterCheckboxHandler(images) {
    const checkboxes = document.querySelectorAll('input[name="tag"]');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const selected = Array.from(checkboxes)
                .filter(box => box.checked)
                .map(box => box.value);

            const filtered = images.filter(image => {
                const tagNames = image.tags.map(tag => tag.name);
                return selected.every(tag => tagNames.includes(tag));
            });

            displayImages(filtered);
            displaySelectedTags(selected);
        });
    });
}


document.addEventListener('DOMContentLoaded', async() => {
    const allTags = await getTags();
    renderTagCheckBoxes(allTags);
    handleSearchBtn();

    // restart button
    document.getElementById('restartBtn').addEventListener('click', resetPage);
});




// |--------------------------------------------III: end of Makes it Nice/reasonable when displayed-------------------------------------------|



// |---------------------------------------------I: Initial Testing make sure got data from API ------------------------------------------|
// const apiUrl = 'https://api.waifu.im/search';  // Replace with the actual API endpoint URL

// // tags options: "waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"
//     //  {"versatile": [ "maid", "waifu", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"],
//   // "nsfw": [ "ass", "hentai", "milf", "oral", "paizuri", "ecchi", "ero"]}

// const params = {
//   included_tags: ['raiden-shogun', 'maid'],
//   height: '>=2000'
// };

// const queryParams = new URLSearchParams();

// for (const key in params) {
//   if (Array.isArray(params[key])) {
//     params[key].forEach(value => {
//       queryParams.append(key, value);
//     });
//   } else {
//     queryParams.set(key, params[key]);
//   }
// }
// const requestUrl = `${apiUrl}?${queryParams.toString()}`;

// fetch(requestUrl)
//   .then(response => {
//     if (response.ok) {
//       return response.json();
//     } else {
//       throw new Error('Request failed with status code: ' + response.status);
//     }
//   })
//   .then(data => {
//     // Process the response data as needed
//      console.log(data);
//     const gallery = document.getElementById("gallery");
//     if (data.images && data.images.length > 0){
//         data.images.forEach(image => {
//             const img = document.createElement('img');
//             img.src = image.url;
//             img.alt = image.name;
//             gallery.appendChild(img);
//         })
//     } else {
//         gallery.innerHTML = '<p>No images found</p>';
//     }

//   })
//   .catch(error => {
//     console.error('An error occurred:', error.message);
//     document.getElementById('gallery').innerHTML = '<p>Error loading images</p>';
//   });

// |---------------------------------------------end of I: initial Testing make sure got data from API ------------------------------------------|



// |-----------------------------------------------II: What should i do to display fetched data ------------------------------------------------|

//   function createButtons(){
//     const availableTags = ["waifu", "maid", "marin-kitagawa", "mori-calliope", "raiden-shogun", "oppai", "selfies", "uniform", "kamisato-ayaka"];
//     const tagContainer = document.getElementById('tagContainer');
//     availableTags.forEach(tag => {
//         const btn = document.createElement('button');
//         btn.textContent = tag;
//         btn.className = 'tag-btn';
//         btn.addEventListener('click', () => fetchWaifuByTag(tag));
//         tagContainer.appendChild(btn);
//     });
//   }


//   function fetchWaifuByTag(tag) {
//     const apiUrl = 'https://api.waifu.im/search'; 
//     const queryParams = new URLSearchParams();
//     queryParams.append('included_tags', tag);
//     queryParams.append('height', '>=2000');
//     queryParams.append('many', 'true'); // Get more results

//     const requestUrl = `${apiUrl}?${queryParams.toString()}`;
//     gallery.innerHTML = '<p>Loading...</p>';

//     fetch(requestUrl)
//         .then(response => {
//             if(!response.ok){
//                 throw new error(`Request failed with status code:  ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             gallery.innerHTML = '';
//             if(data.images && data.images.length > 0){
//                 data.images.forEach(image => {
//                     const img = document.createElement('img');
//                     img.src = image.url;
//                     // extracted arr tag names from returned obj images and then join them as comma-seperated str;
//                     const tagNames = image.tags.map(tag => tag.name).join(",");       
//                     img.alt = tagNames;
//                     gallery.appendChild(img);
//                 })
//             } else {
//                 gallery.innerHTML = '<p>No images found for this tag.</p>';
//             }
//         })
//         .catch(err => {
//             console.log(`Error:`, err.message);
//             gallery.innerHTML = '<p>Failed to load images</p>';
//         })

//   }


// //   document.addEventListener("DOMContentLoaded",() => {
// //     createButtons();
// //   });
// |-----------------------------------------------II: end of What should i do to display fetched data ------------------------------------------------|

