import { createRoot } from "react-dom/client";
import { App } from "./App";

function renderInBrowser() {
  // 获取 root 元素
  const containerEl = document.getElementById("root");
  // 如果 root 元素不存在，抛出错误
  if (!containerEl) {
    throw new Error("root element not found");
  }
  // 渲染
  createRoot(containerEl).render(<App />);
}

renderInBrowser();
