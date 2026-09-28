// ==========================================================================
// 🛒 منظومة سلة المشتريات الملوكية والذاكرة المحلية
// ==========================================================================

// 1. جلب المنتجات المخزنة سابقاً في الذاكرة، أو إنشاء مصفوفة فارغة
let cart = JSON.parse(localStorage.getItem("ultimo_cart")) || [];

// دالة لتحديث العداد الفوشيا في الترويسة
function updateCartCount() {
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }
}

// تشغيل دالة تحديث العداد فور تحميل الصفحة
updateCartCount();

// 2. الإمساك بجميع أزرار الإضافة والتصنت عليها
const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const productCard = this.closest(".product-card");
    if (!productCard) return;

    const productNameElement = productCard.querySelector(".product-info h4");
    const productPriceElement = productCard.querySelector(".product-price");
    const productImageElement = productCard.querySelector(
      ".image-container img",
    );

    if (!productNameElement || !productPriceElement || !productImageElement) {
      console.error("خطأ: لم يتم العثور على عناصر المنتج الداخلية.");
      return;
    }

    const productName = productNameElement.textContent.trim();
    const productPrice = productPriceElement.textContent
      .replace(/\\/g, "")
      .trim();
    const productImage = productImageElement.getAttribute("src");

    // 🌟 سحب المقاس من الكارت (إن وُجد في صفحة النساء) أو وضع "-" كافتراضي للصفحة الرئيسية
    const productSize = productCard.getAttribute("data-size") || "-";

    const product = {
      id: Date.now() + Math.random(),
      name: productName,
      price: productPrice,
      image: productImage,
      size: productSize, // 🌟 حفظ المقاس الجديد في الذاكرة
    };

    cart.push(product);
    localStorage.setItem("ultimo_cart", JSON.stringify(cart));
    updateCartCount();

    alert(`تم إضافة "${productName}" إلى سلة المشتريات بنجاح! 🎉`);
  });
});

// ==========================================================================
// 🔍 منظومة شريط البحث الذكي والفوري للمتجر
// ==========================================================================

// 1. الإمساك بنموذج البحث وحقل الإدخال النصي
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector('.search-form input[type="text"]');

// نتحقق أولاً من وجود شريط البحث في الصفحة لمنع حدوث أخطاء في الصفحات التي لا تحتوي عليه
if (searchForm && searchInput) {
  // دالة لتنفيذ عملية الفلترة والبحث
  function performSearch() {
    // تحويل الكلمة المكتوبة إلى حروف صغيرة ومسح المسافات الجانبية لضمان دقة الفحص
    const query = searchInput.value.toLowerCase().trim();

    // الإمساك بجميع بطاقات المنتجات المتوفرة في الشبكة الحالية
    const productCards = document.querySelectorAll(".product-card");

    productCards.forEach((card) => {
      // جلب اسم المنتج الداخلي وتحويله لنفس الصيغة
      const productName = card
        .querySelector(".product-info h4")
        .textContent.toLowerCase();

      // الـ Magic هنا: فحص ما إذا كان اسم المنتج يتضمن الكلمة المفتاحية المكتوبة
      if (productName.includes(query)) {
        card.style.display = "block"; // إظهار المنتج إذا كان مطابقاً للبحث
      } else {
        card.style.display = "none"; // إخفاء المنتج تماماً إذا كان غير مطابق
      }
    });
  }

  // أ) منع النموذج من إعادة تحميل الصفحة عند الضغط على زر العدسة 🔍 أو زر Enter
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault(); // إيقاف السلوك الافتراضي للمتصفح
    performSearch(); // تنفيذ البحث فوراً
  });

  // ب) ✨ ميزة إضافية فائقة الفخامة: البحث الفوري أثناء الكتابة (Live Search)
  // بمجرد أن يبدأ الزبون بطباعة أي حرف، ستتفلتر المنتجات أمام عينه مباشرة دون الحاجة لضغط الزر
  searchInput.addEventListener("input", performSearch);
}

// ==========================================================================
// 3. نظام تصفية المنتجات الذكي (Filtering) في صفحة النساء (women.html)
// ==========================================================================

// الإمساك بعناصر القائمة الجانبية ومربعات المقاسات
const categoryLinks = document.querySelectorAll(".shop-layout aside ul li");
const sizeCheckboxes = document.querySelectorAll(
  '.size-filter input[type="checkbox"]',
);

// متغير لحفظ الفئة المختارة حالياً (الافتراضي هو "الكل" أو غير محدد)
let selectedCategory = "الكل";

if (categoryLinks.length > 0 || sizeCheckboxes.length > 0) {
  // أ) التصنت على ضغط عناصر قائمة الفئات الجانبية
  categoryLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // إعادة مظهر جميع الروابط للوضع الطبيعي وتلوين الرابط النشط فقط باللّون الفوشيا
      categoryLinks.forEach((l) => {
        l.style.background = "none";
        l.style.color = "#2d2d2d";
      });
      this.style.background = "#e02b7f";
      this.style.color = "#ffffff";

      // تخزين اسم الفئة المكبوسة وتشغيل الفلتر
      selectedCategory = this.textContent.trim();
      filterProducts();
    });
  });

  // ب) التصنت على تغيير حالة مربعات اختيار المقاسات (Checkboxes)
  sizeCheckboxes.forEach((box) => {
    box.addEventListener("change", filterProducts);
  });

  // ج) الدالة المركزية لفلترة وإخفاء/إظهار المنتجات بناءً على الشروط
  function filterProducts() {
    const cards = document.querySelectorAll(
      ".shop-layout section .product-card",
    );

    // تجميع كل المقاسات التي وضع الزبون عليها علامة صح في مصفوفة
    let activeSizes = [];
    sizeCheckboxes.forEach((box) => {
      if (box.checked) activeSizes.push(box.value);
    });

    cards.forEach((card) => {
      // قراءة الخصائص المعرفة في الـ HTML لكل كرت منتج
      const cardCategory = card.getAttribute("data-category");
      const cardSize = card.getAttribute("data-size");

      // فحص شرط الفئة: هل هي "الكل" أم تطابق فئة الكرت؟
      const matchCategory =
        selectedCategory === "الكل" || cardCategory === selectedCategory;

      // فحص شرط المقاس: هل السلة فارغة (لم يختر مقاس) أم مقاس الكرت مطلوب؟
      const matchSize =
        activeSizes.length === 0 || activeSizes.includes(cardSize);

      // النتيجة: إذا تحقق الشرطان معاً يظهر المنتج، وإلا يختفي تماماً
      if (matchCategory && matchSize) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }
}

// ==========================================================================
// 4. تفعيل أزرار قائمة الأمنيات (التفاعل اللمسي للقلب) - المطور والملون
// ==========================================================================

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

wishlistButtons.forEach((button) => {
  button.addEventListener("click", function () {
    this.classList.toggle("active");

    if (this.classList.contains("active")) {
      this.style.color = "#e02b7f"; // تلوين القلب باللون الفوشيا الفخم للمتجر
      this.style.transform = "scale(1.2)"; // عمل تأثير تكبير خفيف وممتع بصرياً للزبون
      alert("تم الإضافة إلى قائمة الأمنيات المفضلة ❤️");
    } else {
      this.style.color = "#2d2d2d"; // إعادة اللون الداكن الافتراضي للمتجر عند الإلغاء
      this.style.transform = "scale(1)"; // إعادة الحجم الطبيعي للقلب
      alert("تم الإزالة من قائمة الأمنيات");
    }
  });
});
