import { VitePluginConfig } from 'unocss/vite';
import { presetAttributify, presetWind, presetIcons } from 'unocss';

const options: VitePluginConfig = {
  presets: [presetAttributify(), presetWind({}), presetIcons()],
  rules: [
    [
      /^divider-(\w+)$/,
      ([, w]) => ({
        [`border-${w}`]: '1px solid var(--feather-c-divider-light)'
      })
    ],
    [
      'menu-item-before',
      {
        'margin-right': '12px',
        'margin-left': '12px',
        width: '1px',
        height: '24px',
        'background-color': 'var(--feather-c-divider-light)',
        content: '" "'
      }
    ]
  ],
  shortcuts: {
    'flex-center': 'flex justify-center items-center'
  },
  theme: {
    colors: {
      brandLight: 'var(--feather-c-brand-light)',
      brandDark: 'var(--feather-c-brand-dark)',
      brand: 'var(--feather-c-brand)',
      text: {
        1: 'var(--feather-c-text-1)',
        2: 'var(--feather-c-text-2)',
        3: 'var(--feather-c-text-3)',
        4: 'var(--feather-c-text-4)'
      },
      divider: {
        default: 'var(--feather-c-divider)',
        light: 'var(--feather-c-divider-light)',
        dark: 'var(--feather-c-divider-dark)'
      },
      gray: {
        light: {
          1: 'var(--feather-c-gray-light-1)',
          2: 'var(--feather-c-gray-light-2)',
          3: 'var(--feather-c-gray-light-3)',
          4: 'var(--feather-c-gray-light-4)'
        }
      },
      bg: {
        default: 'var(--feather-c-bg)',
        soft: 'var(--feather-c-bg-soft)',
        mute: 'var(--feather-c-bg-mute)'
      }
    }
  }
};

export default options;
