// ==========================================
// 单词管理器
// 处理单词数据的增删改查
// ==========================================

import { db } from '../firebase.js';
import { collection, getDocs, updateDoc, doc, addDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

class WordManager {
  constructor() {
    this.words = [];
    this.currentIndex = 0;
    this.isLoading = false;
  }
  
  /**
   * 从 Firebase 加载所有单词
   */
  async loadWords() {
    try {
      this.isLoading = true;
      const snap = await getDocs(collection(db, 'words'));
      
      this.words = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        // 确保必要字段存在
        interval: d.data().interval || 1,
        easeFactor: d.data().easeFactor || 2.5,
        reviewCount: d.data().reviewCount || 0,
        lastReviewDate: d.data().lastReviewDate || null,
        nextReviewDate: d.data().nextReviewDate || new Date().getTime()
      }));
      
      console.log(`✅ 加载了 ${this.words.length} 个单词`);
      return this.words;
    } catch (error) {
      console.error('❌ 加载单词失败:', error);
      return [];
    } finally {
      this.isLoading = false;
    }
  }
  
  /**
   * 获取当前单词
   */
  getCurrentWord() {
    if (this.words.length === 0) return null;
    return this.words[this.currentIndex];
  }
  
  /**
   * 移到下一个单词
   */
  nextWord() {
    if (this.words.length === 0) return false;
    this.currentIndex = (this.currentIndex + 1) % this.words.length;
    return true;
  }
  
  /**
   * 移到上一个单词
   */
  prevWord() {
    if (this.words.length === 0) return false;
    this.currentIndex = (this.currentIndex - 1 + this.words.length) % this.words.length;
    return true;
  }
  
  /**
   * 跳转到指定索引的单词
   */
  jumpToWord(index) {
    if (index < 0 || index >= this.words.length) return false;
    this.currentIndex = index;
    return true;
  }
  
  /**
   * 更新单词的学习记录
   */
  async updateWord(wordId, updates) {
    try {
      const wordRef = doc(db, 'words', wordId);
      await updateDoc(wordRef, {
        ...updates,
        updatedAt: new Date().getTime()
      });
      
      // 更新本地数据
      const index = this.words.findIndex(w => w.id === wordId);
      if (index !== -1) {
        this.words[index] = { ...this.words[index], ...updates };
      }
      
      return true;
    } catch (error) {
      console.error('❌ 更新单词失败:', error);
      return false;
    }
  }
  
  /**
   * 添加新单词
   */
  async addWord(french, chinese, imageUrl = '') {
    try {
      const newWord = {
        french: french.trim(),
        chinese: chinese.trim(),
        imageUrl,
        interval: 1,
        easeFactor: 2.5,
        reviewCount: 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      };
      
      const docRef = await addDoc(collection(db, 'words'), newWord);
      console.log(`✅ 添加单词成功: ${french}`);
      return { id: docRef.id, ...newWord };
    } catch (error) {
      console.error('❌ 添加单词失败:', error);
      return null;
    }
  }
  
  /**
   * 获取需要复习的单词
   */
  getWordsToReview() {
    const now = new Date().getTime();
    return this.words.filter(w => w.nextReviewDate <= now);
  }
  
  /**
   * 获取统计信息
   */
  getStats() {
    const now = new Date().getTime();
    return {
      total: this.words.length,
      needsReview: this.words.filter(w => w.nextReviewDate <= now).length,
      new: this.words.filter(w => !w.reviewCount || w.reviewCount === 0).length,
      learning: this.words.filter(w => w.reviewCount > 0 && w.reviewCount < 5).length,
      mastered: this.words.filter(w => w.reviewCount >= 5 && w.easeFactor > 2.5).length
    };
  }
}

export default new WordManager();
