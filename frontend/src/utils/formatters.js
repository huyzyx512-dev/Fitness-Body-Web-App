// Date formatters
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Number formatters
export const formatWeight = (weight) => {
  if (!weight) return '0';
  return `${parseFloat(weight).toFixed(1)} kg`;
};

// Status formatters
export const formatWorkoutStatus = (status) => {
  const statusMap = {
    planned: 'Đã lên lịch',
    in_progress: 'Đang tập',
    completed: 'Hoàn thành',
  };
  return statusMap[status] || status;
};
