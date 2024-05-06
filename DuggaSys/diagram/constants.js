//#region ================================ ENUMS ===============================================

/**
 * @description Keybinds that are used in the system. This is used to generate tooltips and for determining keyboard input logic.
 */
const keybinds = {
    LEFT_CONTROL: {key: "control", ctrl: true},
    ALT: {key: "alt", ctrl: false},
    META: {key: "meta", ctrl: false},
    HISTORY_STEPBACK: {key: "z", ctrl: true},
    HISTORY_STEPFORWARD: {key: "y", ctrl: true},
    DELETE: {key: "delete", ctrl: false},
    ESCAPE: {key: "escape", ctrl: false},
    POINTER: {key: "1", ctrl: false},
    BOX_SELECTION: {key: "2", ctrl: false},
    PLACE_ENTITY: {key: "3", ctrl: false},
    PLACE_RELATION: {key: "4", ctrl: false},
    EDGE_CREATION: {key: "5", ctrl: false},
    STATE_INITIAL: { key: "6" , ctrl: false },
    SEQ_LIFELINE: { key: "7", ctrl: false },
    NOTE_ENTITY: { key: "8", ctrl: false },
    ZOOM_IN: {key: "+", ctrl: true, meta: true},
    ZOOM_OUT: {key: "-", ctrl: true, meta: true},
    ZOOM_RESET: {key: "0", ctrl: true, meta: true},
    TOGGLE_A4: {key: "p", ctrl: false, meta: false},
    TOGGLE_GRID: {key: "g", ctrl: false},
    TOGGLE_RULER: {key: "t", ctrl: false},
    TOGGLE_SNAPGRID: {key: "s", ctrl: false},
    TOGGLE_DARKMODE: {key: "d", ctrl: false},
    CENTER_CAMERA: {key:"home", ctrl: false},
    OPTIONS: {key: "o", ctrl: false},
    ENTER: {key: "enter", ctrl: false},
    COPY: {key: "c", ctrl: true, meta: true},
    PASTE: {key: "v", ctrl: true, meta: true},
    SELECT_ALL: {key: "a", ctrl: true},
    DELETE_B: {key: "backspace", ctrl: false},
    MOVING_OBJECT_UP: {key: "ArrowUp", ctrl: false},
    MOVING_OBJECT_DOWN: {key: "ArrowDown", ctrl: false},
    MOVING_OBJECT_LEFT: {key: "ArrowLeft", ctrl: false},
    MOVING_OBJECT_RIGHT: {key: "ArrowRight", ctrl: false},
    TOGGLE_KEYBINDLIST: {key: "F1", ctrl: false},
    TOGGLE_REPLAY_MODE: {key: "r", ctrl: false},
    TOGGLE_ER_TABLE: {key: "e", ctrl: false},
    TOGGLE_ERROR_CHECK:  {key: "h", ctrl: false},
    SAVE_DIAGRAM: { key: "s", ctrl: true },
    LOAD_DIAGRAM: { key: "l", ctrl: true },
};

/**
 * @description Represents the current input mode the end user is currently in. */
const mouseModes = {
    POINTER: 0,
    BOX_SELECTION: 1,
    PLACING_ELEMENT: 2,
    EDGE_CREATION: 3,
};

/**
 * @description All different types of elements that can be constructed.
 * @see constructElementOfType() For creating elements out dof this enum.
 */
const elementTypes = {
    EREntity: 0,
    ERRelation: 1,
    ERAttr: 2,
    Ghost: 3,
    UMLEntity: 4,
    UMLRelation: 5,
    IEEntity: 6,
    IERelation: 7,
    SDEntity: 8,
    UMLInitialState: 9,
    UMLFinalState: 10,
    UMLSuperState: 11,
    sequenceActor: 12,
    sequenceActivation: 13,
    sequenceLoopOrAlt: 14,
    note: 15,
    sequenceObject: 16,
};

/**
 * @description Same as const elementTypes, but uses their names instead of numbers.
 * @see generateErTableString() For comparing elements with this enum.
 */
const elementTypesNames = {
    EREntity: "EREntity",
    ERRelation: "ERRelation",
    ERAttr: "ERAttr",
    Ghost: "Ghost",
    UMLEntity: "UMLEntity",
    IEEntity: "IEEntity",
    IERelation: "IERelation",
    SDEntity: "SDEntity",
    UMLInitialState: "UMLInitialState",
    UMLFinalState: "UMLFinalState",
    UMLSuperState: "UMLSuperState",
    sequenceActor: "sequenceActor",
    sequenceObject: "sequenceObject",
    sequenceActivation: "sequenceActivation",
    sequenceLoopOrAlt: "sequenceLoopOrAlt",
    note: "Note",
    UMLRelation: "UMLRelation",
}

