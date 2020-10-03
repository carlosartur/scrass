import {
    enviroments,
    EnviromentSprites
} from "../scripts/EnviromentSprites.js";

var currentSelectedElement = null,
    tilesTypes = {
        default: {
            "ninja": "enemies",
            "ground": "platforms",
            "ground_left": "platforms",
            "ground_right": "platforms",
            "ground_mid_left": "platforms",
            "ground_mid": "platforms",
            "ground_mid_right": "platforms",
            "ground_ramp_up_right": "platforms",
            "ground_ramp_up_right_bottom": "platforms",
            "ground_bottom": "platforms",
            "ground_ramp_up_left_bottom": "platforms",
            "ground_ramp_up_left": "platforms",
            "ground_bottom_left": "platforms",
            "ground_small_left": "platforms",
            "ground_small": "platforms",
            "ground_small_right": "platforms",
            "ground_bottom_right": "platforms",
            "decorative_crate": "platforms",
            "water_top": "fluid_ground",
            "water_bottom": "fluid_ground",
            "decorative_bush_1": "decoratives",
            "decorative_bush_2": "decoratives",
            "decorative_bush_3": "decoratives",
            "decorative_bush_4": "decoratives",
            "decorative_mushroom_1": "decoratives",
            "decorative_mushroom_2": "decoratives",
            "decorative_stone": "decoratives",
            "decorative_tree_1": "decoratives",
            "decorative_tree_2": "decoratives",
            "decorative_tree_3": "decoratives"
        }
    },
    currentPositionedElement = null,
    tilesPositions = {},
    possibleNextGroundEnviroment = {
        default: {
            "ground": ["ground_right", "ground", "ground_ramp_up_right"],
            "ground_left": ["ground_right", "ground", "ground_ramp_up_right"],
            "ground_right": ["water_top", "ground_small_left"],
            "ground_mid_left": ["ground_mid", "ground_mid_right"],
            "ground_mid": ["ground_mid", "ground_mid_right", "ground_ramp_up_left_bottom"],
            "ground_mid_right": ["water_top", "ground_small_left"],
            "ground_ramp_up_right": ["ground_ramp_up_right_bottom"],
            "ground_ramp_up_right_bottom": ["ground_ramp_up_left_bottom", "ground_mid"],
            "ground_ramp_up_left_bottom": ["ground_ramp_up_left"],
            "ground_ramp_up_left": ["ground_right", "ground"],
            "ground_small_left": ["ground_small", "ground_small_right"],
            "ground_small": ["ground_small", "ground_small_right"],
            "ground_small_right": ["ground_left"],
            "water_top": ["water_top", "ground_left", "ground_small_left"],
        }
    };

$(document).ready(function () {
    const enviroment = new EnviromentSprites(null, enviroments.DEFAULT);

    Object.keys(enviroment.enviromentImages).forEach(item => {
        let $opt = $(`<option value="${item}">${item[0].toUpperCase() + item.split('_').join(' ').slice(1)}</option>`);
        $("#enviroment").append($opt);
    });

    $("#enviroment").change(function () {
        let images = enviroment.enviromentImages[$(this).val()];
        currentSelectedElement = null;
        tilesPositions = {};
        makeTilesOptions(images, $(this).val());
    });

    $(document).on("click", "img.tile", function () {
        currentSelectedElement = $(this).clone();
    });

    $(document).on("click", "img.positioned", function (event) {
        currentPositionedElement = $(this);
        currentSelectedElement = currentPositionedElement;
        event.stopPropagation();
        return false;
    });

    $(document).keydown(function (event) {
        if (!event.altKey) {
            return true;
        }
        keyBindigs(event);
    });

    $("#level").click(function (event) {
        if (!currentSelectedElement) {
            return true;
        }
        let levelOffset = $(this).offset(),
            relX = event.pageX - levelOffset.left,
            relY = event.pageY - levelOffset.top,
            positions = {
                y: relY,
                x: relX
            };
        currentSelectedElement.css({
            'position': 'absolute',
            'top': relY,
            'left': relX
        });

        currentSelectedElement.attr('data-pos', JSON.stringify(positions));
        let id = currentSelectedElement.attr('id');
        if (!id) {
            id = (new Date()).getTime();
            currentSelectedElement.attr('id', id);
        }
        $(this).append(currentSelectedElement);

        positions.y += $(`#${id}`).height() / 2;
        positions.x += $(`#${id}`).width() / 2;

        tilesPositions[currentSelectedElement.attr('id')] = positions;

        currentSelectedElement.addClass('positioned');
        currentPositionedElement = currentSelectedElement;
    });
});

const makeTilesOptions = (images, selectedEnviroment) => {
    $("#tiles").html('');
    let enviromentPath = images['enviromentPath'],
        imagePaths = images['images'];
    for (let name in imagePaths) {
        let src = imagePaths[name],
            $imgTag = $(`<div class="tileContainer">
                <img src="./assets/images/enviroment${enviromentPath}${src}" 
                    class="${name} tile" 
                    data-tile-name="${name}" 
                    data-tile-type="${tilesTypes[selectedEnviroment][name]}"
                />
            </div>`);
        $("#tiles").append($imgTag);
    }
};

