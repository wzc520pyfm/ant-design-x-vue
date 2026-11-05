import { createApp, defineComponent, h, nextTick, ref } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { useStreaming } from '../hooks/useStreaming';
import type { StreamingOption } from '../interface';

type Case = {
  title: string;
  input: any;
  output: string;
  config?: StreamingOption;
};

const basicTestCases: Case[] = [
  { title: 'complete Html', input: '<div></div>', output: '<div></div>' },
  {
    title: 'not support link reference definitions',
    input: '[foo]: /url "title"',
    output: '[foo]: /url "title"',
  },
  {
    title: 'complete link nested image',
    input:
      '[![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)](https://github.com/ant-design/x)',
    output:
      '[![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)](https://github.com/ant-design/x)',
  },
  {
    title: 'complete image',
    input:
      '![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)',
    output:
      '![version](https://camo.githubusercontent.com/c6d467fb550578b3f321c1012e289f20e038b92dcdfc35f2b8147ca6572878ad/68747470733a2f2f696d672e736869656c64732e696f2f747769747465722f666f6c6c6f772f416e7444657369676e55492e7376673f6c6162656c3d416e7425323044657369676e)',
  },
  { title: 'heading', input: '#', output: '#' },
  { title: 'heading3', input: '###', output: '###' },
  { title: 'wrong heading', input: '#Heading1', output: '#Heading1' },
  { title: 'correctly heading', input: '# Heading1', output: '# Heading1' },
  { title: 'heading over 6', input: '#######', output: '#######' },
  { title: 'incomplete Html', input: '<div', output: '<div' },
  { title: 'invalid Html', input: '<divvvv', output: '<divvvv' },
  { title: 'incomplete code span', input: '`code', output: '`code' },
  { title: 'complete code span', input: '`code`', output: '`code`' },
  {
    title: 'incomplete fenced code',
    input: '```js\ncode',
    output: '```js\ncode',
  },
  {
    title: 'complete fenced code',
    input: '```js\ncode\n```',
    output: '```js\ncode\n```',
  },
  { title: 'incomplete list -', input: '-', output: '-' },
  { title: 'not list ', input: '+123', output: '+123' },
  { title: 'incomplete list +', input: '+', output: '+' },
  { title: 'incomplete list *', input: '*', output: '*' },
  { title: 'incomplete hr -', input: '--', output: '--' },
  { title: 'complete hr -', input: '---\n', output: '---\n' },
  { title: 'incomplete hr =', input: '==', output: '==' },
  { title: 'complete hr =', input: '===\n', output: '===\n' },
];

