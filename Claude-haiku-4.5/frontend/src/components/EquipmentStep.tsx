import React from 'react';
import { uiLogger } from '../utils/ui-logger';

interface EquipmentStepProps {
  theme: 'light' | 'dark';
}

const EquipmentStep: React.FC<EquipmentStepProps> = ({ theme }) => {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

  React.useEffect(() => {
    uiLogger.logEvent(
      'page_load',
      { componentName: 'EquipmentStep' },
      { step: 'equipment' }
    );
  }, []);

  const equipment = [
    { id: 'laptop', name: 'Laptop', description: 'Company-issued laptop' },
    { id: 'monitor', name: 'Monitor', description: 'External display' },
    { id: 'keyboard', name: 'Keyboard & Mouse', description: 'Input devices' },
    { id: 'headset', name: 'Headset', description: 'Wireless headset' },
    { id: 'badge', name: 'ID Badge', description: 'Office access card' },
  ];

  const handleToggle = (id: string) => {
    const newItems = selectedItems.includes(id)
      ? selectedItems.filter(item => item !== id)
      : [...selectedItems, id];
    setSelectedItems(newItems);

    uiLogger.logEvent(
      'form_input',
      { componentName: 'EquipmentStep', elementId: `equipment-${id}` },
      { step: 'equipment', equipment: id, selected: newItems.includes(id) }
    );
  };

  const bgItemClass = theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200';
  const textClass = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const mutedClass = theme === 'dark' ? 'text-slate-400' : 'text-gray-600';
  const borderClass = theme === 'dark' ? 'border-slate-600' : 'border-gray-300';

  return (
    <div className="space-y-6" role="region" aria-label="Equipment & access setup">
      <div>
        <h2 className={`text-2xl font-bold ${textClass} mb-2`}>Equipment & Access Setup</h2>
        <p className={mutedClass}>
          Select the equipment you need for your role. These items will be ordered and delivered to your office.
        </p>
      </div>

      <div className="space-y-3">
        {equipment.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${bgItemClass} border`}
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item.id)}
              onChange={() => handleToggle(item.id)}
              className="mt-1 w-5 h-5 rounded"
              aria-label={item.name}
            />
            <div className="flex-1">
              <div className={`font-medium ${textClass}`}>{item.name}</div>
              <div className={`text-sm ${mutedClass}`}>{item.description}</div>
            </div>
          </label>
        ))}
      </div>

      <div className={`p-4 rounded-lg border ${borderClass} ${theme === 'dark' ? 'bg-slate-800' : 'bg-gray-50'}`}>
        <p className={`text-sm ${mutedClass}`}>
          Selected {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''}.
          Items will be arranged with IT department.
        </p>
      </div>
    </div>
  );
};

export default EquipmentStep;
