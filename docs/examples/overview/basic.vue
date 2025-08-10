<script setup lang="tsx">
import {
  Card,
  Space,
  Typography,
  Row,
  Col,
  Input,
  Tag,
  Affix,
} from 'ant-design-vue';
import {
  MessageOutlined,
  CommentOutlined,
  StarOutlined,
  BulbOutlined,
  PaperClipOutlined,
  SendOutlined,
  ThunderboltOutlined,
  NodeIndexOutlined,
  ApiOutlined,
  SettingOutlined,
  GlobalOutlined,
  CloudOutlined,
  RobotOutlined,
  SearchOutlined,
  LinkOutlined,
} from '@ant-design/icons-vue';
import {
  Bubble,
  Welcome,
  Prompts,
  Suggestion,
  ThoughtChain,
  Sender,
} from 'ant-design-x-vue';
import { ref, computed } from 'vue';

defineOptions({ name: 'AXOverviewDemo' });

const { Title, Paragraph } = Typography;

// 搜索功能
const searchValue = ref('');

// 示例数据
const promptItems = [
  {
    key: '1',
    icon: <BulbOutlined style={{ color: '#FFD700' }} />,
    label: '创意启发',
    description: '获得新项目的灵感',
  },
  {
    key: '2',
    icon: <StarOutlined style={{ color: '#1890FF' }} />,
    label: '效率提升',
    description: '如何更快更好地工作？',
  },
];

const suggestionItems = [
  { label: '写一个报告', value: 'report' },
  { label: '画个图', value: 'draw' },
  { label: '查询知识', value: 'knowledge' },
];

const suggestionValue = ref('');

const thoughtChainItems = [
  {
    title: '分析需求',
    description: '理解用户的具体需求和场景',
    status: 'success' as const,
  },
  {
    title: '设计方案',
    description: '根据需求设计合适的技术方案',
    status: 'success' as const,
  },
  {
    title: '实现功能',
    description: '编写代码实现设计的功能',
    status: 'pending' as const,
  },
];

// 组件数据
const allComponents = [
  {
    id: 'bubble',
    category: '通用组件',
    title: 'Bubble 对话气泡',
    description: '用于展示对话消息的气泡组件，支持多种样式和自定义内容',
    icon: <CommentOutlined style={{ color: '#52c41a' }} />,
    content: 'bubble-demo',
  },
  {
    id: 'conversations',
    category: '通用组件',
    title: 'Conversations 管理对话',
    description: '管理多个对话会话的组件，支持分组、排序和交互操作',
    icon: <MessageOutlined style={{ color: '#722ed1' }} />,
    content: 'conversations-demo',
  },
  {
    id: 'welcome',
    category: '唤醒组件',
    title: 'Welcome 欢迎',
    description: 'AI 应用的欢迎界面组件，用于引导用户开始对话',
    icon: <StarOutlined style={{ color: '#fa8c16' }} />,
    content: 'welcome-demo',
  },
  {
    id: 'prompts',
    category: '唤醒组件',
    title: 'Prompts 提示集',
    description: '预设提示词组件，帮助用户快速选择对话主题',
    icon: <BulbOutlined style={{ color: '#ffd700' }} />,
    content: 'prompts-demo',
  },
  {
    id: 'attachments',
    category: '表达组件',
    title: 'Attachments 输入附件',
    description: '处理文件上传和附件管理的组件，支持多种文件类型',
    icon: <PaperClipOutlined style={{ color: '#eb2f96' }} />,
    content: 'attachments-demo',
  },
  {
    id: 'sender',
    category: '表达组件',
    title: 'Sender 输入框',
    description: '消息输入组件，支持文本输入、语音识别等功能',
    icon: <SendOutlined style={{ color: '#1890ff' }} />,
    content: 'sender-demo',
  },
  {
    id: 'suggestion',
    category: '表达组件',
    title: 'Suggestion 快捷指令',
    description: '快捷建议组件，为用户提供预设的操作选项',
    icon: <ThunderboltOutlined style={{ color: '#f5222d' }} />,
    content: 'suggestion-demo',
  },
  {
    id: 'thought-chain',
    category: '确认组件',
    title: 'ThoughtChain 思维链',
    description: '展示 AI 思考过程的组件，可视化推理步骤',
    icon: <NodeIndexOutlined style={{ color: '#722ed1' }} />,
    content: 'thought-chain-demo',
  },
  {
    id: 'use-x-agent',
    category: '工具组件',
    title: 'useXAgent',
    description: '模型调度的 Vue 组合式函数',
    icon: <RobotOutlined style={{ color: '#13c2c2' }} />,
    content: 'use-x-agent-demo',
  },
  {
    id: 'use-x-chat',
    category: '工具组件',
    title: 'useXChat',
    description: '聊天数据管理的组合式函数',
    icon: <MessageOutlined style={{ color: '#52c41a' }} />,
    content: 'use-x-chat-demo',
  },
  {
    id: 'x-stream',
    category: '工具组件',
    title: 'XStream',
    description: '流式数据传输工具',
    icon: <CloudOutlined style={{ color: '#1890ff' }} />,
    content: 'x-stream-demo',
  },
  {
    id: 'x-request',
    category: '工具组件',
    title: 'XRequest',
    description: 'AI 服务请求工具',
    icon: <ApiOutlined style={{ color: '#fa541c' }} />,
    content: 'x-request-demo',
  },
  {
    id: 'x-provider',
    category: '工具组件',
    title: 'XProvider 全局化配置',
    description: '全局配置提供者，统一管理应用级别的设置',
    icon: <GlobalOutlined style={{ color: '#722ed1' }} />,
    content: 'x-provider-demo',
  },
];

