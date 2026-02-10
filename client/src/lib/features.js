const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop().toLowerCase();
  const fileTypes = {
    video: ["mp4", "webm", "ogg"],
    audio: ["mp3", "wav"],
    image: ["png", "jpg", "jpeg", "gif"],
  };

  for (const [type, extensions] of Object.entries(fileTypes)) {
    if (extensions.includes(fileExt)) {
      return type;
    }
  }

  return "file";
};

const transFormImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
  return newUrl;
};

const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

const handleAvatarChange = (e, setAvatarPath) => {
  e.preventDefault();
  setAvatarPath(URL.createObjectURL(e.target.files[0]));
};

export { fileFormat, getOrSaveFromStorage, handleAvatarChange, transFormImage };
