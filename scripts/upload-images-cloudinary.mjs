import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import 'dotenv/config';
import path from 'node:path';

const blogContentDir = 'src/content/blog';
const publicImageDir = 'public/images/blog';
const localImagePatterns = [
  /!\[[^\]]*\]\((\/images\/blog\/[^)\s]+)\)/g,
  /(?:src|href)=["'](\/images\/blog\/[^"']+)["']/g,
  /(^|[\s"'(])((?:\/images\/blog\/)[^\s)"'<]+)/g,
];
const obsidianImagePattern = /!\[\[([^\]\n|]+)(?:\|[^\]]*)?\]\]/g;
const imageExtensionPattern = /\.(png|jpe?g|gif|webp|avif|svg|bmp)(?:[?#].*)?$/i;

async function loadCloudinary() {
  try {
    const module = await import('cloudinary');
    return module.v2 ?? module.default?.v2;
  } catch {
    throw new Error('Missing dependency. Run: npm install cloudinary dotenv');
  }
}

async function loadDotenvIfPresent() {
  try {
    const dotenv = await import('dotenv');
    dotenv.config();
  } catch {
    // dotenv is optional when CLOUDINARY_URL is already set in the shell or CI.
  }
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function findMarkdownFiles() {
  const sourceDir = path.join(process.cwd(), blogContentDir);

  if (!existsSync(sourceDir)) {
    return [];
  }

  const files = await walk(sourceDir);
  return files.filter((file) => /\.(md|mdx)$/i.test(file));
}

function decodeImagePath(urlPath) {
  const cleanPath = urlPath.replace(/[?#].*$/, '');

  return cleanPath
    .split('/')
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))
    .join('/');
}

function publicUrlToFile(publicUrl) {
  const relativePublicPath = decodeImagePath(publicUrl).replace(/^images\/blog\//, '');
  return path.join(process.cwd(), publicImageDir, relativePublicPath);
}

async function findReferencedBlogImages() {
  const markdownFiles = await findMarkdownFiles();
  const images = new Map();

  for (const markdownFile of markdownFiles) {
    const content = await readFile(markdownFile, 'utf8');

    for (const pattern of localImagePatterns) {
      let match;

      pattern.lastIndex = 0;

      while ((match = pattern.exec(content)) !== null) {
        const publicUrl = match[2] ?? match[1];
        images.set(publicUrl, publicUrlToFile(publicUrl));
      }
    }

    let obsidianMatch;

    obsidianImagePattern.lastIndex = 0;

    while ((obsidianMatch = obsidianImagePattern.exec(content)) !== null) {
      const target = obsidianMatch[1].trim().replace(/\\/g, '/');

      if (/^(https?:)?\/\//.test(target) || target.startsWith('/') || !imageExtensionPattern.test(target)) {
        continue;
      }

      const publicUrl = `/images/blog/${target}`;
      images.set(publicUrl, publicUrlToFile(publicUrl));
    }
  }

  return images;
}

await loadDotenvIfPresent();

if (!process.env.CLOUDINARY_URL) {
  throw new Error('CLOUDINARY_URL is not set. Copy .env.example to .env and fill in your Cloudinary credentials.');
}

const images = await findReferencedBlogImages();

if (images.size === 0) {
  console.log('No /images/blog/ references found in src/content/blog.');
  process.exit(0);
}

const cloudinary = await loadCloudinary();
let uploaded = 0;

for (const [publicUrl, absolutePath] of images) {
  if (!existsSync(absolutePath)) {
    console.warn(`Missing file for ${publicUrl}: ${path.relative(process.cwd(), absolutePath)}`);
    continue;
  }

  const result = await cloudinary.uploader.upload(absolutePath, {
    folder: 'six-moon-blog/blog',
    resource_type: 'image',
    use_filename: true,
    unique_filename: false,
    overwrite: false,
  });

  uploaded += 1;
  console.log(`${publicUrl} -> ${result.secure_url}`);
}

console.log(`Uploaded ${uploaded} of ${images.size} referenced blog image(s) to Cloudinary.`);
