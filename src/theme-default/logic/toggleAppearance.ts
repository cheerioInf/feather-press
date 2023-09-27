const APPEARANCE_KEY = 'appearance';

export const setClassList = (isDark = false) => {
  console.log('setClassList', isDark);
  // 获取根元素
  const rootElement = document.documentElement;
  // 设置根元素的 classList
  rootElement.classList.remove(isDark ? 'light' : 'dark');
  rootElement.classList.add(isDark ? 'dark' : 'light');
};

// 根据本地状态存储设置主题
export const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'dark');
};

// 切换主题时，更新本地状态存储
export function toggle() {
  const classList = document.documentElement.classList;
  if (classList.contains('dark')) {
    setClassList(false);
    // 本地状态存储
    localStorage.setItem(APPEARANCE_KEY, 'light');
  } else {
    setClassList(true);
    // 本地状态存储
    localStorage.setItem(APPEARANCE_KEY, 'dark');
  }
}
