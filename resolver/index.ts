
export interface AntDesignXResolverOptions {
  /**
   * exclude components that do not require automatic import
   *
   * @default []
   */
  exclude?: string[]

  /**
   * rename package
   *
   * @default 'ant-design-x-vue'
   */
  packageName?: string

  /**
   * customizable prefix for resolving components
   * 
   * @default 'AX'
   */
  prefix?: string
}

/**
 * set of components that are contained in the package
 */
const primitiveNames = new Set<string>([
  'Attachments',
  'Bubble',
  'Conversations',
  'Prompts',
  'Sender',
  'Suggestion',
  'Theme',
  'ThoughtChain',
  'Welcome',
])

function isAntdXVueComponent(name: string) {
  return primitiveNames.has(name)
}

// currently unnecessary to add side effects
// function getSideEffects(
//  componentName: string,
//  options: AntDesignXResolverOptions = {} 
// ) {
//   const { importStyle = true, packageName = 'ant-design-x-vue' } = options

//   if (!importStyle) return

//   return 
// }

export function AntDesignXVueResolver(
  options: AntDesignXResolverOptions = {}
) {
  const {
    prefix = 'AX',
    packageName = 'ant-design-x-vue',
    exclude = []
  } = options

  const resolverInfo = {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith(prefix)) return

      const componentName = name.slice(prefix.length)

      if (
        !isAntdXVueComponent(componentName) || exclude.includes(componentName)
      ) return

      return {
        name: componentName,
        from: packageName,
        as: `${prefix}${componentName}`
      }
    }
  }
  return resolverInfo.resolve
}
