// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];

// 選択状況を保持する変数
let selectedGender = null;
let selectedHeight = null;

// モーダル用のグローバル変数
let currentGender = null;
let currentHeight = null;
let currentIndex = 0;

// 画像表示を更新する関数（性別と身長の両方が必要）
function updateImages(gender, height) {
  const container = document.getElementById('imageContainer');
  container.innerHTML = ''; // 以前の画像をクリア

  sizes.forEach((size, index) => {
    const img = document.createElement('img');
    // 画像パスの例: images/male/157/S_157.png
    img.src = `images/${gender}/${height}/${size}_${height}.png`;
    img.alt = `${height}cm ${size} (${gender})`;
    // タップ（クリック）でモーダルを開く
    img.addEventListener('click', () => {
      openModal(gender, height, index);
    });
    container.appendChild(img);
  });
  // URL更新（性別と身長のパラメータを追加）
  updateURL(gender, height);
}

// URLのクエリパラメータを更新する関数
function updateURL(gender, height) {
  const newURL = window.location.protocol + "//" + window.location.host + window.location.pathname + `?gender=${gender}&height=${height}`;
  window.history.pushState({path: newURL}, '', newURL);
}

// 両方が選択されていれば画像表示を更新する
function handleSelection() {
  if (selectedGender && selectedHeight) {
    updateImages(selectedGender, selectedHeight);
  }
}

// 性別ボタンのイベントリスナー
document.querySelectorAll('#genderContainer .button-group button').forEach(button => {
  button.addEventListener('click', () => {
    // 選択状態をリセット
    document.querySelectorAll('#genderContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedGender = button.getAttribute('data-gender');
    handleSelection();
  });
});

// 身長ボタンのイベントリスナー
document.querySelectorAll('#heightContainer .button-group button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#heightContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedHeight = button.getAttribute('data-height');
    handleSelection();
  });
});

// ページ読み込み時にURLパラメータから選択状態を復元
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get('gender');
  const height = params.get('height');
  if (gender) {
    selectedGender = gender;
    const genderBtn = document.querySelector(`#genderContainer button[data-gender="${gender}"]`);
    if (genderBtn) genderBtn.classList.add('selected');
  }
  if (height) {
    selectedHeight = height;
    const heightBtn = document.querySelector(`#heightContainer button[data-height="${height}"]`);
    if (heightBtn) heightBtn.classList.add('selected');
  }
  if (selectedGender && selectedHeight) {
    updateImages(selectedGender, selectedHeight);
  }
});

// モーダルを開く関数
function openModal(gender, height, index) {
  currentGender = gender;
  currentHeight = height;
  currentIndex = index;
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = `images/${gender}/${height}/${sizes[index]}_${height}.png`;
  modalImg.alt = `${height}cm ${sizes[index]} (${gender})`;
  modal.style.display = 'block';
}

// モーダルを閉じる関数
function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

// モーダル内画像更新関数
function updateModalImage() {
  const modalImg = document.getElementById('modalImg');
  modalImg.src = `images/${currentGender}/${currentHeight}/${sizes[currentIndex]}_${currentHeight}.png`;
  modalImg.alt = `${currentHeight}cm ${sizes[currentIndex]} (${currentGender})`;
}

// 前の画像を表示する関数
function showPrev() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = sizes.length - 1; // 最後にループ
  }
  updateModalImage();
}

// 次の画像を表示する関数
function showNext() {
  if (currentIndex < sizes.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // 最初にループ
  }
  updateModalImage();
}

// モーダルの閉じるボタンのイベント
document.getElementById('closeModal').addEventListener('click', closeModal);

// モーダルのナビゲーションボタンのイベント
document.getElementById('prevBtn').addEventListener('click', showPrev);
document.getElementById('nextBtn').addEventListener('click', showNext);

// モーダル外クリックで閉じる
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});
