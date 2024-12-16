import React, { useState } from "react";

interface StockJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventories: {
    inventory_id: number;
    product_name: string;
  }[];
  onConfirm: (inventories: { inventoryIds: number[]; stockChange: number }) => void; // Confirmation handler
}

function StockJournalModal({
  isOpen,
  onClose,
  inventories,
  onConfirm,
}: StockJournalModalProps) {
  const [stockChange, setStockChange] = useState<string | number>(0);

  const handleSubmit = () => {
    const inventoryIds = inventories.map((item) => item.inventory_id);
    onConfirm({ inventoryIds, stockChange: Number(stockChange) });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">
          Update Stock for:
          <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">
            {inventories.map((item) => (
              <li key={item.inventory_id}>{item.product_name}</li>
            ))}
          </ul>
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Stock Change
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={stockChange}
            onChange={(e) => {
                const value = e.target.value
                if(value === "" || value === "-"){
                    setStockChange(value);
                }else if(!isNaN(Number(value))){
                    setStockChange(Number(value))
                }
            }}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-gray-800 text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockJournalModal;