const streamingTestCases: Case[] = [
  {
    title: 'incomplete link with streaming enabled',
    input: '[incomplete link](https://example',
    output: '<incomplete-link data-raw="%5Bincomplete%20link%5D(https%3A%2F%2Fexample" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image only start should not show',
    input: '!',
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete image with streaming enabled',
    input: '![alt text](https://example',
    output: '<incomplete-image data-raw="!%5Balt%20text%5D(https%3A%2F%2Fexample" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link with custom component',
    input: '[ant design x](https',
    output: '<custom-link-placeholder data-raw="%5Bant%20design%20x%5D(https" />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { link: 'custom-link-placeholder' },
    },
  },
  {
    title: 'incomplete image with custom component',
    input: '![alt text](https',
    output: '<custom-image-placeholder data-raw="!%5Balt%20text%5D(https" />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { image: 'custom-image-placeholder' },
    },
  },
  {
    title: 'incomplete link and image with custom components',
    input: '[link](https',
    output: '<custom-link-placeholder data-raw="%5Blink%5D(https" />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: {
        link: 'custom-link-placeholder',
        image: 'custom-image-placeholder',
      },
    },
  },
  {
    title: 'complete elements should not use placeholders',
    input: '[ant design x](https://x.ant.design)',
    output: '[ant design x](https://x.ant.design)',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete list -',
    input: '-',
    output: '<incomplete-list data-raw="-" />',
  },
  {
    title: 'incomplete list - with incomplete bold',
    input: '- **',
    output: '<incomplete-list data-raw="-%20**" />',
  },
  {
    title: 'incomplete list - with complete bold',
    input: '- **text**',
    output: '- **text**',
  },
  {
    title: 'setext heading',
    input: 'text \n- ',
    output: 'text \n<incomplete-list data-raw="-%20" />',
  },
  { title: 'not list ', input: '+123', output: '+123' },
  {
    title: 'incomplete list +',
    input: '+',
    output: '<incomplete-list data-raw="%2B" />',
  },
  {
    title: 'incomplete list * with space',
    input: '-    ',
    output: '-    ',
  },
  { title: 'complete list *', input: '* list', output: '* list' },
  {
    title: 'complete list - with incomplete bold',
    input: '- **',
    output: '<incomplete-list data-raw="-%20**" />',
  },
  {
    title: 'complete list - with complete bold',
    input: '- **bold**',
    output: '- **bold**',
  },
  { title: 'inValid heading', input: '#######', output: '#######' },
  {
    title: 'inValid heading no space',
    input: '###Heading',
    output: '###Heading',
  },
  { title: 'valid heading ', input: '### Heading', output: '### Heading' },
  {
    title: 'incomplete table - only header',
    input: '| Header 1 | Header 2 |',
    output: '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete table - only header with title',
    input: 'table \n | Header 1 | Header 2 |',
    output:
      'table \n <incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete table - header and separator',
    input: '| Header 1 | Header 2 |\n| --- | --- |',
    output:
      '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C%0A%7C%20---%20%7C%20---%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete table',
    input: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
    output: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
    config: { hasNextChunk: false },
  },
  {
    title: 'incomplete table with custom component',
    input: '| Header 1 | Header 2 |',
    output:
      '<custom-table-placeholder data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C" />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { table: 'custom-table-placeholder' },
    },
  },
  {
    title: 'malformed table - no closing pipe',
    input: '| Header 1 | Header 2 \n',
    output: '| Header 1 | Header 2 \n',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with incomplete separator',
    input: '| Header 1 | Header 2 |\n| --- |',
    output:
      '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C%0A%7C%20---%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with left align separator',
    input: '| Header 1 | Header 2 |\n| :--- |',
    output:
      '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C%0A%7C%20%3A---%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with right align separator',
    input: '| Header 1 | Header 2 |\n| ---: |',
    output:
      '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C%0A%7C%20---%3A%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'table with center separator',
    input: '| Header 1 | Header 2 |\n| :---: |',
    output:
      '<incomplete-table data-raw="%7C%20Header%201%20%7C%20Header%202%20%7C%0A%7C%20%3A---%3A%20%7C" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - open tag',
    input: '<div ',
    output: '<incomplete-html data-raw="%3Cdiv%20" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - close tag',
    input: '</div ',
    output: '<incomplete-html data-raw="%3C%2Fdiv%20" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete Html - self close tag',
    input: '<img src="" / ',
    output: '<incomplete-html data-raw="%3Cimg%20src%3D%22%22%20%2F%20" />',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete html with custom component',
    input: '<img src="" /',
    output: '<custom-html-placeholder data-raw="%3Cimg%20src%3D%22%22%20%2F" />',
    config: {
      hasNextChunk: true,
      incompleteMarkdownComponentMap: { html: 'custom-html-placeholder' },
    },
  },
  {
    title: 'complete Html - open tag',
    input: '<div>Div</div> ',
    output: '<div>Div</div> ',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete Html - self close tag',
    input: '<br />',
    output: '<br />',
    config: { hasNextChunk: true },
  },
  {
    title: 'complete Html - nested tags',
    input: '<div><span>text</span></div>',
    output: '<div><span>text</span></div>',
    config: { hasNextChunk: true },
  },
];

const fencedCodeTestCases: Case[] = [
  {
    title: 'incomplete link in fenced code block should not be replaced',
    input: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    output: '```markdown\nThis is a [link](https://example.com that is incomplete\n```',
    config: { hasNextChunk: true },
  },
  {
    title: 'incomplete link outside fenced code block should be replaced',
    input: 'Here is a [link](https://example',
    output: 'Here is a <incomplete-link data-raw="%5Blink%5D(https%3A%2F%2Fexample" />',
    config: { hasNextChunk: true },
  },
];

const errorHandlingTestCases: Case[] = [
  { title: 'null input', input: null, output: '', config: { hasNextChunk: true } },
  {
    title: 'undefined input',
    input: undefined,
    output: '',
    config: { hasNextChunk: true },
  },
  { title: 'number input', input: 123, output: '', config: { hasNextChunk: true } },
  {
    title: 'boolean input',
    input: true,
    output: '',
    config: { hasNextChunk: true },
  },
  {
    title: 'object input',
    input: { text: 'test' },
    output: '',
    config: { hasNextChunk: true },
  },
];

