import meta from './plugin-meta.json';

export interface PluginMeta {
  plugin: string;
  desc: string;
  descEn: string;
}

const pluginMeta: PluginMeta[] = meta as PluginMeta[];

export { pluginMeta };
export default pluginMeta;
