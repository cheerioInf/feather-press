import { loadConfigFromFile } from 'vite';
import { RawConfig, SiteConfig, UserConfig } from '../shared/types';
import { resolve } from 'path';
import fs from 'fs-extra';

function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    return supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
  }
}

async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  const configPath = getUserConfigPath(root);
  const result = await loadConfigFromFile({ command, mode }, configPath, root);

  if (result) {
    const { config: rawConfig = {} as RawConfig } = result;
    // 三种情况:
    // 1. object
    // 2. promise
    // 3. function
    const userConfig = await (typeof rawConfig === 'function'
      ? rawConfig()
      : rawConfig);
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

function setDefaultSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'feather.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  return {
    root,
    configPath: configPath,
    siteData: setDefaultSiteData(userConfig as UserConfig)
  };
}

export function defineConfig(config: UserConfig) {
  return config;
}
