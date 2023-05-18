import { Plugin } from 'vite';
import { pluginMdxRollup } from './pluginMdxRollup';

export function createPluginMdx(): Plugin[] {
  return [pluginMdxRollup()] as unknown as Plugin[];
}
