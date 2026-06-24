// Data State for the 4 Items
let currentTab = 0;

// Default templates for all 4 cards
const cardsData = [
];

// Form Inputs
const inputs = {
    name: document.getElementById('inputName'),
    type: document.getElementById('inputType'),
    weight: document.getElementById('inputWeight'),
    attunement: document.getElementById('inputAttunement'),
    desc: document.getElementById('inputDesc'),
    rules: document.getElementById('inputRules'),
    footerFront: document.getElementById('inputFooterFront'),
    footerBack: document.getElementById('inputFooterBack'),
    brightness: document.getElementById('brightnessSlider')
};
const brightnessVal = document.getElementById('brightnessVal');
const imageUpload = document.getElementById('imageUpload');

// 3D Card Interaction
const theCard = document.getElementById('theCard');
document.getElementById('cardScene').addEventListener('click', () => {
    theCard.classList.toggle('is-flipped');
});

// ----------------------------------------------------------------------
// DOM Cloning: Build Print grid to perfectly match styles of UI
// ----------------------------------------------------------------------
function setupPrintDOM() {
    const printLayout = document.getElementById('print-layout');
    const mainFront = document.querySelector('.card-face-front');
    const mainBack = document.querySelector('.card-face-back');

    const pageFronts = document.createElement('div');
    pageFronts.className = 'print-page';
    const pageBacks = document.createElement('div');
    pageBacks.className = 'print-page';

    // Print Matrix Grid Indexes 
    const frontOrder = [0, 1, 2, 3];
    // Mirror Matrix for correct double-sided printing behind fronts
    const backOrder = [1, 0, 3, 2];

    frontOrder.forEach(idx => {
        const clone = mainFront.cloneNode(true);
        clone.id = `print-front-${idx}`;
        pageFronts.appendChild(clone);
    });

    backOrder.forEach(idx => {
        const clone = mainBack.cloneNode(true);
        clone.id = `print-back-${idx}`;
        
        // Clear the cloned canvas container and generate a unique canvas tag
        const canvasContainer = clone.querySelector('.flex-grow');
        canvasContainer.innerHTML = ''; 
        const newCanvas = document.createElement('canvas');
        newCanvas.className = 'max-w-full max-h-full object-contain';
        newCanvas.style.imageRendering = 'pixelated';
        newCanvas.id = `print-canvas-${idx}`;
        canvasContainer.appendChild(newCanvas);

        pageBacks.appendChild(clone);
    });

    printLayout.appendChild(pageFronts);
    printLayout.appendChild(pageBacks);
}

// ----------------------------------------------------------------------
// Tab Management & State Handling
// ----------------------------------------------------------------------
function switchTab(index) {
    // Save state of current tab before switching
    saveCurrentTabState();
    
    // Switch index
    currentTab = index;

    // Update UI Tab Styles
    for(let i=0; i<4; i++) {
        const btn = document.getElementById(`tab-${i}`);
        if(i === index) {
            btn.className = "tab-btn flex-1 py-1.5 px-2 text-sm font-bold rounded bg-amber-600 text-white transition-colors";
        } else {
            btn.className = "tab-btn flex-1 py-1.5 px-2 text-sm font-bold rounded bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors";
        }
    }

    // Load new state into inputs
    loadStateIntoInputs();
    
    // Re-render visuals
    updateAllVisuals();
}

function saveCurrentTabState() {
    const c = cardsData[currentTab];
    c.name = inputs.name.value;
    c.type = inputs.type.value;
    c.weight = inputs.weight.value;
    c.attunement = inputs.attunement.checked;
    c.desc = inputs.desc.value;
    c.rules = inputs.rules.value;
    c.fFront = inputs.footerFront.value;
    c.fBack = inputs.footerBack.value;
    c.bright = parseInt(inputs.brightness.value);
}

function loadStateIntoInputs() {
    const c = cardsData[currentTab];
    inputs.name.value = c.name;
    inputs.type.value = c.type;
    inputs.weight.value = c.weight;
    inputs.attunement.checked = c.attunement;
    inputs.desc.value = c.desc;
    inputs.rules.value = c.rules;
    inputs.footerFront.value = c.fFront;
    inputs.footerBack.value = c.fBack;
    inputs.brightness.value = c.bright;
    brightnessVal.textContent = c.bright;
    
    // Clear file upload UI visually to indicate ready for new load
    imageUpload.value = '';
}

// Watch for any text/slider changes to sync in real time
Object.values(inputs).forEach(input => {
    input.addEventListener('input', () => {
        saveCurrentTabState();
        updateAllVisuals();
        if(input === inputs.brightness) {
            brightnessVal.textContent = input.value;
        }
    });
    if(input.type === 'checkbox') {
        input.addEventListener('change', () => {
            saveCurrentTabState();
            updateAllVisuals();
        });
    }
});

