import { loadConfigFromFile } from 'vite';
import { RawConfig, SiteConfig, UserConfig } from '../shared/types/index';
import { resolve } from 'path';
import fs from 'fs-extra';

// 获取用户配置文件路径
function getUserConfigPath(root: string) {
  try {
    const supportConfigFiles = ['config.ts', 'config.js'];
    // fs.pathExistsSync 判断文件是否存在
    const configPath = supportConfigFiles
      .map((file) => resolve(root, file))
      .find(fs.pathExistsSync);
    return configPath;
  } catch (e) {
    console.error(`Failed to load user config: ${e}`);
    throw e;
  }
}

// 获取用户配置信息
async function resolveUserConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
) {
  const configPath = getUserConfigPath(root);
  // 解析配置文件
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

// 设置默认配置
function setDefaultSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'feather.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

/**
 * 解析配置文件主函数
 * @param root 根目录
 * @param command 环境变量
 * @param mode 开发模式
 * @returns 配置文件
 */
export async function resolveConfig(
  root: string,
  command: 'serve' | 'build',
  mode: 'development' | 'production'
): Promise<SiteConfig> {
  const [configPath, userConfig] = await resolveUserConfig(root, command, mode);
  // 在用户配置外包一层配置
  const siteConfig: SiteConfig = {
    root,
    configPath: configPath,
    siteData: setDefaultSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

// 用户可以在配置文件中使用 defineConfig 方法
// 从而获得类型提示
export function defineConfig(config: UserConfig) {
  return config;
}
