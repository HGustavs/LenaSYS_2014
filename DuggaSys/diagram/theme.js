/**
 * @description Translate all elements to the correct coordinate
 */
function updateCSSForAllElements() {
    function updateElementDivCSS(elementData, divObject, useDelta, element) {
        let left = Math.round(((elementData.x - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
        let top = Math.round((((elementData.y - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

        if (useDelta) {
            left -= deltaX;
            top -= deltaY;
        }

        if (settings.grid.snapToGrid && useDelta) {
            if (element.kind == elementTypesNames.EREntity) {
                // The element coordinates with snap point
                let objX = Math.round((elementData.x + elementData.width / 2 - (deltaX * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);
                let objY = Math.round((elementData.y + elementData.height / 2 - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            } else if (element.kind != elementTypesNames.EREntity) {
                // The element coordinates with snap point
                let objX = Math.round((elementData.x + elementData.width / 2 - (deltaX * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);
                let objY = Math.round((elementData.y + elementData.height / 2 - (deltaY * (1.0 / zoomfact))) / (settings.grid.gridSize / 2)) * (settings.grid.gridSize / 2);

                // Add the scroll values
                left = Math.round(((objX - zoomOrigo.x) * zoomfact) + (scrollx * (1.0 / zoomfact)));
                top = Math.round((((objY - zoomOrigo.y) - (settings.grid.gridSize / 2)) * zoomfact) + (scrolly * (1.0 / zoomfact)));

                // Set the new snap point to center of element
                left -= ((elementData.width * zoomfact) / 2);
                top -= ((elementData.height * zoomfact) / 2);
            }
        }
        divObject.style.left = left + "px";
        divObject.style.top = top + "px";
    }

    // Update positions of all data elements based on the zoom level and view space coordinate
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        // Element DIV (dom-object)
        const elementDiv = document.getElementById(element.id);
        if (elementDiv) {
            // If the element was clicked and our mouse movement is not null
            const inContext = deltaX && findIndex(context, element.id) != -1;
            let useDelta = inContext && movingObject;
            let fillColor;
            let fontColor;
            let weakKeyUnderline;
            let disjointLine1Color;
            let disjointLine2Color;
            if (data[i].isLocked) useDelta = false;
            updateElementDivCSS(element, elementDiv, useDelta, element);

            // Edge creation does not highlight selected elements
            if (mouseMode != mouseModes.EDGE_CREATION) {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne(inContext)) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontColor.style.fill = fontContrast(element, fontColor);
                        }
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne(inContext)) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontColor.style.fill = fontContrast(element, fontColor);
                        }
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        if (markedOverOne(inContext)) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontColor.style.fill = fontContrast(element, fontColor);
                        }
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];

                        if (markedOverOne(inContext)) {
                            fillColor.style.fill = color.LIGHT_PURPLE;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = element.fill;
                            fontColor.style.fill = fontContrast(element, fontColor);
                        }
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if (markedOverOne(inContext)) {
                        fillColor.style.fill = color.LIGHT_PURPLE;
                        fontColor.style.fill = color.WHITE;
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if (element.kind == elementTypesNames.IERelation && element.state != "overlapping") {
                            disjointLine1Color.style.stroke = color.WHITE;
                            disjointLine2Color.style.stroke = color.WHITE;
                        }
                        // If UMLRelation is not marked.
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                        }
                    } else {
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.BLACK;
                            if (element.fill == color.BLACK) {
                                weakKeyUnderline.style.stroke = color.WHITE;
                            }
                        }
                    }
                }
            } else {
                // Update UMLEntity
                if (element.kind == elementTypesNames.UMLEntity) {
                    for (let index = 0; index < 3; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                    }
                }
                // Update IEEntity
                else if (element.kind == elementTypesNames.IEEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                    }
                }
                // Update SDEntity
                else if (element.kind == elementTypesNames.SDEntity) {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[index].children[0].children[0];
                        fontColor = elementDiv.children[index].children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                    }
                }
                // Update Elements with double borders.
                else if (element.state == "weak" || element.state == "multiple") {
                    for (let index = 0; index < 2; index++) {
                        fillColor = elementDiv.children[0].children[index];
                        fontColor = elementDiv.children[0];
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                    }
                } else { // Update normal elements, and relations
                    fillColor = elementDiv.children[0].children[0];
                    fontColor = elementDiv.children[0];
                    weakKeyUnderline = elementDiv.children[0].children[2];
                    disjointLine1Color = elementDiv.children[0].children[2];
                    disjointLine2Color = elementDiv.children[0].children[3];
                    if (markedOverOne(inContext)) {
                        fillColor.style.fill = `${element.fill}`;
                        fontColor.style.fill = fontContrast(element, fontColor);
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.WHITE;
                        } // Turns the "X" white in disjoint IE-inheritance when multiple IE-inheritances are selected.
                        else if (element.kind == elementTypesNames.IERelation && element.state != "overlapping") {
                            disjointLine1Color.style.stroke = color.WHITE;
                            disjointLine2Color.style.stroke = color.WHITE;
                        }
                        // If UMLRelation is not marked.
                    } else if (element.kind == "UMLRelation") {
                        if (element.state == "overlapping") {
                            fillColor.style.fill = color.BLACK;
                            fontColor.style.fill = color.WHITE;
                        } else {
                            fillColor.style.fill = color.WHITE;
                        }
                    } else {
                        fillColor.style.fill = element.fill;
                        fontColor.style.fill = fontContrast(element, fontColor);
                        if (element.state == "weakKey") {
                            weakKeyUnderline.style.stroke = color.BLACK;
                            if (element.fill == color.BLACK) {
                                weakKeyUnderline.style.stroke = color.WHITE;
                            }
                        }
                    }
                }
            }
        }
    }
    // Also update ghost if there is one
    if (ghostElement) {
        const ghostDiv = document.getElementById(ghostElement.id);

        if (ghostDiv) {
            updateElementDivCSS(ghostElement, ghostDiv, false);
        }
    }

    function fontContrast(element, fontColor) {
        //check if the fill color is black or pink, if so the font color is set to white
        return (element.fill == color.BLACK || element.fill == color.PINK) ? color.WHITE : color.BLACK;
    }

    function markedOverOne(inContext) {
        //If more than one element is marked.
        return inContext && context.length > 1 || inContext && context.length > 0 && contextLine.length > 0;
    }

    toggleBorderOfElements();
}

