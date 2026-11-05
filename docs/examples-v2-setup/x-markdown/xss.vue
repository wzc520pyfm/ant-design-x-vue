<script setup lang="ts">
defineOptions({ name: 'AXXMarkdownXssV2Setup' });

import { XMarkdown } from '@ant-design-x-vue/x-markdown';
import '@ant-design-x-vue/x-markdown/themes/light.css';

const scriptTag = '<' + 'script>alert(\'Direct script injection XSS vector\');</' + 'script>';
const iframeSrcdoc = '<' + 'iframe srcdoc="<' + 'script>alert(\'DOM-based XSS - iframe srcdoc injection\')</' + 'script>"></' + 'iframe>';
const nestedScript = '<' + 'scr' + 'ipt>alert(\'Filter evasion\')</' + 'scr' + 'ipt>';

const content = [
  '### Cross-Site Scripting (XSS) Attack Vectors',
  '',
  '#### 1. Stored XSS (Persistent XSS)',
  '<img src=x onerror="alert(\'Stored XSS - Image onerror payload\')">',
  '',
  '#### 2. Reflected XSS (Non-persistent XSS)',
  '[Malicious Link](javascript:alert(\'Reflected XSS - Link click payload\'))',
  '',
  '#### 3. DOM-based XSS',
  iframeSrcdoc,
  '',
  '#### 4. Attribute-based XSS',
  '<iframe src="javascript:alert(\'Attribute-based XSS - src attribute injection\')"></iframe>',
  '',
  '#### 5. Script Tag Injection',
  scriptTag,
  '',
  '#### 6. Event Handler XSS',
  '<img src="invalid.jpg" alt="Test Image" onerror="alert(\'Event handler XSS - onerror payload\')" />',
  '',
  '#### 7. JavaScript Protocol XSS',
  '<a href="javascript:alert(\'JavaScript protocol XSS\')">Click Here</a>',
  '',
  '#### 8. SVG Vector XSS',
  '<svg onload="alert(\'SVG onload event XSS vector\')"></svg>',
  '',
  '#### 9. Form Input XSS',
  '<form action="javascript:alert(\'Form action XSS\')"><input type="text" value="x"></form>',
  '',
  '#### 10. CSS Injection XSS',
  '<div style="background-image: url(javascript:alert(\'CSS background image XSS\'))">Test Content</div>',
  '',
  '#### 11. Data URI XSS',
  '<img src="data:text/html,xss">',
  '',
  '#### 12. Mouse Event XSS',
  '<div onmouseover="alert(\'Mouse event XSS - onmouseover payload\')">Hover over this text</div>',
  '',
  '#### 13. Button Tag XSS',
  '<button onclick="alert(\'Button click XSS vector\')">Click Button</button>',
  '',
  '#### 14. Nested script evasion',
  nestedScript,
].join('\n');

</script>

<template>
  <XMarkdown class-name="x-markdown-light" :content="content" />
</template>
