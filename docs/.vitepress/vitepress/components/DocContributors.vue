<template>
  <div class="doc-contributors">
    <div class="contributors-header">
      <h3 class="contributors-title">
        <svg class="title-icon" viewBox="0 0 16 16" width="18" height="18">
          <path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        贡献者
      </h3>
    </div>
    
    <div class="contributors-list">
      <div 
        v-for="contributor in contributorsList" 
        :key="contributor.id"
        class="contributor-wrapper"
        @click="openProfile(contributor.html_url)"
        @mouseenter="showTooltip = contributor.id"
        @mouseleave="showTooltip = null"
      >
        <img 
          :src="contributor.avatar_url" 
          :alt="contributor.login"
          class="contributor-avatar"
          @error="handleImageError"
        />
        <div 
          v-if="showTooltip === contributor.id"
          class="contributor-tooltip"
        >
          {{ contributor.login }}
        </div>
      </div>
      
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-contributors">
        <div class="loading-text">
          正在加载贡献者信息...
        </div>
      </div>
      
      <!-- 如果没有找到贡献者，显示默认信息 -->
      <div v-else-if="contributorsList.length === 0" class="no-contributors">
        <div class="no-contributors-text">
          暂无贡献者信息
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

interface Contributor {
  login: string
  id: number
  avatar_url: string
  html_url: string
  contributions: number
  type: string
}

interface FileContributor {
  file: string
  contributors: Contributor[]
}

interface Props {
  componentName?: string
  maxCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  componentName: '',
  maxCount: 50
})

// 加载实际的贡献者数据
let contributorsData: any = null

// 动态导入贡献者数据
const loadContributorsData = async () => {
  if (contributorsData) return contributorsData
  
  try {
    // 在客户端环境下动态导入
    if (typeof window !== 'undefined') {
      const module = await import('../../../../contributors/data.ts')
      contributorsData = module.contributorsData
      return contributorsData
    } else {
      // 服务端渲染时返回空数据
      return {
        contributors: [],
        componentContributors: [],
        fileContributors: []
      }
    }
  } catch (error) {
    console.warn('Failed to load contributors data:', error)
    // 返回模拟数据作为后备
    return {
      contributors: [
        {
          login: 'wzc520pyfm',
          id: 69044080,
          avatar_url: 'https://avatars.githubusercontent.com/u/69044080?v=4',
          html_url: 'https://github.com/wzc520pyfm',
          contributions: 127,
          type: 'User'
        }
      ],
      componentContributors: [],
      fileContributors: []
    }
  }
}

// 响应式数据
const allContributorsData = ref<any>(null)
const loading = ref(true)
const showTooltip = ref<number | null>(null)

// 过滤当前组件的贡献者
const contributorsList = computed(() => {
  if (!allContributorsData.value || loading.value) {
    return []
  }

  if (!props.componentName) {
    return allContributorsData.value.contributors?.slice(0, props.maxCount) || []
  }

  // 优先使用新的 componentContributors 结构
  if (allContributorsData.value.componentContributors) {
    // 查找所有包含当前组件名的组件（包括完全匹配和包含关系）
    const matchingComponents = allContributorsData.value.componentContributors.filter((comp: any) => {
      const compName = comp.component.toLowerCase()
      const targetName = props.componentName.toLowerCase()
      
      // 完全匹配或者组件名包含目标名称（如 prompts-docs 包含 prompts）
      return compName === targetName || compName.includes(targetName)
    })
    
    if (matchingComponents.length > 0) {
      // 按贡献者 login 去重并合并贡献数
      const contributorsMap = new Map()
      
      matchingComponents.forEach((componentData: any) => {
        componentData.contributors.forEach((contributor: Contributor) => {
          const existing = contributorsMap.get(contributor.login)
          if (existing) {
            // 累加贡献数
            existing.contributions += contributor.contributions
          } else {
            // 新增贡献者
            contributorsMap.set(contributor.login, { ...contributor })
          }
        })
      })
      
      // 按贡献度排序并返回
      return Array.from(contributorsMap.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, props.maxCount)
    }
  }

  // 回退到 fileContributors 结构（向后兼容）
  if (allContributorsData.value.fileContributors) {
    const componentFiles = allContributorsData.value.fileContributors.filter((fc: FileContributor) => {
      const fileName = fc.file.toLowerCase()
      const componentName = props.componentName.toLowerCase()
      
      return fileName.includes(`src/${componentName}/`) || 
             fileName.includes(`/${componentName}.vue`) ||
             fileName.includes(`/${componentName}header.vue`) ||
             fileName.endsWith(`${componentName}/index.vue`)
    })

    // 合并所有相关文件的贡献者
    const contributorsMap = new Map()
    
    componentFiles.forEach((fileContrib: FileContributor) => {
      fileContrib.contributors.forEach((contributor: Contributor) => {
        const existing = contributorsMap.get(contributor.login)
        if (existing) {
          existing.contributions += contributor.contributions
        } else {
          contributorsMap.set(contributor.login, { ...contributor })
        }
      })
    })

    if (contributorsMap.size > 0) {
      return Array.from(contributorsMap.values())
        .sort((a, b) => b.contributions - a.contributions)
        .slice(0, props.maxCount)
    }
  }

  // 最后回退到总体贡献者
  return allContributorsData.value.contributors?.slice(0, props.maxCount) || []
})

// 方法
const openProfile = (url: string) => {
  window.open(url, '_blank')
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://github.com/identicons/github.png'
}

// 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const data = await loadContributorsData()
    allContributorsData.value = data
    console.log(`Contributors data loaded for component: ${props.componentName}`, data)
  } catch (error) {
    console.error('Failed to load contributors data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  console.log(`DocContributors mounted for component: ${props.componentName}`)
  await loadData()
})
</script>

<style scoped>
.doc-contributors {
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.contributors-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.contributors-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.title-icon {
  margin-right: 8px;
  color: var(--vp-c-brand);
  flex-shrink: 0;
}

.contributors-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* Reduced gap */
  min-height: 60px;
  align-items: flex-start;
}

.contributor-wrapper {
  position: relative;
  cursor: pointer;
}

.contributor-wrapper:hover .contributor-avatar {
  border-color: var(--vp-c-brand);
  transform: translateY(-1px);
}

.contributor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-bg);
  transition: all 0.2s ease;
  flex-shrink: 0;
  display: block;
}

.contributor-tooltip {
  position: absolute;
  top: -36px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-1);
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  opacity: 1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--vp-c-divider);
  pointer-events: none;
  animation: tooltip-fade-in 0.2s ease-out;
}

.contributor-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 5px solid transparent;
  border-top-color: var(--vp-c-bg-alt);
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.loading-contributors {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.loading-text {
  opacity: 0.7;
}

.no-contributors {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px;
  color: var(--vp-c-text-2);
  font-size: 14px;
}

.no-contributors-text {
  opacity: 0.7;
}

@media (max-width: 768px) {
  .contributors-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .contributors-list {
    justify-content: center;
  }

  .contributor-avatar {
    width: 28px;
    height: 28px;
  }
}
</style> 