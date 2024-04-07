function showPassword(span) {
    let i = span.childNodes[0];
    let password = document.getElementById("password");
    
    if(i.classList.contains("fa-eye-slash")) {
        i.classList.remove("fa-eye-slash")
        i.classList.add("fa-eye");
        password.type = "text";
    }
    else {
        i.classList.remove("fa-eye")
        i.classList.add("fa-eye-slash");
        password.type = "password";
    }
}

function showRePassword(span) {
    let i = span.childNodes[0];
    let repassword = document.getElementById("repassword");
    
    if(i.classList.contains("fa-eye-slash")) {
        i.classList.remove("fa-eye-slash")
        i.classList.add("fa-eye");
        repassword.type = "text";
    }
    else {
        i.classList.remove("fa-eye")
        i.classList.add("fa-eye-slash");
        repassword.type = "password";
    }
}