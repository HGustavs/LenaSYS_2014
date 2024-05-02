/**
 * @description Event function triggered when the mousewheel reader has a value of grater or less than 0.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mwheel(event) {
    event.preventDefault();
    if (zoomAllowed) {
        if (event.deltaY < 0) {
            zoomin(event);
        } else {
            zoomout(event);
        }
        zoomAllowed = false;
        setTimeout(function () {
            zoomAllowed = true
        }, 75); // This number decides the time between each zoom tick, in ms.
    }
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of the container.
 * @param {MouseEvent} event Triggered mouse event.
 */
function mdown(event) {
    mouseButtonDown = true;

    // Mouse pressed over delete button for multiple elements
    if (event.button == 0) {
        if (context.length > 0 || contextLine.length > 0) {
            hasPressedDelete = checkDeleteBtn();
        }
    }

    // Prevent middle mouse panning when moving an object
    if (event.button == 1) {
        if (movingObject) {
            event.preventDefault();
            return;
        }
    }

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active, set scroll start values
    if (event.button == 1 || settings.replay.active) {
        pointerState = pointerStates.CLICKED_CONTAINER;
        sscrollx = scrollx;
        sscrolly = scrolly;
        startX = event.clientX;
        startY = event.clientY;
        event.preventDefault();
        return;
    }

    // If the right mouse button is pressed => return
    if (event.button == 2) return;

    // Check if no element has been clicked or delete button has been pressed.
    if (pointerState != pointerStates.CLICKED_ELEMENT && !hasPressedDelete && !settings.replay.active) {

        // Used when clicking on a line between two elements.
        determinedLines = determineLineSelect(event.clientX, event.clientY);
        

        // If a line was clicked, determine if the label or line was clicked.
        if (determinedLines) {
            if (determinedLines.id.length == 6) { // LINE
                pointerState = pointerStates.CLICKED_LINE;

                // If double click, open option pane
                if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                    wasDblClicked = true;
                    document.getElementById('optmarker').innerHTML = "&#9650;Options";
                    document.getElementById("options-pane").className = "show-options-pane";
                }
            } else if (determinedLines.id.length > 6) { // LABEL
                targetLabel = lineLabelList[findIndex(lineLabelList, determinedLines.id)];
                startX = event.clientX;
                startY = event.clientY;

                pointerState = pointerStates.CLICKED_LABEL;
            }
        }
    }

    // If no line, label or delete button was clicked, react to mouse down on container
    if (pointerState != pointerStates.CLICKED_LINE && pointerState != pointerStates.CLICKED_LABEL && !hasPressedDelete) {
        if (event.target.id == "container") {
            switch (mouseMode) {
                case mouseModes.POINTER:
                    sscrollx = scrollx;
                    sscrolly = scrolly;
                    startX = event.clientX;
                    startY = event.clientY;

                    // If pressed down in selection box
                    if (context.length > 0) {
                        if (startX > selectionBoxLowX && startX < selectionBoxHighX && startY > selectionBoxLowY && startY < selectionBoxHighY) {
                            pointerState = pointerStates.CLICKED_ELEMENT;
                            targetElement = context[0];
                            targetElementDiv = document.getElementById(targetElement.id);
                        } else {
                            pointerState = pointerStates.CLICKED_CONTAINER;
                            containerStyle.cursor = "grabbing";
                            if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                                wasDblClicked = true;
                                document.getElementById("options-pane").className = "hide-options-pane";
                            }
                        }
                        break;
                    } else {
                        pointerState = pointerStates.CLICKED_CONTAINER;
                        containerStyle.cursor = "grabbing";

                        if ((new Date().getTime() - dblPreviousTime) < dblClickInterval) {
                            wasDblClicked = true;
                            toggleOptionsPane();
                        }
                        break;
                    }

                case mouseModes.BOX_SELECTION:
                    // If pressed down in selection box
                    if (context.length > 0) {
                        startX = event.clientX;
                        startY = event.clientY;
                        if (startX > selectionBoxLowX && startX < selectionBoxHighX && startY > selectionBoxLowY && startY < selectionBoxHighY) {
                            pointerState = pointerStates.CLICKED_ELEMENT;
                            targetElement = context[0];
                            targetElementDiv = document.getElementById(targetElement.id);
                        } else {
                            boxSelect_Start(event.clientX, event.clientY);
                        }
                    } else {
                        boxSelect_Start(event.clientX, event.clientY);
                    }
                    break;

                default:
                    break;
            }
            // If node is clicked, determine start point for resize
        } else if (event.target.classList.contains("node")) {
            pointerState = pointerStates.CLICKED_NODE;
            var element = data[findIndex(data, context[0].id)];

            // Save the original properties
            originalWidth = element.width;
            originalHeight = element.height;
            originalX = element.x;
            originalY = element.y;

            startWidth = data[findIndex(data, context[0].id)].width;
            startHeight = data[findIndex(data, context[0].id)].height;

            //startNodeRight = !event.target.classList.contains("mr");
            startNodeLeft = event.target.classList.contains("ml")
            startNodeRight = event.target.classList.contains("mr"); //since it used to be "anything but mr", i changed it to "be ml" since theres not only two nodes anymore. This variable still does not make sense to me but I left it functionally intact.
            startNodeDown = event.target.classList.contains("md");
            startNodeUp = event.target.classList.contains("mu");
            startNodeUpRight = event.target.classList.contains("tr");
            startNodeUpLeft = event.target.classList.contains("tl");
            startNodeDownRight = event.target.classList.contains("br");
            startNodeDownLeft = event.target.classList.contains("bl");

            startX = event.clientX;
            startY = event.clientY;
        }
    }

    if (!event.target.parentElement.classList.contains("placementTypeBoxIcons")) {
        hidePlacementType();
    }

    dblPreviousTime = new Date().getTime();
    wasDblClicked = false;
}

