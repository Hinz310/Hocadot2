/* =========================
   CHO CÁ ĂN
========================= */

const aquarium = document.getElementById("aquarium");
const foodBtn = document.getElementById("foodBtn");

let feedMode = false;
let baitPreview = null;
let bait = null;


/* =========================
   BẬT / TẮT CHẾ ĐỘ CHO ĂN
========================= */

function toggleFeedMode(){

    feedMode = !feedMode;

    if(feedMode){

        foodBtn.classList.add("active");
        foodBtn.innerHTML = "Đang cho cá ăn";

        console.log("Đã bật chế độ cho cá ăn");

    }else{

        foodBtn.classList.remove("active");
        foodBtn.innerHTML = "Cho cá ăn";

        removePreview();

        console.log("Đã tắt chế độ cho cá ăn");
    }
}


/* =========================
   MỒI XEM TRƯỚC
========================= */

function previewBait(e){

    if(!feedMode || bait) return;

    const rect = aquarium.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    if(!baitPreview){

        baitPreview = document.createElement("div");

        baitPreview.className = "bait";

        baitPreview.style.opacity = "0.5";

        aquarium.appendChild(baitPreview);
    }


    baitPreview.style.left = x + "px";
    baitPreview.style.top = y + "px";
}


/* =========================
   THẢ MỒI
========================= */

function dropBait(e){

    if(!feedMode || bait) return;

    const rect = aquarium.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;


    removePreview();


    /* Tạo mồi */

    bait = document.createElement("div");

    bait.className = "bait";

    aquarium.appendChild(bait);


    bait.style.left = x + "px";
    bait.style.top = "20px";


    console.log("Mồi bắt đầu rơi");


    /* Mồi rơi xuống */

    const fall = bait.animate(
        [
            { top:"20px" },
            { top:targetY + "px" }
        ],
        {
            duration:1200,
            easing:"ease-out",
            fill:"forwards"
        }
    );


    fall.onfinish = function(){

        console.log("Mồi đã rơi xuống");

        findFish(x,targetY);
    };
}


/* =========================
   TÌM CÁ GẦN NHẤT
========================= */

function findFish(foodX,foodY){

    const fishes =
        document.querySelectorAll(".fish");


    let nearestFish = null;
    let nearestDistance = Infinity;


    fishes.forEach(fish => {

        const directionBox =
            fish.querySelector(".fish-direction");

        if(!directionBox) return;


        const fishRect =
            directionBox.getBoundingClientRect();

        const aquariumRect =
            aquarium.getBoundingClientRect();


        const fishX =
            fishRect.left -
            aquariumRect.left +
            fishRect.width / 2;


        const fishY =
            fishRect.top -
            aquariumRect.top +
            fishRect.height / 2;


        const distance =
            Math.hypot(
                foodX - fishX,
                foodY - fishY
            );


        if(distance < nearestDistance){

            nearestDistance = distance;

            nearestFish = fish;
        }

    });


    if(nearestFish){

        console.log(
            "Đã tìm thấy cá gần mồi"
        );


        swimToFood(
            nearestFish,
            foodX,
            foodY
        );
    }
}


/* =========================
   CÁ BƠI TỚI MỒI
========================= */

