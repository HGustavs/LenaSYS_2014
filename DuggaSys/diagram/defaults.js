/**
 * @description All default values for element types. These will be applied to new elements created via the construction function ONLY.
 * @see constructElementOfType() For creating new elements with default values.
 */
const defaults = {
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
        minWidth: 60,
        minHeight: 60,
    },
    ERAttr: {
        name: "Attribute",
        kind: "ERAttr",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 120,
        height: 70,
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
        minWidth: 150,
        minHeight: 0,
    },
    UMLRelation: {
        name: "Inheritance",
        kind: "UMLRelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 80,
        height: 80,
        type: "UML",
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
        minWidth: 150,
        minHeight: 0,
    },
    IERelation: {
        name: "Inheritance",
        kind: "IERelation",
        fill: color.WHITE,
        stroke: color.BLACK,
        width: 85,
        height: 85,
        type: "IE",
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
        minWidth: 150,
        minHeight: 50,
    },
};

const defaultLine = {kind: "Normal"};
