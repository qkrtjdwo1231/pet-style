// Mock Data
const data = {
    breeds: [
        { id: 'maltese', name: '말티즈', emoji: '🐶' },
        { id: 'poodle', name: '푸들', emoji: '🐩' },
        { id: 'pomeranian', name: '포메라니안', emoji: '🦊' },
        { id: 'bichon', name: '비숑 프리제', emoji: '☁️' }
    ],
    styles: {
        'maltese': ['알머리', '베이비컷', '썸머컷'],
        'poodle': ['테디베어컷', '브로콜리컷', '스포팅'],
        'pomeranian': ['곰돌이컷', '물개컷', '진돗개컷'],
        'bichon': ['하이바', '귀툭튀', '스포팅']
    },
    shops: [
        {
            id: 1,
            name: '멍멍 뷰티살롱',
            location: '강남구',
            distance: '1.2km',
            rating: 4.8,
            reviews: 124,
            availableStyles: ['테디베어컷', '곰돌이컷', '귀툭튀', '베이비컷']
        },
        {
            id: 2,
            name: '해피 퍼피 양재',
            location: '서초구',
            distance: '2.5km',
            rating: 4.9,
            reviews: 312,
            availableStyles: ['알머리', '썸머컷', '브로콜리컷', '물개컷', '진돗개컷', '하이바', '스포팅']
        },
        {
            id: 3,
            name: '스타일 독',
            location: '송파구',
            distance: '3.1km',
            rating: 4.6,
            reviews: 89,
            availableStyles: ['곰돌이컷', '하이바', '베이비컷', '테디베어컷', '썸머컷']
        },
        {
            id: 4,
            name: '바둑이 그루밍',
            location: '강동구',
            distance: '4.5km',
            rating: 4.7,
            reviews: 204,
            availableStyles: ['알머리', '브로콜리컷', '진돗개컷', '스포팅', '물개컷', '귀툭튀']
        }
    ]
};

// State
let selectedBreed = null;
let selectedStyle = null;

// DOM Elements
const breedOptions = document.getElementById('breed-options');
const styleStep = document.getElementById('style-step');
const styleOptions = document.getElementById('style-options');
const searchBtn = document.getElementById('search-btn');
const resultsSection = document.getElementById('results-section');
const shopsContainer = document.getElementById('shops-container');

// Initialize
function init() {
    renderBreeds();
}

function renderBreeds() {
    breedOptions.innerHTML = '';
    data.breeds.forEach(breed => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `
            <span style="font-size: 2rem;">${breed.emoji}</span>
            <span>${breed.name}</span>
        `;
        card.onclick = () => selectBreed(breed.id, card);
        breedOptions.appendChild(card);
    });
}

function selectBreed(breedId, cardElement) {
    // Update State
    selectedBreed = breedId;
    selectedStyle = null; // Reset style when breed changes

    // Update UI
    document.querySelectorAll('#breed-options .option-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    // Enable Style Step
    styleStep.classList.remove('disabled');

    // Render Styles
    renderStyles(breedId);

    // Disable Search Button
    updateSearchButton();

    // Hide Results
    resultsSection.classList.add('hidden');
}

function renderStyles(breedId) {
    styleOptions.innerHTML = '';
    const styles = data.styles[breedId];

    styles.forEach(style => {
        const card = document.createElement('div');
        card.className = 'option-card';
        card.innerHTML = `<span>✂️ ${style}</span>`;
        card.onclick = () => selectStyle(style, card);
        styleOptions.appendChild(card);
    });
}

function selectStyle(style, cardElement) {
    selectedStyle = style;

    document.querySelectorAll('#style-options .option-card').forEach(c => c.classList.remove('selected'));
    cardElement.classList.add('selected');

    updateSearchButton();
    resultsSection.classList.add('hidden');
}

function updateSearchButton() {
    if (selectedBreed && selectedStyle) {
        searchBtn.disabled = false;
    } else {
        searchBtn.disabled = true;
    }
}

searchBtn.addEventListener('click', () => {
    // Show loading or scroll down
    resultsSection.classList.remove('hidden');
    renderResults();

    // Smooth scroll to results
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }, 100);
});

function renderResults() {
    shopsContainer.innerHTML = '';

    // Find matching shops
    const matchingShops = data.shops.filter(shop => shop.availableStyles.includes(selectedStyle));

    if (matchingShops.length === 0) {
        shopsContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--gray);">해당 스타일이 가능한 매장을 찾을 수 없습니다.</p>`;
        return;
    }

    matchingShops.forEach(shop => {
        // Tag rendering
        const allTags = shop.availableStyles.slice(0, 4); // show max 4
        let tagsHtml = allTags.map(tag => {
            if (tag === selectedStyle) {
                return `<span class="tag match-tag">✨ ${tag}</span>`;
            }
            return `<span class="tag">${tag}</span>`;
        }).join('');

        if (shop.availableStyles.length > 4) {
            tagsHtml += `<span class="tag">등 ${shop.availableStyles.length}개</span>`;
        }

        // Select an image from realistic grooming examples based on shop id
        const images = [
            'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1594149929911-78975a43d4f5?auto=format&fit=crop&q=80&w=400',
            'https://images.unsplash.com/photo-1537151608804-ea2f105bb58f?auto=format&fit=crop&q=80&w=400'
        ];
        const portfolioImage = images[(shop.id - 1) % images.length];

        const shopCard = document.createElement('div');
        shopCard.className = 'shop-card';
        shopCard.innerHTML = `
            <div class="shop-portfolio">
                <img src="${portfolioImage}" alt="${selectedStyle} 시술 예시" class="portfolio-img">
                <div class="portfolio-overlay">
                    <span class="portfolio-badge">✨ ${selectedStyle} 예시</span>
                </div>
            </div>
            <div class="shop-info">
                <h3 class="shop-name">${shop.name}</h3>
                <div class="shop-meta">
                    <span>📍 ${shop.location} (${shop.distance})</span>
                    <span>⭐ ${shop.rating} (${shop.reviews})</span>
                </div>
                <div class="shop-tags">
                    ${tagsHtml}
                </div>
                <button class="book-btn">예약하기</button>
            </div>
        `;
        shopsContainer.appendChild(shopCard);
    });
}

// Start app
init();
