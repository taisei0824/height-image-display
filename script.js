// =============================================
// 身長オプション
// 身長を追加・変更する場合はここを編集
// =============================================
const heightOptions = {
  male: {
    tshirt: ['165', '169', '173', '179'],
    longT: [],
    sweat: []
  },
  female: {
    tshirt: ['157', '162', '166'],
    longT: [],
    sweat: ['157']
  }
};

// =============================================
// サイズの配列
// サイズを変更する場合はここを編集
// =============================================
const sizes = ['S', 'M', 'L', 'XL'];

// =============================================
// 状態管理
// =============================================
let selectedGender = null;
let selectedGarment = null;
let selectedHeight = null;
let selectedUnitedIndices = [];
let selectedGildanIndices = [];
let selectedOrder = [];
let modalImages = [];
let modalCurrentIndex = 0;

// =============================================
// 性別選択
// =============================================
document.querySelectorAll('input[name="gender"]').forEach(radio => {
  radio.addEventListener('change', () => {
    selectedGender = radio.value;

    // アイテム選択を表示・リセット
    document.getElementById('garmentContainer').style.display = 'block';
    document.querySelectorAll('input[name="garment"]').forEach(r => r.checked = false);
    selectedGarment = null;

    // 以降をリセット
    document.getElementById('heightContainer').style.display = 'none';
    document.getElementById('heightButtons').innerHTML = '';
    document.getElementById('brandContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    clearSizeSelections();
  });
});

// =============================================
// 着用アイテム選択
// =============================================
document.querySelectorAll('input[name="garment"]').forEach(radio => {
  radio.addEventListener('change', () => {
    selectedGarment = radio.value;

    const heights = heightOptions[selectedGender]?.[selectedGarment] ?? [];

    if (heights.length > 0) {
      document.getElementById('heightContainer').style.display = 'block';
      buildHeightButtons(heights);
    } else {
      document.getElementById('heightContainer').style.display = 'none';
      document.getElementById('heightButtons').innerHTML = '';
    }

    // 以降をリセット
    document.getElementById('brandContainer').style.display = 'none';
    document.getElementById('comparisonContainer').style.display = 'none';
    clearSizeSelections();

    scrollToElement('heightContainer');
  });
});

// =============================================
// 身長ボタンを動的に生成
// =============================================
function buildHeightButtons(heights) {
  const container = document.getElementById('heightButtons');
  container.innerHTML = '';

  heights.forEach(height => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.textContent = `${height}cm`;
    btn.dataset.height = height;

    btn.addEventListener('click', () => {
      document.querySelectorAll('#heightButtons .size-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedHeight = height;

      document.getElementById('brandContainer').style.display = 'block';
      document.getElementById('comparisonContainer').style.display = 'none';
      clearSizeSelections();
      buildBrandButtons();

      scrollToElement('brandContainer');
    });

    container.appendChild(btn);
  });
}

// =============================================
// ブランド別サイズボタンを生成
// =============================================
function buildBrandButtons() {
  buildSizeButtons('unitedAthleButtons', 'UnitedAthle', selectedUnitedIndices);
  buildSizeButtons('gildanButtons', 'GILDAN', selectedGildanIndices);
}

function buildSizeButtons(containerId, brand, selectedIndices) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  sizes.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.textContent = size;

    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        if (brand === 'UnitedAthle') {
          selectedUnitedIndices = selectedUnitedIndices.filter(i => i !== index);
        } else {
          selectedGildanIndices = selectedGildanIndices.filter(i => i !== index);
        }
      } else {
        const total = selectedUnitedIndices.length + selectedGildanIndices.length;
        if (total >= 2) {
          clearSizeSelections();
        }
        btn.classList.add('selected');
        if (brand === 'UnitedAthle') {
          selectedUnitedIndices.push(index);
        } else {
          selectedGildanIndices.push(index);
        }
      }

      updateSelectedOrder();
      updateComparison();
    });

    container.appendChild(btn);
  });
}

