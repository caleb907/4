// Cart functions
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === id);
    
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${name} added to cart!`);
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartLink = document.querySelector('.nav-menu a[href="/cart.html"]');
    if (cartLink) {
        cartLink.textContent = count > 0 ? `Cart 🛒(${count})` : 'Cart 🛒';
    }
}

// Testimonial functions
async function loadTestimonials() {
    const container = document.getElementById('testimonials-list');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading spud love...</div>';
    
    try {
        const response = await fetch('/api/testimonials');
        const testimonials = await response.json();
        
        if (testimonials.length === 0) {
            container.innerHTML = '<div class="loading">🌟 No reviews yet — be the first!</div>';
            return;
        }
        
        container.innerHTML = testimonials.map(t => `
            <div class="testimonial-card">
                <div class="testimonial-rating">${'⭐'.repeat(t.rating)}</div>
                <div class="testimonial-text">"${escapeHtml(t.text)}"</div>
                <div class="testimonial-author">- ${escapeHtml(t.author)}</div>
                <div class="testimonial-date">${new Date(t.date).toLocaleDateString()}</div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="loading">⚠️ Failed to load reviews</div>';
    }
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});