document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const closeButton = document.getElementById('close-button');
    const fullscreenContent = document.getElementById('fullscreen-content');
    const themeCheckbox = document.getElementById('checkbox');

    let modules = [];
    let currentModule = null;
    let currentImageIndex = 0;
    let imageList = [];

    // Function to shuffle an array (Fisher-Yates shuffle)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Function to load modules from data.json
    async function loadModules() {
        try {
            const response = await fetch('assets/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            modules = await response.json();
            initializeGrid();
        } catch (error) {
            console.error('Error loading modules:', error);
            alert('Failed to load modules. Check the console for errors.');
        }
    }

    // Function to load images from the module's data
    async function loadImages(module) {
        imageList = module.images.map(image => `assets/${module.folder}/${image}`);
        shuffleArray(imageList);
    }

    // Function to display a learning module in fullscreen
    function displayImage(index) {
        if (index >= 0 && index < imageList.length) {
            const imagePath = imageList[index];
            fullscreenImage.src = imagePath;

            // Extract filename without extension
            const filenameWithExtension = imagePath.substring(imagePath.lastIndexOf('/') + 1);
            const filename = filenameWithExtension.substring(0, filenameWithExtension.lastIndexOf('.'));

            // Create or update the filename element
            let filenameElement = document.getElementById('filename-display');
            if (!filenameElement) {
                filenameElement = document.createElement('p');
                filenameElement.id = 'filename-display';
                fullscreenContent.appendChild(filenameElement); // Add to the container
            }
            filenameElement.textContent = filename;
            currentImageIndex = index;
        }
    }

    // Event listeners for navigation
    prevButton.addEventListener('click', () => {
        displayImage(currentImageIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        displayImage(currentImageIndex + 1);
    });

    closeButton.addEventListener('click', () => {
        closeFullscreen(); // Use function to close fullscreen
    });

    // Function to create grid items
    function createGridItem(module) {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item');
        gridItem.textContent = module.name;

        gridItem.addEventListener('click', async () => {
            currentModule = module;
            await loadImages(module); // Pass the module object
            currentImageIndex = 0;
            displayImage(currentImageIndex);
            fullscreenOverlay.classList.remove('hidden');
        });

        return gridItem;
    }

    // Initialize the grid
    function initializeGrid() {
        gridContainer.innerHTML = ''; // Clear existing items

        // Add Translate Module first
        const translateItem = document.createElement('div');
        translateItem.className = 'grid-item';
        translateItem.textContent = 'Translate';
        translateItem.onclick = () => openIframePopup('https://translate.spotrot.com');
        gridContainer.appendChild(translateItem);

        modules.forEach(module => {
            const gridItem = createGridItem(module);
            gridContainer.appendChild(gridItem);
        });
    }

    // Load the modules and initialize the grid
    loadModules();

    // ------------------ Swipe Gesture ------------------
    let touchstartX = 0;
    let touchendX = 0;

    fullscreenContent.addEventListener('touchstart', (e) => {
        touchstartX = e.changedTouches[0].screenX;
    });

    fullscreenContent.addEventListener('touchend', (e) => {
        touchendX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeDistance = touchendX - touchstartX;
        const swipeThreshold = 50; // Adjust as needed

        if (swipeDistance > swipeThreshold) {
            // Swipe right (previous)
            displayImage(currentImageIndex - 1);
        } else if (swipeDistance < -swipeThreshold) {
            // Swipe left (next)
            displayImage(currentImageIndex + 1);
        }
    }
    // ------------------Click Outside Event ------------------
    fullscreenOverlay.addEventListener('click', function(event) {
        if (event.target === fullscreenOverlay) {
            closeFullscreen();
        }
    });

    // ------------------ Helper function  ------------------
    function closeFullscreen() {
        fullscreenOverlay.classList.add('hidden');
        currentModule = null;
        imageList = [];
    }

    // ------------------ Theme Toggle ------------------
    themeCheckbox.addEventListener('change', () => {
        const targetTheme = themeCheckbox.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', targetTheme);
    });

    function openIframePopup(url) {
        document.getElementById('iframe-viewer').src = url;
        document.getElementById('iframe-popup').classList.remove('hidden');
    }
    
    function closeIframePopup() {
        document.getElementById('iframe-popup').classList.add('hidden');
        document.getElementById('iframe-viewer').src = ''; // Reset for performance
    } 

});