# Confirm · Generation process

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bsGjTaJWgR4AAAAAAAAAAAAADgCCAQ/fmt.webp)

During the process of waiting for AI to respond after users express their intentions, the AI must be shown the progress and status of processing requests, generating content, or executing tasks.

## Design goals

Feedback during processing should be provided to users promptly through streaming output and other means, allowing users to clearly perceive the AI's working status and establish appropriate waiting expectations. In some business scenarios, it is necessary to fully display the AI's thinking process and processing stages, reduce the sense of being black-boxed, and enhance users' trust and understanding of the system.

---

## Dynamic content loading

### Loading animation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RR6eTbVD-tIAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

System status feedback triggered immediately upon receiving user requests. Lightweight animation effects let users know the system has started processing without causing visual distractions. Animations should be triggered instantly, concise, and restrained, allowing users to perceive clear responses.

### Streaming output

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*w5T-R6Q2tM0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Real-time feedback format when AI processes text content. By default, typewriter cursor effects are used, allowing users to sense the generation rhythm; However, when the model responds very quickly, the full content should be displayed directly. Maintain readability of output content, allowing users to read the generated parts in real time.

### Progress display

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*nbk_Q4EfmR0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Status feedback in asynchronous generation scenarios. Shows current task progress through progress percentages or processing phase prompts. For tasks that take a long time, provide estimated completion times to help users build waiting expectations.

## Error-state display

### Generation failed

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*jSdGT4NGzy0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When a request fails, promptly display the reasons for failure and possible actions. Failure prompts should be eye-catching but not provocative, with clear and concise copying, and suggestions for follow-up actions such as retrying.

### Generation stopped

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Ul_rR5Ix1XAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Includes cases where users initiate or automatically terminate the system. After termination, retain the generated content and clearly indicate the current status. For system termination, explain the reason and provide recommendations.

## Showing the thinking process

### Show thinking stages

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*QOdOQpy-io8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Helps users understand the AI's processing flow and progress. In scenarios that take longer (such as deep search), it displays the complete processing steps; When it takes a short time, only the current thinking state is shown.

### Show thinking details

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DtBxSYxd7WcAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Present the specific steps and basis of AI reasoning in an expandable/collapsed format. Design should allow users to view decision-making process details while avoiding information overload.

---

React original: [Confirm | Generation Process] (https://x.ant.design/docs/spec/confirm-generation-process-cn).