/**
 * @description Used by the mup and mmoving functions to determine what was clicked in ddown/mdown.
 * @see ddown For mouse down on top of elements.
 */
const pointerStates = {
    DEFAULT: 0,
    CLICKED_CONTAINER: 1,
    CLICKED_ELEMENT: 2,
    CLICKED_NODE: 3,
    CLICKED_LINE: 4,
    CLICKED_LABEL: 5,
};

/**
 * @description Used by the user feedback popup messages to indicate different messages.
 * @see displayMessage() For showing popup messages.
 */
const messageTypes = {
    ERROR: "error",
    WARNING: "warning",
    SUCCESS: "success"
};

/**
 * @description Available types of the attribute element. This will alter how the attribute is drawn onto the screen.
 */
const attrState = {
    NORMAL: "normal",
    PRIMARY: "primary",
    WEAK: "weakKey",
    COMPUTED: "computed",
    MULTIPLE: "multiple",
};

/**
 * @description Available types of entity, ie ER, IE, UML & SD This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const entityType = {
    UML: "UML",
    ER: "ER",
    IE: "IE",
    SD: "SD",
    SE: "SE",
    note: "NOTE",
};

/**
 * @description Available types of the entity element. This will alter how the entity is drawn onto the screen.
 */
const entityState = {
    NORMAL: "normal",
    WEAK: "weak",
};

/**
 * @description Available types of relations, ie ER, IE & UML This affect how the entity is drawn and which menu is displayed   //<-- UML functionality
 */
const relationType = {
    UML: "UML",
    ER: "ER",
    IE: "IE"
};

/**
 * @description Available types of the relation element. This will alter how the relation is drawn onto the screen.
 */
const relationState = {
    NORMAL: "normal",
    WEAK: "weak",
};

/**
 * @description State of inheritance between UML entities. <-- UML functionality
 */
const inheritanceState = {
    DISJOINT: "disjoint",
    OVERLAPPING: "overlapping",
};

/**
 * @description State of inheritance between IE entities. <-- IE functionality
 */
const inheritanceStateIE = {
    DISJOINT: "disjoint",
    OVERLAPPING: "overlapping",
};


/**
 * @description Available types of lines to draw between different elements.
 */
const lineKind = {
    NORMAL: "Normal",
    DOUBLE: "Double",
    DASHED: "Dashed",
    RECURSIVE: "Recursive"
};

/**
 * @description Available options of strings to display next to lines connecting two elements.
 */
const lineCardinalitys = {
    MANY: "N",
    ONE: "1"
};

const lineDirection = {
    UP: 'TB',
    DOWN: 'BT',
    RIGHT: 'RL',
    LEFT: 'LR',
}

/**
 * @description Available options of icons to display at the end of lines connecting two UML elements.
 */
const UMLLineIcons = {//TODO: Replace with actual icons for the dropdown
    ARROW: "Arrow",
    TRIANGLE: "Triangle",
    BLACK_TRIANGLE: "Black_Triangle",
    WHITEDIAMOND: "White_Diamond",
    BLACKDIAMOND: "Black_Diamond",
};

/**
 * @description Available options of icons to display at the end of lines connecting two UML elements.
 */
const IELineIcons = {//TODO: Replace with actual icons for the dropdown
    ZERO_MANY: "0-M",
    ZERO_ONE: "0-1",
    ONE: "1",
    FORCED_ONE: "1!",
    ONE_MANY: "1-M",
    MANY: "M",
    WEAK: "Weak"
};

/**
 * @description Available options of icons to display at the end of lines connecting two SD elements.
 */
const SDLineIcons = {//TODO: Replace with actual icons for the dropdown
    ARROW: "ARROW"
};

/**
 * @description Available options of Line types between two SD elements
 */
const SDLineType = {
    STRAIGHT: "Straight",
    SEGMENT: "Segment"
}

/**
 * @description Polyline [x, y] coordinates of a line icon. For all element pair orientations
 * @type {{BT: number[][], LR: number[][], RL: number[][], TB: number[][]}}
 */
