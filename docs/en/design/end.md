# End

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*l97pQZf55w4AAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT overview

AI should end the conversation gracefully. Through carefully crafted closing remarks, AI can not only showcase its social intelligence but also ensure users feel satisfied and respected at the end of the conversation. As the conversation nears its end, AI should provide helpful summaries or clear suggestions for follow-up steps, making the conclusion smooth and productive, leaving a positive impression on users and laying a solid foundation for future interactions.

## HOW to operate

### 1. Completed intentions

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*9AP9RYhIBL8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When users' needs or intentions are met, AI should ensure users clearly recognize that the task is successfully completed and confirm the end of the conversation with appropriate closing remarks, making users feel satisfied and respected. Additionally, AI should proactively ask users if they need further help or have other questions to ensure they feel well taken care of at the end of the conversation.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*FrGtRqUj_7MAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 2. Abandoned intentions

Users may abandon ongoing tasks for various reasons. Whatever the specific reason, AI should respect users' decisions and allow them to end the conversation at the appropriate time. This means AI needs to provide clear instructions or options that allow users to easily opt out of the conversation, while ensuring they know they can return at any time to continue or resume. In this way, AI helps users maintain control and feel comfortable and respectful during communication.

#### 2.1. Let users exit directly

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bqwuR5dIx4IAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Do not conduct secondary confirmations unless significant progress is lost.

> Please note that "Exit," "Cancel," "Stop," "It's Okay," and "Goodbye" are supported by default, so if the user says these, the AI's operation will end.

#### 2.2. End the conversation reasonably

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CQ5gRb8APpUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Once users indicate the conversation is over, assume you've lost their attention.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CW8eR523owIAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 3. Unsupported intentions

When AI cannot support the user's requested functions, the conversation will end. In such cases, the key approach is to honestly acknowledge the shortcomings of AI capabilities and offer feasible alternatives or guide users to achieve their goals through other means. Additionally, this is a valuable opportunity to collect feedback and data to enhance AI's capabilities and effectiveness in the future, more accurately meeting user needs. By adopting transparent and user-friendly error handling measures, user disappointment can be minimized and their trust and satisfaction with AI services maintained.

#### 3.1. Keep replies short and appropriate

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tpCSSq-dDtsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

1. When requests go beyond the scope, briefly notify users and avoid overusing apologies, such as repeatedly saying "sorry."
2. Avoid overcommitting. Only use phrases like "I can't do X yet" when the requested feature is planned to be built.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*xbHOQY7fn_kAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 4. Errors

During conversations, if you encounter irrecoverable errors, such as user input exceeding the system's processing capacity, appropriate measures should be taken to end the conversation.

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*Qa78S6hhT-QAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

1. **Timeout with no response:** If the user does not enter input within the preset waiting time, the system should automatically terminate the conversation and provide an option to restart the conversation so the user can continue accessing the desired service.
2. **Unable to match input:** When a user's input cannot be parsed by the system or does not match any preset commands, AI should provide clear error feedback. At the same time, AI should offer suggestions or possible action plans, guiding users on how to adjust their input for assistance.

<br/>

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*t4J8T5I2AowAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

3. **System error:** If system restrictions prevent user requests, AI should clearly inform users that the required service cannot be provided and offer alternative or redirect to other services.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cGTxRbmiHawAAAAAAAAAAAAADgCCAQ/fmt.webp)

---

React Original: [End] (https://x.ant.design/docs/spec/end-cn).
