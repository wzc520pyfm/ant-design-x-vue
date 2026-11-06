# Error

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*2zMiQIQK9c8AAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT overview

Although AI has made significant progress in natural language processing, in practical applications it may still encounter situations where conversations cannot continue, which can lead to errors. Common types of errors include:

1. **AI cannot parse user input; **
2. **Users provide invalid input; **
3. **The current capabilities of AI cannot meet user requests. **

In response to these errors, effective error handling mechanisms must be implemented to guide users back onto the correct communication track. The way errors are responded to is crucial to user experience; a single mishandled error can leave a deep impression on users, even outperforming multiple successful interactions. Conversely, if errors are properly handled, users may not even realize that errors have occurred.

To optimize user experience, error handling mechanisms should:

1. Timely identification and clear identification of problems;
2. Provide clear guidance to help users correct errors or offer effective alternatives;
3. Maintain a friendly and professional tone to reduce user frustration;
4. Record error situations to continuously improve AI's understanding and response capabilities.

Through such measures, errors can minimize the negative impact of errors on user experience, while also improving the reliability and user satisfaction of AI systems.

## HOW to operate

### 1. The AI cannot parse or match the user input

In AI conversation design, a "no match" error refers to a system unable to find responses or actions that match the user's intent when processing user input. This usually occurs when the user's question or request exceeds the AI's preset processing range, or when the user's expression does not match patterns in the system's training data. For example, if a user uses unconventional wording or poses a novel question that the system has not been trained to recognize, the AI may fail to understand its intent, resulting in a no-match error.

#### 1.1. Guide the user to rephrase

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CqISQJfdzqoAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

To address such errors, AI needs to have certain error handling and recovery mechanisms. For example, the user restatement method should guide users to rephrase their questions or requests more clearly and specifically by asking questions or providing options. Generally, this method is used when there is a lack of mandatory slots (without this content to perform tasks), where the answer is unique but the scope is broad and AI cannot make guesses.

##### Components Summary

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*CoAhR4xjsKQAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 1.2. Narrow the scope

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*BqzoQIMo8DEAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

When re-asking users, AI can adopt narrow-scope strategies to enhance the clarity and efficiency of interactions. Including:

1. **Display Options**: By providing clear choices, users can quickly identify and select the option that best meets their needs.
2. **Provide Examples**: Demonstrate the correct input format or desired answer type through examples, helping users express their requests more accurately.
3. **Forecasting Demand**: Utilize AI's analytical capabilities to forecast possible user needs and proactively provide relevant information to reduce input effort.

##### Components Summary

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pYSIRqIK5oMAAAAAAAAAAAAADgCCAQ/fmt.webp)

#### 1.3. Acknowledge the mistake

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*mXiTTo9E1HAAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

To avoid users experiencing continuous frustration, AI should proactively end the conversation after two failed attempts to understand the user's intent. In such cases, providing vague promises may undermine users' trust in the system. Therefore, it should:

1. **Timely termination of conversation**: If after two attempts the user still cannot accurately understand the user's needs, the system should politely end the conversation to avoid unnecessary attempts.
2. **Clearly acknowledge limitations**: The system should honestly explain to users the limitations of its current capabilities and acknowledge that it cannot resolve users' issues.
3. **Provide alternatives**: Before ending the conversation, the system can offer other possible solutions or suggest that users seek alternative help channels.
4. **Maintain Transparency and Honesty**: Through transparent and honest communication, the system can maintain user trust and leave a positive impression for future interactions.
5. **Collecting Feedback**: The system should encourage users to provide feedback so they can learn from these interactions and improve future performance.

##### Components Summary

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*j21eTJ-CTvUAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 2. The user provided invalid input

During conversational interactions, users may send damaged or lost information due to device failures or unstable networks, or provide irrelevant or inaccurate data due to misunderstanding AI prompts. This requires guiding users to reprovide information or helping them express their needs more accurately.

#### 2.1. Restate the problem

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*YDlfR6i56soAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

During conversations, users may sometimes send damaged or incomplete information due to device failures or network connection issues. In such cases, AI systems should be capable of recognizing such issues and proactively ask users to rephrase their questions or requests. Additionally, if the user's input is unclear, AI can restate the issues it understands to confirm whether the user's intent is correctly grasped.

#### 2.2. Prompt again before ending

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*logJRZE1lx4AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

In AI conversation design, when it is recognized that a user's input may have issues or is incomplete, the user should be given another chance to respond before the conversation ends, ensuring users have the opportunity to correct or supplement their requests, thereby avoiding misunderstandings or unmet needs.

#### 2.3. End reasonably

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*jEC3S56XqiUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

To avoid unnecessary user entanglement and maintain the efficiency and respect of conversations, AI should proactively end the conversation after two failed attempts to collect user input. This strategy not only respects users' time but also avoids possible communication fatigue.

### 3. System errors

A system error occurs when the user's intent is correct, but the system on which the execution depends cannot perform the task or fails due to technical issues. Such errors may manifest as:

- **System failure**: the system is unresponsive or encounters network errors, such as network connection timeouts or large model rendering failures.
- **Invalid request**: the request made by the user is logically incorrect, such as attempting to book a time slot that has already passed.
- **Beyond capability**: the request made by the user exceeds what the AI can perform, for example: depositing 10,000 yuan into my bank card.

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*i9LTSZP6t_QAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

To ensure the system's reliability and user trust, errors should be communicated to the user in a transparent and honest manner, and practical steps for resolution should be provided. This includes but is not limited to:

1. **Provide clear error information**: give a clear and specific description of the error, avoiding technical or vague language.
2. **Explain the cause**: as much as possible, explain to the user the technical reason behind the error to increase transparency.
3. **Offer solutions**: based on the type of error, provide actionable steps or suggestions that the user can take.
4. **Guide the user**: if the problem cannot be solved immediately, advise the user on how to seek further help or contact technical support.
5. **Record and analyze**: the system should automatically record error details for subsequent analysis and improvement.

##### Components Summary

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cs2aS5jtj8AAAAAAAAAAAAAADgCCAQ/fmt.webp)

---

React source: [Error](https://x.ant.design/docs/spec/error-cn).
