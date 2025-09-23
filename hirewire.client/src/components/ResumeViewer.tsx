import React from 'react';

interface Props {
  url: string | null;
  onClose: () => void;
}

const ResumeViewer: React.FC<Props> = ({ url, onClose }) => {
  if (!url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 w-[90%] h-[90%] rounded shadow-lg overflow-hidden">
        <div className="p-2 flex justify-end bg-gray-100 dark:bg-gray-900">
          <button onClick={onClose} className="btn btn-secondary">Close</button>
        </div>
        <div className="w-full h-[calc(100%-48px)]">
          <iframe src={url} title="Resume Preview" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
