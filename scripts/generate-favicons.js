import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, "..", "public");
const logoPath = path.join(publicDir, "logo.png");

async function generateFavicons() {
  try {
    // Generate different sizes
    const sizes = {
      "favicon-16x16.png": 16,
      "favicon-32x32.png": 32,
      "apple-touch-icon.png": 180,
    };

    for (const [filename, size] of Object.entries(sizes)) {
      await sharp(logoPath)
        .resize(size, size, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .toFile(path.join(publicDir, filename));
      console.log(`Generated ${filename}`);
    }

    console.log("All favicons generated successfully!");
  } catch (error) {
    console.error("Error generating favicons:", error);
  }
}

generateFavicons();
