import {
    enviroments,
    EnviromentSprites
} from "../scripts/EnviromentSprites.js";

var currentSelectedElement = null,
    currentJsonLoadedObject = {},
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
            "ground_ramp_up_left_bottom": ["ground_right"],
            "ground_ramp_up_left": ["ground_right", "ground"],
            "ground_small_left": ["ground_small", "ground_small_right"],
            "ground_small": ["ground_small", "ground_small_right"],
            "ground_small_right": ["ground_left"],
            "water_top": ["water_top", "ground_left", "ground_small_left"],
        }
    },
    possibleUpGroundEnviroment = {
        default: {
            "ground": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone", "decorative_tree_1", "decorative_tree_2", "decorative_tree_3", "decorative_crate"],
            "ground_left": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone",],
            "ground_right": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone",],
            "ground_mid_left": ["ground_left"],
            "ground_mid": ["ground"],
            "ground_mid_right": ["ground_right"],
            "ground_ramp_up_right": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone", "decorative_tree_1", "decorative_tree_2", "decorative_tree_3"],
            "ground_ramp_up_right_bottom": ["ground_left"],
            "ground_ramp_up_left_bottom": ["ground_right"],
            "ground_ramp_up_left": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone", "decorative_tree_1", "decorative_tree_2", "decorative_tree_3"],
            "ground_small_left": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone",],
            "ground_small": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone", "decorative_tree_1", "decorative_tree_2", "decorative_tree_3"],
            "ground_small_right": ["decorative_bush_1", "decorative_bush_2", "decorative_bush_3", "decorative_bush_4", "decorative_mushroom_1", "decorative_mushroom_2", "decorative_stone",],
            "water_top": [],
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

    $("#showhelp").click(function () { 
        modal("help");
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
            id = parseInt(String(Math.random()).split(".").pop()) + (new Date()).getTime();
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

const functions = {
    help: function () {
        modal('help');
    },
    fixTilePosition: function () {
        currentSelectedElement = currentSelectedElement.clone();
        currentSelectedElement.removeAttr('id');
    },
    deleteSelectedTile: function () {
        currentPositionedElement.remove();
        currentSelectedElement = null;
    },
    generateJson: function () {
        let finalObj = {};
        $(".positioned").each(function () {
            let tileName = $(this).data('tile-name'),
                tileType = $(this).data('tile-type'),
                position = tilesPositions[$(this).attr('id')];
            finalObj[tileType] = finalObj[tileType] || {};
            finalObj[tileType][tileName] = finalObj[tileType][tileName] || [];
            finalObj[tileType][tileName].push(position);
        });

        finalObj.crystal = currentJsonLoadedObject.crystal || {
            "key": "crystal",
            "repeat": 150,
            "setXY": {
                "x": 12,
                "y": 0,
                "stepX": 70
            }
        };
        
        finalObj.enemies = currentJsonLoadedObject.enemies || {};

        let finalJson = JSON.stringify(finalObj, null, 4);
        currentJsonLoadedObject = finalObj;
        $("#finaljson").val(finalJson);
    },
    clearCursor: function () {
        currentSelectedElement = null;
    },
    moveTileUp: function () {
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
    moveTileDown: function () {
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
    moveTileLeft: function () {
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
    moveTileRight: function () {
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
    loadJson: function () {
        $("#level").html("");
        try {
            let json = $("#finaljson").val(),
                object = JSON.parse(json);
            currentJsonLoadedObject = object;

            let countTiles = 1;

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

                        let id = countTiles++;

                        $insertTile.attr('data-pos', JSON.stringify(position));
                        $insertTile.attr('id', id);
                        
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
    generateFlatFloor: function () {
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
    generateFromSeed: function () {
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
            possibleNextGround = possibleNextGroundEnviroment[$("#enviroment").val()],
            possibleUpGround = possibleUpGroundEnviroment[$("#enviroment").val()];

        do {
            currentArray = possibleNextGround[currentPosition];
            object.platforms[currentPosition] = object.platforms[currentPosition] || [];
            object.platforms[currentPosition].push(Object.assign({}, defaultPosition));
            defaultPosition.x += $masterTile.width();
            let index = getNElement(arr, count);
            currentPosition = getNElement(currentArray, index);
            count++;
            $masterTile = $(`.${currentPosition}`).not('.positioned').first();
            
            let aboveGround = getNElement(possibleUpGround[currentPosition], index);
            if (aboveGround) {
                let $aboveGroundElement = $(`.${aboveGround}`).not('.positioned').first(),
                    aboveGroundElementType = $aboveGroundElement.data('tile-type'),
                    aboveGroundElementHeigth = $aboveGroundElement.height();
                
                let aboveGroundTilePositionX = defaultPosition.x,
                    aboveGroundTilePositionY = defaultPosition.y - aboveGroundElementHeigth * (aboveGroundElementType === "decoratives" ? 1.5 : 1);
                
                object[aboveGroundElementType] = object[aboveGroundElementType] || {};
                object[aboveGroundElementType][aboveGround] = object[aboveGroundElementType][aboveGround] || [];
                object[aboveGroundElementType][aboveGround].push({ x: aboveGroundTilePositionX, y: aboveGroundTilePositionY });
            }
            
        } while (defaultPosition.x < $("#level").width());

        $('#finaljson').val(JSON.stringify(object, null, 4));
        $("#currentseed").val(string);
        functions.loadJson();
    }
};

const keyBindigs = event => {
    let key = event.key,
        actions = {
            'h': functions.help,
            'r': functions.fixTilePosition,
            'x': functions.deleteSelectedTile,
            'g': functions.generateJson,
            'Alt': function () {
                return true;
            },
            'c': functions.clearCursor,
            '8': functions.moveTileUp,
            '2': functions.moveTileDown,
            '4': functions.moveTileLeft,
            '6': functions.moveTileRight,
            'l': functions.loadJson,
            'n': functions.generateFlatFloor,
            'y': functions.generateFromSeed
        },
        callback = (actions[key] || actions['h']).bind(functions);
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

setInterval(() => {
    $(".current-selected-element").removeClass("current-selected-element");
    if (!currentSelectedElement) {
        return;
    }
    currentSelectedElement.addClass("current-selected-element");
}, 200);
