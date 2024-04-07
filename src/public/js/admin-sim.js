let code = document.getElementById("code");
let price = document.getElementById("price");
let selectionFee = document.getElementById("selectionFee");
let type = document.getElementById("type");
let provider = document.getElementById("provider");

function selectSim(tr, codeValue, priceValue, selectionFeeValue, typeValue, providerValue) {
    // Chọn 1 row thì check vào radio button tương ứng
    let lastTd = tr.children[6];
    let radioButton = lastTd.children[0].children[0];
    radioButton.checked = true;

    // Chọn 1 row thì thay đổi trạng thái của 3 button thêm, sửa, xóa
    $("#btn-add").attr("disabled", true);
    $("#btn-edit").attr("disabled", false);
    $("#btn-delete").attr("disabled", false);
    $("#code").attr("disabled", true);

    // Chọn 1 row thì hiển thị thông tin tương ứng lên các thẻ input
    code.value = codeValue;
    price.value = priceValue;
    selectionFee.value = selectionFeeValue;
    type.value = typeValue;
    provider.value = providerValue;
}

function addSim() {
    fetch("/admin/sim", {
        method: "post",
        body: new URLSearchParams({
            code: code.value, 
            price: price.value, 
            selectionFee: selectionFee.value, 
            type: type.value, 
            provider: provider.value
        })
    })
    .then(response => response.json())
    .then(json => {
        if (json.status) {
            $("#alert-success").html('<i class="fa-solid fa-circle-check"></i> ' + json.message)
            $("#alert-success").fadeIn(1000)
            $("#alert-success").fadeOut(1500)

            setTimeout(() => {
                reset();
            }, 2500)
        }
        else {
            $("#alert-error").html('<i class="fa-solid fa-circle-exclamation"></i> ' + json.message)
            $("#alert-error").fadeIn(1000)
            $("#alert-error").fadeOut(1500)
        } 
    })
}

function editSim() {
    fetch("/admin/sim", {
        method: "put",
        body: new URLSearchParams({
            code: code.value, 
            price: price.value, 
            selectionFee: selectionFee.value, 
            type: type.value, 
            provider: provider.value
        })
    })
    .then(response => response.json())
    .then(json => {
        if (json.status) {
            $("#alert-success").html('<i class="fa-solid fa-circle-check"></i> ' + json.message)
            $("#alert-success").fadeIn(1000)
            $("#alert-success").fadeOut(1500)

            setTimeout(() => {
                reset();
            }, 2500)
        }
        else {
            $("#alert-error").html('<i class="fa-solid fa-circle-exclamation"></i> ' + json.message)
            $("#alert-error").fadeIn(1000)
            $("#alert-error").fadeOut(1500)
        } 
    })
}

function deleteSim() {
    fetch("/admin/sim", {
        method: "delete",
        body: new URLSearchParams({
            code: code.value, 
        })
    })
    .then(response => response.json())
    .then(json => {
        $("#alert-success").html('<i class="fa-solid fa-circle-check"></i> ' + json.message)
        $("#alert-success").fadeIn(1000)
        $("#alert-success").fadeOut(1500)

        setTimeout(() => {
            reset();
        }, 2500)
    })
}

function showDeleteModal() {
    let deletedSim = document.getElementById("deletedSim");

    deletedSim.innerHTML = "Xác nhận xóa sim <b>" + code.value + "</b>?";
    $("#myModal").modal("show");
}

function reset() {
    location.reload();
}