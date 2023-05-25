import { loadConfigFromFile } from 'vite';
import { SiteConfig, UserConfig } from '../shared/types/index';
import { resolve } from 'path';
import fs from 'fs-extra';

// 初次解析配置文件时, 可能会返回三种类型的配置
type RawConfig =
  | UserConfig
  | Promise<UserConfig>
  | (() => UserConfig | Promise<UserConfig>);

/**
 * 获取用户配置文件路径
 * @param root 项目根目录
 * @returns 配置文件路径
 */
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

/**
 * 解析用户配置文件
 * @param root 项目根目录
 * @param command 环境变量
 * @param mode 开发模式
 * @returns [配置文件路径, 用户配置]
 */
export async function resolveUserConfig(
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
    // as const 的作用是将一个对象的所有属性值都变为只读的
    return [configPath, userConfig] as const;
  } else {
    return [configPath, {} as UserConfig] as const;
  }
}

/**
 * 在用户没有配置时使用默认值
 * @param userConfig 用户配置
 * @returns 默认配置
 */
export function resolveSiteData(userConfig: UserConfig): UserConfig {
  return {
    title: userConfig.title || 'feather.js',
    description: userConfig.description || 'SSG Framework',
    themeConfig: userConfig.themeConfig || {},
    vite: userConfig.vite || {}
  };
}

/**
 * 解析配置文件主函数
 * @param root 解析根目录
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
    siteData: resolveSiteData(userConfig as UserConfig)
  };
  return siteConfig;
}

// 用户可以在配置文件中使用 defineConfig 方法
// 从而获得类型提示
export function defineConfig(config: UserConfig) {
  return config;
}
