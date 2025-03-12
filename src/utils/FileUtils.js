// Utility functions for file handling

/**
 * Determines file type based on file name extension
 * @param {string} fileName - Complete file name with extension
 * @return {string} - File type identifier used by the application
 */
export const getFileTypeFromName = (fileName) => {
    if (!fileName) return '';

    const extension = fileName.split('.').pop().toLowerCase();

    const typeMap = {
        // Video formats
        'mp4': 'video',

        // Document formats
        'pdf': 'pdf',
        'docx': 'word',
        'doc': 'wps',

        // Presentation formats
        'pptx': 'pptx',
        'ppt': 'wps',

        // Spreadsheet formats
        'xlsx': 'excel',
        'xls': 'excel',
        'csv': 'excel',

        // Image formats
        'png': 'image',
        'jpg': 'image',
        'jpeg': 'image',
        'svg': 'image',

        // Audio formats
        'mp3': 'audio',

        // Text formats
        'txt': 'pre',
    };

    return typeMap[extension] || '';
};

/**
 * Extracts directory path from a full file path
 * @param {string} filePath - Full file path
 * @return {string} - Directory path
 */
export const extractPath = (filePath) => {
    if (!filePath) return '';

    const regex = /^(.*[\/\\])/;
    const match = filePath.match(regex);
    return match ? match[1] : '';
};

/**
 * Formats file size in bytes to human-readable format
 * @param {number} size - File size in bytes
 * @return {string} - Formatted file size (e.g., "1.25 MB")
 */
export const formatSize = (size) => {
    if (size === undefined || size === null) return '0 bytes';

    const KB = 1024;
    const MB = KB * 1024;
    const GB = MB * 1024;
    const TB = GB * 1024;

    if (size >= TB) return (size / TB).toFixed(2) + ' TB';
    if (size >= GB) return (size / GB).toFixed(2) + ' GB';
    if (size >= MB) return (size / MB).toFixed(2) + ' MB';
    if (size >= KB) return (size / KB).toFixed(2) + ' KB';
    return size + ' bytes';
};

/**
 * Fetches content of a text file from URL
 * @param {string} url - URL to fetch text from
 * @return {Promise<string>} - Text content
 */
export const fetchTextContent = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        return await blob.text();
    } catch (error) {
        console.error('Error fetching text content:', error);
        throw error;
    }
};

/**
 * Creates a download link for a blob and triggers download
 * @param {Blob} blob - File data as blob
 * @param {string} fileName - Name for the downloaded file
 */
export const downloadBlob = (blob, fileName) => {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    // Clean up
    window.URL.revokeObjectURL(link.href);
};

/**
 * Returns file icon based on file type
 * @param {string} fileName - File name with extension
 * @return {string} - Path to icon image
 */
export const getFileIcon = (fileName) => {
    const fileType = getFileTypeFromName(fileName);

    const iconMap = {
        'video': '/icons/video.svg',
        'pdf': '/icons/pdf.svg',
        'word': '/icons/word.svg',
        'excel': '/icons/excel.svg',
        'image': '/icons/image.svg',
        'audio': '/icons/audio.svg',
        'pre': '/icons/text.svg',
        'pptx': '/icons/ppt.svg',
        'wps': '/icons/doc.svg',
    };

    return iconMap[fileType] || '/icons/file.svg';
};
