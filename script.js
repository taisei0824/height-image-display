// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];

// グローバル変数：現在の身長とサイズのインデックスを保持
let currentHeight = null;
let currentIndex = 0;

// 画像を更新する関数（ドロップダウン選択時）
function updateImages(height) {
  const container = document.getElementById('imageContainer');
  container.innerHTML = ''; // 以前の画像をクリア

  sizes.forEach((size, index) => {
    const img = document.createElement('img');
    // 画像パス (例: images/165/M_165.png)
    img.src = `images/${height}/${size}_${height}.png`;
    img.alt = `${height}cm ${size}`;
    // 画像をクリックしたらモーダルを開くイベントを追加
    img.addEventListener('click', () => {
      openModal(height, index);
    });
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
    document.getElementById('heightSelector').value = height;
    updateImages(height);
  }
});

// モーダルを開く関数
function openModal(height, index) {
  currentHeight = height;
  currentIndex = index;
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = `images/${height}/${sizes[index]}_${height}.png`;
  modalImg.alt = `${height}cm ${sizes[index]}`;
  modal.style.display = 'block';
}

// モーダルを閉じる関数
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// 前の画像を表示
function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = sizes.length - 1; // ループして最後へ
  }
  updateModalImage();
}

// 次の画像を表示
function showNext() {
  if (currentIndex < sizes.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // ループして最初へ
  }
  updateModalImage();
}

// モーダル内の画像を更新する
function updateModalImage() {
  const modalImg = document.getElementById('modalImg');
  modalImg.src = `images/${currentHeight}/${sizes[currentIndex]}_${currentHeight}.png`;
  modalImg.alt = `${currentHeight}cm ${sizes[currentIndex]}`;
}

// モーダルの閉じるボタンのイベント
document.getElementById('closeModal').addEventListener('click', closeModal);

// モーダルのナビゲーションボタンのイベント
document.getElementById('prevBtn').addEventListener('click', showPrev);
document.getElementById('nextBtn').addEventListener('click', showNext);

// クリックしてモーダル外を閉じる（オーバーレイ部分）
window.addEventListener('click', function(event) {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});
