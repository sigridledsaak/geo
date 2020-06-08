
//Opens and closes the drawing info window.
function openDrawingInfo() {
    let infoModal = document.getElementById("infoModal");
    infoModal.style.display = "block";
    let close = document.getElementById("infoClose");
    close.onclick = function () {
        infoModal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target == infoModal) {
            infoModal.style.display = "none";
        }
    };
}

