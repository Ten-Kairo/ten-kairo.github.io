// Array holding configuration items for watch faces
const watchFaces = [
    {
        title: "Ahsoka",
        description: "",
        image: "images/Ahsoka.png",
        storeUrl: "",
        tags: ["Analog", "Star Wars", "Sci-Fi"],
        featured: true
    },
    {
        title: "Coming Soon",
        description: "",
        image: "", 
        storeUrl: "", 
        tags: [],
        featured: false
    },
    {
        title: "Coming Soon",
        description: "",
        image: "",
        storeUrl: "",
        tags: [],
        featured: false
    }
];

// Document Selectors
const grid = document.getElementById('faces-grid');
const searchBar = document.getElementById('search-bar');
const tabsContainer = document.getElementById('filter-tabs-container');

// State tracking metrics
let activeFilter = 'all';
let searchQuery = '';

/**
 * Reads data array, extracts all unique tags, counts them, and renders button pills
 */
function buildFilterButtons() {
    const counts = { all: watchFaces.length };
    
    watchFaces.forEach(face => {
        if (face.tags) {
            face.tags.forEach(tag => {
                const normalized = tag.toLowerCase();
                counts[normalized] = (counts[normalized] || 0) + 1;
            });
        }
    });

    const uniqueTags = Object.keys(counts).filter(k => k !== 'all').sort();
    
    tabsContainer.innerHTML = '';
    createButton('all', `All`, counts['all']);

    uniqueTags.forEach(tag => {
        const displayLabel = tag.charAt(0).toUpperCase() + tag.slice(1);
        createButton(tag, displayLabel, counts[tag]);
    });
}

/**
 * Core rendering helper for a single filter button element
 */
function createButton(filterValue, label, count) {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${activeFilter === filterValue ? 'active' : ''}`;
    btn.setAttribute('data-filter', filterValue);
    btn.innerHTML = `${label} <span class="filter-count">${count}</span>`;
    
    btn.addEventListener('click', () => {
        activeFilter = filterValue;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderPortfolio();
    });
    
    tabsContainer.appendChild(btn);
}

/**
 * Global application-accessible function to wipe text query fields
 */
function clearSearch() {
    searchBar.value = '';
    searchQuery = '';
    renderPortfolio();
}

/**
 * Main application interface build engine
 */
function renderPortfolio() {
    grid.innerHTML = '';

    const filteredFaces = watchFaces.filter(face => {
        const matchesSearch = face.title.toLowerCase().includes(searchQuery) || 
                              face.description.toLowerCase().includes(searchQuery);
        
        const matchesTag = activeFilter === 'all' || 
                           (face.tags && face.tags.some(t => t.toLowerCase() === activeFilter));

        return matchesSearch && matchesTag;
    });

    // Empty Results Exception Block
    if (filteredFaces.length === 0) {
        grid.innerHTML = `
            <div class="no-results-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                <h3>No Watch Faces Found</h3>
                <p>We couldn't find matches for your search parameters. Try resetting the filters or keywords.</p>
                <button class="reset-btn" onclick="clearSearch()">Clear Search</button>
            </div>
        `;
        return;
    }

    // Main Card Generation Mapping Loop
    filteredFaces.forEach(face => {
        const card = document.createElement('div');
        card.className = 'card';
        
        const featuredHTML = face.featured 
            ? `<div class="featured-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/></svg>
                Featured
               </div>` 
            : '';

        const tagsHTML = face.tags && face.tags.length > 0 
            ? `<div class="tags-container">${face.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>`
            : '';

        const hasUrl = face.storeUrl && face.storeUrl.trim() !== "";
        const hasImage = face.image && face.image.trim() !== "";
        
        const previewHTML = hasImage 
            ? `<img class="watch-preview" src="${face.image}" alt="${face.title} preview">`
            : `<div class="watch-preview-placeholder"><span>Coming Soon</span></div>`;

        const btnClass = hasUrl ? "btn" : "btn disabled";
        const btnHref = hasUrl ? `href="${face.storeUrl}" target="_blank" rel="noopener noreferrer"` : '';
        const btnText = hasUrl ? "Get it on Google Play" : "Coming Soon";

        card.innerHTML = `
            ${featuredHTML}
            <div class="image-container">${previewHTML}</div>
            <div class="content">
                <h2 class="title">${face.title}</h2>
                ${tagsHTML}
                <p class="description">${face.description}</p>
                <a ${btnHref} class="${btnClass}">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L21,12.91C21.57,13.2 21.57,14.03 21,14.31L17.87,15.9L16.89,12L17.87,11.33M3,3.41C3.33,3.41 3.67,3.5 4,3.65L18.73,11.23L15.65,12.31L3,3.41M3,20.81L15.65,11.91L18.73,13L4,20.57C3.67,20.72 3.33,20.81 3,20.81Z" />
                    </svg>
                    <span>${btnText}</span>
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global Event Action Listeners
searchBar.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    renderPortfolio();
});

// Primary Start execution sequencing
buildFilterButtons();
renderPortfolio();
