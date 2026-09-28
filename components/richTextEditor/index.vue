<template>
  <div class="richTextEditor">
    <div v-if="editor" class="richTextEditor__toolbar" role="toolbar" aria-label="Форматирование">
      <button
        v-for="tool in tools"
        :key="tool.name"
        type="button"
        class="richTextEditor__btn"
        :class="{ 'is-active': tool.isActive?.() }"
        :title="tool.title"
        :disabled="tool.isDisabled?.()"
        @mousedown.prevent
        @click="tool.run"
      >
        <span :class="tool.className">{{ tool.label }}</span>
      </button>
    </div>
    <EditorContent :editor="editor" class="richTextEditor__content" />
  </div>
</template>

<script setup>
import { onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { ElMessageBox } from 'element-plus';
import { descriptionHtml } from '~/composables/useRichText.ts';

const props = defineProps({
  /** HTML описания; старый простой текст тоже принимается — станет абзацами */
  modelValue: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);

// mousedown.prevent на кнопках: фокус и выделение остаются в тексте. Иначе
// фокус уходит на кнопку, и следующий Enter нажимает её ещё раз.
//
// Набор кнопок совпадает с белым списком санитайзера (useRichText.ts):
// всё, что редактор умеет, на странице выведется, остальное выключено.
const editor = useEditor({
  content: descriptionHtml(props.modelValue),
  extensions: [
    StarterKit.configure({
      heading: { levels: [2, 3] },
      code: false,
      codeBlock: false,
      horizontalRule: false,
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      // rel и target проставляет санитайзер при выводе — по типу ссылки.
      HTMLAttributes: { rel: null, target: null },
    }),
  ],
  onUpdate: ({ editor: e }) => {
    emit('update:modelValue', e.isEmpty ? '' : e.getHTML());
  },
});

onBeforeUnmount(() => editor.value?.destroy());

const chain = () => editor.value.chain().focus();

const editLink = async () => {
  const previous = editor.value.getAttributes('link').href || '';
  let href;
  try {
    ({ value: href } = await ElMessageBox.prompt(
      'Внутренняя ссылка — с «/», например /iphone. Внешняя — с https://. Пусто — убрать ссылку.',
      'Ссылка',
      { inputValue: previous, confirmButtonText: 'Готово', cancelButtonText: 'Отмена' },
    ));
  } catch {
    return;
  }
  const url = String(href || '').trim();
  if (!url) {
    chain().extendMarkRange('link').unsetLink().run();
    return;
  }
  chain().extendMarkRange('link').setLink({ href: url }).run();
};

const tools = [
  { name: 'bold', label: 'Ж', className: 'is-bold', title: 'Жирный', run: () => chain().toggleBold().run(), isActive: () => editor.value?.isActive('bold') },
  { name: 'italic', label: 'К', className: 'is-italic', title: 'Курсив', run: () => chain().toggleItalic().run(), isActive: () => editor.value?.isActive('italic') },
  { name: 'strike', label: 'З', className: 'is-strike', title: 'Зачёркнутый', run: () => chain().toggleStrike().run(), isActive: () => editor.value?.isActive('strike') },
  { name: 'h2', label: 'H2', title: 'Заголовок', run: () => chain().toggleHeading({ level: 2 }).run(), isActive: () => editor.value?.isActive('heading', { level: 2 }) },
  { name: 'h3', label: 'H3', title: 'Подзаголовок', run: () => chain().toggleHeading({ level: 3 }).run(), isActive: () => editor.value?.isActive('heading', { level: 3 }) },
  { name: 'ul', label: '• Список', title: 'Маркированный список', run: () => chain().toggleBulletList().run(), isActive: () => editor.value?.isActive('bulletList') },
  { name: 'ol', label: '1. Список', title: 'Нумерованный список', run: () => chain().toggleOrderedList().run(), isActive: () => editor.value?.isActive('orderedList') },
  { name: 'quote', label: '«»', title: 'Цитата', run: () => chain().toggleBlockquote().run(), isActive: () => editor.value?.isActive('blockquote') },
  { name: 'link', label: 'Ссылка', title: 'Ссылка', run: editLink, isActive: () => editor.value?.isActive('link') },
  { name: 'clear', label: 'Очистить', title: 'Убрать форматирование', run: () => chain().unsetAllMarks().clearNodes().run() },
  { name: 'undo', label: '↶', title: 'Отменить', run: () => chain().undo().run(), isDisabled: () => !editor.value?.can().undo() },
  { name: 'redo', label: '↷', title: 'Повторить', run: () => chain().redo().run(), isDisabled: () => !editor.value?.can().redo() },
];
</script>

<style scoped lang="scss">
.richTextEditor {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.richTextEditor__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 6px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.richTextEditor__btn {
  min-width: 32px;
  height: 30px;
  padding: 0 8px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: transparent;
  color: #303133;
  font-size: 13px;
  cursor: pointer;

  &:hover:not(:disabled) { background: #eef0f4; }
  &.is-active { background: #e6f0ff; border-color: #b3d1ff; color: #0060df; }
  &:disabled { opacity: 0.4; cursor: default; }

  .is-bold { font-weight: 700; }
  .is-italic { font-style: italic; }
  .is-strike { text-decoration: line-through; }
}

// Внутри ProseMirror — те же отступы, что у описания на карточке.
.richTextEditor__content {
  :deep(.ProseMirror) {
    min-height: 220px;
    max-height: 55vh;
    overflow-y: auto;
    padding: 12px 14px;
    font-size: 15px;
    line-height: 1.6;
    color: #333;
    outline: none;

    p { margin: 0 0 10px; }
    h2, h3 { margin: 14px 0 8px; font-weight: 500; }
    h2 { font-size: 19px; }
    h3 { font-size: 17px; }
    ul, ol { padding-left: 22px; margin: 0 0 10px; }
    li > p { margin: 0; }
    a { color: #0071e3; }
    blockquote { margin: 0 0 10px; padding-left: 12px; border-left: 2px solid #e0e0e0; }
  }
}
</style>
