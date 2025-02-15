// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];

// 性別ごとの身長オプション（例）
const heightOptions = {
  male: ['157', '165'],
  female: ['150', '160']
};

// 選択状態を保持する変数
let selectedGender = null;
let selectedHeight = null;
// 各ブランドで選択されたサイズのインデックス（0～3）
let selectedUnitedIndex = null;
let selectedGildanIndex = null;
// クリックされた順番を記録（例："UnitedAthle", "GILDAN"）
let selectedOrder = [];

// モーダル用変数（比較用の画像リスト）
let modalImages = [];
let modalCurrentIndex = 0;

// --- 性別選択 --- //
document.querySelectorAll('#genderContainer .button-group button').forEach(button => {
  button.addEventListener('click', () => {
    // 性別選択のスタイルリセット
    document.querySelectorAll('#genderContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedGender = button.getAttribute('data-gender');

    // 性別選択後、身長選択の案内文を表示
    document.getElementById('heightInstruction').style.display = 'block';

    // 選択に合わせて身長ボタンを更新
    updateHeightButtons();

    // 以降の選択肢はリセット
    selectedHeight = null;
    document.getElementById('comparePrompt').style.display = 'none';
    document.getElementById('brandContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    // リセット：ブランド選択と順番
    selectedUnitedIndex = null;
    selectedGildanIndex = null;
    selectedOrder = [];
  });
});

// --- 身長ボタンを動的に生成 --- //
function updateHeightButtons() {
  const container = document.getElementById('heightButtons');
  container.innerHTML = '';
  if (!selectedGender) return;
  const heights = heightOptions[selectedGender];
  heights.forEach(height => {
    const btn = document.createElement('button');
    btn.textContent = `${height}cm`;
    btn.setAttribute('data-height', height);
    btn.addEventListener('click', () => {
      // 身長選択のスタイルリセット
      document.querySelectorAll('#heightButtons button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedHeight = height;
      // 身長選択後、比較用の見出しとブランドセクションを表示
      document.getElementById('comparePrompt').style.display = 'block';
      document.getElementById('brandContainer').style.display = 'block';
      // ブランド選択のリセット
      selectedUnitedIndex = null;
      selectedGildanIndex = null;
      selectedOrder = [];
      updateBrandButtons();
      // 比較画像表示は初期状態では非表示
      document.getElementById('comparisonContainer').style.display = 'none';
    });
    container.appendChild(btn);
  });
}

// --- ブランド別のサイズボタンを生成 --- //
function updateBrandButtons() {
  // United Athle
  const uaContainer = document.getElementById('unitedAthleButtons');
  uaContainer.innerHTML = '';
  sizes.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.textContent = size;
    btn.addEventListener('click', () => {
      uaContainer.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedUnitedIndex = index;
      if (!selectedOrder.includes("UnitedAthle")) {
        selectedOrder.push("UnitedAthle");
      }
      updateComparison();
    });
    uaContainer.appendChild(btn);
  });
  
  // GILDAN
  const gContainer = document.getElementById('gildanButtons');
  gContainer.innerHTML = '';
  sizes.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.textContent = size;
    btn.addEventListener('click', () => {
      gContainer.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedGildanIndex = index;
      if (!selectedOrder.includes("GILDAN")) {
        selectedOrder.push("GILDAN");
      }
      updateComparison();
    });
    gContainer.appendChild(btn);
  });
}

// --- 比較表示領域の更新 --- //
function updateComparison() {
  const compContainer = document.getElementById('comparisonContainer');
  compContainer.innerHTML = '';
  
  // 比較用画像の配列を作成
  modalImages = [];
  
  // selectedOrder の順に画像情報を作成
  selectedOrder.forEach(brand => {
    let src = "";
    let alt = "";
    if (brand === "UnitedAthle" && selectedUnitedIndex !== null) {
      src = `images/UnitedAthle/${selectedGender}/${selectedHeight}/${sizes[selectedUnitedIndex]}_${selectedHeight}.png`;
      alt = `${selectedHeight}cm ${sizes[selectedUnitedIndex]} (United Athle)`;
    } else if (brand === "GILDAN" && selectedGildanIndex !== null) {
      src = `images/GILDAN/${selectedGender}/${selectedHeight}/${sizes[selectedGildanIndex]}_${selectedHeight}.png`;
      alt = `${selectedHeight}cm ${sizes[selectedGildanIndex]} (GILDAN)`;
    }
    if (src) {
      modalImages.push({ src, alt });
    }
  });
  
  if (modalImages.length > 0) {
    compContainer.style.display = 'flex';
    modalImages.forEach((imgInfo, idx) => {
      const img = document.createElement('img');
      img.src = imgInfo.src;
      img.alt = imgInfo.alt;
      img.addEventListener('click', () => {
        modalCurrentIndex = idx;
        openModal();
      });
      compContainer.appendChild(img);
    });
  } else {
    compContainer.style.display = 'none';
  }
}

// --- モーダル表示関連 --- //
function openModal() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modalImg');
  modalImg.src = modalImages[modalCurrentIndex].src;
  modalImg.alt = modalImages[modalCurrentIndex].alt;
  modal.style.display = 'block';
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

function updateModalImage() {
  const modalImg = document.getElementById('modalImg');
  modalImg.src = modalImages[modalCurrentIndex].src;
  modalImg.alt = modalImages[modalCurrentIndex].alt;
}

function showPrev() {
  modalCurrentIndex = (modalCurrentIndex - 1 + modalImages.length) % modalImages.length;
  updateModalImage();
}

function showNext() {
  modalCurrentIndex = (modalCurrentIndex + 1) % modalImages.length;
  updateModalImage();
}

document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('prevBtn').addEventListener('click', showPrev);
document.getElementById('nextBtn').addEventListener('click', showNext);

// モーダル外クリックで閉じる
window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});

// --- URLパラメータからの復元（任意） --- //
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get('gender');
  const height = params.get('height');
  if (gender) {
    selectedGender = gender;
    const genderBtn = document.querySelector(`#genderContainer button[data-gender="${gender}"]`);
    if (genderBtn) genderBtn.classList.add('selected');
    // 性別選択後に身長選択の案内文を表示
    document.getElementById('heightInstruction').style.display = 'block';
    updateHeightButtons();
  }
  if (height) {
    selectedHeight = height;
    const heightBtn = document.querySelector(`#heightButtons button[data-height="${height}"]`);
    if (heightBtn) heightBtn.classList.add('selected');
    document.getElementById('comparePrompt').style.display = 'block';
    document.getElementById('brandContainer').style.display = 'block';
    updateBrandButtons();
  }
});
