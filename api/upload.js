// ===== api/upload.js =====
// File ini taruh di folder: api/upload.js

const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB max
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Parse error:', err);
        return res.status(500).json({ error: 'Upload failed' });
      }

      const file = files.image;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Read file
      const fileData = fs.readFileSync(file.filepath);
      const fileName = `${Date.now()}_${file.originalFilename}`;
      
      // Convert to base64
      const base64 = fileData.toString('base64');
      const mimeType = file.mimetype || 'image/png';
      
      // Create data URL
      const dataUrl = `data:${mimeType};base64,${base64}`;

      // Return URL
      res.status(200).json({
        success: true,
        url: dataUrl,
        fileName: fileName,
        size: file.size,
        mimeType: mimeType
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// ===== ATAU GUNAKAN VERCEL BLOB (RECOMMENDED) =====
// Install: npm install @vercel/blob
/*
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ error: 'Upload failed' });
      }

      const file = files.image;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Upload to Vercel Blob
      const fileData = fs.readFileSync(file.filepath);
      const fileName = `${Date.now()}_${file.originalFilename}`;
      
      const blob = await put(fileName, fileData, {
        access: 'public',
      });

      res.status(200).json({
        success: true,
        url: blob.url,
        fileName: fileName,
        size: file.size
      });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
*/
