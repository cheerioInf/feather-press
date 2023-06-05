const APPEARANCE_KEY = 'appearance';

const setClassList = (isDark = false) => {
  const classList = document.documentElement.classList;
  if (isDark) {
    classList.add('dark');
  } else {
    classList.remove('dark');
  }
};

const updateAppearance = () => {
  const userPreference = localStorage.getItem(APPEARANCE_KEY);
  setClassList(userPreference === 'dark');
};

// ssr 跳过
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  updateAppearance();
  // 多标签页状态同步
  window.addEventListener('storage', updateAppearance);
}

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