const TRIANGLE = {
    'TB': [[-10, -20], [0, 0], [10, -20], [-10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20], [-10, 20]],
    'LR': [[-20, -10], [0, 0], [-20, 10], [-20, -10]],
    'RL': [[20, -10], [0, 0], [20, 10], [20, -10]]
}
const WEAK_TRIANGLE = {
    'TB': [[-10, -5], [0, -25], [10, -5], [-10, -5]],
    'BT': [[-10, 5], [0, 25], [10, 5], [-10, 5]],
    'LR': [[-5, -10], [-25, 0], [-5, 10], [-5, -10]],
    'RL': [[5, -10], [25, 0], [5, 10], [5, -10]],
}
const DIAMOND = {
    'TB': [[-10, -20], [0, 0], [10, -20], [0, -40], [-10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20], [0, 40], [-10, 20]],
    'RL': [[20, -10], [0, 0], [20, 10], [40, 0], [20, -10]],
    'LR': [[-20, -10], [0, 0], [-20, 10], [-40, 0], [-20, -10]],
}
const MANY = {
    'TB': [[-10, 5], [0, -15], [10, 5]],
    'BT': [[-10, -5], [0, 15], [10, -5]],
    'LR': [[5, -10], [-15, 0], [5, 10]],
    'RL': [[-5, -10], [15, 0], [-5, 10]],
}
const ARROW = {
    'TB': [[-10, -20], [0, 0], [10, -20]],
    'BT': [[-10, 20], [0, 0], [10, 20]],
    'LR': [[-20, -10], [0, 0], [-20, 10]],
    'RL': [[20, -10], [0, 0], [20, 10]]
}
const SD_ARROW = {
    'TB': [[-5, -10], [0, 0], [5, -10], [-5, -10]],
    'BT': [[-5, 10], [0, 0], [5, 10], [-5, 10]],
    'LR': [[-10, -5], [0, 0], [-10, 5], [-10, -5]],
    'RL': [[10, -5], [0, 0], [10, 5], [10, -5]],
}

/**
 *@description Gives x1, y1, x2, y2 position of a line for a line icon. For all element pair orientations
 */
const iconLineDirections = (a, b) => ({
    'TB': [-a, -b, a, -b],
    'BT': [-a, b, a, b],
    'LR': [-b, -a, -b, a],
    'RL': [b, -a, b, a],
});
/**
 *@description Gives x, y coordinates and radius of a cricle for a line icon. For all element pair orientations
 */
const iconCircleDirections = (a) => ({
    'TB': [0, -a, 8],
    'BT': [0, a, 8],
    'LR': [-a, 0, 8],
    'RL': [a, 0, 8],
});

/**
 * @description Coordinates for line icons
 * @type {{BT: (number|*)[], LR: (number|*)[], RL: (*|number)[], TB: (number|*)[]}}
 */
const ONE_LINE = iconLineDirections(10, 10);
const TWO_LINE = iconLineDirections(10, 20);
const CIRCLE = iconCircleDirections(25);

const cursorOffset = new Map([
    [0.25, -15.01],
    [0.5, -3],
    [0.75, -0.775],
    [1.25, 0.36],
    [1.5, 0.555],
    [2, 0.75],
    [4, 0.9375],
]);

// Constants
const textheight = 18;
const strokewidth = 2.0;
const color = {
    WHITE: "#ffffff",
    BLACK: "#000000",
    GREY: "#383737",
    BLUE: "#0000ff",
    YELLOW: "#FFB000",
    ORANGE: "#FE6100",
    PURPLE: "#614875",
    PINK: "#DC267F",
    DENIM: "#648fff",
    SELECTED: "#A000DC",
    LIGHT_BLUE: "#C4E4FC",
    LIGHT_RED: "#FFD4D4",
    LIGHT_YELLOW: "#FFF4C2",
    LIGHT_GREEN: "#C4F8BD",
    LIGHT_PURPLE: "#927B9E",
};
const MENU_COLORS = [
    color.WHITE,
    color.LIGHT_BLUE,
    color.LIGHT_RED,
    color.LIGHT_YELLOW,
    color.LIGHT_GREEN,
    color.DENIM,
    color.PINK,
    color.YELLOW,
    color.ORANGE,
    color.BLUE,
    color.BLACK,
]
const strokeColors = [color.GREY];

// Sub menu items used in item cycling
const subMenuEntity = [
    elementTypes.EREntity,
    elementTypes.UMLEntity,
    elementTypes.IEEntity,
    elementTypes.SDEntity,
]
const subMenuRelation = [
    elementTypes.ERRelation,
    elementTypes.ERAttr,
    elementTypes.UMLRelation,
    elementTypes.IERelation,
]
const subMenuUMLstate = [
    elementTypes.UMLInitialState,
    elementTypes.UMLFinalState,
    elementTypes.UMLSuperState,
]
const subMenuSequence = [
    elementTypes.sequenceActor,
    elementTypes.sequenceObject,
    elementTypes.sequenceActivation,
    elementTypes.sequenceLoopOrAlt,
]