// =============================================
// サイズ選択をすべてクリア
// =============================================
function clearSizeSelections() {
  document.querySelectorAll('#unitedAthleButtons .size-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('#gildanButtons .size-btn').forEach(btn => btn.classList.remove('selected'));
  selectedUnitedIndices = [];
  selectedGildanIndices = [];
  selectedOrder = [];
}

// =============================================
// 選択ブランド順序を更新
// =============================================
function updateSelectedOrder() {
  selectedOrder = [];
  if (selectedUnitedIndices.length > 0) selectedOrder.push('UnitedAthle');
  if (selectedGildanIndices.length > 0) selectedOrder.push('GILDAN');
}

// =============================================
// 画像拡張子を解決（.png / .PNG）
// =============================================
async function resolveImagePath(basePath) {
  const pngPath = basePath + '.png';
  try {
    const res = await fetch(pngPath, { method: 'HEAD' });
    if (res.ok) return pngPath;
  } catch (e) {}
  return basePath + '.PNG';
}

// =============================================
// 比較画像を更新
// =============================================
async function updateComparison() {
  const compContainer = document.getElementById('comparisonContainer');
  const imageContainer = document.getElementById('comparisonImages');
  imageContainer.innerHTML = '';
  modalImages = [];

  const promises = [];

  selectedOrder.forEach(brand => {
    const indices = brand === 'UnitedAthle' ? selectedUnitedIndices : selectedGildanIndices;
    indices.forEach(i => {
      const base = `images/${brand}/${selectedGender}/${selectedGarment}/${selectedHeight}/${sizes[i]}_${selectedHeight}`;
      const alt = `${selectedHeight}cm ${sizes[i]} (${brand})`;
      promises.push(resolveImagePath(base).then(src => ({ src, alt })));
    });
  });

  modalImages = await Promise.all(promises);

  if (modalImages.length > 0) {
    compContainer.style.display = 'block';
    modalImages.forEach((imgInfo, idx) => {
      const img = document.createElement('img');
      img.src = imgInfo.src;
      img.alt = imgInfo.alt;
      img.addEventListener('click', () => {
        modalCurrentIndex = idx;
        openModal();
      });
      imageContainer.appendChild(img);
    });
  } else {
    compContainer.style.display = 'none';
  }
}

// =============================================
// モーダル
// =============================================
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

document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('prevBtn').addEventListener('click', () => {
  modalCurrentIndex = (modalCurrentIndex - 1 + modalImages.length) % modalImages.length;
  updateModalImage();
});

document.getElementById('nextBtn').addEventListener('click', () => {
  modalCurrentIndex = (modalCurrentIndex + 1) % modalImages.length;
  updateModalImage();
});

window.addEventListener('click', (event) => {
  if (event.target === document.getElementById('modal')) closeModal();
});

// =============================================
// スムーズスクロール
// =============================================
function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) {
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

// =============================================
// ナビゲーションボタン
// =============================================
document.getElementById('homeButton').addEventListener('click', () => {
  window.location.href = 'https://d1nvne-if.myshopify.com/collections/商品';
});

// =============================================
// URLパラメータからの復元
// =============================================
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const gender = params.get('gender');
  const garment = params.get('garment');
  const height = params.get('height');

  if (gender) {
    const radio = document.querySelector(`input[name="gender"][value="${gender}"]`);
    if (radio) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  }
  if (garment) {
    const radio = document.querySelector(`input[name="garment"][value="${garment}"]`);
    if (radio && !radio.disabled) {
      radio.checked = true;
      radio.dispatchEvent(new Event('change'));
    }
  }
  if (height) {
    setTimeout(() => {
      const btn = document.querySelector(`#heightButtons .size-btn[data-height="${height}"]`);
      if (btn) btn.click();
    }, 100);
  }
});
