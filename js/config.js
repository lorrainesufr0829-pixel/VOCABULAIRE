// ==========================================
// 配置文件
// ==========================================

/**
 * SM-2 SRS 算法参数
 * https://en.wikipedia.org/wiki/SuperMemo
 */
export const SRS_CONFIG = {
  // 初始难度系数
  INITIAL_EASE: 2.5,
  
  // 最小难度系数
  MIN_EASE: 1.3,
  
  // 难度调整
  EASE_ADJUST: 0.08,
  EASE_BASE: 0.1,
  
  // 默认间隔（天）
  DEFAULT_INTERVAL: 1,
  
  // 复习反馈分数
  // 0-2: 太简单/简单, 3: 中等, 4-5: 有点难/太难
  DIFFICULTY_LEVELS: {
    FORGOT: 0,      // 完全忘了
    UNSURE: 3,      // 有点不确定
    EASY: 5         // 很简单
  }
};

/**
 * Firebase 配置
 */
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-storage",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "sender-id",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "app-id"
};

/**
 * UI 配置
 */
export const UI_CONFIG = {
  // 漫画吉祥物表情
  MASCOT_EMOJI: '🎨',
  
  // 页面标题
  APP_TITLE: '法语词汇小卖部',
  
  // 调试模式
  DEBUG: import.meta.env.DEV
};
