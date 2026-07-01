// Data State for the 4 Items
let currentTab = 0;

// Default templates for all 4 cards
const cardsData = [
    { name: "Ring of Protection +1", type: "Ring", weight: "-", attunement: true, desc: "A perfectly smooth silver band that reflects light with an unnatural brilliance.", rules: "Grants the wearer a +1 bonus to Armor Class and all saving throws. Multiple rings of protection do not stack their effects.", fFront: "~ D&D Item ~", fBack: "Illustration", img: null, bright: 0 },
    { name: null, type: null, weight: null, attunement: false, desc: null, rules: null,  fFront: null, fBack: null, img: null, bright: 0 },
    { name: null, type: null, weight: null, attunement: false, desc: null, rules: null,  fFront: null, fBack: null, img: null, bright: 0 },
    { name: null, type: null, weight: null, attunement: false, desc: null, rules: null,  fFront: null, fBack: null, img: null, bright: 0 }
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
    brightness: document.getElementById('brightnessSlider'),
    descSpacing: document.getElementById('inputDescSpacing'),
    fontSize: document.getElementById('inputFontSize')
};
const brightnessVal = document.getElementById('brightnessVal');
const imageUpload = document.getElementById('imageUpload');

// 3D Card Interaction
document.addEventListener('DOMContentLoaded', () => {
    const theCard = document.getElementById('theCard');
    const cardScene = document.getElementById('cardScene');

    if (cardScene && theCard) {
        cardScene.addEventListener('click', () => {
            theCard.classList.toggle('is-flipped');
        });
    }
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
    c.descSpacing = parseInt(inputs.descSpacing.value);
    c.fontSizeOverride = inputs.fontSize.value;
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
    inputs.descSpacing.value = c.descSpacing !== undefined ? c.descSpacing : 12;
    gapVal.textContent = inputs.descSpacing.value;
    inputs.fontSize.value = c.fontSizeOverride || '';
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
        if(input === inputs.descSpacing) {
            gapVal.textContent = input.value;
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
        if(el) {
            // FIX: Convert invisible text area line breaks (\n) into HTML line breaks (<br>)
            // This preserves paragraph spacing and blank lines perfectly.
            el.innerHTML = (text || '').toString().replace(/\n/g, '<br>');
        }
        return el; // Return the element so we can measure it below
    };

    const titleEl = applyText('name', data.name || 'Unnamed Item');
    applyText('type', data.type);
    applyText('weight', data.weight);
    
    // We capture descEl here so we can style it below!
    const descEl = applyText('desc', data.desc); 
    
    applyText('rules', data.rules);
    applyText('footerFront', data.fFront);
    applyText('nameBack', data.name || 'Unnamed Item');
    applyText('footerBack', data.fBack);

    // --- 1. HANDLE EMPTY DESCRIPTIONS & SPACING ---
    if (descEl) {
        if (!data.desc || data.desc.trim() === '') {
            // If empty, hide it completely so rules slide to the top
            descEl.style.display = 'none';
        } else {
            // If text exists, show it and apply the spacing slider value
            descEl.style.display = 'block';
            descEl.style.marginBottom = (data.descSpacing !== undefined ? data.descSpacing : 12) + 'px';
        }
    }

    const attEl = container.querySelector('[data-target="attunement"]');
    if(attEl) {
        if (data.attunement) attEl.classList.remove('hidden');
        else attEl.classList.add('hidden');
    }

    // --- 2. AUTO-SHRINK OR MANUAL FONT SIZE ---
    const textBodyContainer = container.querySelector('.flex-grow.overflow-hidden');
    if (textBodyContainer) {
        // If the user typed a manual override, use it!
        if (data.fontSizeOverride && data.fontSizeOverride.toString().trim() !== '') {
            textBodyContainer.style.fontSize = data.fontSizeOverride + 'px';
        } else {
            // Otherwise, run the default auto-shrink loop
            if (textBodyContainer.clientHeight > 0) {
                let size = 18; 
                textBodyContainer.style.fontSize = size + 'px';
                
                while (textBodyContainer.scrollHeight > textBodyContainer.clientHeight && size > 8) {
                    size -= 0.5;
                    textBodyContainer.style.fontSize = size + 'px';
                }
                data.bodyFontSize = size;
            } else if (data.bodyFontSize) {
                textBodyContainer.style.fontSize = data.bodyFontSize + 'px';
            }
        }
    }
    // 2. Auto-shrink the Item Title
    if (titleEl) {
        if (titleEl.clientHeight > 0) {
            let titleSize = 24; 
            titleEl.style.fontSize = titleSize + 'px';
            
            while (titleEl.scrollHeight > 60 && titleSize > 12) {
                titleSize -= 1;
                titleEl.style.fontSize = titleSize + 'px';
            }
            data.titleFontSize = titleSize;
        } else if (data.titleFontSize) {
            titleEl.style.fontSize = data.titleFontSize + 'px';
        }
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
        const arrayBuffer = event.target.result;
        
        // 1. Try to extract hidden 'arcaneData' from the file binary
        const embeddedJson = extractTextChunk(arrayBuffer, 'arcaneData');
        if (embeddedJson) {
            try {
                const parsed = JSON.parse(embeddedJson);
                // Merge parsed data (exclude the HTML image obj)
                Object.assign(cardsData[currentTab], parsed);
                loadStateIntoInputs(); 
                console.log("Magic PNG stats successfully restored!");
            } catch (err) {
                console.error("Failed to parse embedded data", err);
            }
        }

        // 2. Load the visual image normally
        const blob = new Blob([arrayBuffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = function() {
            cardsData[currentTab].img = img;
            updateAllVisuals();
            // Auto-flip to back so user sees the change
            if (!theCard.classList.contains('is-flipped')) {
                theCard.classList.add('is-flipped');
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
        
        e.target.value = ''; // Reset input so same file can be uploaded again if needed
    };
    reader.readAsArrayBuffer(file);
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

// ----------------------------------------------------------------------
// Steganography: PNG Chunk Injection 
// ----------------------------------------------------------------------

// Standard CRC32 table for PNG checksum validation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) { c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)); }
    crcTable[n] = c;
}

function crc32(data) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < data.length; i++) {
        crc = (crc >>> 8) ^ crcTable[(crc ^ data[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
}

function extractTextChunk(arrayBuffer, targetKeyword) {
    const view = new DataView(arrayBuffer);
    const bytes = new Uint8Array(arrayBuffer);
    
    // Check standard PNG file signature
    if (bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) return null; 

    let offset = 8;
    while (offset < view.byteLength) {
        const length = view.getUint32(offset);
        const type = String.fromCharCode(bytes[offset+4], bytes[offset+5], bytes[offset+6], bytes[offset+7]);
        
        if (type === 'tEXt') {
            const dataBytes = bytes.slice(offset + 8, offset + 8 + length);
            const nullIdx = dataBytes.indexOf(0);
            if (nullIdx !== -1) {
                const keyword = new TextDecoder().decode(dataBytes.slice(0, nullIdx));
                if (keyword === targetKeyword) {
                    return new TextDecoder().decode(dataBytes.slice(nullIdx + 1));
                }
            }
        }
        offset += 12 + length; // Skip past Length (4) + Type (4) + Data (length) + CRC (4)
    }
    return null;
}

function injectTextChunk(dataURL, keyword, textData) {
    const b64Data = dataURL.split(',')[1];
    const binaryStr = atob(b64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for(let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);

    const encoder = new TextEncoder();
    const kwBytes = encoder.encode(keyword);
    const textBytes = encoder.encode(textData);
    
    // Chunk Data = Keyword + Null Byte separator + Text Payload
    const chunkData = new Uint8Array(kwBytes.length + 1 + textBytes.length);
    chunkData.set(kwBytes, 0);
    chunkData[kwBytes.length] = 0; 
    chunkData.set(textBytes, kwBytes.length + 1);

    const length = chunkData.length;
    const type = encoder.encode('tEXt');

    // Calculate CRC Checksum over Type + Data
    const crcData = new Uint8Array(4 + length);
    crcData.set(type, 0);
    crcData.set(chunkData, 4);
    const crc = crc32(crcData);

    // Build new byte chunk (Length [4] + Type [4] + Data [length] + CRC [4])
    const newChunk = new Uint8Array(12 + length);
    const view = new DataView(newChunk.buffer);
    view.setUint32(0, length);
    newChunk.set(type, 4);
    newChunk.set(chunkData, 8);
    view.setUint32(8 + length, crc);

    // Splice new chunk into original file immediately after IHDR chunk (always at byte 33)
    const out = new Uint8Array(bytes.length + newChunk.length);
    out.set(bytes.slice(0, 33), 0);
    out.set(newChunk, 33);
    out.set(bytes.slice(33), 33 + newChunk.length);

    return new Blob([out], { type: 'image/png' });
}

function exportEmbeddedImage() {
    saveCurrentTabState();
    
    const dataToSave = { ...cardsData[currentTab] };
    delete dataToSave.img; // Do not stringify the HTMLImageElement
    const jsonStr = JSON.stringify(dataToSave);

    // Use original image as carrier if it exists, otherwise fall back to drawing placeholder
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    const currentImg = cardsData[currentTab].img;

    if (currentImg) {
        tempCanvas.width = currentImg.width;
        tempCanvas.height = currentImg.height;
        ctx.drawImage(currentImg, 0, 0);
    } else {
        drawPlaceholder(tempCanvas);
    }

    // Force conversion to PNG to ensure standard chunk architecture
    const dataURL = tempCanvas.toDataURL('image/png');
    
    try {
        const blob = injectTextChunk(dataURL, 'arcaneData', jsonStr);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Clean up the name and append _Magic so the user knows it has data
        a.download = (dataToSave.name || 'Arcane_Item').replace(/\s+/g, '_') + '_Magic.png';
        a.click();
        URL.revokeObjectURL(url);
    } catch(e) {
        console.error(e);
        alert("Error exporting Magic PNG.");
    }
}
