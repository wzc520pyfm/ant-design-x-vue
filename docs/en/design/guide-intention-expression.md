# Guide intention expression

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*pNdBQ6XZy0YAAAAAAAAAAAAADgCCAQ/fmt.webp)

User intentions often tend to be expressed in a colloquial manner, which makes AI unable to recognize and understand efficiently, which in turn affects the user experience. In order to guide the accurate matching of the intentions of both AI and users, we introduced the concept of "slot design" on the design side.

What is a slot? Slots can be understood as predefined parameters or variables, used to match key information expressed by users, such as date, time, location, etc. This information is critical to understanding user intent and providing accurate responses, which together form a complete understanding of user needs. For example, in a smart assistant application, the user says "remind me to have a meeting at 2pm tomorrow", where "tomorrow at 2pm" is a time slot. In order to accurately guide users to express these key information clearly, we need to consciously and naturally guide users to express the corresponding information during the interaction process.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*JobgQqiiT4YAAAAAAAAAAAAADgCCAQ/fmt.webp)

In the actual business practice of Ant, we found that even if the application intent slot matching is applied, there are still cases where some scenarios are not fully matched. For such scenarios, we have also compiled a response strategy to cover the scenario of full intent slot matching. The intent slot matching strategy is as follows:

- **Accurate matching of intent and slot:** If the reliability of the user's intention is high and all required slots have been successfully filled, the system will directly send instructions to the downstream service to execute the user's request.

- **Intent matches multiple similar slots:** When the reliability of the user's intention or key slot is low, the system will reply with an intent or slot confirmation message to request further clarification or additional information from the user to ensure that the information is accurate.

- **Intent not matched to the slot:** When encountering a user intention that cannot be handled directly, adopt a dialogue transfer or reply cryptic strategy to ensure that the user receives reasonable guidance or response.

The rules of slot design will be related to specific applications in the specific session design chapters. Please refer to them as needed.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*_a2DTZensl8AAAAAAAAAAAAADgCCAQ/fmt.webp)

At this point, I believe everyone has a preliminary answer to the question mentioned in the introduction of the overview: "When should conversational methods be used? How to make AI understand the user's intentions?" etc. Next, let us enter the role design chapter, conversation design chapter, and hybrid interface chapter to further understand how to create a better AI product experience.

## Best cases

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*SSWhQIEadIYAAAAAAAAAAAAADgCCAQ/fmt.webp)

---

React original text: [Guide Intention Expression](https://x.ant.design/docs/spec/guide-intention-expression-cn).
