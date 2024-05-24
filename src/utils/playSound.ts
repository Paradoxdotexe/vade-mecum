export const playSound = async (src?: string, auto = true) => {
  return new Promise<HTMLAudioElement>(resolve => {
    const sound = new Audio(src);
    sound.addEventListener('canplaythrough', () => {
      auto && sound.play();
      resolve(sound);
    });
  });
};
