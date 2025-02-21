// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];

// 性別ごとの身長オプション（例）
const heightOptions = {
  male: ['157', '165'],
  female: ['150', '160']
};

// 選択状態を保持する変数
let selectedGender = null;
let selectedGarment = null;
let selectedHeight = null;
// 各ブランドで選択されたサイズのインデックス（両ブランド合わせて合計2つまで選択可能）
let selectedUnitedIndices = [];
let selectedGildanIndices = [];
// 選択中のブランド（表示順序用）
let selectedOrder = [];

// モーダル用変数（比較用の画像リスト）
let modalImages = [];
let modalCurrentIndex = 0;

// --- すべてのサイズ選択状態をクリアする ---
function clearSizeSelections() {
  document.querySelectorAll('#unitedAthleButtons button').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('#gildanButtons button').forEach(btn => btn.classList.remove('selected'));
  selectedUnitedIndices = [];
  selectedGildanIndices = [];
  selectedOrder = [];
}

// --- 選択中のブランド順序を更新 ---
function updateSelectedOrder() {
  selectedOrder = [];
  if (selectedUnitedIndices.length > 0) selectedOrder.push("UnitedAthle");
  if (selectedGildanIndices.length > 0) selectedOrder.push("GILDAN");
}

// --- 性別選択 ---
document.querySelectorAll('#genderContainer .button-group button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#genderContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedGender = button.getAttribute('data-gender');

    // ガーメント選択エリアを表示
    document.getElementById('garmentContainer').style.display = 'block';

    // リセット：ガーメント、身長、ブランド選択
    selectedGarment = null;
    selectedHeight = null;
    document.getElementById('heightInstruction').style.display = 'none';
    document.getElementById('comparePrompt').style.display = 'none';
    document.getElementById('brandContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    clearSizeSelections();
  });
});

// --- 着用アイテム（ガーメント）選択 ---
document.querySelectorAll('#garmentContainer .button-group button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('#garmentContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedGarment = button.getAttribute('data-garment');

    // ガーメント選択後、身長選択を表示
    document.getElementById('heightInstruction').style.display = 'block';
    updateHeightButtons();
  });
});

// --- 身長ボタンを動的に生成 ---
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
      document.querySelectorAll('#heightButtons button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedHeight = height;
      // 身長選択後、比較用の見出しとブランドセクションを表示
      document.getElementById('comparePrompt').style.display = 'block';
      document.getElementById('brandContainer').style.display = 'block';
      clearSizeSelections();
      updateBrandButtons();
      document.getElementById('comparisonContainer').style.display = 'none';
    });
    container.appendChild(btn);
  });
}

// --- ブランド別のサイズボタンを生成 ---
function updateBrandButtons() {
  // United Athle
  const uaContainer = document.getElementById('unitedAthleButtons');
  uaContainer.innerHTML = '';
  sizes.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.textContent = size;
    btn.addEventListener('click', () => {
      // 既に選択済みの場合は解除
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedUnitedIndices = selectedUnitedIndices.filter(i => i !== index);
      } else {
        let totalSelected = selectedUnitedIndices.length + selectedGildanIndices.length;
        if (totalSelected < 2) {
          btn.classList.add('selected');
          selectedUnitedIndices.push(index);
        } else {
          // 2つ既に選択されている場合は全体をクリアして新たに選択
          clearSizeSelections();
          btn.classList.add('selected');
          selectedUnitedIndices.push(index);
        }
      }
      updateSelectedOrder();
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
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedGildanIndices = selectedGildanIndices.filter(i => i !== index);
      } else {
        let totalSelected = selectedUnitedIndices.length + selectedGildanIndices.length;
        if (totalSelected < 2) {
          btn.classList.add('selected');
          selectedGildanIndices.push(index);
        } else {
          clearSizeSelections();
          btn.classList.add('selected');
          selectedGildanIndices.push(index);
        }
      }
      updateSelectedOrder();
      updateComparison();
    });
    gContainer.appendChild(btn);
  });
}

// --- 比較表示領域の更新 ---
function updateComparison() {
  const compContainer = document.getElementById('comparisonContainer');
  compContainer.innerHTML = '';
  modalImages = [];
  selectedOrder.forEach(brand => {
    if (brand === "UnitedAthle") {
      selectedUnitedIndices.forEach(i => {
        const src = `images/UnitedAthle/${selectedGender}/${selectedHeight}/${sizes[i]}_${selectedHeight}.png`;
        const alt = `${selectedHeight}cm ${sizes[i]} (United Athle)`;
        modalImages.push({ src, alt });
      });
    } else if (brand === "GILDAN") {
      selectedGildanIndices.forEach(i => {
        const src = `images/GILDAN/${selectedGender}/${selectedHeight}/${sizes[i]}_${selectedHeight}.png`;
        const alt = `${selectedHeight}cm ${sizes[i]} (GILDAN)`;
        modalImages.push({ src, alt });
      });
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

// --- モーダル表示関連 ---
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

window.addEventListener('click', (event) => {
  const modal = document.getElementById('modal');
  if (event.target === modal) {
    closeModal();
  }
});

// --- URLパラメータからの復元（任意） ---
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get('gender');
  const height = params.get('height');
  if (gender) {
    selectedGender = gender;
    const genderBtn = document.querySelector(`#genderContainer button[data-gender="${gender}"]`);
    if (genderBtn) genderBtn.classList.add('selected');
    document.getElementById('garmentContainer').style.display = 'block';
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
