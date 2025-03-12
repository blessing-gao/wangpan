// File preview operations and state management
import { ref, computed } from 'vue';
import { getFileTypeFromName, extractPath } from './FileUtils';
import * as panApi from '@/api/pan.js';
import * as shareApi from '@/api/share.js';
import { GET_USERNAME } from '@/utils/auth';

export const useFilePreview = () => {
    // File data refs
    const fileData = ref({
        id: '',
        name: '',
        type: '',
        path: '',
        extension: '',
        content: null,
    });

    // Status refs
    const status = ref({
        loading: true,
        error: null,
        downloading: false,
    });

    // Loading message based on file type
    const loadingMessage = computed(() => {
        if (!fileData.value.type) return '加载中...';

        const typeMessages = {
            'video': '视频加载中...',
            'pdf': 'PDF加载中...',
            'image': '图片加载中...',
            'pre': '文本加载中...',
            'audio': '音频加载中...',
            'excel': '表格加载中...',
            'word': '文档加载中...',
            'ppt': '演示文稿加载中...',
            'pptx': '演示文稿加载中...',
            'wps': '文档加载中...',
        };

        return typeMessages[fileData.value.type] || '加载中...';
    });

    // Determine if file should use Collabora preview
    const useCollaboraPreview = computed(() => {
        // Identify document types that should use Collabora Online
        return ['wps', 'doc'].includes(fileData.value.type);
    });

    /**
     * Resets file preview state
     */
    const resetState = () => {
        fileData.value = {
            id: '',
            name: '',
            type: '',
            path: '',
            extension: '',
            content: null,
        };

        status.value = {
            loading: true,
            error: null,
            downloading: false,
        };
    };

    /**
     * Loads file information from API
     * @param {string} fileId - ID of the file to load
     * @returns {Promise<void>}
     */
    const loadFileInfo = async (fileId) => {
        resetState();
        fileData.value.id = fileId;

        try {
            const response = await panApi.providerOptions(fileId);
            const data = response.data;

            fileData.value.name = data.name || '未知文件';
            fileData.value.extension = fileData.value.name.split('.').pop().toLowerCase();
            fileData.value.type = getFileTypeFromName(fileData.value.name);

            await generatePreviewPath(data);
        } catch (error) {
            console.error('加载文件信息失败:', error);
            status.value.error = '加载文件信息失败';
        } finally {
            status.value.loading = false;
        }
    };

    /**
     * Loads shared file information
     * @param {string} shareId - ID or UUID of the shared file
     * @returns {Promise<void>}
     */
    const loadSharedFileInfo = async (shareId) => {
        resetState();

        try {
            const result = await shareApi.share(shareId);
            const data = result.data;

            fileData.value.id = data.id;
            fileData.value.name = data.name || '未知文件';
            fileData.value.extension = fileData.value.name.split('.').pop().toLowerCase();
            fileData.value.type = getFileTypeFromName(fileData.value.name);

            await generatePreviewPath(data, true);
        } catch (error) {
            console.error('加载共享文件信息失败:', error);
            status.value.error = '加载共享文件信息失败';
        } finally {
            status.value.loading = false;
        }
    };

    /**
     * Generates the preview path based on file type
     * @param {Object} data - File data from API
     * @param {boolean} isShared - If the file is being accessed via share link
     * @returns {Promise<void>}
     */
    const generatePreviewPath = async (data, isShared = false) => {
        try {
            const fileType = fileData.value.type;

            // Video and audio files (direct streaming)
            if (['video', 'audio'].includes(fileType) && !isShared) {
                const folder = extractPath(data.uniqueKey);
                fileData.value.path = `/preview/${GET_USERNAME()}/${folder}${fileData.value.name}`;
                return;
            }

            // Files that need blob URLs (images, standard documents, etc.)
            if (['image', 'excel', 'word', 'pdf', 'pptx', 'pre', 'ppt'].includes(fileType)) {
                const response = await panApi.downloadFile(fileData.value.id);
                fileData.value.path = URL.createObjectURL(response.data);

                // Handle text content for text files
                if (fileType === 'pre') {
                    const blob = response.data;
                    fileData.value.content = await blob.text();
                }

                return;
            }

            // Collabora Online documents (wps, etc.)
            if (useCollaboraPreview.value) {
                fileData.value.path = isShared
                    ? window.location.href
                    : `/browser/0b27e85/cool.html?lang=zh-CN&WOPISrc=${data.url}`;
                return;
            }

            // Default case - unsupported file type
            status.value.error = '不支持的文件类型';
        } catch (error) {
            console.error('生成预览路径失败:', error);
            status.value.error = '生成预览路径失败';
        }
    };

    /**
     * Downloads the current file
     * @returns {Promise<void>}
     */
    const downloadFile = async () => {
        if (!fileData.value.id) return;

        status.value.downloading = true;

        try {
            const response = await panApi.downloadFile(fileData.value.id);

            const blob = new Blob([response.data]);
            let fileName = response.headers['content-disposition']
                .split(';')[1]
                .split('=')[1]
                .trim()
                .replace(/"/g, '');

            // Decode the filename
            fileName = decodeURI(fileName);

            // Create download link
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;
            link.click();

            // Clean up
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('下载文件失败:', error);
        } finally {
            status.value.downloading = false;
        }
    };

    return {
        fileData,
        status,
        loadingMessage,
        useCollaboraPreview,
        loadFileInfo,
        loadSharedFileInfo,
        downloadFile
    };
};
