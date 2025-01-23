<template>
  <!-- <iframe :src="iframeUrl" frameborder="0" width="100%" height="100%"></iframe> -->
  <vue-pdf-app
    style="height: 100%; width: 100%;"
    :config="config"
    :pdf="iframeUrl"
  ></vue-pdf-app>
</template>

<script setup>
import { ref, onMounted } from "vue";

// import * as courseApi from "@/api/course/course-api";
import VuePdfApp from "vue3-pdf-app";
import "vue3-pdf-app/dist/icons/main.css";

const props = defineProps({
  content: {
    type: Object,
    default: () => {},
  },
  previewBoolean: {
    default: Boolean,
    default: true,
  },
});

const config = {
  toolbar: {
    toolbarViewerRight: {
      presentationMode: true,
      openFile: true,
      print: true,
      download: false,
      viewBookmark: true,
    },
  },
};

let iframeUrl = ref(null);
const yulan = () => {
  // courseApi
  //   .previewCourse(props.content.id)
  //   .then((response) => {
  //     if (response.code === 200) {

  //       // let url = process.env.VUE_APP_STATIC_PREFIX + response.data;

  //       // iframeUrl.value = url;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
};

onMounted(() => {
  yulan();
});
</script>

<style lang="less" scoped></style>