/**
 * @description Event function triggered when any mouse button is pressed down on top of any element.
 * @param {MouseEvent} event Triggered mouse event.
 */
function ddown(event) {
    // Mouse pressed over delete button for a single line over a element
    if (event.button == 0 && (contextLine.length > 0 || context.length > 0)) {
        hasPressedDelete = checkDeleteBtn();
    }

    // Used when determining time between clicks.
    if ((new Date().getTime() - dblPreviousTime) < dblClickInterval && event.button == 0) {
        wasDblClicked = true; // General purpose bool. True when doubleclick was performed.

        const element = data[findIndex(data, event.currentTarget.id)];
        if (element != null && context.length == 1 && context.includes(element) && contextLine.length == 0) {
            event.preventDefault(); // Needed in order for focus() to work properly
            var input = document.getElementById("elementProperty_name");
            if (input !== null) {
                input.focus();
                input.setSelectionRange(0, input.value.length); // Select the whole text.
            }
            document.getElementById('optmarker').innerHTML = "&#9650;Options";
            document.getElementById("options-pane").className = "show-options-pane"; // Toggle optionspanel.
        }
    }

    // If the middle mouse button (mouse3) is pressed OR replay-mode is active => return
    if (event.button == 1 || settings.replay.active) return;

    // If the right mouse button is pressed => return
    if (event.button == 2) return;
    if (!hasPressedDelete) {
        switch (mouseMode) {
            case mouseModes.POINTER:
            case mouseModes.BOX_SELECTION:
                startX = event.clientX;
                startY = event.clientY;

                if (!altPressed) {
                    pointerState = pointerStates.CLICKED_ELEMENT;
                    targetElement = event.currentTarget;
                    targetElementDiv = document.getElementById(targetElement.id);
                }
            case mouseModes.EDGE_CREATION:
                if (event.button == 2) return;
                const element = data[findIndex(data, event.currentTarget.id)];
                // If element not in context, update selection on down click
                if (element != null && !context.includes(element)) {
                    pointerState = pointerStates.CLICKED_ELEMENT;
                    updateSelection(element);
                    lastClickedElement = null;
                } else if (element != null) {

                    lastClickedElement = element;
                }
                break;
            default:
                console.error(`State ${mouseMode} missing implementation at switch-case in ddown()!`);
                break;
        }
    }
    dblPreviousTime = new Date().getTime(); // Update dblClick-timer.
    wasDblClicked = false; // Reset the bool.
}

/**
 * @description Event function triggered when any mouse button is released on top of the container. Logic is handled depending on the current pointer state.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */
