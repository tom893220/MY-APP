'use client'
// 方法1: 通過 cellRendererParams 傳遞狀態 
import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

ModuleRegistry.registerModules([AllCommunityModule]);

// Cell Renderer Component
const ActionCellRenderer: React.FC<ICellRendererParams & {
  externalState: any;
  setExternalState: (value: any) => void;
  selectedRows: string[];
  setSelectedRows: (rows: string[]) => void;
}> = ({ data, externalState, setExternalState, selectedRows, setSelectedRows }) => {
  
  const handleClick = () => {
    // 使用外部狀態
    setExternalState(data.id);
    
    // 更新選中的行
    const newSelection = [...selectedRows, data.id];
    setSelectedRows(newSelection);
  };

  const isSelected = selectedRows.includes(data.id);

  return (
    <div className="flex gap-2">
      <button 
        onClick={handleClick}
        className={`px-3 py-1 rounded ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
      <span>Current: {externalState}</span>
    </div>
  );
};

// 主要組件
 const GridComponent: React.FC = () => {
  // 外部狀態
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [gridData, setGridData] = useState([
    { id: '1', name: 'John', age: 25 },
    { id: '2', name: 'Jane', age: 30 },
    { id: '3', name: 'Bob', age: 35 }
  ]);

  // 列定義
  const columnDefs: ColDef[] = [
    { field: 'name', headerName: 'Name' },
    { field: 'age', headerName: 'Age' },
    {
      field: 'actions',
      headerName: 'Actions',
      cellRenderer: ActionCellRenderer,
      cellRendererParams: {
        externalState: selectedItem,
        setExternalState: setSelectedItem,
        selectedRows: selectedRows,
        setSelectedRows: setSelectedRows
      },
      width: 300
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3>外部狀態信息:</h3>
        <p>Selected Item: {selectedItem}</p>
        <p>Selected Rows: {selectedRows.join(', ')}</p>
        <button 
          onClick={() => setSelectedItem('')}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Clear Selection
        </button>
      </div>
      
      <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
        <AgGridReact
          rowData={gridData}
          columnDefs={columnDefs}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true
          }}
        />
      </div>
    </div>
  );
};
export default GridComponent