/**
 * Client-side Image Compression Utility
 * Resizes and compresses image files using HTML5 Canvas before uploading to Supabase,
 * ensuring fast uploads and preventing file size limit errors.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1
  mimeType?: string; // 'image/jpeg' | 'image/webp'
}

export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<File> {
  // If not an image (e.g. video or audio), return original file as-is
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip SVG or already tiny files (< 200KB)
  if (file.type === 'image/svg+xml' || file.size < 200 * 1024) {
    return file;
  }

  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.82,
    mimeType = 'image/jpeg',
  } = options;

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect-ratio scaling
        if (width > maxWidth || height > maxHeight) {
          const widthRatio = maxWidth / width;
          const heightRatio = maxHeight / height;
          const scale = Math.min(widthRatio, heightRatio);

          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to original if canvas fails
          return;
        }

        // Fill background with white for JPEG transparency handling
        if (mimeType === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            // Create compressed File object with same name
            const compressedFileName = file.name.replace(/\.[^/.]+$/, '.jpg');
            const compressedFile = new File([blob], compressedFileName, {
              type: mimeType,
              lastModified: Date.now(),
            });

            // Return compressed file if smaller, otherwise keep original
            resolve(compressedFile.size < file.size ? compressedFile : file);
          },
          mimeType,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target?.result as string;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}

export async function compressMultipleFiles(
  files: FileList | File[],
  options?: CompressionOptions
): Promise<File[]> {
  const fileArray = Array.from(files);
  const compressedPromises = fileArray.map((file) => compressImage(file, options));
  return Promise.all(compressedPromises);
}