const keyBindigs = event => {
    let key = event.key,
        actions = {
            'h': function () {
                alert(`Help
                    To use this editor, select a enviroment, click on a tile and click on the position it must be on game.
                    Key bindings(ALT+):
                    r: Fix the position of the last inserted tile
                    h: Show this modal again
                    x: Deletes the last clicked tile
                    l: Load or reload stage json
                    y: Generate stage from seed
                    n: Generate generic floor
                    g: Generate final JSON file to include on the game
                    c: Clean the cursor, to stop to insert elements every click
                    k: Moves the last clicked tile UP
                    ,: Moves the last clicked tile DOWN
                    m: Moves the last clicked tile LEFT
                    .: Moves the last clicked tile RIGHT
                    `.split(' '.repeat(20)).join(' '.repeat(4)));
            },
            'r': function () {
                currentSelectedElement = currentSelectedElement.clone();
                currentSelectedElement.removeAttr('id');
            },
            'x': function () {
                currentPositionedElement.remove();
                currentSelectedElement = null;
            },
            'g': function () {
                let finalObj = {};
                $(".positioned").each(function () {
                    let tileName = $(this).data('tile-name'),
                        tileType = $(this).data('tile-type'),
                        position = tilesPositions[$(this).attr('id')];
                    finalObj[tileType] = finalObj[tileType] || {};
                    finalObj[tileType][tileName] = finalObj[tileType][tileName] || [];
                    finalObj[tileType][tileName].push(position);
                });
                $("#finaljson").val(JSON.stringify(finalObj, null, 4));
            },
            'Alt': function () {
                return true;
            },
            'c': function () {
                currentSelectedElement = null;
            },
            'k': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.y--;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': (position.y - (currentPositionedElement.height() / 2)),
                    'left': (position.x - (currentPositionedElement.width() / 2))
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            ',': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.y++;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': (position.y - (currentPositionedElement.height() / 2)),
                    'left': (position.x - (currentPositionedElement.width() / 2))
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            'm': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.x--;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': (position.y - (currentPositionedElement.height() / 2)),
                    'left': (position.x - (currentPositionedElement.width() / 2))
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            '.': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.x++;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': (position.y - (currentPositionedElement.height() / 2)),
                    'left': (position.x - (currentPositionedElement.width() / 2))
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            'l': function () {
                $("#level").html("");
                try {
                    let json = $("#finaljson").val(),
                        object = JSON.parse(json);
                    Object.entries(object).forEach(([typeName, type]) => {
                        if (['crystal', 'enemies'].includes(typeName)) {
                            return true;
                        }
                        Object.entries(type).forEach(([tile, positions]) => {
                            const $masterTile = $(`.${tile}`).not('.positioned').first();
                            positions.forEach(position => {
                                let relX = position.x,
                                    relY = position.y,
                                    $insertTile = $masterTile.clone();
                                $insertTile.css({
                                    'position': 'absolute',
                                    'top': relY - $masterTile.height() / 2,
                                    'left': relX - $masterTile.width() / 2
                                });

                                $insertTile.attr('data-pos', JSON.stringify(position));
                                let id = $insertTile.attr('id');
                                if (!id) {
                                    id = (new Date()).getTime();
                                    $insertTile.attr('id', id);
                                }
                                $insertTile.addClass("positioned");
                                $("#level").append($insertTile);

                                positions.y += $(`#${id}`).height() / 2;
                                positions.x += $(`#${id}`).width() / 2;

                                tilesPositions[$insertTile.attr('id')] = position;
                            });
                        });
                    });
                } catch (error) {
                    alert('error trying to load json data');
                    console.error(error);
                }
            },
            'n': function () {
                let defaultPosition = {
                        y: 538,
                        x: 62
                    },
                    object = {
                        platforms: {
                            ground: []
                        }
                    },
                    $masterTile = $('.ground').not('.positioned').first();
                do {
                    object.platforms.ground.push(Object.assign({}, defaultPosition));
                    defaultPosition.x += $masterTile.width();
                } while (defaultPosition.x < $("#level").width());
                $('#finaljson').val(JSON.stringify(object, null, 4));
                this.l();
            },
            'y': function () {
                let string = $("#currentseed").val() || String(Math.random()).split('.').pop(),
                    defaultPosition = {
                        y: 538,
                        x: 62
                    },
                    object = {
                        platforms: {
                            ground: []
                        }
                    },
                    count = 0,
                    arr = createIntArrayFromString(string, string.length),
                    currentPosition = "ground",
                    currentArray = [],
                    $masterTile = $(`.${currentPosition}`).not('.positioned').first(),
                    possibleNextGround = possibleNextGroundEnviroment[$("#enviroment").val()];

                do {
                    currentArray = possibleNextGround[currentPosition];
                    object.platforms[currentPosition] = object.platforms[currentPosition] || [];
                    object.platforms[currentPosition].push(Object.assign({}, defaultPosition));
                    defaultPosition.x += $masterTile.width();
                    let index = getNElement(arr, count);
                    currentPosition = getNElement(currentArray, index);
                    console.log(currentPosition);
                    count++;
                    $masterTile = $(`.${currentPosition}`).not('.positioned').first();
                } while (defaultPosition.x < $("#level").width());

                $('#finaljson').val(JSON.stringify(object, null, 4));
                $("#currentseed").val(string);
                this.l();
            }
        },
        callback = (actions[key] || actions['h']).bind(actions);
    callback();
};

const createIntArrayFromString = (string, length = 100) => {
    let arr = [],
        i = 0;
    do {
        i++;
        try {
            let char = string[i % string.length].toLowerCase(),
                number = parseInt(char, 36);
            if (isNaN(number)) {
                throw `${char} is not a valid number`;
            }
            arr.push(number);
        } catch (err) {
            console.log(err);
        }
    } while (arr.length < length);
    return arr;
}


const getNElement = (arr, index) => {
    if (!arr.length) {
        return undefined;
    }
    let seed = index + Math.floor(index / arr.length);
    index = (seed % arr.length);
    return arr[index];
}