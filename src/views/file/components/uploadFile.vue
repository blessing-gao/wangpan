<template>
  <div>
    <el-dialog
        v-model="dialogTableVisible"
        width="41.7%"
        :modal="false"
        :show-close="false"
        @close="handleClose"
    >
      <!-- 文件或文件夹拖拽区域 -->
      <div
          class="file-box"
          @dragenter.prevent="handleDragEnter"
          @dragover.prevent="handleDragOver"
          @drop="handleDrop"
          @click="triggerFileInput"
      >
        <div>
          <img style="width: 83px" src="/assets/upload.png" />
          <p v-if="isUploadFile">拖拽文件到这里</p>
          <p v-else>拖拽文件夹到这里</p>
        </div>
        <!-- 隐藏的文件输入框 -->
        <input
            type="file"
            ref="fileInput"
            style="display: none"
            :webkitdirectory="!isUploadFile"
            multiple
            @change="handleFileInputChange"
        />
      </div>

      <!-- 文件列表展示 -->
      <div v-if="fileList.length" class="file-style">
        <h3 v-if="isUploadFile">已选择的文件:</h3>
        <h3 v-else>已选择的文件夹内容:</h3>
        <ul>
          <li
              v-for="(file, index) in fileList"
              :key="index"
              class="file-style-content"
          >
            {{ file.name }}
            <el-button @click="removeFile(index)" style="margin-left: 10px">
              <el-icon><Close /></el-icon>
            </el-button>
          </li>
        </ul>
      </div>
      <template #footer>
        <el-button
            style="background: #de3a05; border-radius: 4px; color: #fff"
            v-if="isUploadFile"
            @click="uploadFiles"
        >
          上传文件
        </el-button>
        <el-button
            style="background: #de3a05; border-radius: 4px; color: #fff"
            v-else
            @click="uploadFolders"
        >
          上传文件夹
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { ElNotification } from 'element-plus';
import { Close } from '@element-plus/icons-vue';
import * as fileApi from '@/api/file.js';
import '@/styles/components/uploadFile.css';  // 引入普通的 CSS 文件

const dialogTableVisible = ref(false);
const fileList = ref([]); // 用于存储上传的文件列表
const isUploadFile = ref(true); // 上传模式标志，true 为文件，false 为文件夹

// 打开组件并指定上传模式
const handleEdit = (uploadMode = 'file') => {
  isUploadFile.value = uploadMode === 'file';
  dialogTableVisible.value = true;
};

// 处理拖拽进入事件
const handleDragEnter = (e) => e.preventDefault();
const handleDragOver = (e) => e.preventDefault();

// 处理文件或文件夹放下（drop）事件
const handleDrop = (e) => {
  e.preventDefault();
  const items = Array.from(e.dataTransfer.items);
  const files = [];

  items.forEach((item) => {
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (!isUploadFile.value && entry.isDirectory) {
        // 如果是文件夹上传模式，递归处理文件夹内容
        traverseDirectory(entry);
      } else if (isUploadFile.value && entry.isFile) {
        // 如果是文件上传模式，处理文件
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }
  });

  // 处理文件
  handleFiles(files);
};

// 处理文件选择框的变更事件
const handleFileInputChange = (event) => {
  const files = Array.from(event.target.files);
  handleFiles(files);
  event.target.value = '';
};

const fileInput = ref(null);
// 触发文件输入框的点击事件
const triggerFileInput = () => {
  fileInput.value.click();
};

// 递归读取文件夹内的文件
const traverseDirectory = (entry) => {
  const dirReader = entry.createReader();
  dirReader.readEntries((entries) => {
    entries.forEach((entry) => {
      if (entry.isDirectory) {
        traverseDirectory(entry);
      } else {
        entry.file((file) => {
          fileList.value.push(file);
        });
      }
    });
  });
};

// 处理文件选择（通过拖拽选择文件）
const handleFiles = (files) => {
  files.forEach((file) => {
    fileList.value.push(file);
  });
};

// 上传文件到服务器
const uploadFiles = () => {
  if (fileList.value.length === 0) return;

  console.log('上传文件列表：', fileList.value);

  const formData = new FormData();
  fileList.value.forEach((file) => {
    formData.append('files', file);
  });

  const params = {
    bucketName: 'gjq', // 替换为实际的存储桶名称
    path: '/'
  };

  fileApi.uploadFile(params, formData)
      .then((res) => {
        if (res.success) {
          ElNotification({
            title: '成功',
            message: '文件上传成功！',
            type: 'success',
          });
          fileList.value = [];
        } else {
          ElNotification({
            title: '失败',
            message: `文件上传失败：${res.message}`,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        ElNotification({
          title: '错误',
          message: `文件上传出错：${err.message}`,
          type: 'error',
        });
      });
};

// 上传文件夹到服务器
const uploadFolders = () => {
  if (fileList.value.length === 0) return;

  console.log('上传文件夹内容：', fileList.value);

  const formData = new FormData();

  fileList.value.forEach((file) => {
    // 获取文件的相对路径（webkitRelativePath），包含文件夹结构
    const relativePath = file.webkitRelativePath;

    // 拼接相对路径和文件名，作为存储在服务器的对象名
    formData.append('files', file, relativePath);
  });

  const params = {
    bucketName: 'gjq', // 替换为实际的存储桶名称
    path: '/test'
  };

  // 调用上传文件夹的后端API
  fileApi.uploadFolder(params, formData)
      .then((res) => {
        if (res.success) {
          ElNotification({
            title: '成功',
            message: '文件夹上传成功！',
            type: 'success',
          });
          fileList.value = [];
        } else {
          ElNotification({
            title: '失败',
            message: `文件夹上传失败：${res.message}`,
            type: 'error',
          });
        }
      })
      .catch((err) => {
        ElNotification({
          title: '错误',
          message: `文件夹上传出错：${err.message}`,
          type: 'error',
        });
      });
};


const removeFile = (index) => {
  fileList.value.splice(index, 1);
};

onMounted(async () => {
  await nextTick();
});

const handleClose = () => {
  fileList.value = [];
  dialogTableVisible.value = false;
};

defineExpose({
  handleEdit,
});
</script>
