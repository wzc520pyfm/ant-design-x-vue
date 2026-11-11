# Express · User input

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*59IVSLXDTdIAAAAAAAAAAAAADgCCAQ/fmt.webp)

Open-ended input for AI conversations: when users start conveying their intentions to the AI, it often requires input of various types of content.

## Design goals

When users have clear demands, different forms of input interaction are needed to accurately convey their intentions to AI, thereby improving AI's understanding of user intentions and providing precise responses. [Input components] play an important role during the expression stage. By utilizing various forms (such as text descriptions, image uploads, voice input, etc.), input components add more possibilities and flexibility to interactions between users and AI, allowing users to input content naturally, conveniently, and correctly, and then send it.

---

## 🙌 Text input

Input boxes provide users with controls for editing text and are the most basic and common way to provide information to large models.

### Input

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*os7CTZgHfZgAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

For a smaller number of characters, a single-line input form is used. To improve data entry efficiency, placeholder hints can usually be added in the input box to help remind users.

> **Note**: Special styles can be applied to certain text (such as numbers and URLs).

### Textarea

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*FE3vSrLOW_UAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

A multi-line text area is used when entering long pieces of single text.

### Stop generation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*gCKFSY3S1oUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>
<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Ba4tQ6IN6LcAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Stop generation actions are commonly located near the input box for easy user operation.

## 🎙️ Voice input

### Listening

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BM6xRrVP9B4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Users can be provided the option to input via voice, which is then converted to text for user confirmation.

### First-time voice start

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*N1QbRL-nCdUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>
<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eaLATo9gzwEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Upon first starting the voice function, system-provided prompts usually appear to enable the user to allow or deny voice input.

### Voice errors

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*N4eTQokA5akAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>
<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*JrsuTYuyy_UAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Abnormal situations may occur during voice input and must be promptly and clearly communicated to the user, such as timeout warnings or interruptions due to network issues.

## 📃 File input

File uploads allow users to express intentions based on files, enabling the large model to understand and respond more deeply based on the uploaded file.

### Simple upload

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*E2IPT4lnwj8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Basic upload methods are usually used for a single file upload and when a preview is not required. Users can simply click a button to open a file selection dialog and choose the file they want to upload.

### Drag-and-drop upload

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tosqQ4NLfOMAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Users can drag files into a designated area to complete the upload. This method is simple and efficient, requiring no complicated steps; a simple drag allows the file to be quickly uploaded to the specified location.

## 🎯️ Shortcut commands

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*NpaOSq__vi8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*znoMQZL88_EAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

In AI large model products, provide shortcuts for common intents for quick input by users. Shortcuts enable users to interact efficiently with AI, avoid tedious input operations, and improve work efficiency and user experience.

## 🧩 Slot filling

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bHm7Q5NFGRUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Slot filling usually means that when the user triggers a specific command, a preset input template appears, allowing users to simply fill in or select the operation. Slot filling provides users with a convenient input method, reducing their input burden and improving accuracy and efficiency.

## 💬 Quoted input

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UU-SRa-vbhAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Based on AI answers or user-sent content, if you ask again, you can provide citation input options, including text, images, documents, etc. This approach makes it easier for users to cite relevant information, enriching the content and context of their questions, and helping to obtain more accurate and targeted answers.

<br />

---

React original: [Expression | User input] (https://x.ant.design/docs/spec/expression-user-input-cn).
