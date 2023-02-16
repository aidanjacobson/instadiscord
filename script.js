window.onload = async function() {
    hideAll();
    if (isLoggedIn()) {
        if (!(localStorage.name && localStorage.name != "")) {
            await getName();
            location.reload();
        }
        if (decryptAccessToken()) {
            main();
        } else {
            logout();
        }
    } else {
        await doLogin();
    }
}

var encrypted_access_token = "U2FsdGVkX1/GipoKK0xFuMIfMK0Xmk/ISLmvGtTB+z5Rhi7af5ug4mxghGm21fNuZytN1A1CNeNRz4I4YV/FuPzDbMMBX8mKXF7Xq1meEIiF9nfUNr0CJU45RHm2ghzbeEIYADW9G23WuGOYAYRNQpvMykUafnQLzaONVE5JJNDqySTDQ0JyxjkXh7xQaiLWf9nTKAl83QLw5jB7BGBB9pNUe5RVLO6cXzGuhg/xmvdq9jKt9yDCZcOHIzk41UzNMcR4/mJC6GgAefm9VNfOqw=";
var access_token = "";

function isLoggedIn() {
    return !!localStorage.dpin && localStorage.dpin !='';
}

function decryptAccessToken() {
    try {
        access_token = CryptoJS.AES.decrypt(encrypted_access_token, localStorage.dpin).toString(CryptoJS.enc.Utf8);
        return true;
    } catch(e) {
        return false;
    }
}

function logout() {
    localStorage.removeItem("dpin");
    localStorage.removeItem("name");
    location.reload();
}

async function doLogin() {
    switchTo(passwordInputDiv);
    localStorage.dpin = await passwordEnter();
    location.reload();
}

function hideAll() {
    var hideables = document.getElementsByClassName("hideable");
    for (var i = 0; i < hideables.length; i++) {
        hideables[i].hide();
    }
}

function switchTo(element) {
    hideAll();
    element.show();
}

HTMLElement.prototype.hide = function() {
    this.setAttribute("hidden", true)
}

HTMLElement.prototype.show = function() {
    this.removeAttribute("hidden");
}

function passwordEnter() {
    passwordInput.focus();
    passwordInput.value = "";
    return new Promise(function(resolve) {
        passwordInput.onchange = function() {
            resolve(passwordInput.value);
        }
    })
}

function getName() {
    switchTo(nameInputDiv);
    if (localStorage.name && localStorage.name != "") {
        return localStorage.name;
    } else {
        nameInput.value = "";
        nameInput.focus();
        return new Promise(function(resolve) {
            nameInput.onchange = function() {
                localStorage.name = nameInput.value;
                resolve(localStorage.name);
            }
        });
    }
}

function main() {
    switchTo(output);
    var params = new URLSearchParams(location.search);
    if (params.has("text")) log("text: " + params.get("text"));
    if (params.has("title")) log("title: " + params.get("title"));
    if (params.has("url")) log("url: " + params.get("url"));
}

function log(x) {
    console.log(x);
    output.innerHTML += x + "<br>";
}