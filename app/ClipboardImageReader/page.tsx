'use client'
import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Alert, Space, Descriptions, Image, Spin, Row, Col } from 'antd';
import { CopyOutlined, FileImageOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ImageInfo {
  name: string;
  size: number;
  type: string;
  width: number;
  height: number;
  dataUrl: string;
  lastModified?: number;
}

const ClipboardImageReader: React.FC = () => {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 監聽鍵盤事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 檢查是否按下 Ctrl+V (Windows/Linux) 或 Cmd+V (Mac)
      if ((event.ctrlKey || event.metaKey) && event.key === 'v') {
        // 防止預設的貼上行為
        event.preventDefault();
        // 避免在載入中時重複觸發
        if (!isLoading) {
          readClipboardImage();
        }
      }
    };

    // 添加事件監聽器
    document.addEventListener('keydown', handleKeyDown);

    // 清理函數：移除事件監聽器
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading]); // 依賴 isLoading 以避免重複觸發

  // 讀取剪貼簿中的圖片
  const readClipboardImage = async () => {
    setIsLoading(true);
    setError('');
    setImageInfo(null);

    try {
      // 檢查瀏覽器是否支援 Clipboard API
      if (!navigator.clipboard || !navigator.clipboard.read) {
        throw new Error('你的瀏覽器不支援 Clipboard API');
      }

      // 讀取剪貼簿內容
      const clipboardItems = await navigator.clipboard.read();
      
      if (clipboardItems.length === 0) {
        throw new Error('剪貼簿是空的');
      }

      let foundImage = false;

      for (const clipboardItem of clipboardItems) {
        // 尋找圖片類型的項目
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            await processImageBlob(blob, type);
            foundImage = true;
            break;
          }
        }
        if (foundImage) break;
      }

      if (!foundImage) {
        throw new Error('剪貼簿中沒有找到圖片');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : '讀取剪貼簿失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 處理圖片 Blob
  const processImageBlob = async (blob: Blob, type: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      const img = new window.Image();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        
        img.onload = () => {
          const info: ImageInfo = {
            name: `clipboard-image-${Date.now()}`,
            size: blob.size,
            type: type,
            width: img.width,
            height: img.height,
            dataUrl: dataUrl,
            lastModified: Date.now()
          };
          
          setImageInfo(info);
          resolve();
        };

        img.onerror = () => {
          reject(new Error('無法載入圖片'));
        };

        img.src = dataUrl;
      };

      reader.onerror = () => {
        reject(new Error('無法讀取圖片檔案'));
      };

      reader.readAsDataURL(blob);
    });
  };

  // 格式化檔案大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const descriptionsItems = imageInfo ? [
    {
      key: 'name',
      label: '檔案名稱',
      children: imageInfo.name,
    },
    {
      key: 'type',
      label: '檔案類型',
      children: imageInfo.type,
    },
    {
      key: 'size',
      label: '檔案大小',
      children: formatFileSize(imageInfo.size),
    },
    {
      key: 'width',
      label: '寬度',
      children: `${imageInfo.width} px`,
    },
    {
      key: 'height',
      label: '高度',
      children: `${imageInfo.height} px`,
    },
    {
      key: 'ratio',
      label: '寬高比例',
      children: `${(imageInfo.width / imageInfo.height).toFixed(2)}:1`,
    },
  ] : [];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            <FileImageOutlined style={{ marginRight: 8 }} />
            剪貼簿圖片讀取器
          </Title>
          <Paragraph type="secondary">
            複製圖片到剪貼簿後，點擊下方按鈕或按 <Text keyboard>Ctrl+V</Text> 讀取圖片資訊
          </Paragraph>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Button
            type="primary"
            size="large"
            icon={<CopyOutlined />}
            loading={isLoading}
            onClick={readClipboardImage}
          >
            {isLoading ? '讀取中...' : '讀取剪貼簿圖片'}
          </Button>
        </div>

        {error && (
          <Alert
            message="錯誤"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {imageInfo && (
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 圖片預覽 */}
            <Card title="圖片預覽" size="small">
              <div style={{ textAlign: 'center' }}>
                <Image
                  src={imageInfo.dataUrl}
                  alt="剪貼簿圖片"
                  style={{ maxWidth: '100%', maxHeight: 300 }}
                  preview={{
                    mask: '點擊放大'
                  }}
                />
              </div>
            </Card>

            {/* 圖片資訊 */}
            <Card 
              title={
                <span>
                  <InfoCircleOutlined style={{ marginRight: 8 }} />
                  圖片資訊
                </span>
              } 
              size="small"
            >
              <Descriptions
                items={descriptionsItems}
                column={{ xs: 1, sm: 2, md: 2 }}
                bordered
                size="small"
              />
            </Card>

            {/* Data URL 資訊 */}
            <Card title="Data URL 資訊" size="small">
              <Paragraph>
                <Text strong>Data URL 預覽：</Text>
              </Paragraph>
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: 12, 
                borderRadius: 6,
                marginBottom: 8
              }}>
                <Text code style={{ fontSize: '12px', wordBreak: 'break-all' }}>
                  {imageInfo.dataUrl.substring(0, 100)}...
                </Text>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                完整的 Data URL 長度：{imageInfo.dataUrl.length.toLocaleString()} 字元
              </Text>
            </Card>
          </Space>
        )}

        <Alert
          message="使用說明"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>在任何地方複製圖片（右鍵複製或 Ctrl+C）</li>
              <li>回到這個頁面點擊按鈕或直接按 <Text keyboard>Ctrl+V</Text></li>
              <li>支援 PNG、JPEG、GIF、WebP 等常見格式</li>
              <li>需要 HTTPS 環境或 localhost 才能使用</li>
              <li>快捷鍵在輸入框中不會觸發，避免干擾正常輸入</li>
            </ul>
          }
          type="info"
          showIcon
          style={{ marginTop: 24 }}
        />
      </Card>
    </div>
  );
};

export default ClipboardImageReader;