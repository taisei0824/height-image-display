// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];

// 画像を更新する関数
function updateImages(height) {
  const container = document.getElementById('imageContainer');
  container.innerHTML = ''; // 以前の画像をクリア

  sizes.forEach(size => {
    const img = document.createElement('img');
    // 画像パスを設定 (例: images/160/S.jpg)
    img.src = `images/${height}/${size}_${height}.png`;
    img.alt = `${height}cm ${size}`;
    container.appendChild(img);
  });
}

// URL のクエリパラメータを更新する関数
function updateURL(height) {
  const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + '?height=' + height;
  window.history.pushState({path: newURL}, '', newURL);
}

// ドロップダウンの変更イベント
document.getElementById('heightSelector').addEventListener('change', function(){
  const height = this.value;
  if (height) {
    updateImages(height);
    updateURL(height);
  } else {
    document.getElementById('imageContainer').innerHTML = '';
  }
});

// ページ読み込み時に URL パラメータをチェック
window.addEventListener('load', function(){
  const params = new URLSearchParams(window.location.search);
  const height = params.get('height');
  if (height) {
    // ドロップダウンの初期値として反映
    document.getElementById('heightSelector').value = height;
    updateImages(height);
  }
});
