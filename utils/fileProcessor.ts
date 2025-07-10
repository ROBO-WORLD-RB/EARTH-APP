import { FileMessage } from '../types';

// Supported file types
export const SUPPORTED_TEXT_TYPES = [
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/json',
  'application/xml',
  'text/xml',
  'text/html',
  'text/css',
  'text/javascript',
  'application/javascript',
  'text/typescript',
  'application/typescript'
];

export const SUPPORTED_CODE_TYPES = [
  'text/javascript',
  'application/javascript',
  'text/typescript',
  'application/typescript',
  'text/css',
  'text/html',
  'text/xml',
  'application/xml',
  'application/json',
  'text/csv'
];

export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif'
];

export const SUPPORTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword' // .doc
];

export function isSupportedFileType(file: File): boolean {
  const allSupportedTypes = [
    ...SUPPORTED_TEXT_TYPES,
    ...SUPPORTED_CODE_TYPES,
    ...SUPPORTED_IMAGE_TYPES,
    ...SUPPORTED_DOCUMENT_TYPES
  ];
  
  return allSupportedTypes.includes(file.type) || 
         file.name.endsWith('.md') || 
         file.name.endsWith('.txt') ||
         file.name.endsWith('.json') ||
         file.name.endsWith('.csv') ||
         file.name.endsWith('.js') ||
         file.name.endsWith('.ts') ||
         file.name.endsWith('.jsx') ||
         file.name.endsWith('.tsx') ||
         file.name.endsWith('.html') ||
         file.name.endsWith('.css') ||
         file.name.endsWith('.xml');
}

export function getFileCategory(file: File): 'text' | 'image' | 'document' | 'code' | 'unsupported' {
  if (SUPPORTED_TEXT_TYPES.includes(file.type) || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md')) {
    return 'text';
  }
  
  if (SUPPORTED_CODE_TYPES.includes(file.type) ||
      file.name.endsWith('.js') ||
      file.name.endsWith('.ts') ||
      file.name.endsWith('.jsx') ||
      file.name.endsWith('.tsx') ||
      file.name.endsWith('.html') ||
      file.name.endsWith('.css') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.xml')) {
    return 'code';
  }
  
  if (SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return 'image';
  }
  
  if (SUPPORTED_DOCUMENT_TYPES.includes(file.type)) {
    return 'document';
  }
  
  return 'unsupported';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export async function processFile(file: File, conversationId?: string): Promise<FileMessage> {
  const category = getFileCategory(file);
  
  if (category === 'unsupported') {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  
  let content: string;
  
  switch (category) {
    case 'text':
    case 'code':
      content = await extractTextContent(file);
      break;
    case 'image':
      content = await convertImageToBase64(file);
      break;
    case 'document':
      content = await extractDocumentText(file);
      break;
    default:
      throw new Error(`Unsupported file category: ${category}`);
  }
  
  return {
    id: generateFileId(),
    name: file.name,
    type: file.type,
    size: file.size,
    content,
    uploadDate: new Date(),
    conversationId
  };
}

async function extractTextContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const content = reader.result as string;
      resolve(content);
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64);
    };
    
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function extractDocumentText(file: File): Promise<string> {
  // For now, we'll return a placeholder for documents
  // In a full implementation, you'd use libraries like pdf.js for PDFs
  // and mammoth.js for Word documents
  return `[Document: ${file.name}]\n\nThis document contains content that can be processed by the AI. The file type is: ${file.type}`;
}

function generateFileId(): string {
  return `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function validateFile(file: File): { isValid: boolean; error?: string } {
  if (!isSupportedFileType(file)) {
    return {
      isValid: false,
      error: `Unsupported file type: ${file.type}. Please upload text, code, image, or document files.`
    };
  }
  
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds the ${formatFileSize(maxSize)} limit.`
    };
  }
  
  return { isValid: true };
}

export function getFileIcon(file: File): string {
  const category = getFileCategory(file);
  
  switch (category) {
    case 'text':
      return '📄';
    case 'code':
      return '💻';
    case 'image':
      return '🖼️';
    case 'document':
      return '📋';
    default:
      return '📎';
  }
}

export function truncateFileName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name;
  
  const extension = name.split('.').pop();
  const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
  const maxNameLength = maxLength - (extension ? extension.length + 1 : 0) - 3; // 3 for "..."
  
  return `${nameWithoutExt.substring(0, maxNameLength)}...${extension ? '.' + extension : ''}`;
} 