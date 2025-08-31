import React, { useState, useEffect } from 'react';
import { List, listService, CreateListData } from '../services/listService';
import { socketService } from '../services/socketService';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onSelectList: (listId: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onSelectList }) => {
  const [lists, setLists] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchLists();
    setupSocketListeners();
    
    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const fetchLists = async () => {
    try {
      const fetchedLists = await listService.getAllLists();
      setLists(fetchedLists);
    } catch (error) {
      console.error('Error fetching lists:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onListCreated((newList: List) => {
      setLists(prev => [newList, ...prev]);
    });

    socketService.onListUpdated((updatedList: List) => {
      setLists(prev => prev.map(list => 
        list.id === updatedList.id ? updatedList : list
      ));
    });

    socketService.onListDeleted((deletedList: List) => {
      setLists(prev => prev.filter(list => list.id !== deletedList.id));
    });
  };

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;

    setCreating(true);
    try {
      const listData: CreateListData = {
        title: newListTitle.trim(),
        description: newListDescription.trim() || undefined
      };

      await listService.createList(listData);
      setNewListTitle('');
      setNewListDescription('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating list:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteList = async (listId: number) => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return;
    }

    try {
      await listService.deleteList(listId);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading your lists...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Shared Lists</h1>
        <button 
          className="create-button"
          onClick={() => setShowCreateForm(true)}
        >
          + Create New List
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form-overlay">
          <div className="create-form-modal">
            <h3>Create New List</h3>
            <form onSubmit={handleCreateList}>
              <div className="form-group">
                <label htmlFor="title">List Title *</label>
                <input
                  type="text"
                  id="title"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="Enter list title"
                  required
                  disabled={creating}
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Enter list description (optional)"
                  disabled={creating}
                />
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewListTitle('');
                    setNewListDescription('');
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={creating || !newListTitle.trim()}
                >
                  {creating ? 'Creating...' : 'Create List'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="lists-grid">
        {lists.length === 0 ? (
          <div className="empty-state">
            <h3>No lists yet</h3>
            <p>Create your first shared list to get started!</p>
            <button 
              className="create-button"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First List
            </button>
          </div>
        ) : (
          lists.map(list => (
            <div key={list.id} className="list-card">
              <div className="list-card-header">
                <h3 onClick={() => onSelectList(list.id)} className="list-title">
                  {list.title}
                </h3>
                {user?.id === list.owner.id && (
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteList(list.id)}
                    title="Delete list"
                  >
                    ×
                  </button>
                )}
              </div>
              
              {list.description && (
                <p className="list-description">{list.description}</p>
              )}
              
              <div className="list-meta">
                <span className="list-owner">by {list.owner.name}</span>
                <span className="list-items-count">
                  {list._count?.items || 0} items
                </span>
              </div>
              
              <div className="list-date">
                Created {formatDate(list.createdAt)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;