/**
 * @description toggles the border of all elements to white or gray; depending on current theme and fill.
 */
function toggleBorderOfElements() {
    //get all elements with the class text. This inludes the text in the elements but also the non text svg that surrounds the text and just has a stroke.
    //For the future, these svg elements should probably be given a class of their own and then this function should be updated.
    let allTexts = document.getElementsByClassName('text');
    if (localStorage.getItem('diagramTheme') != null) {
        //in localStorage, diagramTheme holds a URL to the CSS file currently used. Like, style.css or blackTheme.css
        let cssUrl = localStorage.getItem('diagramTheme');
        //this turns, for example, '.../Shared/css/style.css' into just 'style.css'
        cssUrl = cssUrl.split("/").pop();

        if (cssUrl == 'blackTheme.css') {
            //iterate through all the elements that have the class 'text'.
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                //assign their current stroke color to a variable.
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                //if the element has a stroke which has the color #383737 and its fill isn't white: set it to white.
                //this is because we dont want to affect the strokes that are null or other colors and have a contrasting border.
                if (strokeColor == color.GREY && fillColor != color.WHITE) {
                    strokeColor = color.WHITE;
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
        //if the theme isnt darkmode and the fill isn't gray, make the stroke gray.
        else {
            for (let i = 0; i < allTexts.length; i++) {
                let text = allTexts[i];
                let strokeColor = text.getAttribute('stroke');
                let fillColor = text.getAttribute('fill');
                if (strokeColor == color.WHITE && fillColor != color.GREY) {
                    strokeColor = color.GREY;
                    text.setAttribute('stroke', strokeColor);
                }
            }
        }
    }
}