// ----------------------------------------------------------------------
// Rendering engine for Data -> HTML Elements
// ----------------------------------------------------------------------
function renderCardDataToElement(container, data) {
    if(!container) return;
    const applyText = (targetStr, text) => {
        const el = container.querySelector(`[data-target="${targetStr}"]`);
        if(el) el.textContent = text;
    };

    applyText('name', data.name || 'Unnamed Item');
    applyText('type', data.type);
    applyText('weight', data.weight);
    applyText('desc', data.desc);
    applyText('rules', data.rules);
    applyText('footerFront', data.fFront);
    applyText('nameBack', data.name || 'Unnamed Item');
    applyText('footerBack', data.fBack);

    const attEl = container.querySelector('[data-target="attunement"]');
    if(attEl) {
        if (data.attunement) attEl.classList.remove('hidden');
        else attEl.classList.add('hidden');
    }
}

function updateAllVisuals() {
    // Render Active UI Card
    renderCardDataToElement(document.getElementById('theCard'), cardsData[currentTab]);
    applyImageToCanvas(cardsData[currentTab], document.getElementById('artCanvas'));

    // Render all 4 Print Cards
    cardsData.forEach((cardState, idx) => {
        renderCardDataToElement(document.getElementById(`print-front-${idx}`), cardState);
        renderCardDataToElement(document.getElementById(`print-back-${idx}`), cardState);
        applyImageToCanvas(cardState, document.getElementById(`print-canvas-${idx}`));
    });
}

// ----------------------------------------------------------------------
// Image Processing / Dithering
// ----------------------------------------------------------------------
imageUpload.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            cardsData[currentTab].img = img;
            updateAllVisuals();
            // Auto-flip to back so user sees the change
            if (!theCard.classList.contains('is-flipped')) {
                theCard.classList.add('is-flipped');
            }
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

function applyImageToCanvas(cardData, targetCanvas) {
    if(!targetCanvas) return;
    
    const currentImg = cardData.img;
    if(!currentImg) {
        drawPlaceholder(targetCanvas);
        return;
    }

    const ctx = targetCanvas.getContext('2d', { willReadFrequently: true });
    
    const MAX_SIZE = 300; 
    let width = currentImg.width;
    let height = currentImg.height;
    
    if (width > height) {
        if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
        }
    } else {
        if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
        }
    }
    
    targetCanvas.width = Math.floor(width);
    targetCanvas.height = Math.floor(height);

    ctx.drawImage(currentImg, 0, 0, targetCanvas.width, targetCanvas.height);

    const imageData = ctx.getImageData(0, 0, targetCanvas.width, targetCanvas.height);
    const data = imageData.data;
    const w = targetCanvas.width;
    const h = targetCanvas.height;
    
    const brightnessOffset = cardData.bright;

    const gray = new Float32Array(w * h);
    for (let i = 0; i < data.length; i += 4) {
        let lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        lum = Math.max(0, Math.min(255, lum + brightnessOffset));
        gray[i / 4] = lum;
    }

    // Floyd-Steinberg Dithering
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = y * w + x;
            const oldPixel = gray[idx];
            const newPixel = oldPixel < 128 ? 0 : 255;
            gray[idx] = newPixel;
            
            const quantError = oldPixel - newPixel;

            if (x + 1 < w) gray[idx + 1] += quantError * 7 / 16;
            if (y + 1 < h) {
                if (x - 1 >= 0) gray[idx + w - 1] += quantError * 3 / 16;
                gray[idx + w] += quantError * 5 / 16;
                if (x + 1 < w) gray[idx + w + 1] += quantError * 1 / 16;
            }
        }
    }

    // Target ink color: #1c1815 -> R:28, G:24, B:21
    for (let i = 0; i < gray.length; i++) {
        const val = gray[i];
        const idx = i * 4;
        if (val === 0) {
            data[idx] = 28;     // R
            data[idx + 1] = 24; // G
            data[idx + 2] = 21; // B
            data[idx + 3] = 255; // Alpha
        } else {
            data[idx] = 0;
            data[idx + 1] = 0;
            data[idx + 2] = 0;
            data[idx + 3] = 0; // Alpha Transparent (parchment shows through)
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function drawPlaceholder(targetCanvas) {
    if(!targetCanvas) return;
    const ctx = targetCanvas.getContext('2d');
    targetCanvas.width = 150;
    targetCanvas.height = 150;
    ctx.clearRect(0, 0, 150, 150);
    ctx.fillStyle = '#1c1815';
    ctx.beginPath();
    ctx.moveTo(70, 130);
    ctx.lineTo(80, 130);
    ctx.lineTo(80, 50);
    ctx.lineTo(95, 50);
    ctx.lineTo(95, 40);
    ctx.lineTo(80, 40);
    ctx.lineTo(75, 10);
    ctx.lineTo(70, 40);
    ctx.lineTo(55, 40);
    ctx.lineTo(55, 50);
    ctx.lineTo(70, 50);
    ctx.closePath();
    ctx.fill();
    
    // Retro printed noise
    const imgData = ctx.getImageData(0,0,150,150);
    for(let i=0; i<imgData.data.length; i+=4){
        if(imgData.data[i+3] > 0) {
            if(Math.random() > 0.8) {
                imgData.data[i+3] = 0;
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
}

// Initialize sequence on startup
window.onload = () => {
    setupPrintDOM();
    loadStateIntoInputs();
    updateAllVisuals();
};
