function selectSim(tr) {
    let lastTd = tr.children[5];
    let radioButton = lastTd.children[0].children[0];

    radioButton.checked = true;
}

let sort = document.getElementById("sort");
let tbody = document.getElementById("tbody");

function sortSim() {
    fetch("/sort?sortType=" + sort.value)
    .then(response => response.json())
    .then(json => {
        tbody.innerHTML = "";

        let sims = json.sims;
        let trs = "";

        sims.forEach(s => {
            trs += `
                <tr onclick="selectSim(this)" style="cursor: pointer;">
                    <td>${s.code}</td>
                    <td>${vietnamesePrice(s.price)}đ</td>
                    <td>${vietnamesePrice(s.selectionFee)}đ</td>
                    <td class="text-${colorSimType(s.type)}">${s.type}</td>
                    <td><img src="/img/${imageSimProvider(s.provider)}" alt="img" width="100px" height="30px"></td>
                    <td>
                        <div class="custom-control custom-radio custom-control-inline">
                            <input type="radio" class="custom-control-input" name="selected-sim" value="${s.code}"
                                id="${s.code}">
                            <label class="custom-control-label" for="${s.code}"></label>
                        </div>
                    </td>
                </tr>
            `
        })

        tbody.innerHTML = trs;
    })
}

function addToCart() {
    let selectedSim = document.querySelector("input[name='selected-sim']:checked");

    if (!selectedSim)
        return alert("Bạn vẫn chưa chọn SIM để thêm vào giỏ hàng");
    
    fetch("/cart", {
        method: "post",
        body: new URLSearchParams({
            simCode: selectedSim.value
        })
    })
    .then(response => response.json())
    .then(json => {
        alert(json.message);
    })
}

function vietnamesePrice(price) {
    return price.toLocaleString('vi-VN');
}

function colorSimType(type) {
    if (type === "Sim tiến lên")
        return "success";
    else if (type === "Sim số đẹp")
        return "primary";
    else if (type === "Sim tứ quý")
        return "danger";
    else
        return "";
}

function imageSimProvider(provider) {
    if (provider === "Mobifone")
        return "img36.png";
    else if (provider === "Viettel")
        return "img37.png";
    else if (provider === "Vinaphone")
        return "img38.png";
    else
        return "img39.png";
}