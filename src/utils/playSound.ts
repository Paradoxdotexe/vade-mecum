export const playSound = async (src?: string) => {
  return new Promise<void>(resolve => {
    const sound = new Audio(src);
    sound.addEventListener('canplaythrough', () => {
      sound.play();
      resolve();
    });
  });
};
