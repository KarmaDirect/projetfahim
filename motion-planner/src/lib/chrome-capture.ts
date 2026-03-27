/**
 * Chrome Capture Pipeline
 *
 * Utilitaires pour orchestrer la capture d'assets via Chrome MCP
 * et les préparer pour Remotion.
 *
 * Usage avec Claude Code :
 * 1. L'agent Chrome navigue et capture les screenshots
 * 2. Les fichiers sont sauvegardés dans public/assets/captures/
 * 3. Remotion les utilise via staticFile()
 */

import path from "path";
import fs from "fs";

const CAPTURES_DIR = path.join(
  process.cwd(),
  "public",
  "assets",
  "captures"
);

export interface CaptureManifest {
  projectName: string;
  capturedAt: string;
  images: CaptureEntry[];
}

export interface CaptureEntry {
  filename: string;
  path: string;
  staticPath: string; // chemin pour staticFile() de Remotion
  url?: string;
  description?: string;
  order: number;
}

/**
 * Crée un dossier de projet pour organiser les captures
 */
export function createProjectFolder(projectName: string): string {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const folderPath = path.join(CAPTURES_DIR, slug);
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
}

/**
 * Liste les captures d'un projet
 */
export function listCaptures(projectName: string): CaptureEntry[] {
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const folderPath = path.join(CAPTURES_DIR, slug);

  if (!fs.existsSync(folderPath)) return [];

  const files = fs
    .readdirSync(folderPath)
    .filter((f) => /\.(png|jpg|jpeg|webp|gif)$/i.test(f))
    .sort();

  return files.map((filename, i) => ({
    filename,
    path: path.join(folderPath, filename),
    staticPath: `assets/captures/${slug}/${filename}`,
    order: i,
  }));
}

/**
 * Génère les props Remotion à partir des captures d'un projet
 */
export function getSlideshowProps(projectName: string) {
  const captures = listCaptures(projectName);
  return {
    images: captures.map((c) => c.staticPath),
    title: projectName,
    transitionDuration: 15,
    slideDuration: 60,
    accentColor: "#6C63FF",
  };
}

export function getShowcaseProps(projectName: string, clientName?: string) {
  const captures = listCaptures(projectName);
  return {
    images: captures.map((c) => c.staticPath),
    projectName,
    clientName,
    accentColor: "#6C63FF",
  };
}

/**
 * Sauvegarde un manifest JSON du projet (pour traçabilité)
 */
export function saveManifest(projectName: string): string {
  const captures = listCaptures(projectName);
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const manifestPath = path.join(CAPTURES_DIR, slug, "manifest.json");

  const manifest: CaptureManifest = {
    projectName,
    capturedAt: new Date().toISOString(),
    images: captures,
  };

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return manifestPath;
}
