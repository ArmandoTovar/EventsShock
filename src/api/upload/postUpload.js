const postUpload = async (ctx) => {
  const {
    avatar: { newFilename },
  } = ctx.request.files;

  ctx.body = { name: newFilename };
};

export default postUpload;