function swimToFood(
    fish,
    foodX,
    foodY
){

    const directionBox =
        fish.querySelector(".fish-direction");


    if(!directionBox){

        console.warn(
            "Không tìm thấy .fish-direction"
        );

        return;
    }


    /* Dừng route CSS */

    fish.style.animationPlayState =
        "paused";


    const aquariumRect =
        aquarium.getBoundingClientRect();


    const fishRect =
        directionBox.getBoundingClientRect();


    /* Vị trí hiện tại */

    const startX =
        fishRect.left -
        aquariumRect.left;


    const startY =
        fishRect.top -
        aquariumRect.top;


    /* Vị trí đích */

    const targetX =
        foodX -
        fishRect.width / 2;


    const targetY =
        foodY -
        fishRect.height / 2;


    const dx =
        targetX -
        startX;


    const dy =
        targetY -
        startY;


    const distance =
        Math.hypot(dx,dy);


    /* =========================
       QUAY ĐẦU NGAY LẬP TỨC
    ========================= */

    const direction =
        dx >= 0 ? 1 : -1;


    directionBox.style.transform =
        `scaleX(${direction})`;


    console.log(
        direction === 1
            ? "Cá quay sang phải"
            : "Cá quay sang trái"
    );


    /* =========================
       TỐC ĐỘ
    ========================= */

    const speed = 0.45;


    const duration =
        Math.max(
            800,
            distance / speed
        );


    const startTime =
        performance.now();


    /* =========================
       BƠI TỚI MỒI
    ========================= */

    function moveToFood(currentTime){

        const elapsed =
            currentTime -
            startTime;


        let progress =
            elapsed / duration;


        progress =
            Math.min(progress,1);


        /* Chuyển động mềm */

        const ease =
            progress *
            (2 - progress);


        const moveX =
            dx * ease;


        const moveY =
            dy * ease;


        directionBox.style.transform =
            `translate(${moveX}px,${moveY}px)
             scaleX(${direction})`;


        if(progress < 1){

            requestAnimationFrame(
                moveToFood
            );

            return;
        }


        console.log(
            "Cá đã tới gần mồi"
        );


        eatBait(
            fish,
            directionBox,
            moveX,
            moveY,
            direction
        );
    }


    requestAnimationFrame(
        moveToFood
    );
}


/* =========================
   CÁ ĂN MỒI
========================= */

function eatBait(
    fish,
    directionBox,
    moveX,
    moveY,
    direction
){

    console.log(
        "Cá đã ăn mồi"
    );


    /* =========================
       MỒI BIẾN MẤT
    ========================= */

    if(bait){

        const eat =
            bait.animate(
                [
                    {
                        transform:
                            "translate(-50%,-50%) scale(1)",
                        opacity:1
                    },

                    {
                        transform:
                            "translate(-50%,-50%) scale(0)",
                        opacity:0
                    }
                ],
                {
                    duration:250,
                    fill:"forwards"
                }
            );


        eat.onfinish = function(){

            if(bait){

                bait.remove();

                bait = null;
            }

        };
    }


    /* =========================
       TRẢ CÁ VỀ ROUTE
    ========================= */

    setTimeout(function(){

        /*
         * Route CSS vẫn đang
         * đứng ở vị trí cũ.
         *
         * Cá đang lệch bởi
         * translate().
         *
         * Ta đưa translate về 0
         * trước khi chạy tiếp.
         */

        const returnMove =
            directionBox.animate(
                [
                    {
                        transform:
                            `translate(${moveX}px,${moveY}px)
                             scaleX(${direction})`
                    },

                    {
                        transform:
                            `translate(0,0)
                             scaleX(${direction})`
                    }
                ],
                {
                    duration:500,
                    easing:"ease-out",
                    fill:"forwards"
                }
            );


        returnMove.onfinish = function(){

            /*
             * Xóa transform tạm thời.
             */

            directionBox.style.transform =
                "";


            /*
             * Cho route CSS chạy tiếp.
             */

            fish.style.animationPlayState =
                "running";


            console.log(
                "Cá tiếp tục bơi theo route"
            );
        };


    },300);
}


/* =========================
   XÓA MỒI XEM TRƯỚC
========================= */

function removePreview(){

    if(baitPreview){

        baitPreview.remove();

        baitPreview = null;
    }
}


/* =========================
   DI CHUỘT TRONG HỒ
========================= */

aquarium.addEventListener(
    "mousemove",
    function(e){

        if(feedMode){

            previewBait(e);
        }
    }
);


/* =========================
   CLICK THẢ MỒI
========================= */

aquarium.addEventListener(
    "click",
    function(e){

        if(feedMode){

            dropBait(e);
        }
    }
);