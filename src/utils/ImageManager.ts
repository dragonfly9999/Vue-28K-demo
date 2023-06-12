const processImage = async (file: File) => {
  // 壓縮
  const maxWidth = 800;
  const maxHeight = 800;
  const quality = 0.8;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = URL.createObjectURL(file);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve();
    };
    img.onerror = reject;
  });

  let width = img.width;
  let height = img.height;

  if (width > maxWidth) {
    height = (maxWidth * height) / width;
    width = maxWidth;
  }

  if (height > maxHeight) {
    width = (maxHeight * width) / height;
    height = maxHeight;
  }

  canvas.width = width;
  canvas.height = height;

  // 浮水印
  if (ctx) {
    ctx.drawImage(img, 0, 0, width, height);

    const text = '好幣多 實名驗證';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 10, 20, maxWidth);

    const dataUrl = canvas.toDataURL('image/jpeg', quality);
    return dataUrl;
  } else {
    return false;
  }
};

const handleBoforeUpload = async (file: File | undefined) => {
  if (!file) return '-';
  const PureImg = await processImage(file);
  if (PureImg) return PureImg;
  return '-';
};

const fullScreen = (base64Image: string) => {
  // 建立一個新的 Image 物件
  const img = new Image();
  // 設定 Image 物件的 src 為 base64 圖片資料
  img.src = base64Image;

  // 當圖片載入完成時
  img.onload = function () {
    // 建立一個新的全螢幕元素
    const fullscreenElement = document.createElement('div');
    fullscreenElement.style.position = 'fixed';
    fullscreenElement.style.top = '0';
    fullscreenElement.style.left = '0';
    fullscreenElement.style.width = '100%';
    fullscreenElement.style.height = '100%';
    fullscreenElement.style.background = 'rgba(0, 0, 0, 0.8)';
    fullscreenElement.style.display = 'flex';
    fullscreenElement.style.justifyContent = 'center';
    fullscreenElement.style.alignItems = 'center';
    fullscreenElement.style.zIndex = '9999';

    // 建立一個新的圖片元素，設定其寬度為 100% 並加入全螢幕元素中
    const imgElement = document.createElement('img');
    imgElement.style.width = '100%';
    imgElement.src = base64Image;
    fullscreenElement.appendChild(imgElement);

    // 加入全螢幕元素到 body 中
    document.body.appendChild(fullscreenElement);

    // 當使用者按下 ESC 鍵或點擊全螢幕元素時，關閉全螢幕展示
    fullscreenElement.addEventListener('click', closeFullscreen);
    document.addEventListener('keydown', function (event: KeyboardEvent) {
      if (event.keyCode === 27) {
        closeFullscreen();
      }
    });

    function closeFullscreen() {
      fullscreenElement.removeEventListener('click', closeFullscreen);
      document.removeEventListener('keydown', closeFullscreen);
      document.body.removeChild(fullscreenElement);
    }
  };
};

export { handleBoforeUpload, fullScreen };
