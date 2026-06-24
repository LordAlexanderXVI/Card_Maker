// themes.js
const CardThemes = {
    // 1. Classic AD&D
    classic: {
        name: "Classic AD&D",
        getHTML: () => `
            <div class="card-face card-face-front parchment p-6 flex flex-col">
                <div class="add-border"></div>
                <div class="relative z-10 flex flex-col h-full pl-3 pr-3 pt-4 pb-2">
                    <div class="text-center mb-2">
                        <h2 data-target="name" class="card-title text-2xl leading-none uppercase tracking-wide"></h2>
                        <p data-target="type" class="card-body text-sm italic mt-1"></p>
                    </div>
                    <div class="separator"></div>
                    <div class="flex justify-between card-body text-sm font-bold px-2">
                        <span>Weight: <span data-target="weight"></span></span>
                        <span data-target="attunement" class="italic font-normal hidden">(Requires Attunement)</span>
                    </div>
                    <div class="separator"></div>
                    <div class="card-body text-sm mt-2 flex-grow overflow-hidden flex flex-col">
                        <p data-target="desc" class="italic mb-3 text-justify leading-snug"></p>
                        <p data-target="rules" class="text-justify leading-snug font-medium"></p>
                    </div>
                    <div data-target="footerFront" class="mt-auto pt-2 text-center text-xs card-body opacity-70"></div>
                </div>
            </div>
            <div class="card-face card-face-back parchment p-6">
                <div class="add-border"></div>
                <div class="relative z-10 flex flex-col h-full w-full items-center p-3">
                    <h2 data-target="nameBack" class="card-title text-xl text-center uppercase tracking-wider mb-4 border-b border-[var(--ink-color)] pb-1 w-full"></h2>
                    <div class="flex-grow w-full flex items-center justify-center overflow-hidden">
                        <canvas class="target-canvas max-w-full max-h-full object-contain" style="image-rendering: pixelated;"></canvas>
                    </div>
                    <p data-target="footerBack" class="card-body text-xs mt-4 opacity-50"></p>
                </div>
            </div>
        `
    },
    // 2. Modern Minimalist
    minimalist: {
        name: "Modern Minimalist",
        getHTML: () => `
            <div class="card-face card-face-front bg-white border border-gray-300 p-4 flex flex-col font-sans h-full">
                <h2 data-target="name" class="font-bold text-xl text-black"></h2>
                <div class="text-xs text-gray-500 font-bold uppercase mb-2"><span data-target="type"></span> | <span data-target="weight"></span></div>
                <div class="text-sm text-gray-700 italic mb-2" data-target="desc"></div>
                <div class="bg-gray-100 border-l-4 border-blue-500 p-2 text-sm text-gray-800 flex-grow overflow-hidden" data-target="rules"></div>
                <div data-target="footerFront" class="mt-2 text-center text-xs text-gray-400"></div>
            </div>
            <div class="card-face card-face-back bg-gray-900 p-4 h-full flex flex-col">
                <h2 data-target="nameBack" class="text-white text-center font-bold mb-2"></h2>
                <div class="flex-grow w-full flex items-center justify-center overflow-hidden bg-black rounded">
                     <canvas class="target-canvas max-w-full max-h-full object-contain"></canvas>
                </div>
                <div data-target="footerBack" class="mt-2 text-center text-xs text-gray-500"></div>
            </div>
        `
    }
};
