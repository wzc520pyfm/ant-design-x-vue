# Follow-up

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BhgMQIcgCfUAAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT overview

During AI conversational interactions, if the information provided by the user is insufficient for the AI to complete its intended task, the AI must take proactive measures by using carefully designed questions to guide the user in providing additional slot information. This strategy not only ensures the smooth completion of the task but also enhances the user experience, avoiding misunderstandings or errors caused by insufficient information. For example, if a user provides only the check-in date when booking a hotel but does not provide the check-out date, the AI can politely ask, 'How long will you be staying here?' Such a question is both clear and specific, helping to obtain the necessary information while maintaining the flow of the conversation.

## HOW to operate

1. **Clearly identify needs:** AI first needs to accurately analyze user input to determine which information is missing or insufficient.

2. **Construct effective questions:** Based on the identified information gaps, the AI should construct clear and specific questions that directly guide the user to provide the required information.

3. **Maintain conversational coherence:** When requesting additional information, the AI should keep the dialogue natural and smooth, avoiding abrupt questions, and ensure the user understands why the information is needed.

### 1. Disambiguation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*D2ntT7HfxeIAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

In conversations, language often carries multiple interpretations and usually relies on context to resolve ambiguities. When contextual information is insufficient to clarify meaning, the AI should proactively request additional information from the user to clarify the issue.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*dW_WRphl1w8AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 2. Error handling

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*mKI4QJKDLEwAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When problems arise in a conversation, by accurately identifying the core of the problem, more targeted assistance can be provided, guiding the user to quickly resume the correct operation process.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*ALVHQ4SVycsAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 3. Second confirmation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*DGmNTpLDwf4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Although this situation is rare, in the following scenarios, reconfirmation is crucial:

- When misunderstanding the user's intent could lead to serious consequences (for example, involving names, addresses, or text that the user has authorized to share);
- Before performing irreversible actions (for example, deleting user data or completing a transaction).

Double confirmation can minimize errors and risks, ensuring the user receives accurate and reliable service.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*rybpRpR5W_gAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 4. Impact on the core experience

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*8lGGTJP2bw0AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

If optional slot information is crucial to the user experience, the AI can also proactively ask follow-up questions to ensure that the collected information is sufficient to support the user's decision-making.

---

React original text: [Follow-up](https://x.ant.design/docs/spec/follow-up-cn).
