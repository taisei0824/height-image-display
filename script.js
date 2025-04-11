// サイズの配列
const sizes = ['S', 'M', 'L', 'XL'];
const heightOptions = {
  male: {
    tshirt: ['165', '173'],
    sweat: ['170', '179']
  },
  female: {
    sweat: ['157']
  }
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
    // 性別ボタンの選択状態を更新
    document.querySelectorAll('#genderContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    selectedGender = button.getAttribute('data-gender');

    // ガーメント（着用アイテム）選択エリアを表示しつつリセット
    document.getElementById('garmentContainer').style.display = 'block';
    document.querySelectorAll('#garmentContainer .button-group button').forEach(btn => btn.classList.remove('selected'));
    selectedGarment = null;
    
    // 身長選択状態のリセット（身長文字とボタンも消去）
    selectedHeight = null;
    document.getElementById('heightInstruction').style.display = 'none';
    document.getElementById('heightButtons').innerHTML = '';

    // 比較・ブランド選択状態のリセット
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

    // 身長選択：選択された性別・ガーメントに対応する身長があれば表示する
    if (
      selectedGender &&
      selectedGarment &&
      heightOptions[selectedGender] &&
      heightOptions[selectedGender][selectedGarment] &&
      heightOptions[selectedGender][selectedGarment].length > 0
    ) {
      document.getElementById('heightInstruction').style.display = 'block';
      updateHeightButtons();
    } else {
      // 利用可能な身長がなければ非表示
      document.getElementById('heightInstruction').style.display = 'none';
      document.getElementById('heightButtons').innerHTML = '';
    }

    // 身長選択後の比較・ブランド表示をリセット
    document.getElementById('comparePrompt').style.display = 'none';
    document.getElementById('brandContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    clearSizeSelections();
  });
});

// --- 身長ボタンを動的に生成 ---
function updateHeightButtons() {
  const container = document.getElementById('heightButtons');
  container.innerHTML = '';
  if (!selectedGender || !selectedGarment) return;
  const availableHeights = (heightOptions[selectedGender] && heightOptions[selectedGender][selectedGarment]) 
                           ? heightOptions[selectedGender][selectedGarment] 
                           : [];
  availableHeights.forEach(height => {
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
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        selectedUnitedIndices = selectedUnitedIndices.filter(i => i !== index);
      } else {
        let totalSelected = selectedUnitedIndices.length + selectedGildanIndices.length;
        if (totalSelected < 2) {
          btn.classList.add('selected');
          selectedUnitedIndices.push(index);
        } else {
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
        const src = `images/UnitedAthle/${selectedGender}/${selectedGarment}/${selectedHeight}/${sizes[i]}_${selectedHeight}.png`;
        const alt = `${selectedHeight}cm ${sizes[i]} (${brand})`;
        modalImages.push({ src, alt });
      });
    } else if (brand === "GILDAN") {
      selectedGildanIndices.forEach(i => {
        const src = `images/GILDAN/${selectedGender}/${selectedGarment}/${selectedHeight}/${sizes[i]}_${selectedHeight}.png`;
        const alt = `${selectedHeight}cm ${sizes[i]} (${brand})`;
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
  const garment = params.get('garment');
  const height = params.get('height');
  if (gender) {
    selectedGender = gender;
    const genderBtn = document.querySelector(`#genderContainer button[data-gender="${gender}"]`);
    if (genderBtn) genderBtn.classList.add('selected');
    document.getElementById('garmentContainer').style.display = 'block';
  }
  if (garment) {
    selectedGarment = garment;
    const garmentBtn = document.querySelector(`#garmentContainer button[data-garment="${garment}"]`);
    if (garmentBtn) garmentBtn.classList.add('selected');
    if (selectedGender && selectedGarment && heightOptions[selectedGender] && heightOptions[selectedGender][selectedGarment] && heightOptions[selectedGender][selectedGarment].length > 0) {
      document.getElementById('heightInstruction').style.display = 'block';
      updateHeightButtons();
    }
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

// トップページに戻るボタンの処理
document.getElementById('homeButton').addEventListener('click', function() {
  window.location.href = 'https://kawarimono.kawaiishop.jp/';
});

// 戻るボタンのクリックイベント
document.getElementById('backButton').addEventListener('click', function() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // 履歴が無い場合のフォールバックとして指定の URL に遷移させる場合
    window.location.href = 'https://kawarimono.kawaiishop.jp/'; 
  }
});
