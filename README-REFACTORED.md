# 🎨 法语词汇小卖部 - 重构版

## 📊 代码结构说明

### 文件说明

```
js/
├── config.js          # 配置文件 (SRS参数、Firebase配置)
├── srs-engine.js      # SRS 引擎 (SM-2 算法核心)
├── word-manager.js    # 单词管理器 (CRUD 操作)
└── ui-helper.js       # UI 辅助函数 (DOM 操作)

app-refactored.js      # 主应用入口
```

### 核心模块详解

#### 1. **config.js** - 配置管理

```javascript
// SRS 算法参数
SRS_CONFIG = {
  INITIAL_EASE: 2.5,    // 初始难度系数
  MIN_EASE: 1.3,        // 最小难度系数
  EASE_ADJUST: 0.08,    // 难度调整步长
  DEFAULT_INTERVAL: 1   // 默认间隔(天)
}
```

#### 2. **srs-engine.js** - SRS 核心算法

实现 SM-2 间隔重复系统：

```javascript
// 计算下次复习间隔
calculateNextReview(record, difficulty)
  ↓
// 根据难度分数调整
// difficulty >= 3: 间隔延长
// difficulty < 3:  间隔缩短
  ↓
// 返回: { interval, easeFactor, nextReviewDate }
```

**难度分数说明**：
- `0`: 完全忘了 ❌
- `1-2`: 简单
- `3`: 中等 ⚠️
- `4-5`: 很简单 ✅

#### 3. **word-manager.js** - 单词管理

```javascript
wordManager.loadWords()        // 从 Firebase 加载
wordManager.getCurrentWord()   // 获取当前单词
wordManager.nextWord()         // 下一个单词
wordManager.updateWord(id)     // 更新学习记录
wordManager.getStats()         // 获取统计信息
```

#### 4. **ui-helper.js** - UI 操作

```javascript
displayWord(word)              // 显示单词
showMeaning()                  // 切换显示中文
showNotification(msg)          // 显示通知
updateStats(stats)             // 更新统计显示
```

## 🔄 数据流

```
用户点击复习按钮
    ↓
review(resultType)  // app-refactored.js
    ↓
calculateNextReview()  // srs-engine.js (计算新的间隔)
    ↓
wordManager.updateWord()  // word-manager.js (保存到 Firebase)
    ↓
showNextWord()  // ui-helper.js (显示下一个单词)
```

## 🧮 SM-2 算法工作原理

### 公式

```
新间隔 = {
  如果答对 (difficulty >= 3):
    if 首次复习: 1 天
    else if 第二次: 3 天
    else: round(旧间隔 × 难度系数)
    
  如果答错 (difficulty < 3):
    1 天 (重置)
}

新难度系数 = max(1.3, 旧系数 + (0.1 - (5-分数) × 0.08))
```

### 复习间隔递推

```
首次: 立即
第2次: 1 天
第3次: 3 天
第4次: 7-10 天
第5次: 14-20 天
...
最终: 180+ 天
```

## 🚀 使用方法

### 基础使用

```html
<!-- 替换 app.js 的导入 -->
<script type="module" src="app-refactored.js"></script>
```

### 在 HTML 中添加元素

```html
<!-- 进度显示 -->
<div id="progress">加载中...</div>

<!-- 统计显示 -->
<div id="stats"></div>
```

## 📋 函数参考

### SRS 引擎

```javascript
// 计算下次复习
calculateNextReview(record, difficulty)
  record: { interval, easeFactor, reviewCount }
  difficulty: 0-5
  返回: { interval, easeFactor, nextReviewDate, reviewCount }

// 判断是否需要复习
shouldReview(word)
  返回: boolean

// 获取统计
getReviewStats(words)
  返回: { total, needsReview, new, learning, mastered }
```

### 单词管理

```javascript
await wordManager.loadWords()           // 加载所有单词
wordManager.getCurrentWord()            // 当前单词
wordManager.nextWord()                  // 下一个
wordManager.prevWord()                  // 上一个
await wordManager.updateWord(id, data)  // 更新
await wordManager.addWord(fr, ch)       // 添加新单词
wordManager.getWordsToReview()          // 获取待复习
wordManager.getStats()                  // 统计信息
```

## 🔍 调试

### 查看控制台日志

打开浏览器开发者工具 (F12)，查看 Console 标签：

```
✅ 加载了 10 个单词
✅ 已记录: bonjour (难度: 5, 下次间隔: 3天)
✅ 刷新完成
```

### 常见问题

**Q: 为什么显示 "没有单词"？**
A: Firebase 中没有数据，需要先在 add.html 添加单词。

**Q: 复习反馈没有保存？**
A: 检查 Firebase 配置和网络连接。

**Q: 间隔计算不对？**
A: 查看 srs-engine.js 中的参数配置。

## 🎯 下一步改进

- [ ] 添加本地存储备份
- [ ] 实现单词搜索和筛选
- [ ] 添加学习数据导出
- [ ] 实现每日复习提醒
- [ ] 支持自定义间隔参数
- [ ] 添加单词难度排行

---

**祝学习愉快！** 🇫🇷✨
