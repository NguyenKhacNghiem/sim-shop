let deletedSimCode;

function showDeleteModal(code) {
    let deletedSim = document.getElementById("deletedSim");
    deletedSimCode = code;

    deletedSim.innerHTML = "Xác nhận xóa sim <b>" + deletedSimCode + "</b> khỏi giỏ hàng?";
    $("#myModal").modal("show");
}

function deleteFromCart() {
    fetch("/cart", {
        method: "delete",
        body: new URLSearchParams({
            simCode: deletedSimCode
        })
    })
    .then(response => response.json())
    .then(json => {
        alert(json.message);

        setTimeout(() => {
            location.reload();
        }, 500)
    })
}

function pay(total) {
    fetch("/pay", {
        method: "post",
        body: new URLSearchParams({
            total: total
        })
    })
    .then(response => response.json())
    .then(json => {
        alert(json.message);
        window.location.href = "/"
    });
}