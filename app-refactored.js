// ==========================================
// 主应用入口 (重构版)
// ==========================================

import wordManager from './js/word-manager.js';
import { calculateNextReview, shouldReview, getReviewStats } from './js/srs-engine.js';
import { displayWord, showMeaning, showNotification, updateStats, disableReviewButtons } from './js/ui-helper.js';

/**
 * 页面初始化
 */
async function init() {
  console.log('🚀 应用启动中...');
  
  try {
    // 加载单词数据
    await wordManager.loadWords();
    
    if (wordManager.words.length === 0) {
      showNotification('📭 还没有单词，请先添加！', 'info');
      document.getElementById('card').style.display = 'none';
      return;
    }
    
    // 显示第一个单词
    showCurrentWord();
    
    // 更新统计
    const stats = wordManager.getStats();
    updateStats(stats);
    
    console.log('✅ 应用启动成功');
  } catch (error) {
    console.error('❌ 初始化失败:', error);
    showNotification('❌ 初始化失败，请刷新重试', 'error');
  }
}

/**
 * 显示当前单词
 */
function showCurrentWord() {
  const word = wordManager.getCurrentWord();
  displayWord(word);
  updateWordProgress();
}

/**
 * 更新进度显示
 */
function updateWordProgress() {
  const total = wordManager.words.length;
  const current = wordManager.currentIndex + 1;
  const progressEl = document.getElementById('progress');
  
  if (progressEl) {
    progressEl.innerText = `${current} / ${total}`;
  }
}

/**
 * 处理复习反馈
 */
window.review = async function(resultType) {
  const word = wordManager.getCurrentWord();
  if (!word) return;
  
  // 禁用按钮，防止快速点击
  disableReviewButtons(true);
  
  try {
    // 根据反馈类型获取难度分数
    let difficulty;
    switch (resultType) {
      case 'forgot':
        difficulty = 0;  // 完全忘了
        showNotification('😅 没关系，继续加油！', 'info');
        break;
      case 'unsure':
        difficulty = 3;  // 中等难度
        showNotification('⚠️ 再看几遍会记住的', 'info');
        break;
      case 'easy':
        difficulty = 5;  // 很简单
        showNotification('🎉 太棒了！', 'success');
        break;
      default:
        difficulty = 3;
    }
    
    // 计算下次复习间隔
    const currentRecord = {
      interval: word.interval,
      easeFactor: word.easeFactor,
      reviewCount: word.reviewCount
    };
    
    const nextReview = calculateNextReview(currentRecord, difficulty);
    
    // 保存到 Firebase
    await wordManager.updateWord(word.id, nextReview);
    
    console.log(`✅ 已记录: ${word.french} (难度: ${difficulty}, 下次间隔: ${nextReview.interval}天)`);
    
    // 移到下一个单词
    wordManager.nextWord();
    
    // 更新 UI
    setTimeout(() => {
      showCurrentWord();
      updateStats(wordManager.getStats());
      disableReviewButtons(false);
    }, 500);
    
  } catch (error) {
    console.error('❌ 复习记录失败:', error);
    showNotification('❌ 保存失败，请重试', 'error');
    disableReviewButtons(false);
  }
};

/**
 * 显示中文释义
 */
window.showMeaning = function() {
  showMeaning();
};

/**
 * 上一个单词
 */
window.prevWord = function() {
  wordManager.prevWord();
  showCurrentWord();
};

/**
 * 下一个单词
 */
window.nextWord = function() {
  wordManager.nextWord();
  showCurrentWord();
};

/**
 * 刷新数据
 */
window.refreshWords = async function() {
  showNotification('🔄 刷新中...', 'info');
  await wordManager.loadWords();
  showCurrentWord();
  updateStats(wordManager.getStats());
  showNotification('✅ 刷新完成', 'success');
};

// 页面加载完成后初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
