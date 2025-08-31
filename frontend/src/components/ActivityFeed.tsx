import React, { useState, useEffect, useRef } from 'react';
import { ActivityEvent, socketService } from '../services/socketService';
import { activityService } from '../services/activityService';

interface ActivityFeedProps {
  listId?: number; // If provided, show only activities for this list
  limit?: number;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ listId, limit = 20 }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchActivities();
    setupSocketListener();

    return () => {
      socketService.removeAllListeners();
    };
  }, [listId, limit]);

  const fetchActivities = async () => {
    try {
      let fetchedActivities: ActivityEvent[];
      
      if (listId) {
        fetchedActivities = await activityService.getListActivities(listId, limit);
      } else {
        fetchedActivities = await activityService.getRecentActivities(limit);
      }
      
      setActivities(fetchedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListener = () => {
    socketService.onNewActivity((newActivity: ActivityEvent) => {
      // If we're filtering by list, only show activities for that list
      if (listId && newActivity.list?.id !== listId) {
        return;
      }

      setActivities(prev => [newActivity, ...prev.slice(0, limit - 1)]);
      
      // Auto-scroll to show new activity
      if (feedRef.current) {
        feedRef.current.scrollTop = 0;
      }
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'list_created':
        return '📝';
      case 'list_updated':
        return '✏️';
      case 'list_deleted':
        return '🗑️';
      case 'item_created':
        return '➕';
      case 'item_updated':
        return '📝';
      case 'item_completed':
        return '✅';
      case 'item_uncompleted':
        return '🔄';
      case 'item_deleted':
        return '❌';
      default:
        return '📋';
    }
  };

  const getActivityColor = (action: string) => {
    if (action.includes('created')) return 'activity-created';
    if (action.includes('updated')) return 'activity-updated';
    if (action.includes('deleted')) return 'activity-deleted';
    if (action.includes('completed')) return 'activity-completed';
    return 'activity-default';
  };

  if (loading) {
    return (
      <div className="activity-feed">
        <div className="activity-header">
          <h3>Recent Activity</h3>
        </div>
        <div className="activity-loading">Loading activities...</div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        {activities.length > 0 && (
          <span className="activity-count">{activities.length} recent</span>
        )}
      </div>
      
      <div className="activity-list" ref={feedRef}>
        {activities.length === 0 ? (
          <div className="activity-empty">
            <p>No recent activity</p>
            <span>Actions will appear here as they happen</span>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div 
              key={`${activity.id}-${index}`} 
              className={`activity-item ${getActivityColor(activity.action)}`}
            >
              <div className="activity-icon">
                {getActivityIcon(activity.action)}
              </div>
              
              <div className="activity-content">
                <div className="activity-message">
                  {activity.message}
                </div>
                
                <div className="activity-meta">
                  <span className="activity-time">
                    {formatTime(activity.createdAt)}
                  </span>
                  {activity.list && !listId && (
                    <span className="activity-list">
                      in "{activity.list.title}"
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {activities.length === limit && (
        <div className="activity-footer">
          <button 
            className="load-more-button"
            onClick={() => window.location.reload()}
          >
            Refresh to see more
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;