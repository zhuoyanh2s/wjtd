<template>
  <div class="ckeditor4-wrapper">
    <textarea ref="editorRef" style="display: none;"></textarea>
    <div v-if="loading" class="loading-tip">编辑器加载中...</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, defineProps, defineEmits, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

// 核心Props/Emits
const props = defineProps({
  modelValue: { type: String, default: '' },
  height: { type: String, default: '600px' },
  disabled: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'change']);

// 状态管理
const editorRef = ref<HTMLTextAreaElement>(null);
const loading = ref(true);
let editor: any = null;
let sourceTextarea: any = null; // 缓存源码模式文本域
// 新增：存储事件监听的回调引用（用于销毁）
const eventHandlers = {
  input: null,
  keyup: null,
  paste: null,
  change: null
};

// 强制同步源码内容到编辑器（核心方法）
const syncSourceContent = () => {
  if (!editor || !sourceTextarea) return;
  const rawContent = sourceTextarea.getValue();
  // 强制更新编辑器所有缓存
  editor.setData(rawContent, { raw: true });
  editor._.data = rawContent; // 同步内部缓存
  editor.fire('change'); // 触发change事件更新v-model
};

const initEditor = () => {
  if (!editorRef.value || !window.CKEDITOR) {
    loading.value = false;
    ElMessage.error('编辑器初始化失败');
    return;
  }

  // 全局零解析配置
  window.CKEDITOR.config.protectedSource.push(/[\s\S]/g);
  window.CKEDITOR.config.allowedContent = true;
  window.CKEDITOR.config.disableAutoInline = true;
  window.CKEDITOR.config.parser_enabled = false;
  window.CKEDITOR.config.htmlParser = {
    parseNestedTags: false,
    parseBooleanAttributes: false,
    parseRawHtml: true
  };

  // 编辑器实例配置（修复插件依赖报错）
  editor = window.CKEDITOR.replace(editorRef.value, {
    language: 'zh-cn',
    height: props.height,
    width: '100%',
    // 零解析核心配置
    allowedContent: true,
    disallowedContent: '',
    extraAllowedContent: '*',
    protectedSource: [/[\s\S]/g],
    autoParagraph: false,
    enterMode: window.CKEDITOR.ENTER_BR,
    shiftEnterMode: window.CKEDITOR.ENTER_P,
    preserveStyles: true,
    fillEmptyBlocks: false,
    entities: false,
    entity_encoding: 'raw',
    format_tags: '',
    removeFormatAttributes: '',
    indentClasses: [],
    // 关键：移除indent及依赖插件，解决报错
    removePlugins: 'elementspath,resize,format,justify,link,stylescombo,list,indentblock,indentlist,indent',
    // 原始HTML输出
    dataProcessor: {
      htmlFilter: {
        rules: {
          elements: {
            $: function(element) {
              return element;
            }
          }
        }
      },
      dataFilter: {
        rules: {
          elements: {
            $: function(element) {
              return element;
            }
          }
        }
      }
    },
    // 工具栏配置
    toolbar: [
      ['Maximize']
    ],
    startupMode: 'source',
    forcePasteAsPlainText: true
  });

  // 就绪回调（终极同步修复）
  editor.on('instanceReady', () => {
    loading.value = false;
    // 初始化内容
    if (props.modelValue) {
      editor.setData(props.modelValue, { raw: true });
      editor.setMode('source');
    }
    if (props.disabled) editor.setReadOnly(true);

    // ===== 核心修复：获取源码模式文本域并监听 =====
    nextTick(() => {
      // 方式1：从编辑器实例获取源码文本域
      sourceTextarea = editor.sourceModeEditor?.element;
      // 方式2：兜底从DOM获取（防止方式1失效）
      if (!sourceTextarea) {
        sourceTextarea = window.CKEDITOR.document.findOne('.cke_source');
      }
      // 监听文本域所有输入事件（存储回调引用）
      if (sourceTextarea) {
        eventHandlers.input = syncSourceContent;
        eventHandlers.keyup = syncSourceContent;
        eventHandlers.paste = syncSourceContent;
        eventHandlers.change = syncSourceContent;

        sourceTextarea.on('input', eventHandlers.input);
        sourceTextarea.on('keyup', eventHandlers.keyup);
        sourceTextarea.on('paste', eventHandlers.paste);
        sourceTextarea.on('change', eventHandlers.change);
      }
    });

    // 兜底：模式切换/内容变化都强制同步
    editor.on('mode', syncSourceContent);
    editor.on('change', () => {
      const rawHtml = editor.getData({ raw: true });
      editor._.data = rawHtml; // 强制同步内部缓存
      emit('update:modelValue', rawHtml);
      emit('change', rawHtml);
    });
  });
};

// 监听props变化（精准对比原始内容）
watch(() => props.modelValue, (val) => {
  if (editor && val !== editor.getData({ raw: true }) && !loading.value) {
    editor.setData(val, { raw: true });
    syncSourceContent(); // 同步到源码文本域
  }
}, { deep: true, immediate: true });

watch(() => props.disabled, (bool) => {
  if (editor && !loading.value) editor.setReadOnly(bool);
});

// 生命周期
onMounted(() => {
  setTimeout(initEditor, 100);
});

onUnmounted(() => {
  // ===== 修复：正确移除CKEditor事件监听 =====
  if (sourceTextarea && eventHandlers.input) {
    sourceTextarea.removeListener('input', eventHandlers.input);
    sourceTextarea.removeListener('keyup', eventHandlers.keyup);
    sourceTextarea.removeListener('paste', eventHandlers.paste);
    sourceTextarea.removeListener('change', eventHandlers.change);
  }
  // 销毁编辑器实例
  if (editor) {
    editor.destroy();
    editor = null;
    sourceTextarea = null;
  }
  loading.value = true;
});

// 暴露方法（供父组件强制获取最新内容）
const getContent = () => {
  // 先同步一次，再返回最新值
  syncSourceContent();
  return editor?.getData({ raw: true }) || '';
};

defineExpose({
  getContent,
  syncSourceContent // 暴露同步方法（兜底）
});
</script>

<style>
.cke_notification,
.cke_notification_warning,
.cke_notification_align_top {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  width: 0 !important;
  z-index: -9999 !important;
  pointer-events: none !important;
}
</style>
<style scoped>
.ckeditor4-wrapper {
  width: 100%;
  position: relative;
  min-height: 600px;
}

.loading-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
}

:deep(.cke) {
  border: 1px solid #e6e6e6 !important;
  border-radius: 4px !important;
  height: 100% !important;
  min-height: 600px !important;
}

/* 强制源码文本域占满编辑器高度 */
:deep(.cke_source) {
  height: calc(100% - 80px) !important;
  width: 100% !important;
}
</style>
