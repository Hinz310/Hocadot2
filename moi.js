const aquarium = document.getElementById("aquarium");
const foodBtn = document.getElementById("foodBtn");

let feedMode = false;
let baitPreview = null;
let baits = [];


// ================================
// BẬT / TẮT CHẾ ĐỘ CHO CÁ ĂN
// ================================

function toggleFeedMode() {

    feedMode = !feedMode;

    if (feedMode) {
        foodBtn.classList.add("active");
        foodBtn.innerHTML = "🍖 Đang cho cá ăn";

        createPreview();
    } else {
        foodBtn.classList.remove("active");
        foodBtn.innerHTML = "🍖 Cho cá ăn";

        removePreview();
    }
}


// ================================
// TẠO MỒI XEM TRƯỚC
// ================================

function createPreview() {

    if (baitPreview) return;

    baitPreview = document.createElement("div");
    baitPreview.className = "bait-preview";

    aquarium.appendChild(baitPreview);
}


// ================================
// XÓA MỒI XEM TRƯỚC
// ================================

function removePreview() {

    if (baitPreview) {
        baitPreview.remove();
        baitPreview = null;
    }
}


// ================================
// MỒI ĐI THEO CHUỘT
// ================================

aquarium.addEventListener("mousemove", function (event) {

    if (!feedMode || !baitPreview) return;

    const rect = aquarium.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    baitPreview.style.left = x + "px";
    baitPreview.style.top = y + "px";
});


// ================================
// CLICK → THẢ MỒI
// ================================

aquarium.addEventListener("click", function (event) {

    if (!feedMode) return;

    const rect = aquarium.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    createBait(x, y);
});


// ================================
// TẠO MỒI VÀ CHO RƠI XUỐNG
// ================================

function createBait(x, y) {

    const bait = document.createElement("div");

    bait.className = "bait";

    bait.style.left = x + "px";
    bait.style.top = y + "px";

    aquarium.appendChild(bait);

    baits.push(bait);

    // Cho mồi rơi xuống
    dropBait(bait);
}


// ================================
// HIỆU ỨNG MỒI RƠI
// ================================

function dropBait(bait) {

    const aquariumHeight = aquarium.clientHeight;

    // Chiều cao phần cát
    const sandHeight = aquariumHeight * 0.20;

    // Vị trí đáy của mồi
    const bottomPosition =
        aquariumHeight - sandHeight - 20;

    const currentTop = parseFloat(bait.style.top);

    const fallDistance = bottomPosition - currentTop;

    // Nếu click quá thấp thì không cần rơi
    if (fallDistance <= 0) return;

    const duration = Math.max(
        500,
        Math.min(2000, fallDistance * 3)
    );

    bait.style.transition =
        `top ${duration}ms ease-in`;

    bait.style.top =
        bottomPosition + "px";

    // Khi rơi xong
    setTimeout(function () {

        bait.style.transition = "none";

    }, duration);
}


// ================================
// KIỂM TRA CÁ ĂN MỒI
// ================================

function checkFishEat() {

    const fishes = document.querySelectorAll(".fish");

    fishes.forEach(function (fish) {

        const fishRect = fish.getBoundingClientRect();

        const fishX =
            fishRect.left + fishRect.width / 2;

        const fishY =
            fishRect.top + fishRect.height / 2;


        baits.forEach(function (bait, index) {

            const baitRect =
                bait.getBoundingClientRect();

            const baitX =
                baitRect.left + baitRect.width / 2;

            const baitY =
                baitRect.top + baitRect.height / 2;


            const distance = Math.sqrt(
                Math.pow(fishX - baitX, 2) +
                Math.pow(fishY - baitY, 2)
            );


            // Cá đến gần mồi
            if (distance < 100) {

                bait.remove();

                baits.splice(index, 1);

                // Hiệu ứng cá ăn
                fish.classList.add("eating");

                setTimeout(function () {
                    fish.classList.remove("eating");
                }, 500);
            }

        });

    });
}


// ================================
// KIỂM TRA LIÊN TỤC
// ================================

setInterval(checkFishEat, 100);
