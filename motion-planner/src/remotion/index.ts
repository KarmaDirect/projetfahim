import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

// Load Google Fonts
const fonts = [
  "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap",
];

for (const href of fonts) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

registerRoot(RemotionRoot);
