'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Modal, Button, Card } from 'antd';

// 自訂拖曳 Hook
const useDraggable = (initialPosition = { x: 0, y: 0 }) => {
  const [position, setPosition] = useState(initialPosition);
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0
  });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    
    dragState.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: position.x,
      startTop: position.y
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    document.body.style.cursor = 'move';
    document.body.style.userSelect = 'none';
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current.isDragging) return;

    const deltaX = e.clientX - dragState.current.startX;
    const deltaY = e.clientY - dragState.current.startY;

    const newX = dragState.current.startLeft + deltaX;
    const newY = dragState.current.startTop + deltaY;

    // 邊界限制
    const maxX = window.innerWidth / 2 - 200;
    const maxY = window.innerHeight / 2 - 150;
    const minX = -window.innerWidth / 2 + 200;
    const minY = -window.innerHeight / 2 + 100;

    setPosition({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY))
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);

  // 重置位置的函數
  const resetPosition = useCallback(() => {
    setPosition(initialPosition);
  }, [initialPosition]);

  // 清理事件監聽器
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    position,
    isDragging: dragState.current.isDragging,
    handleMouseDown,
    resetPosition,
    setPosition
  };
};

// 使用自訂 Hook 的可拖曳 Modal 組件
const DraggableModalWithHook: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 使用自訂拖曳 Hook
  const { position, handleMouseDown, resetPosition } = useDraggable();

  const showModal = () => {
    setIsModalOpen(true);
    resetPosition(); // 每次開啟時重置位置
  };

  return (
    <Modal
      title={
        <div 
          style={{ cursor: 'move', userSelect: 'none' }}
          onMouseDown={handleMouseDown}
        >
          🎯 使用自訂 Hook 的拖曳 Modal
        </div>
      }
      open={isModalOpen}
      onOk={() => setIsModalOpen(false)}
      onCancel={() => setIsModalOpen(false)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
    >
      <p>這個 Modal 使用自訂 Hook 實作拖曳功能</p>
      <p>當前位置: X: {position.x}px, Y: {position.y}px</p>
    </Modal>
  );
};

// 使用同樣 Hook 的可拖曳卡片組件
const DraggableCard: React.FC<{ title: string; children: React.ReactNode }> = ({ 
  title, 
  children 
}) => {
  const { position, handleMouseDown } = useDraggable();

  return (
    <Card
      title={
        <div 
          style={{ cursor: 'move', userSelect: 'none' }}
          onMouseDown={handleMouseDown}
        >
          {title}
        </div>
      }
      style={{
        position: 'absolute',
        width: 300,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: 1000
      }}
    >
      {children}
    </Card>
  );
};

// 主組件展示
const CustomHookDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const { position, handleMouseDown, resetPosition,isDragging } = useDraggable();
const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="space-y-4 mb-8">
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          開啟可拖曳 Modal
        </Button>
      </div>

      {/* 使用自訂 Hook 的 Modal */}
      <Modal
        title={
          <div 
            style={{ 
              cursor: 'move', 
              userSelect: 'none',
              padding: '8px 0'
            }}
          >
            🔄 可拖曳的 Modal (點擊此處拖曳)
          </div>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? 'none' : 'transform 0.2s ease'
        }}
        modalRender={(modal) => (
          <div onMouseDown={handleMouseDown}>
            {modal}
          </div>
        )}
      >
        <div className="space-y-4">
          <p>這是一個可以拖曳的 Modal！</p>
          <p>✨ 點擊標題列並拖曳來移動 Modal</p>
          <p>🎯 Modal 會限制在視窗範圍內</p>
          <p>🚀 使用 TypeScript 和 React Hooks 實作</p>
          
          <div className="bg-gray-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              當前位置: X: {position.x}px, Y: {position.y}px
            </p>
          </div>
        </div>
      </Modal>

      {/* 可拖曳的卡片們 */}
      <DraggableCard title="📋 待辦清單">
        <ul>
          <li>學習 React Hooks</li>
          <li>實作拖曳功能</li>
          <li>優化使用者體驗</li>
        </ul>
      </DraggableCard>

      <DraggableCard title="📊 數據圖表">
        <div className="h-32 bg-blue-100 rounded flex items-center justify-center">
          圖表區域 (可拖曳)
        </div>
      </DraggableCard>

      <DraggableCard title="💬 聊天視窗">
        <div className="space-y-2">
          <div className="bg-blue-500 text-white p-2 rounded text-sm">
            你好！這是一個可拖曳的聊天視窗
          </div>
          <div className="bg-gray-200 p-2 rounded text-sm">
            真酷！我也可以拖曳
          </div>
        </div>
      </DraggableCard>

      {/* 說明區域 */}
      <div className="fixed bottom-4 right-4 bg-white p-6 rounded-lg shadow-lg max-w-md">
        <h3 className="text-lg font-bold mb-3">🚀 自訂 Hook 的優勢</h3>
        
        <div className="space-y-3 text-sm">
          <div>
            <strong>💡 邏輯重用：</strong>
            <p>一次寫好，多個組件都能使用相同的拖曳功能</p>
          </div>
          
          <div>
            <strong>🧹 代碼分離：</strong>
            <p>拖曳邏輯與 UI 組件分離，更容易維護</p>
          </div>
          
          <div>
            <strong>🔧 易於測試：</strong>
            <p>可以單獨測試拖曳邏輯，不需要渲染整個組件</p>
          </div>
          
          <div>
            <strong>⚙️ 靈活配置：</strong>
            <p>可以傳入不同參數來自訂拖曳行為</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomHookDemo;