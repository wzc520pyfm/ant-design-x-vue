# Confirm

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*y4fLQ4MNM_kAAAAAAAAAAAAADgCCAQ/fmt.webp)

## WHAT overview

In conversational design, validation design is an interaction design strategy that allows users to verify the parsing of their input when communicating with an AI system. This design not only improves users’ confidence in the accuracy of input information, but also enhances users’ sense of security and trust in interacting with AI by establishing conversational consensus. In addition, confirmation design helps promote the in-depth development of the conversation by maintaining the contextual coherence of the conversation, ensuring the smoothness and efficiency of communication. In this way, the AI ​​system can more accurately understand the user's intent, and the user can instantly correct any mistakes or misunderstandings, thereby improving the overall quality of the interaction.

### Three confirmation styles

#### Explicit confirmation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*E6wURJNuKgUAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Explicit confirmation requires users to make clear response confirmation of the system’s understanding or operation results. This confirmation method usually involves a simple yes/no answer, or the use of synonyms to clearly express the user's confirmation intent.

When implementing explicit confirmation, the system will suspend further operations until explicit instructions from the user are received. This confirmation method is particularly suitable for scenarios where the cost of errors is high or where explicit user consent is required, such as user confirmation before performing irreversible operations.

Explicit confirmation ensures that users have full understanding and consent for the operations to be performed, thereby reducing the risk of operational errors.

#### Implicit confirmation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*OGCvRKZylM8AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Implicit confirmation is a more subtle confirmation method that implicitly confirms the user's information in subsequent conversations or operations without requiring a direct reply from the user. This strategy usually involves the system repeating or synonymously replacing key information entered by the user to demonstrate to the user that the system has understood their intent.

Implicit confirmation is suitable for situations where the cost of error is low or the system has high confidence in the recognition result, because it can improve the efficiency of the dialogue while reducing the user's interaction burden.

When implementing implicit confirmation, the system will refine the key content expressed by the user and integrate it into the response, so that the user can quickly confirm that the system has recognized this information.

The advantage of this method is that it is more efficient, but the disadvantage is that once the system identifies an error, the user may not know how to correct it. Therefore, the use of implicit confirmation strategies needs to be carefully selected based on the accuracy of the system's information recognition and the possibility of errors.

#### No confirmation needed

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*VY4ITICKJmsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

In dialogue design, "no confirmation" means that the AI ​​does not provide any form of confirmation feedback to the user after receiving user input. This situation usually occurs when the information is highly confirmed, or the confirmation operation is considered unnecessary. In this mode, the AI ​​assumes that the user's input is correct and does not require additional confirmation steps to verify the accuracy or completeness of the input.

The "no confirmation" design takes into account the smoothness and efficiency of the user experience, especially in scenarios where the risk of user error is low or the system has sufficient confidence in the recognition of the input. This kind of interaction can reduce the user's operation steps and improve the user experience.

It should be noted that the "no confirmation" design is not suitable for all situations. In scenarios where the cost of errors is high or users’ explicit consent is required, such as before performing irreversible operations, explicit confirmation or implicit confirmation may be more appropriate to ensure that users have full understanding and consent for their operations. Therefore, designers need to carefully weigh the convenience of user experience and the security of operation when deciding whether to adopt "no confirmation" interaction.

## HOW to operate

### 1. Implicitly confirm parameters from user input

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*KgMlQ6KyuzIAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

In most cases, the purpose of implicit confirmation is not to directly verify the user's input, but to confirm the parameter information conveyed or implied by the user.

This strategy shows users that the system understands their intent by implicitly confirming the user's information in subsequent conversations or actions, such as by repeating key information or using synonym substitutions.

Implicit confirmation provides users with the necessary context so that they can more accurately understand the system's response content. In this way, implicit confirmation helps improve interaction coherence and user satisfaction, ensuring a smooth conversation flow.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*I-b4RKnBw6YAAAAAAAAAAAAADgCCAQ/fmt.webp)

### 2. Implicit confirmation of system actions

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bz8tRL4VG18AAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Implicit confirmation of action is also an indirect confirmation mechanism, which implicitly indicates that an action has been completed through systematic behavior and feedback, rather than relying on direct words or clear signals. This confirmation method generally provides users with evidence of action execution through the natural process of system response and display of results, thereby enhancing users' trust and satisfaction with system operation results without interrupting the user process.

### 3. Explicit confirmation

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*4HIpQ7M0nHsAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

Explicit confirmation is essential before performing actions that may lead to irreversible consequences, such as deleting user data or completing critical steps such as completing transactions. This mechanism ensures that users are fully aware of upcoming actions and their potential impact.

The AI ​​must clearly present the specific details of the operation to the user and proactively request the user’s explicit consent before taking the final action. In this way, explicit confirmation not only improves the transparency of the operation, but also strengthens the user's awareness of responsibility for the operation results, thereby reducing the risk of misoperation and increasing user trust in the system.

#### Components anatomy

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*HkF4RZwdqh8AAAAAAAAAAAAADgCCAQ/fmt.webp)

### 4. No confirmation needed

<ImagePreview>
<img class="preview-img no-padding" src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*X4qQRJdioRMAAAAAAAAAAAAADgCCAQ/fmt.webp">
</ImagePreview>

The confirmation step can be omitted when the user input is unambiguous and the system can recognize the user's intent with a high degree of confidence. This design principle is suitable for scenarios where the system has a high degree of accuracy in identifying user intentions, thereby simplifying the interaction process and improving the efficiency and smoothness of the user experience. By reducing unnecessary confirmation steps, users can complete operations more quickly while maintaining operational security and accuracy.

---

React original text: [Confirm](https://x.ant.design/docs/spec/confirm-cn).
