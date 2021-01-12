const ACTIONS = {
    SHOW:  'show',
    CLOSE: 'close',
}

function modal(id, action = ACTIONS.SHOW) {
    // Get the modal
    let modalElement = document.getElementById(id);

    if (ACTIONS.CLOSE == action) { 
        modalElement.style.display = "none";
        return;
    }

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal(id, ACTIONS.CLOSE);
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modalElement) {
            modal(id, ACTIONS.CLOSE);
        }
    }

    modalElement.style.display = "block";
}