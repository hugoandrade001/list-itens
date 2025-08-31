import React, { useState, useEffect } from 'react';
import { itemService, CreateItemData } from '../services/itemService';
import { ListItem } from '../services/listService';
import { socketService } from '../services/socketService';

interface ListViewProps {
  listId: number;
  onBack: () => void;
}

const ListView: React.FC<ListViewProps> = ({ listId, onBack }) => {
  const [listData, setListData] = useState<{
    list: { id: number; title: string; description?: string };
    items: ListItem[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [addingItem, setAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    fetchListData();
    setupSocketListeners();
    socketService.joinList(listId);

    return () => {
      socketService.leaveList(listId);
      socketService.removeAllListeners();
    };
  }, [listId]);

  const fetchListData = async () => {
    try {
      const data = await itemService.getItemsByListId(listId);
      setListData(data);
    } catch (error) {
      console.error('Error fetching list data:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.onItemCreated((newItem: ListItem) => {
      if (newItem.listId === listId) {
        setListData(prev => prev ? {
          ...prev,
          items: [...prev.items, newItem]
        } : null);
      }
    });

    socketService.onItemUpdated((updatedItem: ListItem) => {
      if (updatedItem.listId === listId) {
        setListData(prev => prev ? {
          ...prev,
          items: prev.items.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          )
        } : null);
      }
    });

    socketService.onItemDeleted((deletedItem: ListItem) => {
      if (deletedItem.listId === listId) {
        setListData(prev => prev ? {
          ...prev,
          items: prev.items.filter(item => item.id !== deletedItem.id)
        } : null);
      }
    });

    socketService.onItemToggled((toggledItem: ListItem) => {
      if (toggledItem.listId === listId) {
        setListData(prev => prev ? {
          ...prev,
          items: prev.items.map(item => 
            item.id === toggledItem.id ? toggledItem : item
          )
        } : null);
      }
    });
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    setAddingItem(true);
    try {
      const itemData: CreateItemData = {
        title: newItemTitle.trim(),
        listId: listId
      };

      await itemService.createItem(itemData);
      setNewItemTitle('');
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setAddingItem(false);
    }
  };

  const handleToggleItem = async (itemId: number) => {
    try {
      await itemService.toggleItemCompletion(itemId);
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      await itemService.deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleStartEdit = (item: ListItem) => {
    setEditingItemId(item.id);
    setEditingTitle(item.title);
  };

  const handleSaveEdit = async (itemId: number) => {
    if (!editingTitle.trim()) return;

    try {
      await itemService.updateItem(itemId, { title: editingTitle.trim() });
      setEditingItemId(null);
      setEditingTitle('');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingItemId(null);
    setEditingTitle('');
  };

  if (loading) {
    return (
      <div className="list-view-container">
        <div className="loading">Loading list...</div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="list-view-container">
        <div className="error">List not found</div>
      </div>
    );
  }

  const completedItems = listData.items.filter(item => item.completed).length;
  const totalItems = listData.items.length;
  const completionRate = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  return (
    <div className="list-view-container">
      <div className="list-view-header">
        <button className="back-button" onClick={onBack}>
          ← Back to Lists
        </button>
        <div className="list-info">
          <h1>{listData.list.title}</h1>
          {listData.list.description && (
            <p className="list-description">{listData.list.description}</p>
          )}
          <div className="list-stats">
            <span>{completedItems}/{totalItems} completed</span>
            {totalItems > 0 && (
              <span className="completion-rate">({completionRate}%)</span>
            )}
          </div>
        </div>
      </div>

      <div className="add-item-form">
        <form onSubmit={handleAddItem}>
          <input
            type="text"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Add a new item..."
            disabled={addingItem}
          />
          <button 
            type="submit"
            disabled={addingItem || !newItemTitle.trim()}
          >
            {addingItem ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>

      <div className="items-list">
        {listData.items.length === 0 ? (
          <div className="empty-items">
            <p>No items yet. Add your first item above!</p>
          </div>
        ) : (
          listData.items.map(item => (
            <div key={item.id} className={`item-card ${item.completed ? 'completed' : ''}`}>
              <div className="item-checkbox">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggleItem(item.id)}
                />
              </div>
              
              <div className="item-content">
                {editingItemId === item.id ? (
                  <div className="item-edit-form">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(item.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                      autoFocus
                    />
                    <div className="item-edit-actions">
                      <button onClick={() => handleSaveEdit(item.id)}>Save</button>
                      <button onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="item-title" onClick={() => handleStartEdit(item)}>
                    {item.title}
                  </div>
                )}
              </div>
              
              <div className="item-actions">
                {editingItemId !== item.id && (
                  <>
                    <button 
                      className="edit-button"
                      onClick={() => handleStartEdit(item)}
                      title="Edit item"
                    >
                      ✏️
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteItem(item.id)}
                      title="Delete item"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalItems > 0 && (
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ListView;