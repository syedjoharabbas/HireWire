import React from 'react';

interface Props {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Confirm: React.FC<Props> = ({ title = 'Confirm', message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="bg-white dark:bg-neutralGlass-800 rounded-md p-6 shadow-lg max-w-md w-full">
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Confirm;
