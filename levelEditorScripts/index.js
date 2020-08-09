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
    tilesPositions = {};

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

        if (!currentSelectedElement.attr('id')) {
            currentSelectedElement.attr('id', (new Date()).getTime());
        }

        tilesPositions[currentSelectedElement.attr('id')] = positions;

        currentSelectedElement.addClass('positioned');
        currentPositionedElement = currentSelectedElement;
        $(this).append(currentSelectedElement);
    });
});

const makeTilesOptions = (images, selectedEnviroment) => {
    $("#tiles").html('');
    let enviromentPath = images['enviromentPath'],
        imagePaths = images['images'];
    for (let name in imagePaths) {
        let src = imagePaths[name],
            $imgTag = $(`<div class="tileContainer">
                <img src="/assets/images/enviroment${enviromentPath}${src}" 
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
    g: Generate final JSON file to include on the game
    c: Clean the cursor, to stop to insert elements every click
    8: Moves the last clicked tile UP
    2: Moves the last clicked tile DOWN
    4: Moves the last clicked tile LEFT
    6: Moves the last clicked tile RIGHT `);
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
                $("#finaljson").html(JSON.stringify(finalObj, null, 4));
            },
            'Alt': function () {
                return true;
            },
            'c': function () {
                currentSelectedElement = null;
            },
            '8': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.y--;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': position.y,
                    'left': position.x
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            '2': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.y++;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': position.y,
                    'left': position.x
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            '4': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.x--;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': position.y,
                    'left': position.x
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            },
            '6': function () {
                let position = tilesPositions[currentSelectedElement.attr('id')];
                position.x++;
                currentPositionedElement.css({
                    'position': 'absolute',
                    'top': position.y,
                    'left': position.x
                });

                currentPositionedElement.attr('data-pos', JSON.stringify({
                    y: position.y,
                    x: position.x
                }));
            }
        },
        callback = actions[key] || actions['h'];
    callback();
};