function mup(event) {
    if (!mouseOverLine && !mouseOverElement) {
        setContainerStyles(mouseMode);
    }
    mouseButtonDown = false;
    targetElement = null;
    deltaX = startX - event.clientX;
    deltaY = startY - event.clientY;

    switch (pointerState) {
        case pointerStates.DEFAULT:
            mouseMode_onMouseUp(event);
            break;
        case pointerStates.CLICKED_CONTAINER:
            if (event.target.id == "container") {
                movingContainer = false;

                if (!deltaExceeded) {
                    if (mouseMode == mouseModes.EDGE_CREATION) {
                        clearContext();
                    } else if (mouseMode == mouseModes.POINTER) {
                        updateSelection(null);
                    }
                    if (!ctrlPressed) clearContextLine();
                }
            }
            break;
        case pointerStates.CLICKED_LINE:
            if (!deltaExceeded) {
                updateSelectedLine(determinedLines);
            }
            if (mouseMode == mouseModes.BOX_SELECTION) {
                mouseMode_onMouseUp(event);
            }
            break;
        case pointerStates.CLICKED_LABEL:
            updateSelectedLine(lines[findIndex(lines, determinedLines.labelLineID)]);
            break;
        case pointerStates.CLICKED_ELEMENT:
            // If clicked element already was in context, update selection on mouse up
            if (lastClickedElement != null && context.includes(lastClickedElement) && !movingObject) {
                updateSelection(lastClickedElement);
            }
            movingObject = false;
            // Special cases:
            if (mouseMode == mouseModes.EDGE_CREATION) {
                mouseMode_onMouseUp(event);

                // Normal mode
            } else if (deltaExceeded) {
                if (context.length > 0) setPos(context, deltaX, deltaY);
            }
            break;
        case pointerStates.CLICKED_NODE:
            if (resizeOverlapping) {
                // Reset to original state if overlapping is detected
                var element = data[findIndex(data, context[0].id)];
                element.width = originalWidth;
                element.height = originalHeight;
                element.x = originalX;
                element.y = originalY;
                // Update DOM with the original properties
                const elementDOM = document.getElementById(element.id);
                elementDOM.style.width = originalWidth + 'px';
                elementDOM.style.height = originalHeight + 'px';
                elementDOM.style.left = originalX + 'px';
                elementDOM.style.top = originalY + 'px';
                showdata()
                displayMessage(messageTypes.ERROR, "Error: You can't place elements too close together.");
                resizeOverlapping = false;
            }
            break;
        default:
            console.error(`State ${mouseMode} missing implementation at switch-case in mup()!`);
            break;
    }
    // Update all element positions on the screen
    deltaX = 0;
    deltaY = 0;
    updatepos(0, 0);
    drawRulerBars(scrollx, scrolly);

    // Restore pointer state to normal
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
    hasResized = true;
    disableIfDataEmpty();
}

/**
 * @description Event function triggered when any mouse button is released on top of the toolbar.
 * @param {MouseEvent} event Triggered mouse event.
 * @see pointerStates For all available states.
 */
function tup() {
    mouseButtonDown = false;
    pointerState = pointerStates.DEFAULT;
    deltaExceeded = false;
}

/**
 * @description change cursor style when mouse hovering over an element.
 */
function mouseEnter() {
    if (!mouseButtonDown && mouseMode != mouseModes.PLACING_ELEMENT) {
        mouseOverElement = true;
        containerStyle.cursor = "pointer";
    }
}

/**
 * @description change cursor style when mouse is hovering over the container.
 */
function mouseLeave() {
    mouseOverElement = false;
    setContainerStyles(mouseMode);
}

/**
 * @description Checks if the mouse is hovering over the delete button on selected element/s and deletes it/them.
 */
function checkDeleteBtn() {
    if (lastMousePos.x > deleteBtnX && lastMousePos.x < (deleteBtnX + deleteBtnSize) && lastMousePos.y > deleteBtnY && lastMousePos.y < (deleteBtnY + deleteBtnSize)) {
        if (deleteBtnX != 0 && !mouseOverElement) {
            if (context.length > 0) removeElements(context);
            if (contextLine.length > 0) removeLines(contextLine);
            updateSelection(null);
            return true;
        }
    }
    return false;
}

/**
 *  @description change cursor style if mouse position is over a selection box or the deletebutton.
 */
function mouseOverSelection(mouseX, mouseY) {
    if (context.length > 0 || contextLine.length > 0) {
        // If there is a selection box and mouse position is inside it.
        if (mouseX > selectionBoxLowX && mouseX < selectionBoxHighX && mouseY > selectionBoxLowY && mouseY < selectionBoxHighY) {
            containerStyle.cursor = "pointer";
        }
        // If mouse position is over the delete button.
        else if (mouseX > deleteBtnX && mouseX < (deleteBtnX + deleteBtnSize) && mouseY > deleteBtnY && mouseY < (deleteBtnY + deleteBtnSize)) {
            containerStyle.cursor = "pointer";
        }
        // Not inside selection box, nor over an element or line.
        else if (!mouseOverElement && !mouseOverLine) {
            setContainerStyles(mouseMode);
        }
    }
    // There is no selection box, and mouse position is not over any element or line.
    else if (!mouseOverElement && !mouseOverLine) {
        setContainerStyles(mouseMode);
    }
}
