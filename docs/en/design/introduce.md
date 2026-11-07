# Introduction to the RICH design paradigm

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*48RLR41kwHIAAAAAAAAAAAAADgCCAQ/fmt.webp)

On November 30, 2022, OpenAI released ChatGPT 3.5, leading humanity into a new era of AGI (Artificial General Intelligence) human-computer interaction. AGI makes natural human-computer interaction a reality, and "language," this simple and natural form of interaction, once threatened the GUI (Graphical User Interface) that had dominated the human-computer interaction field for decades. Designers began various attempts and modifications:

- Introducing copilots to BI software, allowing beginners to perform data analysis through natural language
- Integrating various cross-platform enterprise office software into an intelligent assistant to improve office efficiency
- Building AI-native code development software based on natural language to replace traditional complex code editors
- ……

Without exception, designers initially boldly and firmly embraced "conversational interaction," as if it were omnipotent and about to become the ruler of the human-computer interaction field. However, over time, when people calmed down from the "infatuation" with natural language interaction, they realized that although conversational interaction has advantages such as simplicity and ease of use, it also has many drawbacks.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*RWo-R660OAoAAAAAAAAAAAAADgCCAQ/fmt.webp)

An important question began to emerge: **How should AI product interface design be conducted?** In Ant's internal AI product design practice, we also frequently encounter similar confusions:

- Are graphical interface operations not good enough? Is it necessary to use conversational methods?
- What types of products are suitable for completion through conversational interaction?
- Can conversational interaction be integrated with graphical interface interaction?
- What factors influence the user experience of AI product design?
- How to systematically think about the design of an AI product?
- ……

The essence of these confusions comes from our lack of clear definition and understanding of the current "AI product interface design" that integrates multiple interaction modes. Therefore, we are confused on how to create a good AI experience.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*5I5RRLM5N3kAAAAAAAAAAAAADgCCAQ/fmt.webp)

Therefore, starting from the end of 2023, our team mobilized designers from various business fields, established a horizontal AI design research group, and began to try to define and understand what the so-called "AI + Design" is and how to do design propositions.

In this regard, there are many related research and applications in both academia and business circles. Standing on the shoulders of giants, we strive to build a set of AI design theories suitable for today, and at the same time practice and iterate our ideas in the massive AI products emerging within Ant. In this process, a set of systematic AI design theories and methods began to emerge - **"RICH Design Paradigm-Creating Excellent AI Product Experience"**.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*kMJkQLqIftsAAAAAAAAAAAAADgCCAQ/fmt.webp)

## 1. What is the RICH design paradigm?

RICH is an AI interface design paradigm proposed by us, just like the WIMP paradigm for graphical user interfaces.

ACM SIGCHI 2005 (the top conference on human-computer interaction) once defined that the core issues of human-computer interaction can be divided into three levels:

1. **Interface paradigm layer:** Defines the design elements of human-computer interaction interface and guides the core issues that designers should pay attention to.
2. **User model layer:** Build an interface experience evaluation model to measure the quality of the interface experience.
3. **Software framework layer:** The underlying support algorithms and data structures of the human-machine interface and other software development frameworks are the content hidden behind the front-end interface.

Among them, the interface paradigm is the level that designers need to pay most attention to and define when every new human-computer interaction technology is born. The interface paradigm defines what design elements designers should pay attention to. Based on this, we can define what good design is and how to carry out good design.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*g2WzS7qPuTcAAAAAAAAAAAAADgCCAQ/fmt.webp)

People’s pursuit of user interface innovation essentially wants to broaden the bandwidth of human-computer interaction and liberate human productivity to a greater extent. Throughout the development of human-computer interaction, a variety of widely used user interface types have emerged, from the earliest batch processing interface, to the later command line interface, to the most popular graphical user interface today.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*cXCbRJO2Rl4AAAAAAAAAAAAADgCCAQ/fmt.webp)

The graphical user interface based on the **WIMP (Window, Icon, Menu, Point Device) interface paradigm** was first born in the Xerox Company in the 1970s, and was later adopted and carried forward by Apple Macintosh computers and Microsoft Windows computers in the 1980s. The WIMP interface based on the desktop metaphor has continued to dominate the field of interface design for more than 40 years due to its advantages such as syntax minimization, object visualization, and fast semantic feedback.

As shown in the example below, the WIMP graphical user interface we are still using today is not fundamentally different from its earliest appearance. Such a powerful reality once again verifies the importance of defining interface paradigms.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bSY2T5wecoEAAAAAAAAAAAAADgCCAQ/fmt.webp)

In the era of AGI, machines can already understand more complex and ambiguous human intentions, and can communicate with users in an almost fully human-like manner. The technology driving this transformation will inevitably lead us to break away from past design experiences and attempt to define a new paradigm for human-computer interaction interfaces in order to find the optimal experience.

RICH is a proposed paradigm assumption suitable for the current era of AGI human-computer interface design, and it contains four design elements:

- **Intention**
- **Role**
- **Conversation**
- **Hybrid UI**

Each design element guides us, designers, to focus on specific issues.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*6_m8SbyOmlYAAAAAAAAAAAAADgCCAQ/fmt.webp)

