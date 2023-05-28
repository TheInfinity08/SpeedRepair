$("i").click(function(event){
    $("i").removeClass("color-selected");
    let selectedColor = event.target;
    selectedColor.classList.add("color-selected");
})

$(".add-quantity").click(function () {
    let quantity = document.querySelector(".quantities").value;
    if (Number(quantity)>=1) {
        quantity++;
    }
    document.querySelector(".quantities").value = quantity;
})

$(".remove-quantity").click(function () {
    let quantity = document.querySelector(".quantities").value;
    if (Number(quantity) > 1) {
        quantity--;
    }
    document.querySelector(".quantities").value = quantity;
})

const onlyPositive = () => {
    let quantity = document.querySelector(".quantities").value;
    if (Number(quantity) < 1) {
        document.querySelector(".quantities").value = 1;
    }
}

$(".sizes").click(function (event) {
    const size = event.target.textContent;
    console.log(size);
    size.color = "black";
})

$(".sizes span").click(function (event) {
    $("span").removeClass("size-selected");
    let selectedSize = event.target;
    selectedSize.classList.add("size-selected");
})