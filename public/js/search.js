document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const categoryFilter = document.getElementById('category-filter');
    const priceRangeInput = document.getElementById('price-range'); // Updated ID
    const productsContainer = document.getElementById('products-container');
    const noResults = document.getElementById('no-results');

    const fetchProducts = async () => {
        const name = searchInput.value;
        const category = categoryFilter.value;
        const maxPrice = priceRangeInput.value; // Taking value from the slider

        // Build the URL for your fixed backend route
        let url = `http://localhost:3000/api/products/search?`;
        if (name) url += `name=${encodeURIComponent(name)}&`;
        if (category) url += `category=${category}&`;
        if (maxPrice) url += `maxPrice=${maxPrice}&`;

        try {
            console.log("Fetching:", url); // For debugging in F12 console
            const res = await fetch(url);
            const products = await res.json();
            
            renderProducts(products);
        } catch (err) {
            console.error("Search failed:", err);
        }
    };

    function renderProducts(products) {
        productsContainer.innerHTML = '';
        
        if (!products || products.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        
        // Match your boutique's luxury style
        products.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid #d4af37;
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 20px;
                color: white;
                text-align: center;
            `;
            
            card.innerHTML = `
                <img src="images/logo.png" style="width: 100px; margin-bottom: 10px;">
                <h3 style="color: #d4af37; margin: 10px 0;">${item.name}</h3>
                <p style="font-size: 0.9rem; opacity: 0.8;">${item.category}</p>
                <p style="font-size: 1.2rem; font-weight: bold;">${item.price.toLocaleString()} KZT</p>
            `;
            productsContainer.appendChild(card);
        });
    }

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        fetchProducts();
    });

    // Initial load to show all products
    fetchProducts();
});