We believe that in the AI design process, paying attention to these four elements will help us create outstanding AI product experiences with half the effort.

## 2. WHY the RICH design paradigm?

Before applying it, we would like to share how RICH was derived and why it is RICH and not something else.

In the history of human-computer interaction, the iteration of machines and interaction methods has always relied on the maturation and application of transformative technologies. What changes are the technologies and interaction methods, but the essence of human-computer interaction and human needs remain unchanged. It is by identifying the unchanging that RICH was derived.

The essence of human-computer interaction is that the user inputs something to the machine by performing an action or behavior, the machine understands and fulfills the request, producing results for the user, and the user evaluates whether it meets the requirements. If it does, an interaction unit completes a closed loop.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*bokiToyWY0QAAAAAAAAAAAAADgCCAQ/fmt.webp)

Based on this, Donald Norman proposed a human-computer interaction model that further decomposes and defines this interaction unit.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*KjCBRaG4PrkAAAAAAAAAAAAADgCCAQ/fmt.webp)

In the era of graphical interfaces, the various elements in the WIMP paradigm mainly function at the nodes related to human-computer interaction involving 'executing operations' and output:

- **icon:** Helps users carry out operations through graphical metaphors.
- **menu:** Organizes various operations through a structured order, enabling users to perform systematic tasks more efficiently.
- **pointing devices:** Through keyboard and mouse pointing devices, users can more clearly select the target operation.
- **windows:** Provides a fixed space to contain different content, allowing users to read and evaluate various multimedia content.

Due to the characteristics of graphical interface interaction, in past interactions, a large amount of initial work needed to be completed by the user themselves. Users had to first plan and decompose their intentions in combination with tools — namely the computer and the graphical interface — before they could start instructing the machine to execute the specified operations.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*PvCFRqxBjscAAAAAAAAAAAAADgCCAQ/fmt.webp)

It can be seen that in the past, machines merely passively helped users execute commands, while users' intentions needed to be first decomposed and refined by themselves in order to be translated into repeated clicks to communicate them to the machine. But in today’s AI era, everything is different. The biggest leap of machines is that they are increasingly like a 'human'; they can understand users' vague intentions, even automatically create plans and drive task execution, ultimately helping users achieve their intentions.

In this new interaction phase, many invisible experience rules have been added. In the past, as long as the UI interface was relatively usable and aesthetically pleasing, it could provide a good experience for users. But in the AI era, the experience also depends on whether the machine understands what I mean, whether it speaks in a pleasant way, and a series of other invisible factors. Therefore, for this kind of new interaction feature, key design elements need to be re-abstracted and defined to ensure our design focus is moving in the right direction.

The RICH paradigm is the set of design elements we attempt to define for the AI era:

- **Intention:** AI can understand and comprehend users' intentions, assist users in automatically completing plan creation and task decomposition, and thus promote execution.
- **Role:** AI assumes a certain identity role to match the user’s intentions and ensure smooth and expected interaction with the user.
- **Conversation:** Users' vague intentions are gradually focused and decomposed together with AI through conversation, with user commands integrated in the process.
- **Hybrid UI:** The user's actions and the machine's output and feedback are carried in an interface that integrates multiple interaction methods.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*0ZkdTZND-b8AAAAAAAAAAAAADgCCAQ/fmt.webp)

The four elements mentioned above together form the letters IRCH. For ease of memory and application, we rearranged the order of the letters to get the word RICH, which happens to be very easy to remember. For the time being, we call this design paradigm the "RICH Design Paradigm" 😄.

## 3. How to apply the RICH AI design paradigm?

So, how do we apply RICH to create an outstanding AI product experience? In the subsequent guideline documents, we will explain in an easy-to-understand manner, introducing and defining the four elements within RICH individually. By providing ready-to-use design strategies and examples, we help everyone better understand and apply RICH. This concept and the final interface assets are also integrated into Ant Design X, hoping to help everyone easily create outstanding AI product experiences!

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*0xUFQoMAhiIAAAAAAAAAAAAADgCCAQ/original)

## Appendix

Finally, we are grateful for various open-source academic papers, books, and AI design theories from the industry. Over the past year, on their shoulders, we have built a set of ready-to-use theories and methods. We know that RICH still has many aspects that are not well considered, and we hope everyone gives us more feedback.

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*tEwGRIqUGVQAAAAAAAAAAAAADgCCAQ/fmt.webp)

Lastly, thanks to ourselves for finding time in our busy daily work to complete this almost purely public-interest guideline manual. We are designers:

![](https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*h6ZdTq2Bur4AAAAAAAAAAAAADgCCAQ/fmt.webp)

---

Original React article: [Introduction to the RICH Design Paradigm](https://x.ant.design/docs/spec/introduce-cn).

## Mapping to Vue components

Vue components grouped according to the four stages of RICH:

- Wake-up: Welcome, Prompts
- Expression: Attachments, Sender, Suggestion
- Confirmation: Think, ThoughtChain
- Feedback: Actions, FileCard, Sources
- Conversation container: Bubble, Conversations
