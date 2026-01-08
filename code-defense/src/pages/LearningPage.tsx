// ==========================================
// 学习页面 - YouTube 视频
// ==========================================

import React, { useState } from 'react';
import { Play, Clock, Coins, CheckCircle } from 'lucide-react';
import { useTaskStore } from '../stores';
import './LearningPage.css';

// 预设的 freeCodeCamp 视频列表
const VIDEO_LIST = [
  {
    id: 'v1',
    title: 'React 入门教程',
    videoId: 'bMknfKXIFA8',
    duration: '12:00:00',
    reward: 100,
  },
  {
    id: 'v2',
    title: 'JavaScript 全套教程',
    videoId: 'PkZNo7MFNFg',
    duration: '3:26:42',
    reward: 50,
  },
  {
    id: 'v3',
    title: 'TypeScript 完整课程',
    videoId: '30LWjhZzg50',
    duration: '5:00:44',
    reward: 60,
  },
  {
    id: 'v4',
    title: 'Python 入门教程',
    videoId: 'rfscVS0vtbw',
    duration: '4:26:52',
    reward: 55,
  },
];

export const LearningPage: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const { addTask, completeTask, tasks } = useTaskStore();

  const handleVideoEnd = (videoId: string, reward: number) => {
    if (!watchedVideos.has(videoId)) {
      // 创建一个临时任务并完成它
      const taskId = `video-${videoId}`;
      const existingTask = tasks.find((t) => t.id === taskId);

      if (!existingTask) {
        addTask({
          title: `观看视频完成`,
          type: 'video',
          reward,
          videoUrl: `https://youtube.com/watch?v=${videoId}`,
        });
      }

      // 标记为已观看
      setWatchedVideos((prev) => new Set([...prev, videoId]));

      // 找到并完成任务
      setTimeout(() => {
        const task = tasks.find((t) => t.videoUrl?.includes(videoId));
        if (task) {
          completeTask(task.id);
        }
      }, 100);
    }
  };

  return (
    <div className="learning-page">
      {/* 页面标题 */}
      <header className="page-header">
        <h1>学习中心</h1>
        <p>观看 freeCodeCamp 视频获得 CodeCoin 奖励</p>
      </header>

      {/* 视频播放器 */}
      {selectedVideo && (
        <div className="video-player-container">
          <div className="video-wrapper">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo}?enablejsapi=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <button
            className="close-player-btn"
            onClick={() => setSelectedVideo(null)}
          >
            关闭播放器
          </button>
          <p className="video-hint">
            💡 提示：在中国大陆需要使用代理才能观看 YouTube 视频
          </p>
        </div>
      )}

      {/* 视频列表 */}
      <div className="video-list">
        <h2>推荐课程</h2>
        {VIDEO_LIST.map((video) => {
          const isWatched = watchedVideos.has(video.videoId);
          return (
            <div
              key={video.id}
              className={`video-card ${isWatched ? 'watched' : ''}`}
              onClick={() => setSelectedVideo(video.videoId)}
            >
              <div className="video-thumbnail">
                <img
                  src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                  alt={video.title}
                />
                <div className="play-overlay">
                  <Play size={32} />
                </div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
                <div className="video-meta">
                  <span className="duration">
                    <Clock size={14} />
                    {video.duration}
                  </span>
                  <span className="reward">
                    <Coins size={14} />
                    +{video.reward} CodeCoin
                  </span>
                </div>
              </div>
              {isWatched && (
                <div className="watched-badge">
                  <CheckCircle size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 模拟完成按钮 (用于测试) */}
      <div className="test-section">
        <p className="test-hint">🧪 测试模式：点击下方按钮模拟视频观看完成</p>
        <button
          className="simulate-btn"
          onClick={() => {
            const video = VIDEO_LIST[0];
            handleVideoEnd(video.videoId, video.reward);
          }}
        >
          模拟完成第一个视频 (+{VIDEO_LIST[0].reward} 💰)
        </button>
      </div>
    </div>
  );
};
