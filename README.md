Arcane Forge: D&D Item Card Creator

Arcane Forge is a specialized, print-ready web application designed for Dungeon Masters to quickly create, edit, and print professional-looking D&D item cards. It features a dual-sided design, automatic text-shrinking mechanics, and a unique "Magic PNG" steganography system to save and restore card data directly within image files.

🚀 Key Features
Dual-Sided Design: Separate your item's description and mechanics from its illustration and inventory stats for a clean, professional aesthetic.
Print-Ready Forge: A dedicated layout generator that creates perfectly sized, 2x2 grid pages for standard A4 or Letter paper—complete with cutting guides.
"Magic PNG" Workflow: Arcane Forge uses steganography to embed your item's data (name, rules, rarity, etc.) directly into the metadata of your generated images. You can upload an exported item image later to instantly restore its full data.

Dynamic Auto-Forge:
Auto-Shrink Typography: Rules and descriptions automatically resize to fit the card.
Manual Overrides: Custom font size and description-to-rules spacing sliders for total control.
Art Dithering: Upload any image, and the Forge will automatically dither it to match a classic "pen-and-ink" print aesthetic.
Intuitive Controls: Switch between 4 simultaneous item slots with a sleek, responsive interface.


🛠️ How to Use
Draft: Fill in the item name, type, rarity, and mechanics.
Illustrate: Upload your art. Use the Brightness/Dither slider to adjust the ink levels for the best printed result.

Forge:
Flip: Click the card in the preview window to see how the back looks.
Export: Use "Save & Export Magic PNG" to save your card as a PNG that holds its own configuration.
Print: Click "Print / Save PDF" to open your browser’s print dialog. The Forge will automatically hide UI elements and format your items into a clean 4-card grid.

💻 Tech Stack
Frontend: Pure HTML5, Tailwind CSS, and Vanilla JavaScript.
Image Processing: HTML5 Canvas with Floyd-Steinberg dithering algorithms.
Data Handling: Browser localStorage and binary manipulation for PNG chunk injection.

🛠️ Credits & Attribution
This tool was crafted with the assistance of Gemini, a large language model from Google. The design logic, card mechanics, and image processing features were developed in collaboration to create this custom tabletop utility.
