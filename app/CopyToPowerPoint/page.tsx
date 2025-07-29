'use client'
import React, { useState } from 'react';
import { CopyOutlined, } from '@ant-design/icons';
const CopyToPowerPointDemo = () => {
    const [copyStatus, setCopyStatus] = useState('');

    const copyAsRichText = async (element: HTMLElement) => {
        try {
            setCopyStatus('複製中...');

            const html = element.outerHTML;
            const text = element.innerText;

            const clipboardItem = new ClipboardItem({
                'text/html': new Blob([html], { type: 'text/html' }),
                'text/plain': new Blob([text], { type: 'text/plain' })
            });

            await navigator.clipboard.write([clipboardItem]);

            setCopyStatus('✅ 已複製！現在可以貼到 PowerPoint 測試');

            setTimeout(() => setCopyStatus(''), 3000);

        } catch (err) {
            console.error('複製失敗:', err);
            setCopyStatus('❌ 複製失敗，請手動選取複製');
            setTimeout(() => setCopyStatus(''), 3000);
        }
    };

    const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
        const copyArea = e.currentTarget.querySelector('.copy-content');
        if (copyArea instanceof HTMLElement) {
            copyAsRichText(copyArea);
        } else {
            setCopyStatus('❌ 找不到可複製的內容區塊');
            setTimeout(() => setCopyStatus(''), 3000);
        }
    };

    // 範例1：標準文件格式
    const Example1 = () => (
        <div
            className="example-container"
            onClick={handleCopy}
            style={{
                border: '2px dashed #3498db',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <CopyOutlined size={16} style={{ marginRight: '8px', color: '#3498db' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>點擊複製此區塊</span>
            </div>

            <div className="copy-content" style={{
                fontFamily: 'Microsoft JhengHei, Arial, sans-serif',
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#333333'
            }}>
                <h1 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    textAlign: 'center',
                    marginBottom: '20px',
                    borderBottom: '3px solid #3498db',
                    paddingBottom: '10px',
                }}>
                    專案報告：市場分析
                </h1>

                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    marginTop: '25px',
                    marginBottom: '15px'
                }}>
                    一、執行摘要
                </h2>

                <p style={{
                    marginBottom: '15px',
                    textIndent: '2em',
                    textAlign: 'justify'
                }}>
                    根據本季度的市場調查結果顯示，我們的產品在目標市場中獲得了<strong style={{ color: '#e74c3c' }}>85%</strong>的客戶滿意度，較上季度成長<em style={{ color: '#27ae60' }}>12%</em>。
                </p>

                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#e74c3c',
                    marginTop: '25px',
                    marginBottom: '15px'
                }}>
                    二、關鍵指標
                </h2>

                <ul style={{
                    paddingLeft: '25px',
                    marginBottom: '20px'
                }}>
                    <li style={{ marginBottom: '10px' }}>
                        <strong>營收成長：</strong>較去年同期增加 23.5%
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        <strong>市場佔有率：</strong>目前為 15.2%
                    </li>
                    <li style={{ marginBottom: '10px' }}>
                        <strong>客戶留存率：</strong>達到 91.8%
                    </li>
                </ul>
            </div>
        </div>
    );

    // 範例2：表格資料
    const Example2 = () => (
        <div
            className="example-container"
            onClick={handleCopy}
            style={{
                border: '2px dashed #27ae60',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <CopyOutlined size={16} style={{ marginRight: '8px', color: '#27ae60' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>點擊複製表格資料</span>
            </div>

            <div className="copy-content" style={{
                fontFamily: 'Microsoft JhengHei, Arial, sans-serif'
            }}>
                <h2 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '15px',
                    textAlign: 'center'
                }}>
                    季度銷售報表
                </h2>

                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '14px'
                }}>
                    <thead>
                        <tr style={{ backgroundColor: '#34495e', color: '#ffffff' }}>
                            <th style={{
                                border: '1px solid #bdc3c7',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                產品類別
                            </th>
                            <th style={{
                                border: '1px solid #bdc3c7',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                Q1 銷量
                            </th>
                            <th style={{
                                border: '1px solid #bdc3c7',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                Q2 銷量
                            </th>
                            <th style={{
                                border: '1px solid #bdc3c7',
                                padding: '12px',
                                textAlign: 'center',
                                fontWeight: 'bold'
                            }}>
                                成長率
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ backgroundColor: '#ecf0f1' }}>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'center'
                            }}>
                                電子產品
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                1,250
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                1,580
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right',
                                color: '#27ae60',
                                fontWeight: 'bold'
                            }}>
                                +26.4%
                            </td>
                        </tr>
                        <tr>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'center'
                            }}>
                                家用電器
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                890
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                945
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right',
                                color: '#27ae60',
                                fontWeight: 'bold'
                            }}>
                                +6.2%
                            </td>
                        </tr>
                        <tr style={{ backgroundColor: '#ecf0f1' }}>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'center'
                            }}>
                                服飾配件
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                2,100
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right'
                            }}>
                                1,950
                            </td>
                            <td style={{
                                border: '1px solid #bdc3c7',
                                padding: '10px',
                                textAlign: 'right',
                                color: '#e74c3c',
                                fontWeight: 'bold'
                            }}>
                                -7.1%
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    // 範例3：多層次清單
    const Example3 = () => (
        <div
            className="example-container"
            onClick={handleCopy}
            style={{
                border: '2px dashed #f39c12',
                borderRadius: '8px',
                padding: '20px',
                margin: '20px 0',
                cursor: 'pointer',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <CopyOutlined size={16} style={{ marginRight: '8px', color: '#f39c12' }} />
                <span style={{ fontSize: '14px', color: '#666' }}>點擊複製清單結構</span>
            </div>

            <div className="copy-content" style={{
                fontFamily: 'Microsoft JhengHei, Arial, sans-serif',
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#333333'
            }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#d35400',
                    marginBottom: '20px'
                }}>
                    專案執行計畫
                </h2>

                <ol style={{
                    paddingLeft: '25px',
                    marginBottom: '20px'
                }}>
                    <li style={{ marginBottom: '15px' }}>
                        <strong>前期準備階段（第1-2週）</strong>
                        <ul style={{
                            paddingLeft: '20px',
                            marginTop: '8px'
                        }}>
                            <li style={{ marginBottom: '5px' }}>需求分析與確認</li>
                            <li style={{ marginBottom: '5px' }}>資源配置規劃</li>
                            <li style={{ marginBottom: '5px' }}>風險評估報告</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '15px' }}>
                        <strong>開發執行階段（第3-8週）</strong>
                        <ul style={{
                            paddingLeft: '20px',
                            marginTop: '8px'
                        }}>
                            <li style={{ marginBottom: '5px' }}>系統架構設計</li>
                            <li style={{ marginBottom: '5px' }}>
                                核心功能開發
                                <ul style={{
                                    paddingLeft: '15px',
                                    marginTop: '5px'
                                }}>
                                    <li>使用者介面設計</li>
                                    <li>後端 API 開發</li>
                                    <li>資料庫建置</li>
                                </ul>
                            </li>
                            <li style={{ marginBottom: '5px' }}>整合測試</li>
                        </ul>
                    </li>

                    <li style={{ marginBottom: '15px' }}>
                        <strong>驗收上線階段（第9-10週）</strong>
                        <ul style={{
                            paddingLeft: '20px',
                            marginTop: '8px'
                        }}>
                            <li style={{ marginBottom: '5px' }}>使用者驗收測試（UAT）</li>
                            <li style={{ marginBottom: '5px' }}>正式環境部署</li>
                            <li style={{ marginBottom: '5px' }}>使用者教育訓練</li>
                        </ul>
                    </li>
                </ol>

                <div style={{
                    backgroundColor: '#fff3cd',
                    border: '1px solid #ffeaa7',
                    borderRadius: '5px',
                    padding: '15px',
                    marginTop: '20px'
                }}>
                    <strong style={{ color: '#856404' }}>注意事項：</strong>
                    <p style={{ margin: '8px 0 0 0', color: '#856404' }}>
                        每個階段完成後需進行里程碑檢核，確保專案進度符合預期目標。
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{
            maxWidth: '900px',
            margin: '0 auto',
            padding: '20px',
            fontFamily: 'Microsoft JhengHei, Arial, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px'
            }}>
                <h1 style={{
                    color: '#2c3e50',
                    marginBottom: '15px',
                    fontSize: '28px'
                }}>
                    複製到 PowerPoint 排版測試
                </h1>
                <p style={{
                    color: '#7f8c8d',
                    fontSize: '16px',
                    lineHeight: '1.6'
                }}>
                    點擊下方任一區塊進行複製，然後貼到 PowerPoint 中測試排版效果
                </p>

                {copyStatus && (
                    <div style={{
                        marginTop: '15px',
                        padding: '10px',
                        backgroundColor: copyStatus.includes('✅') ? '#d4edda' : '#f8d7da',
                        border: `1px solid ${copyStatus.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
                        borderRadius: '5px',
                        color: copyStatus.includes('✅') ? '#155724' : '#721c24'
                    }}>
                        {copyStatus}
                    </div>
                )}
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>範例一：標準文件格式</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>
                    包含標題、段落、粗體、斜體、顏色文字等基本格式
                </p>
                <Example1 />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>範例二：表格資料</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>
                    測試表格邊框、背景色、對齊方式是否正確複製
                </p>
                <Example2 />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#34495e', marginBottom: '10px' }}>範例三：多層次清單</h3>
                <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '10px' }}>
                    測試有序清單、無序清單、巢狀結構的複製效果
                </p>
                <Example3 />
            </div>

            <div style={{
                marginTop: '40px',
                padding: '20px',
                backgroundColor: '#e8f4fd',
                borderRadius: '8px',
                border: '1px solid #bee5eb'
            }}>
                <h3 style={{ color: '#0c5460', marginBottom: '15px' }}>
                    💡 測試建議
                </h3>
                <ul style={{
                    color: '#0c5460',
                    paddingLeft: '20px',
                    lineHeight: '1.6'
                }}>
                    <li style={{ marginBottom: '8px' }}>複製後直接貼到 PowerPoint 投影片中</li>
                    <li style={{ marginBottom: '8px' }}>觀察字體、顏色、格式是否保持一致</li>
                    <li style={{ marginBottom: '8px' }}>測試表格邊框和背景色是否正確顯示</li>
                    <li style={{ marginBottom: '8px' }}>檢查清單層次結構是否正確</li>
                    <li>如果格式跑掉，可以嘗試「選擇性貼上」→「保留來源格式」</li>
                </ul>
            </div>
        </div>
    );
};

export default CopyToPowerPointDemo;