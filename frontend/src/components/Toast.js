import { toast } from 'react-toastify';

export const showSuccess = (message) => {
  toast.success(message, { position: toast.POSITION.TOP_RIGHT });
};

export const showError = (message) => {
  toast.error(message, { position: toast.POSITION.TOP_RIGHT });
};
