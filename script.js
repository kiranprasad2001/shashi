document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenImage = document.getElementById('fullscreen-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const closeButton = document.getElementById('close-button');
    const fullscreenContent = document.getElementById('fullscreen-content'); // Get the fullscreen content div

    let modules = []; // Will be loaded from JSON
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
            const response = await fetch('assets/data.json'); // Fetch the JSON file
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            modules = await response.json(); // Parse the JSON data
            initializeGrid(); // Initialize the grid after loading modules
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
        fullscreenOverlay.classList.add('hidden');
        currentModule = null;
        imageList = [];
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
        modules.forEach(module => {
            const gridItem = createGridItem(module);
            gridContainer.appendChild(gridItem);
        });
    }

    // Load the modules and initialize the grid
    loadModules();
});