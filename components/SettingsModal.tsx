
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { AnalysisTab } from '../types';

interface SettingsModalProps {
  allTabs: AnalysisTab[];
  visibleTabs: AnalysisTab[];
  onClose: () => void;
  onSave: (selectedTabs: AnalysisTab[]) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ allTabs, visibleTabs, onClose, onSave }) => {
  const [selected, setSelected] = useState<Set<AnalysisTab>>(new Set(visibleTabs));

  const handleToggle = (tab: AnalysisTab) => {
    const newSelected = new Set(selected);
    if (newSelected.has(tab)) {
      newSelected.delete(tab);
    } else {
      newSelected.add(tab);
    }
    setSelected(newSelected);
  };

  const handleSave = () => {
    onSave(Array.from(selected));
  };
  
  const modalContent = (
    <div 
      className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-slate-900 mb-4">Customize Dashboard View</h2>
        <p className="text-sm text-slate-600 mb-6">Select the analysis sections you want to see.</p>
        
        <div className="space-y-3">
          {allTabs.map(tab => (
            <label key={tab} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={selected.has(tab)}
                onChange={() => handleToggle(tab)}
                className="h-5 w-5 rounded text-sky-600 focus:ring-sky-500 border-slate-300"
              />
              <span className="text-slate-800 font-medium">{tab}</span>
            </label>
          ))}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
  
  const modalRoot = document.getElementById('modal-root');
  return modalRoot ? createPortal(modalContent, modalRoot) : null;
};

export default SettingsModal;
