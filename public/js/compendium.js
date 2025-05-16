let allItems = [];

// Load compendium items
async function loadCompendiumItems() {
    const response = await fetch('/api/compendium');
    const responseData = await response.json();
    const items = responseData.data.data;
    window.allItems = items;
    displayItems(items);
}

// Display items in the grid
function displayItems(items) {
    const grid = document.getElementById('compendium-grid');
    grid.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'compendium-card';
        card.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="card-footer">
                <span class="category">${item.category}</span>
                <button onclick="showDetails(${item.id})">Details</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter items based on search input
function filterItems() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const filteredItems = window.allItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
    );
    displayItems(filteredItems);
}

// Show item details
async function showDetails(id) {
    const response = await fetch(`/api/compendium/${id}`);
    const data = await response.json();

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${data.name || 'Unknown'}</h2>
            <p>${data.description || 'No description available'}</p>
            <div class="details">
                <p><strong>Category:</strong> ${data.category || 'N/A'}</p>
                <p><strong>Location:</strong> ${data.common_locations ? data.common_locations.join(', ') : 'N/A'}</p>
                <p><strong>Drops:</strong> ${data.drops && data.drops.length > 0 ? data.drops.join(', ') : 'N/A'}</p>
                <p><strong>Edible:</strong> ${data.edible ? 'Yes' : 'No'}</p>
                <p><strong>DLC:</strong> ${data.dlc ? 'Yes' : 'No'}</p>
            </div>
            <div class="comments-section">
                <h3>Comments</h3>
                <div class="comments-list">
                    ${data.comments && data.comments.length > 0 ? data.comments.map(comment => `
                        <div class="comment">
                            <p>${comment.comment}</p>
                            <small>Posted on ${new Date(comment.created_at).toLocaleDateString()}</small>
                        </div>
                    `).join('') : '<p>No comments yet</p>'}
                </div>
                <form onsubmit="addComment(event, ${id})">
                    <textarea placeholder="Add a comment..." required></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close');
    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };
}

// Add comment
async function addComment(event, itemId) {
    event.preventDefault();
    const form = event.target;
    const textarea = form.querySelector('textarea');
    const comment = textarea.value;

    await fetch('/api/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: 1,
            entry_id: itemId,
            comment: comment
        })
    });

    showDetails(itemId);
    textarea.value = '';
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCompendiumItems();
    
    // Add search input event listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', filterItems);
    }
}); 