// 过滤组件
const filteredComponents = computed(() => {
  if (!searchValue.value) return allComponents;
  const search = searchValue.value.toLowerCase();
  return allComponents.filter(
    (component) =>
      component.title.toLowerCase().includes(search) ||
      component.description.toLowerCase().includes(search) ||
      component.category.toLowerCase().includes(search),
  );
});

// 按分类分组
const groupedComponents = computed(() => {
  const groups: Record<string, typeof allComponents> = {};
  filteredComponents.value.forEach((component) => {
    if (!groups[component.category]) {
      groups[component.category] = [];
    }
    groups[component.category].push(component);
  });
  return groups;
});

// 获取组件显示文本
const getComponentDisplayText = (component: any) => {
  const textMap: Record<string, string> = {
    conversations: '对话管理界面',
    attachments: '文件上传区域',
    'use-x-agent': 'AI 模型调度',
    'use-x-chat': '数据管理',
    'x-stream': '流数据处理',
    'x-request': '请求处理',
    'x-provider': '全局配置管理',
  };
  return textMap[component.id] || component.title;
};

// 获取组件子文本
const getComponentSubText = (component: any) => {
  const subTextMap: Record<string, string> = {
    conversations: '支持会话分组和排序',
    attachments: '支持多种文件类型',
    'x-provider': '统一管理应用级别设置',
  };
  return subTextMap[component.id] || '';
};

// 组件路由映射
const componentRoutes: Record<string, string> = {
  bubble: '/component/bubble',
  conversations: '/component/conversations',
  welcome: '/component/welcome',
  prompts: '/component/prompts',
  attachments: '/component/attachments',
  sender: '/component/sender',
  suggestion: '/component/suggestion',
  'thought-chain': '/component/thought-chain',
  'use-x-agent': '/component/use-x-agent',
  'use-x-chat': '/component/use-x-chat',
  'x-stream': '/component/x-stream',
  'x-request': '/component/x-request',
  'x-provider': '/component/x-provider',
};

// 处理组件点击
const handleComponentClick = (component: any) => {
  const route = componentRoutes[component.id];
  if (route) {
    window.location.href = route;
  } else {
    console.log('未找到路由:', component.id);
  }
};

