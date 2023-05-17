import { Plugin } from 'vite';
import { SiteConfig } from 'shared/types/index';
import { join, relative } from 'path';
import { PACKAGE_ROOT } from 'node/constants';

const SITE_DATA_ID = 'feather:site-data';

export function pluginConfig(
  config: SiteConfig,
  restartServer?: () => Promise<void>
): Plugin {
  return {
    name: 'feather:site-data',
    config() {
      return {
        root: PACKAGE_ROOT,
        resolve: {
          alias: {
            '@runtime': join(PACKAGE_ROOT, 'src', 'runtime', 'index.ts')
          }
        }
      };
    },
    resolveId(id) {
      if (id === SITE_DATA_ID) {
        return '\0' + SITE_DATA_ID;
      }
    },
    load(id) {
      if (id === '\0' + SITE_DATA_ID) {
        return `export default ${JSON.stringify(config.siteData)}`;
      }
    },
    // 监听配置文件的变化，实现热更新
    // ctx.file 是当前变化的文件路径数组
    async handleHotUpdate(ctx) {
      const customWatchedFiles = [config.configPath];
      const include = (id: string) =>
        customWatchedFiles.some((file) => id.includes(file));
      // 判断是否是配置文件的变化
      if (include(ctx.file)) {
        console.log(
          `\n${relative(config.root, ctx.file)} changed, restarting server...`
        );
        // 重启 DevServer
        await restartServer();
      }
    }
  };
}
