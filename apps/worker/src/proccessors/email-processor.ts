export const emailProcessor = async (
  to: string,
  body: string,
  attachments?: any,
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(to, body, attachments);
      resolve(true);
    }, 350);
  });
};