const Demo = () => {
  return (
    <div>
      {/* 搜索框 */}
      <Affix offsetTop={54}>
        <div
          style={{
            padding: '16px 0',
            marginBottom: '24px',
          }}
        >
          <div style={{ margin: '0 auto' }}>
            <Input
              v-model:value={searchValue.value}
              placeholder="搜索组件名称、描述或分类..."
              size="large"
              allowClear
              v-slots={{
                prefix: () => <SearchOutlined style={{ color: '#bfbfbf' }} />,
              }}
            />
          </div>
        </div>
      </Affix>

      {/* 动态渲染各分类 */}
      {Object.entries(groupedComponents.value).map(([category, components]) => (
        <div key={category}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '24px',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: '600' }}>{category}</div>
            <Tag style={{ marginLeft: '8px' }}>{components.length}</Tag>
          </div>

          <Row gutter={[24, 24]} style={{ marginBottom: '48px' }}>
            {components.map((component) => (
              <Col key={component.id} xs={24} lg={12}>
                <div
                  style={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onClick={() => handleComponentClick(component)}
                  onMouseenter={(e: any) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseleave={(e: any) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Card
                    style={{
                      height: '100%',
                      border: '1px solid #f0f0f0',
                    }}
                    bodyStyle={{ padding: '20px' }}
                    hoverable
                  >
                  {/* 卡片头部 */}
                  <div style={{ marginBottom: '16px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {component.icon}
                        <div
                          style={{
                            fontSize: '16px',
                            fontWeight: '500',
                            marginLeft: '8px',
                          }}
                        >
                          {component.title}
                        </div>
                      </div>
                      <LinkOutlined
                        style={{
                          color: '#1890ff',
                          fontSize: '14px',
                          opacity: 0.6,
                        }}
                      />
                    </div>
                    <div style={{ margin: '0', color: '#666', lineHeight: '1.6' }}>
                      {component.description}
                    </div>
                  </div>

                  {/* 组件演示区域 */}
                  <div
                    style={{
                      padding: '20px',
                      background: '#fafafa',
                      borderRadius: '8px',
                      minHeight: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* Bubble 组件演示 */}
                    {component.id === 'bubble' && (
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <Bubble
                          content="你好！我是 AI 助手"
                          placement="start"
                        />
                        <div style={{ textAlign: 'right' }}>
                          <Bubble content="很高兴认识你！" placement="end" />
                        </div>
                      </Space>
                    )}

                    {/* Welcome 组件演示 */}
                    {component.id === 'welcome' && (
                      <Welcome
                        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
                        title="你好，我是 Ant Design X Vue"
                        description="基于 Ant Design，专为 Vue 生态打造的 AI 产品界面解决方案"
                      />
                    )}

                    {/* Prompts 组件演示 */}
                    {component.id === 'prompts' && (
                      <Prompts
                        title="💡 快速开始"
                        items={promptItems}
                        style={{ width: '100%' }}
                      />
                    )}

                    {/* Sender 组件演示 */}
                    {component.id === 'sender' && (
                      <div style={{ width: '100%' }}>
                        <Sender
                          placeholder="请输入您的消息..."
                          style={{ width: '100%' }}
                        />
                      </div>
                    )}

                    {/* Suggestion 组件演示 */}
                    {component.id === 'suggestion' && (
                      <div style={{ width: '100%' }}>
                        <Suggestion
                          items={suggestionItems}
                          onSelect={(itemVal: string) =>
                            (suggestionValue.value = `[${itemVal}]: `)
                          }
                          v-slots={{
                            default: ({ onTrigger, onKeyDown }: any) => (
                              <Sender
                                value={suggestionValue.value}
                                onChange={(nextVal: string) => {
                                  if (nextVal === '/') {
                                    onTrigger();
                                  } else if (!nextVal) {
                                    onTrigger(false);
                                  }
                                  suggestionValue.value = nextVal;
                                }}
                                onKeyDown={onKeyDown}
                                placeholder="输入 / 获取建议"
                                style={{ width: '100%' }}
                              />
                            ),
                          }}
                        />
                      </div>
                    )}

                    {/* ThoughtChain 组件演示 */}
                    {component.id === 'thought-chain' && (
                      <ThoughtChain
                        items={thoughtChainItems}
                        style={{ width: '100%' }}
                      />
                    )}

                    {/* 其他组件显示图标和说明 */}
                    {![
                      'bubble',
                      'welcome',
                      'prompts',
                      'sender',
                      'suggestion',
                      'thought-chain',
                    ].includes(component.id) && (
                      <div style={{ textAlign: 'center', color: '#666' }}>
                        <div style={{ fontSize: '48px'}}>
                          {component.icon}
                        </div>
                        <div style={{ fontWeight: '500'}}>
                          {getComponentDisplayText(component)}
                        </div>
                        {getComponentSubText(component) && (
                          <div style={{ fontSize: '12px', marginTop: '4px' }}>
                            {getComponentSubText(component)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      {/* 无搜索结果 */}
      {Object.keys(groupedComponents.value).length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          <SearchOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <div style={{ fontSize: '16px' }}>未找到匹配的组件</div>
          <div style={{ fontSize: '14px', marginTop: '8px' }}>请尝试其他关键词</div>
        </div>
      )}
    </div>
  );
};

defineRender(() => {
  return <Demo />;
});
</script>
