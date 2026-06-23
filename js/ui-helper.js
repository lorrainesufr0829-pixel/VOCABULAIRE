// ==========================================
// UI 辅助函数
// 处理 DOM 操作和页面交互
// ==========================================

/**
 * 显示加载中状态
 */
export function showLoading() {
  const wordEl = document.getElementById('word');
  if (wordEl) wordEl.innerText = '加载中...';
}

/**
 * 显示单词
 */
export function displayWord(word) {
  if (!word) {
    document.getElementById('word').innerText = '没有单词';
    return;
  }
  
  document.getElementById('word').innerText = word.french;
  document.getElementById('meaning').innerText = word.chinese;
  document.getElementById('meaning').style.display = 'none';
  
  // 显示漫画图片
  const img = document.getElementById('comicImg');
  if (img && word.imageUrl) {
    img.src = word.imageUrl;
    img.style.display = 'block';
  } else if (img) {
    img.style.display = 'none';
  }
}

/**
 * 显示单词的中文释义
 */
export function showMeaning() {
  const meaningEl = document.getElementById('meaning');
  if (meaningEl) {
    meaningEl.style.display = meaningEl.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * 显示通知
 */
export function showNotification(message, type = 'info', duration = 3000) {
  // 创建通知元素
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerText = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 20px;
    background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
    color: white;
    border-radius: 5px;
    z-index: 1000;
    animation: slideIn 0.3s ease-in;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, duration);
}

/**
 * 更新统计显示
 */
export function updateStats(stats) {
  const statsEl = document.getElementById('stats');
  if (!statsEl) return;
  
  statsEl.innerHTML = `
    <div class="stats-container">
      <div class="stat">
        <span class="stat-label">总数:</span>
        <span class="stat-value">${stats.total}</span>
      </div>
      <div class="stat">
        <span class="stat-label">待复习:</span>
        <span class="stat-value">${stats.needsReview}</span>
      </div>
      <div class="stat">
        <span class="stat-label">掌握:</span>
        <span class="stat-value">${stats.mastered}</span>
      </div>
    </div>
  `;
}

/**
 * 禁用按钮
 */
export function disableReviewButtons(disabled = true) {
  const buttons = document.querySelectorAll('.btns button');
  buttons.forEach(btn => btn.disabled = disabled);
}
