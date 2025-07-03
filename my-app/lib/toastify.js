import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export function ShowToast(message, color, onClickCallBack = function () { }) {
    Toastify({
        text: message,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: color,
        },
        onClick: onClickCallBack
    }).showToast();
}

export function ShowError(message){
    Toastify({
        text: message,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "bottom",
        position: "right",
        stopOnFocus: true,
        style: {
            background: 'red',
        },
        onClick: () => {}
    }).showToast();
}