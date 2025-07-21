import React from 'react';
import CopyIcon from './icons/CopyIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import RegenerateIcon from './icons/RegenerateIcon';

interface MessageActionsProps {
  isModel: boolean;
  onCopy: () => void;
  onEdit?: () => void;
  onDelete: () => void;
  onRegenerate?: () => void;
}

const MessageActions: React.FC<MessageActionsProps> = ({ 
  isModel, 
  onCopy, 
  onEdit, 
  onDelete,
  onRegenerate
}) => {
  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
      <button 
        onClick={onCopy}
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        title="Copy message"
      >
        <CopyIcon className="w-4 h-4" />
      </button>
      
      {!isModel && onEdit && (
        <button 
          onClick={onEdit}
          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title="Edit message"
        >
          <EditIcon className="w-4 h-4" />
        </button>
      )}
      
      <button 
        onClick={onDelete}
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
        title="Delete message"
      >
        <DeleteIcon className="w-4 h-4" />
      </button>

      {isModel && onRegenerate && (
        <button 
          onClick={onRegenerate}
          className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
          title="Regenerate response"
        >
          <RegenerateIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default MessageActions;