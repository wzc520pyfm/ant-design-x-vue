# Feedback · Display results

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*p4l8Q4Hdix0AAAAAAAAAAAAADgCCAQ/fmt.webp)

After AI processes user requests, it needs to present various types of answers in a structured and easy-to-read manner.

## Design goals

Presentation of results requires reasonable planning of information hierarchies to make important content and structured information easier to recognize. For different types of content such as text, images, and code, appropriate display formats should be used, maintaining visual style consistency while fully considering the reading experience of long texts, avoiding information overload that could affect comprehension.

---

## Content display

### Text content

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*c_8JTrMpRJ8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

As the most basic display form, it is necessary to properly handle single-line text, multi-line text, and structured text (such as lists, headings, paragraphs, etc.). Improve the readability of long texts through reasonable spacing, font size, and paragraph division. For key content, you can use styles such as highlighting and bolding to highlight them, but control usage frequency to avoid interference.

### Image content

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*S8ljSJ-V6YIAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Display AI-generated or processed image results. By default, display at appropriate sizes, with support for preview of large images and zooming details. For multi-image scenes, pay attention to aesthetic layout; provide placeholder images during loading to avoid layout fluctuations.

### Code content

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*io9ISYEQJ_sAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Design a dedicated container for displaying code snippets. Use monowidth fonts and support syntax highlighting to enhance readability. Provide code copy functionality for user convenience. Supports horizontal scrolling when code is too long, maintaining code formatting integrity.

### Interactive cards

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5TshRpA9w_4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Used for structured content requiring user operation in specific scenarios, such as form filling, parameter adjustments, etc. Cards can include buttons, input boxes, and other interactive elements, with clear feedback required for operations.

### Other

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-MuHQo41bPYAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Used for displaying tables, mathematical formulas, and other special formats. Can be mixed with regular text content to maintain overall visual consistency. Special content display should consider performance and compatibility, and provide downgrade solutions if necessary.

## Content structure

### Content collapse

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*VhKkQ78jX0MAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

For content longer than one screen, a folding function is provided to improve browsing efficiency. By default, preview content is displayed, allowing users to expand and view full information as needed. Folding status must have clear indications, and unfolding/collapse animations should be smooth.

### Source references

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*L5sWQ6w_qjoAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Use in scenarios such as RAG where citation evidence is needed. Reference sources are set to collapse by default to reduce interference; users can view detailed citation content via hover or clicking. Source information should be concise and clear to enhance credibility.

<br/>

---

React original: [Feedback | Result Display] (https://x.ant.design/docs/spec/feedback-result-display-cn).
