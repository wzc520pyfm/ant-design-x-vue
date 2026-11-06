# Express · User send

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QtyDRKq5VQEAAAAAAAAAAAAADgCCAQ/fmt.webp)

Used to carry user-sent conversation content, displaying various types of user-sent content in a structured and easy-to-read manner.

## Design goals

The user sending component must have a clear display effect, allowing users to intuitively review their input, such as using appropriate fonts, font sizes, and colors for text, with reasonable layout; Ensure images with high resolution, fast loading speed, and proper presentation; Provide a concise preview of the document. At the same time, the interaction design should be simple and easy to understand, with prompt and clear feedback on operations. The component should also provide a convenient re-edit function, setting prominent icons or prompts so users can easily modify and improve their input.

---

## Send interactions

### Edit and send

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*-uiSQraZL-UAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

After sending a message, if users find errors or need to add content, they can re-edit and modify the sent bubbles, providing a more convenient and flexible interactive experience that helps users better express their intentions.

### Delete a send

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*TJzIR6-vSCAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When users feel that the content of a bubble is no longer needed or that an error is sent, they can choose to delete it, providing greater flexibility and control while improving the cleanliness and accuracy of the interface.

### Quote and send

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4tI0SrL-Q6wAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eHWARJJ_xIoAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DVouQ6wbeHEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5q0CRLZwLv4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Bubble content sent by users can be referenced, providing convenience and flexibility for communication between users and AI. It can efficiently respond to AI viewpoints or reuse its own information, enhancing the coherence and accuracy of communication.

### Send errors

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDMOSKj_2bUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2aedT6-bNGQAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When sending abnormalities, the system quickly pops up clear prompts to inform users of the cause and provides solutions such as resending the message.

## Send bubble content

### 💬 Text

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Qqs7QbmhhRgAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Send bubbles to display text content to facilitate user communication, improve readability and comprehensibility, and make communication smoother and more efficient. Use appropriate fonts, font sizes, and colors for text, with reasonable layout.

> **Note**: Special styles can be used for certain texts (such as numbers and URL hyperlinks).

### 🎨 Images

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*iDpZSa5acrQAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Send bubble display image content to enhance the richness and vividness of communication, helping to convey information clearly. Design should consider the display effect of images and user experience; images must ensure high resolution, fast loading speed, and appropriate presentation.

### 📃 Documents

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*REJDR5uemYcAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Send bubbles can display document content, enhancing professionalism and richness in AI communication. In design, provide concise document previews, fully considering clarity and ease of use.

### 🧩 Mixed · image + document

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QjFHTarVmYsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Sending bubbles can display a mix of image and document content, enriching sharing methods and enhancing the vividness, professionalism, and richness of communication. This helps convey complex information comprehensively, making communication deeper and more efficient.

### 🙌 Quoted content

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*xCoAS5LeDSEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

After re-entering the content of the Bubble content, sending the Bubble can display text, images, documents, and other formats, enriching the information presentation and making communication intuitive, comprehensive, and efficient.

<br/>

---

React original: [Express|User sends] (https://x.ant.design/docs/spec/expression-user-send-cn).
