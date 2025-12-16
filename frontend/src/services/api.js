const DEFAULT_API_BASE_URL = 'http://localhost:5000/api';

function resolveBaseUrl(override) {
  if (override) return override;
  if (typeof window === 'undefined') {
    return process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export async function uploadFile(file, { baseUrl } = {}) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${resolveBaseUrl(baseUrl)}/files`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || 'Upload failed');
  }

  return res.json();
}

export async function fetchFiles({ baseUrl } = {}) {
  const res = await fetch(`${resolveBaseUrl(baseUrl)}/files`);
  if (!res.ok) {
    throw new Error('Failed to fetch files');
  }
  return res.json();
}
