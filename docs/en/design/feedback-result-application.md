# Feedback · Apply results

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*LGETTJIfYe0AAAAAAAAAAAAADgCCAQ/fmt.webp)

After AI presents the generated results, users need to be provided with quick operation capabilities for AI-generated content, including basic functions such as copying, re-generation, and feedback, to help users efficiently use and process content.

## Design goals

The result application component needs to be tailored to real-world scenarios and provide necessary and convenient content processing capabilities. Through reasonable operation item layout and timely status feedback, users can easily use and manage AI-generated content, enhancing the overall interaction experience and efficiency.

---

## Basic operations

### Copy

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QOSfTLjK1kEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Most commonly used content application methods. After clicking, immediately copy AI-generated content to the clipboard, and the icon switches to completion status to provide feedback. The copy scope includes text, code, and other copyable content, ensuring formatting integrity.

### Regenerate

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*_5uNR7dvpAAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Used to optimize or improve current results. Click to trigger AI regeneration request, supporting switching and comparison of results across multiple versions. Newly generated content should switch smoothly within the interface to maintain a good transition experience.

### Feedback

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*i1aMRKn7WLEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Am8ARrPiHhYAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Collect user reviews of content through likes and clicks. After operation, the icon immediately reflects the selection status, clearly displaying user evaluation results. In specific scenarios, you can collect specific feedback through pop-ups, providing shortcuts while retaining free input options.

### Delete

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*C_PTQIUXkL8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Used to remove unwanted response content. Considering the irreversibility of operations, use warning color reminders and set up a secondary confirmation mechanism to avoid accidental actions. After confirming deletion, the content should be removed smoothly.

### Read aloud

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*gG4nQZZOQYoAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Convert text to voice output. Tap Start Playback, then click Stop again.

### Quote

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*GUaJQrP0sqQAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Quickly use AI responses as quotes for new conversations. After clicking, it will automatically fill in the input area, making it easy for users to continue the conversation based on existing answers. Citations should maintain the original format to ensure contextual coherence.

<br/>

---

React original: [Feedback | Result Application] (https://x.ant.design/docs/spec/feedback-result-application-cn).