//#endregion ===================================================================================
//#region ================================ DEFAULTS ============================================

/**
 * @description All default values for element types. These will be applied to new elements created via the construction function ONLY.
 * @see constructElementOfType() For creating new elements with default values.
 */
var defaults = {
    EREntity: {
        name: "Entity",
        kind: "EREntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 50,
        type: "ER",
        state: 'normal',
        attributes: ['-attribute'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 50,
    },
    ERRelation: {
        name: "Relation",
        kind: "ERRelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 90,
        height: 90,
        type: "ER",
        state: 'normal',
        canChangeTo: Object.values(relationType),
        minWidth: 60,
        minHeight: 60,
    },
    ERAttr: {
        name: "Attribute",
        kind: "ERAttr",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 90,
        height: 45,
        type: "ER",
        state: 'normal',
        minWidth: 90,
        minHeight: 45,
    },
    Ghost: {
        name: "Ghost",
        kind: "ERAttr",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 5,
        height: 5,
        type: "ER"
    },
    UMLEntity: {
        name: "Class",
        kind: "UMLEntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "UML",
        attributes: ['-Attribute'],
        functions: ['+Function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    UMLRelation: {
        name: "Inheritance",
        kind: "UMLRelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "UML",
        canChangeTo: Object.values(relationType),
        minWidth: 60,
        minHeight: 60,
    },
    IEEntity: {
        name: "IEEntity",
        kind: "IEEntity",
        stroke: color.BLACK,
        fill: color.WHITE,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "IE",
        primaryKey: ['*Primary Key'],
        attributes: ['-Attribute'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    IERelation: {
        name: "Inheritance",
        kind: "IERelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 50,
        height: 50,
        type: "IE",
        canChangeTo: Object.values(relationType),
        minWidth: 50,
        minHeight: 50,
    },
    SDEntity: {
        name: "State",
        kind: "SDEntity",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 0, // Extra height when resizing larger than text.
        type: "SD",
        attributes: ['do: func'],
        functions: ['+function'],
        canChangeTo: ["UML", "ER", "IE", "SD"],
        minWidth: 150,
        minHeight: 0,
    },
    UMLInitialState: {
        name: "UML Initial State",
        kind: "UMLInitialState",
        fill: color.BLACK,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "SD",
        canChangeTo: null,
        minWidth: 60,
        minHeight: 60,
    },
    UMLFinalState: {
        name: "UML Final State",
        kind: "UMLFinalState",
        fill: color.BLACK,
        stroke: color.BLACK,
        width: 60,
        height: 60,
        type: "SD",
        canChangeTo: null,
        minWidth: 60,
        minHeight: 60,
    },
    UMLSuperState: {
        name: "UML Super State",
        kind: "UMLSuperState",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 500,
        height: 500,
        type: "SD",
        canChangeTo: null,
        minWidth: 200,
        minHeight: 150,
    },
    sequenceActor: {
        name: "name",
        kind: "sequenceActor",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 100,
        height: 500,
        type: "SE",
        canChangeTo: null,
        minWidth: 100,
        minHeight: 100,
    },
    sequenceObject: {
        name: "name",
        kind: "sequenceObject",
        fill: "#FFFFFF",
        stroke: "#000000",
        width: 100,
        height: 500,
        type: "SE",
        canChangeTo: null,
        minWidth: 100,
        minHeight: 50,
    },
    sequenceActivation: {
        name: "Activation",
        kind: "sequenceActivation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 30,
        height: 100,
        type: "SE",
        canChangeTo: null,
        minWidth: 30,
        minHeight: 50,
    },
    sequenceLoopOrAlt: {
        kind: "sequenceLoopOrAlt",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 750,
        height: 300,
        type: "SE",
        alternatives: ["alternative1"],
        altOrLoop: "Alt",
        canChangeTo: null,
        minWidth: 150,
        minHeight: 50,
    },
    note: {
        name: "Note",
        kind: "note",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 200,
        height: 50,
        type: "NOTE",
        attributes: ['Note'],
        minWidth: 150,
        minHeight: 50,
    },
}

var defaultLine = {kind: "Normal"};

//#endregion ===================================================================================
