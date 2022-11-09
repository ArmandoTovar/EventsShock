import { API_URI } from '../utils/config';

export const GetImagenUrl = async (avatar) => {
  if (!avatar) return null;
  const formData = new FormData();
  formData.append('avatar', avatar);
  try {
    const response = await fetch(`${API_URI}/api/upload/`, {
      method: 'POST',
      header: {
        'content-type':
          'multipart/form-data; boundary=<calculated when request is sent>',
      },
      body: formData,
    });
    const { name } = await response.json();
    const url = API_URI + '/uploads/' + name;
    return url;
  } catch (e) {
    return null;
  }
};
