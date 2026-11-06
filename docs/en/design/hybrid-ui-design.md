# Introduction

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bybpQaS1i9kAAAAAAAAAAAAADgCCAQ/fmt.webp)

In the AI ​​era, graphical interfaces incorporate multi-channel interactions such as natural language conversations and evolve into new forms. When all the intangible experience rules such as intention, role, and conversation are determined, they will eventually be carried on the specific interface. Intangible experience is integrated into tangible experience. In this part, the HUI we propose is to define the tangible experience of the interface and ensure the last threshold for AI product experience.

Ant Design

## WHY Hybrid UI

With the extremely rapid development of artificial intelligence (AI) technology, more and more diverse ways of working with humans and AI have emerged in various fields. This way of working covers many levels, from simple data processing to complex decision-making. As the collaboration between humans and AI continues to innovate and expand, it will inevitably bring about all-round and deep changes in user interaction behavior. These changes are not only reflected in the frequency of interaction, but also include many aspects such as the mode and content of interaction, as well as the expectations and processing of interaction results. Artificial intelligence has brought powerful tool functions and raised users’ expectations for intelligent experiences.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*PmlSR6yuYWgAAAAAAAAAAAAADgCCAQ/fmt.webp)

In the era of artificial intelligence (AI), the change in user behavior is: instead of the main execution behavior (DO) of humans, artificial intelligence can be added to provide intention information (Chat), allowing AI to perform tasks. Humans can perceive the process and results of AI and make assisted decisions.

Therefore, based on changes in user behavior, a new way of natural language dialogue will be added based on the traditional operation of GUI + keyboard and mouse. At the same time, new user behavior also brings challenges of expression barriers. Designers need to think about how to balance the user's conversational experience and operational experience? How should the interface carrier take into account presentation?

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*UpqARobh0kYAAAAAAAAAAAAADgCCAQ/fmt.webp)

Based on the above thinking, after the design practice of 50+ AI products within Ant, we launched **Hybrid User Interface (Hybrid UI)** to answer: How can the AI-powered hybrid intent interface take into account the user's conversational experience and operational experience? We need to combine the original traditional GUI with the new UI model brought by natural language in the AI ​​era to meet the interface expression requirements of different scenarios.

## WHAT · Hybrid UI

The **Hybrid User Interface (Hybrid UI)** powered by AI is suitable for exploring the integration of AI conversational interface and GUI operation interface. Hybrid UI can be equipped with different key UI elements to solve the user's intention expression demands of Chat and Do. Based on business practice in the past year, we have taken stock of 50+ enterprise-level AI products and abstractly summarized three types of interface patterns. Based on different user intentions, PDs or designers can quickly locate the interface patterns for product tendencies.

- **Do mainly:** Mainly based on interface operations, occasionally calling out AI shortcut commands. For example, Quick Bar, fixed imperatives, built-in generatives, etc.
- **Do + Chat balance:** A balanced combination of natural language and interface operations. For example, dual-zone linkage interaction, interactive operation bubbles, etc.
- **Chat-based:** Mainly based on natural language, with almost no interface operations. For example, side-mounted Copilot, independent Web Bot, etc.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*MYRbTYaUnToAAAAAAAAAAAAADgCCAQ/fmt.webp)

In addition, at the asset layer, based on Ant Design 5.0, we also hope to provide a set of convenient AI component assets to facilitate PD or designers to quickly build a suitable Hybrid UI. Design assets are endless and constantly changing, but user purpose and design goals are relatively unique, so we abstracted the four stages of user perception of AI from the user's perspective, and precipitated a set of typical Hybrid UI interface design assets, namely **Ant Design X**, so that it can continue to grow.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*uBTuR6ymZP0AAAAAAAAAAAAADgCCAQ/fmt.webp)

1. **Awakening stage: Users need to understand the capabilities and usage of AI products. ** The design goal is to attract users, allow first-time users to quickly understand what AI can do, and inform users of the range of intentions and expectations that AI can achieve. Related assets are [Welcome&Prompt](/en/design/wake-up-welcome-message).
2. **Expression stage: The user accurately expresses his or her intentions to the AI. ** The design goal is to let users know how to express their intentions quickly and correctly, and to clearly see the content they send. Related assets are [User Input](/en/design/expression-user-input), [User Send](/en/design/expression-user-send).
3. **Confirmation phase: The user waits for the AI ​​to complete the task. ** The design goal is to let users know the AI ​​execution status of the task. The related assets are [Generation Process](/en/design/confirm-generation-process).
4. **Feedback stage: Users check the AI ​​completion results and apply them. ** The design goal is to allow users to clearly see and trust the completion of AI tasks and quickly apply AI to generate results. Related assets include [Result Display](/en/design/feedback-result-display) and [Result Application](/en/design/feedback-result-application).

## HOW · Using assets

We work with engineers to convert Ant Design X design components into reusable code to maximize your productivity and communication efficiency.

- **R&D components:** Ant Design X provides multiple types of basic component libraries.
- **Sketch Assets:** Provides design asset packages, including components, typical templates, etc. Click to download: [🌟AntDesignX_UI KIT_20241122 version.sketch](https://github.com/user-attachments/files/17931379/AntDesignX_UI.KIT_20241122.sketch.zip)
- **Demo Demo:** Provides real model room experience, including independent, assistant, and built-in.

![Typical page diagram](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*e-7uTaBpCjgAAAAAAAAAAAAADgCCAQ/original)

---

React original text: [Introduction](https://x.ant.design/docs/spec/hybrid-ui-design-cn).