describe('useStreaming', () => {
  const apps: Array<ReturnType<typeof createApp>> = [];

  afterEach(() => {
    while (apps.length) {
      apps.pop()?.unmount();
    }
  });

  function mountStreaming(input: any, config?: StreamingOption) {
    const content = ref(input as string);
    const streamingOption = ref(config);
    let api!: ReturnType<typeof useStreaming>;

    const Comp = defineComponent({
      setup() {
        api = useStreaming({
          content: content as any,
          streamingOption,
        });
        return () => h('div', api.displayedContent.value);
      },
    });
    const app = createApp(Comp);
    app.mount(document.createElement('div'));
    apps.push(app);

    return {
      get displayedContent() {
        return api.displayedContent.value;
      },
      get status() {
        return api.status.value;
      },
      get isStreaming() {
        return api.isStreaming.value;
      },
      async setInput(next: any, nextConfig?: StreamingOption) {
        content.value = next;
        if (nextConfig !== undefined) {
          streamingOption.value = nextConfig;
        }
        await nextTick();
      },
    };
  }

  describe('basic functionality', () => {
    basicTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, async () => {
        const api = mountStreaming(input, config || { hasNextChunk: false });
        await nextTick();
        expect(api.displayedContent).toBe(output);
      });
    });
  });

  describe('streaming functionality', () => {
    streamingTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, async () => {
        const api = mountStreaming(input, config || { hasNextChunk: true });
        await nextTick();
        expect(api.displayedContent).toBe(output);
      });
    });
  });

  describe('fenced code blocks', () => {
    fencedCodeTestCases.forEach(({ title, input, output, config }) => {
      it(`should handle ${title}`, async () => {
        const api = mountStreaming(input, config || { hasNextChunk: true });
        await nextTick();
        expect(api.displayedContent).toBe(output);
      });
    });
  });

  describe('error handling', () => {
    errorHandlingTestCases.forEach(({ title, input, config }) => {
      it(`should handle ${title}`, async () => {
        const api = mountStreaming(input, config || { hasNextChunk: true });
        await nextTick();
        expect(api.displayedContent).toBe('');
      });
    });
  });

  describe('streaming behavior', () => {
    it('should handle streaming chunk by chunk', async () => {
      const api = mountStreaming('Hello', { hasNextChunk: true });
      await nextTick();
      expect(api.displayedContent).toBe('Hello');

      await api.setInput('Hello world', { hasNextChunk: true });
      expect(api.displayedContent).toBe('Hello world');

      await api.setInput(
        'Hello world with [incomplete link](https://example',
        { hasNextChunk: true },
      );
      expect(api.displayedContent).toBe(
        'Hello world with <incomplete-link data-raw="%5Bincomplete%20link%5D(https%3A%2F%2Fexample" />',
      );
    });

    it('should reset state when input is completely different', async () => {
      const api = mountStreaming('First content', { hasNextChunk: true });
      await nextTick();
      expect(api.displayedContent).toBe('First content');

      await api.setInput('Completely different', { hasNextChunk: false });
      expect(api.displayedContent).toBe('Completely different');
    });

    it('should handle streaming state transitions', async () => {
      const api = mountStreaming('Start', { hasNextChunk: true });
      await nextTick();
      expect(api.displayedContent).toBe('Start');

      await api.setInput('Start with [link](https://example', {
        hasNextChunk: true,
      });
      expect(api.displayedContent).toBe(
        'Start with <incomplete-link data-raw="%5Blink%5D(https%3A%2F%2Fexample" />',
      );

      await api.setInput('Start with [link](https://example.com)', {
        hasNextChunk: false,
      });
      expect(api.displayedContent).toBe(
        'Start with [link](https://example.com)',
      );
    });
  });

  describe('composables API shape', () => {
    it('exposes displayedContent, status, and isStreaming', async () => {
      const api = mountStreaming('Test content', { hasNextChunk: true });
      await nextTick();
      expect(api.displayedContent).toBe('Test content');
      expect(api.isStreaming).toBe(true);
      expect(api.status).toBe('streaming');
    });

    it('should handle component unmounting without throwing', async () => {
      const api = mountStreaming('Test content', { hasNextChunk: true });
      await nextTick();
      expect(api.displayedContent).toBe('Test content');
      expect(() => {
        apps.pop()?.unmount();
      }).not.toThrow();
    });
  });

  describe('integration', () => {
    it('should handle real-world streaming scenarios', async () => {
      const api = mountStreaming('', { hasNextChunk: true });
      await nextTick();

      const streamingContent = [
        '#',
        '# Welcome',
        '# Welcome to',
        '# Welcome to our',
        '# Welcome to our [documentation](https://example',
        '# Welcome to our [documentation](https://example.com)',
      ];

      for (let index = 0; index < streamingContent.length; index++) {
        await api.setInput(streamingContent[index], {
          hasNextChunk: index < streamingContent.length - 1,
        });
      }

      expect(api.displayedContent).toBe(
        '# Welcome to our [documentation](https://example.com)',
      );
    });

    it('should handle malformed markdown gracefully', async () => {
      const malformedCases = [
        '[[[nested brackets]]]',
        '(((())))nested parentheses',
        '**unclosed bold **text',
        '_unclosed italic_ text',
        '```unclosed code block',
        '| table without closing |',
      ];

      for (const malformed of malformedCases) {
        const api = mountStreaming(malformed, { hasNextChunk: true });
        await nextTick();
        expect(api.displayedContent).toBeDefined();
        expect(typeof api.displayedContent).toBe('string');
      }
    });
  });
});
