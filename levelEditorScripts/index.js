import {
    enviroments,
    EnviromentSprites
} from "../scripts/EnviromentSprites.js";

var currentSelectedElement = null;

$(document).ready(function () {
    const enviroment = new EnviromentSprites(null, enviroments.DEFAULT);

    Object.keys(enviroment.enviromentImages).forEach(item => {
        let $opt = $(`<option value="${item}">${item[0].toUpperCase() + item.split('_').join(' ').slice(1)}</option>`);
        $("#enviroment").append($opt);
    });

    $("#enviroment").change(function () {
        let images = enviroment.enviromentImages[$(this).val()];
        currentSelectedElement = null;
        makeTilesOptions(images);
    });

    $(document).on("click", "img.tile", function () {
        currentSelectedElement = $(this).clone();
    });

    $("#level").click(function () {
        if (!currentSelectedElement) {
            alert("Please select a element before placing it.");
        }
        $(this).append(currentSelectedElement);
    });
});

const makeTilesOptions = images => {
    $("#tiles").html('');
    let enviromentPath = images['enviromentPath'],
        imagePaths = images['images'],
        count = 0;
    for (let name in imagePaths) {
        let src = imagePaths[name],
            $imgTag = $(`<div class="tileContainer">
                <img src="/assets/images/enviroment${enviromentPath}${src}" class="${name} tile"/>
            </div>`);
        $("#tiles").append($imgTag);
        count++;
    }
};