// themes.js
const CardThemes = {
    // 1. Classic AD&D
    classic: {
        name: "Classic AD&D",
        getHTML: () => `
            <div class="card-face card-face-front parchment p-6 flex flex-col">
                <div class="add-border"></div>
                </div>
            <div class="card-face card-face-back parchment p-6">
                </div>
        `
    },
    // 2. Modern Minimalist
    minimalist: {
        name: "Modern Minimalist",
        getHTML: () => `
            <div class="card-face card-face-front bg-white border border-gray-300 p-4 flex flex-col font-sans">
                <h2 data-target="name" class="font-bold text-xl text-black"></h2>
                <div class="bg-gray-100 p-2 my-2 text-sm" data-target="rules"></div>
                <div class="text-xs text-gray-500 italic" data-target="desc"></div>
            </div>
            <div class="card-face card-face-back bg-gray-900 p-4">
                <div class="flex-grow w-full flex items-center justify-center overflow-hidden">
                     <canvas class="target-canvas max-w-full max-h-full object-contain"></canvas>
                </div>
            </div>
        `
    }
};
