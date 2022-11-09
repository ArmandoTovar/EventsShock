import { API_URI } from '../utils/config';

export const GetReportPdf = (data) => {
  if (!data) return null;
  try {
    return fetch(`${API_URI}/api/pdf/`, {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.blob())
      .then((blob) => {
        let newWindow = window.open('/');
        newWindow.onload = () => {
          newWindow.location = URL.createObjectURL(blob);
        };
      });
  } catch (e) {
    return null;
  }
};
