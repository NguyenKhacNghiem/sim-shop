function addToCart(code) {
    fetch("/cart", {
        method: "post",
        body: new URLSearchParams({
            simCode: code
        })
    })
    .then(response => response.json())
    .then(json => {
        alert(json.message);
    })
}