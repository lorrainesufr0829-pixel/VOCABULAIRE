// ==========================================
// SRS (间隔重复系统) 引擎
// 实现 SM-2 算法
// ==========================================

import { SRS_CONFIG } from './config.js';

/**
 * 计算下次复习的间隔
 * 
 * 基于 SM-2 算法：
 * - 答对: 间隔按 easeFactor 递推
 * - 答错: 间隔重置为 1 天
 * 
 * @param {Object} record - 学习记录
 *   - interval: 当前间隔(天)
 *   - easeFactor: 难度系数
 *   - reviewCount: 复习次数
 * @param {number} difficulty - 难度评分 (0-5)
 * @returns {Object} 新的间隔和难度系数
 */
export function calculateNextReview(record, difficulty) {
  let { interval = 1, easeFactor = SRS_CONFIG.INITIAL_EASE, reviewCount = 0 } = record;
  
  // 难度评分必须在 0-5 之间
  if (difficulty < 0 || difficulty > 5) {
    console.warn(`Invalid difficulty: ${difficulty}, using default 3`);
    difficulty = 3;
  }
  
  let newInterval;
  let newEaseFactor;
  
  // ✅ 答对的情况
  if (difficulty >= 3) {
    // 按 SM-2 规则递推间隔
    if (reviewCount === 0) {
      newInterval = 1;
    } else if (reviewCount === 1) {
      newInterval = 3;
    } else {
      newInterval = Math.round(interval * easeFactor);
    }
    
    // 更新难度系数
    // 公式: EF' = EF + (0.1 - (5 - q) * 0.08)
    // q = 3 时不变, < 3 时降低, > 3 时提高
    newEaseFactor = easeFactor + (
      SRS_CONFIG.EASE_BASE - (5 - difficulty) * SRS_CONFIG.EASE_ADJUST
    );
    
    newEaseFactor = Math.max(SRS_CONFIG.MIN_EASE, newEaseFactor);
  }
  // ❌ 答错的情况
  else {
    // 重置间隔
    newInterval = 1;
    // 降低难度系数
    newEaseFactor = Math.max(SRS_CONFIG.MIN_EASE, easeFactor - 0.2);
  }
  
  // 计算下次复习时间
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  return {
    interval: newInterval,
    easeFactor: parseFloat(newEaseFactor.toFixed(2)),
    nextReviewDate: nextReviewDate.getTime(),
    reviewCount: reviewCount + 1,
    lastReviewDate: new Date().getTime()
  };
}

/**
 * 判断单词是否应该复习
 * @param {Object} word - 单词对象
 * @returns {boolean}
 */
export function shouldReview(word) {
  if (!word.nextReviewDate) return true;
  return new Date().getTime() >= word.nextReviewDate;
}

/**
 * 获取复习统计信息
 * @param {Array} words - 单词列表
 * @returns {Object} 统计数据
 */
export function getReviewStats(words) {
  const now = new Date().getTime();
  
  return {
    total: words.length,
    needsReview: words.filter(w => shouldReview(w)).length,
    new: words.filter(w => !w.reviewCount || w.reviewCount === 0).length,
    learning: words.filter(w => w.reviewCount > 0 && w.reviewCount < 5).length,
    mastered: words.filter(w => w.reviewCount >= 5 && w.easeFactor > 2.5).length,
    difficult: words.filter(w => w.reviewCount > 0 && w.easeFactor <= 1.3).length
  };
}

/**
 * 获取单词学习状态
 * @param {Object} word - 单词对象
 * @returns {string} 状态标签
 */
export function getWordStatus(word) {
  if (!word.reviewCount || word.reviewCount === 0) return '🆕 新';
  if (word.easeFactor <= 1.3) return '🆘 困难';
  if (word.reviewCount >= 5 && word.easeFactor > 2.5) return '⭐ 掌握';
  return '📚 学习中';
}
