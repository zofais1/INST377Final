const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 3000,
    },
});

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
}

async function loadFeaturedItems() {
    const response = await fetch('/api/compendium');
    const responseData = await response.json();
    const items = responseData.data.data;
    
    const randomItems = items
        .filter(item => item && typeof item === 'object')
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

    const sliderWrapper = document.getElementById('featured-slider');
    sliderWrapper.innerHTML = '';

    randomItems.forEach(item => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="featured-item">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
            </div>
        `;
        sliderWrapper.appendChild(slide);
    });

    swiper.update();
}

async function createStatisticsChart() {
    const response = await fetch('/api/compendium');
    const responseData = await response.json();
    const items = responseData.data.data;
    
    const categories = {};
    items
        .filter(item => item && typeof item === 'object')
        .forEach(item => {
            if (item.category) {
                categories[item.category] = (categories[item.category] || 0) + 1;
            }
        });

    const chartCanvas = document.getElementById('compendiumChart');
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#9b59b6',
                    '#e74c3c',
                    '#f1c40f',
                    '#1abc9c'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                },
                title: {
                    display: true,
                    text: 'Compendium Items by Category'
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedItems();
    createStatisticsChart();
}); 
