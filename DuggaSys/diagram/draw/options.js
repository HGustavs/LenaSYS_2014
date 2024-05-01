/**
 * @description Generates fields for all properties of the currently selected element/line in the context.
 * These fields can be used to modify the selected element/line.
 */
function generateContextProperties() {
    var propSet = document.getElementById("propertyFieldset");
    var menuSet = document.getElementsByClassName('options-section');

    var str = "<legend>Properties</legend>";
    /*
        //a4 propteries
        if (document.getElementById("a4Template").style.display === "block") {
            str += `<text>Change the size of the A4</text>`;
            str += `<input type="range" onchange="setA4SizeFactor(event)" min="100" max="200" value ="${settings.grid.a4SizeFactor*100}" id="slider">`;
            str += `<br><button onclick="toggleA4Vertical()">Vertical</button>`;
            str += `<button onclick="toggleA4Horizontal()">Horizontal</button>`;
        } */

    //No element or line selected
    if (context.length == 0 && contextLine.length == 0 && !erTableToggle && !testCaseToggle) {
        //Hide properties and show the other options
        propSet.classList.add('options-fieldset-hidden');
        propSet.classList.remove('options-fieldset-show');
        for (let i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add('options-fieldset-show');
            menuSet[i].classList.remove('options-fieldset-hidden');
        }
    } else if (context.length == 0 && contextLine.length == 0 && (erTableToggle || testCaseToggle)) {// No element or line selected, but either erTableToggle or testCaseToggle is active.
        //Show properties and hide the other options
        propSet.classList.add('options-fieldset-show');
        propSet.classList.remove('options-fieldset-hidden');
        for (let i = 0; i < menuSet.length; i++) {
            menuSet[i].classList.add('options-fieldset-hidden');
            menuSet[i].classList.remove('options-fieldset-show');
        }
    }

    //If erTableToggle is true, then display the current ER-table instead of anything else that would be visible in the "Properties" area.
    if (erTableToggle == true) {
        str += `<div id="ERTable">`
        var ertable = generateErTableString();
        str += ertable;
        str += `</div>`
    } else if (testCaseToggle) {//If testCaseToggle is true, then display the current ER-table instead of anything else that would be visible in the "Properties" area.
        str += '<div id="ERTable">'; //using same styling for now, maybe change later
        str += generateStateDiagramInfo();
        str += '</div>';
    } else {
        //One element selected, no lines
        if (context.length == 1 && contextLine.length == 0) {//Show properties and hide the other options
            propSet.classList.add('options-fieldset-show');
            propSet.classList.remove('options-fieldset-hidden');
            for (let i = 0; i < menuSet.length; i++) {
                menuSet[i].classList.add('options-fieldset-hidden');
                menuSet[i].classList.remove('options-fieldset-show');
            }
            //Get selected element
            const element = context[0];

            //Skip diagram type-dropdown if element does not have an UML equivalent, in this case only applies to ER attributes
            //TODO: Find a way to do this dynamically as new diagram types are added
            if (element.kind != elementTypesNames.ERAttr) {
                let typesToChangeTo;

                // If property canChangeTo is not set, or set to null, assign empty array
                if (element.canChangeTo === undefined || element.canChangeTo === null) {
                    typesToChangeTo = []
                } else if (element.canChangeTo && element.canChangeTo.length > 0) { // If canChangeTo is set and containts any value, assign canChangeTo
                    typesToChangeTo = element.canChangeTo
                } else { // If canChangeTo is set but is empty, assign all types
                    typesToChangeTo = Object.values(entityType);
                }
                // Create a dropdown menu for diagram type, if typesToChangeTo has any value(s)
                if (typesToChangeTo.length > 0) {
                    let selected = context[0].type;
                    str += `<div style='color:white'>Type</div>`;
                    str += '<select id="typeSelect">';

                    //Only displays selected element in dropdown if it has any lines
                    if (elementHasLines(element)) {
                        str += '<option selected ="selected" value=' + selected + '>' + selected + '</option>';
                    } else {
                        for (let i = 0; i < typesToChangeTo.length; i++) {
                            if (selected != typesToChangeTo[i]) {
                                str += `<option value="${typesToChangeTo[i]}"> ${typesToChangeTo[i]} </option>`;
                            } else if (selected == typesToChangeTo[i]) {
                                str += `<option selected="selected" value="${typesToChangeTo[i]}"> ${typesToChangeTo[i]} </option>`;
                            }
                        }
                    }
                    str += '</select>';
                }
            }
            //Selected ER type
            if (element.type == entityType.ER) {
                //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'name':
                            str += `<div style='color:white'>Name</div>`;
                            str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                            break;
                        default:
                            break;
                    }
                }
                str += `<div style='color:white'>Variant</div>`;

                //Creates drop down for changing state of ER elements
                var value;
                var selected = context[0].state;
                if (selected == undefined) selected = "normal"
                if (element.kind == elementTypesNames.ERAttr) {
                    value = Object.values(attrState);
                } else if (element.kind == elementTypesNames.EREntity) {
                    value = Object.values(entityState);
                } else if (element.kind == elementTypesNames.ERRelation) {
                    value = Object.values(relationState);
                }

                str += '<select id="propertySelect">';
                for (let i = 0; i < value.length; i++) {
                    if (selected != value[i]) {
                        str += '<option value=' + value[i] + '>' + value[i] + '</option>';
                    } else if (selected == value[i]) {
                        str += '<option selected ="selected" value=' + value[i] + '>' + value[i] + '</option>';
                    }
                }
                str += '</select>';
            } else if (element.type == 'NOTE') {
                for (const property in element) {
                    switch (property.toLowerCase()) {
                        case 'attributes':
                            str += `<div style='color:white'>Attributes </div>`;
                            str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                            break;
                        default:
                            break;
                    }
                }
            } else if (element.type == entityType.UML) {
                if (element.kind == elementTypesNames.UMLEntity) {
                    //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            case 'attributes':
                                str += `<div style='color:white'>Attributes</div>`;
                                str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                                break;
                            case 'functions':
                                str += `<div style='color:white'>Functions</div>`;
                                str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                                break;
                            default:
                                break;
                        }
                    }
                } else if (element.kind == elementTypesNames.UMLRelation) {
                    //ID MUST START WITH "elementProperty_"!!!!!
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='display:none;'>Name</div>`;
                                str += `<input id='elementProperty_${property}' style='display:none;' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            default:
                                break;
                        }
                    }
                    str += `<div style='color:white'>Inheritance</div>`;
                    //Creates drop down for changing state of ER elements
                    let value;
                    let selected = context[0].state;
                    if (selected == undefined) {
                        selected = "disjoint"
                    }

                    if (element.kind == "UMLRelation") {
                        value = Object.values(inheritanceState);
                    }

                    str += '<select id="propertySelect">';
                    for (let i = 0; i < value.length; i++) {
                        if (selected != value[i]) {
                            str += '<option value=' + value[i] + '>' + value[i] + '</option>';
                        } else if (selected == value[i]) {
                            str += '<option selected ="selected" value=' + value[i] + '>' + value[i] + '</option>';
                        }
                    }
                    str += '</select>';
                }
            } else if (element.type == entityType.IE) {//Selected IE type
                //If IE entity
                if (element.kind == elementTypesNames.IEEntity) {
                    //ID MUST START WITH "elementProperty_"!!!!!1111!!!!!1111
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            case 'attributes':
                                str += `<div style='color:white'>Attributes</div>`;
                                str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                                break;
                            default:
                                break;
                        }
                    }
                } else if (element.kind == elementTypesNames.IERelation) {
                    //ID MUST START WITH "elementProperty_"!!!!!
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='display:none;'>Name</div>`;
                                str += `<input id='elementProperty_${property}' style='display:none;' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            default:
                                break;
                        }
                    }
                    str += `<div style='color:white'>Inheritance</div>`;
                    //Creates drop down for changing state of IE elements
                    let value;
                    let selected = context[0].state;
                    if (selected == undefined) {
                        selected = "disjoint"
                    }

                    if (element.kind == elementTypesNames.IERelation) {
                        value = Object.values(inheritanceStateIE);
                    }
                    str += '<select id="propertySelect">';
                    for (let i = 0; i < value.length; i++) {
                        if (selected != value[i]) {
                            str += '<option value=' + value[i] + '>' + value[i] + '</option>';
                        } else if (selected == value[i]) {
                            str += '<option selected ="selected" value=' + value[i] + '>' + value[i] + '</option>';
                        }
                    }
                    str += '</select>';
                }
            } else if (element.type == entityType.SD) {//Selected SD type
                //if SDEntity kind
                if (element.kind == elementTypesNames.SDEntity) {
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            case 'attributes':
                                str += `<div style='color:white'>Attributes</div>`;
                                /* find me str += `<div>`;
                                 str += `<select id="SDOption">`;
                                     str +=  `<option value ="Do: " selected>Do</option>`;
                                     str += `<option value="Exit: ">Exit</option>`;
                                 str += `</select>`;
                                 str += `</div>`; */
                                str += `<textarea id='elementProperty_${property}' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                                break;
                            default:
                                break;
                        }
                    }
                } else if (element.kind == elementTypesNames.UMLSuperState) {
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' 
                                            type='text' 
                                            value='${element[property]}' 
                                            maxlength='${20 * zoomfact}'
                                            onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            default:
                                break;
                        }
                    }
                }
            } else if (element.type == entityType.SE) {//Selected sequence type
                if (element.kind == elementTypesNames.sequenceActor) {
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            default:
                                break;
                        }
                    }
                }
                if (element.kind == 'sequenceObject') {
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'name':
                                str += `<div style='color:white'>Name</div>`;
                                str += `<input id='elementProperty_${property}' type='text' value='${element[property]}' onfocus='propFieldSelected(true)' onblur='propFieldSelected(false)'>`;
                                break;
                            default:
                                break;
                        }
                    }
                } else if (element.kind == 'sequenceLoopOrAlt') {
                    for (const property in element) {
                        switch (property.toLowerCase()) {
                            case 'alternatives':
                                str += `<div>Each line is an alternative. Just one is a loop.`;
                                //TODO in the future, this can be implemented as part of saveProperties and combine attribute and func and alternatives cases.
                                str += `<textarea id='inputAlternatives' rows='4' style='width:98%;resize:none;'>${textboxFormatString(element[property])}</textarea>`;
                                str += `</div>`;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            /// Creates button for selecting element background color if not a UML relation since they should not be able change color
            if (element.kind != 'UMLRelation' && element.kind != elementTypesNames.IERelation) {
                // Creates button for selecting element background color
                str += `<div style="white">Color</div>`;
                str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
                    `<span id="BGColorMenu" class="colorMenu"></span></button>`;
            }
            str += `<br><br><input type="submit" value="Save" class='saveButton' onclick="setSequenceAlternatives();changeState();saveProperties();generateContextProperties();">`;
        }
        // Creates radio buttons and drop-down menu for changing the kind attribute on the selected line.
        if (contextLine.length == 1 && context.length == 0) {
            //Show properties and hide the other options
            propSet.classList.add('options-fieldset-show');
            propSet.classList.remove('options-fieldset-hidden');
            for (let i = 0; i < menuSet.length; i++) {
                menuSet[i].classList.add('options-fieldset-hidden');
                menuSet[i].classList.remove('options-fieldset-show');
            }

            str = "<legend>Properties</legend>";

            var value;
            var selected = contextLine[0].kind;
            if (selected == undefined) selected = normal;

            value = Object.values(lineKind);
            //this creates line kinds for UML IE AND ER
            let UMLConnection = isLineConnectedTo(contextLine[0], elementTypesNames.UMLEntity);
            if (contextLine[0].type == entityType.UML || contextLine[0].type == entityType.IE || contextLine[0].type == 'NOTE') {
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
                for (let i = 0; i < value.length; i++) {
                    if (i != 1 && UMLConnection != null || i != 2 && UMLConnection == null) {
                        if (selected == value[i]) {
                            str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}' checked>`
                            str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                        } else {
                            str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}'>`
                            str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                        }
                    }
                }
            } else if (contextLine[0].type == entityType.ER) {
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Kinds</h3>`;
                for (var i = 0; i < value.length - 1; i++) {
                    if (i != 1 && UMLConnection != null || i != 2 && UMLConnection == null) {
                        if (selected == value[i]) {
                            str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}' checked>`
                            str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                        } else {
                            str += `<input type="radio" id="lineRadio${i + 1}" name="lineKind" value='${value[i]}'>`
                            str += `<label for='lineRadio${i + 1}'>${value[i]}</label><br>`
                        }
                    }
                }
            }
            if (contextLine[0].type == entityType.ER) {
                if (isLineConnectedTo(contextLine[0], elementTypesNames.ERAttr) == null) {
                    if (isLineConnectedTo(contextLine[0], elementTypesNames.EREntity) != null) {
                        str += `<label style="display: block">Cardinality: <select id='propertyCardinality'>`;
                        str += `<option value=''>None</option>`
                        Object.keys(lineCardinalitys).forEach(cardinality => {
                            if (contextLine[0].cardinality != undefined && contextLine[0].cardinality == cardinality) {
                                str += `<option value='${cardinality}' selected>${lineCardinalitys[cardinality]}</option>`;
                            } else {
                                str += `<option value='${cardinality}'>${lineCardinalitys[cardinality]}</option>`;
                            }
                        });
                        str += `</select></label>`;
                        str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
                        str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
                        if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
                        str += `/>`;
                    }
                }
            }
            if ((contextLine[0].type == entityType.UML) || (contextLine[0].type == 'NOTE')) {
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
                str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
                str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
                if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
                str += `/>`;
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`;
                str += `<input id="lineStartLabel" maxlength="50" type="text" placeholder="Start cardinality"`;
                if (contextLine[0].startLabel && contextLine[0].startLabel != "") str += `value="${contextLine[0].startLabel}"`;
                str += `/>`;
                str += `<input id="lineEndLabel" maxlength="50" type="text" placeholder="End cardinality"`;
                if (contextLine[0].endLabel && contextLine[0].endLabel != "") str += `value="${contextLine[0].endLabel}"`;
                str += `/>`;
            } else if ((contextLine[0].type == entityType.IE)) {
                str += `<span id="lineLabel"`;
                if (contextLine[0].label && contextLine[0].label != "") str += `${contextLine[0].label}`;
                str += `/span>`;
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Cardinalities</h3>`;
                str += `<input id="lineStartLabel" maxlength="50" type="text" placeholder="Start cardinality"`;
                if (contextLine[0].startLabel && contextLine[0].startLabel != "") str += `value="${contextLine[0].startLabel}"`;
                str += `/>`;
                str += `<input id="lineEndLabel" maxlength="50" type="text" placeholder="End cardinality"`;
                if (contextLine[0].endLabel && contextLine[0].endLabel != "") str += `value="${contextLine[0].endLabel}"`;
                str += `/>`;
            } else if (contextLine[0].type == entityType.SD) {
                str += `<h3 style="margin-bottom: 0; margin-top: 5px">Label</h3>`;
                str += `<div><button id="includeButton" type="button" onclick="setLineLabel(); changeLineProperties();">&#60&#60include&#62&#62</button></div>`;
                str += `<input id="lineLabel" maxlength="50" type="text" placeholder="Label..."`;
                if (contextLine[0].label && contextLine[0].label != "") str += `value="${contextLine[0].label}"`;
                str += `/>`;
            }
            if (contextLine[0].type == entityType.UML || contextLine[0].type == entityType.IE || contextLine[0].type == 'NOTE') {
                str += `<label style="display: block">Icons:</label> <select id='lineStartIcon' onchange="changeLineProperties()">`;
                str += `<option value=''>None</option>`;
                //iterate through all the icons assicoated with UML, like Arrow or Black Diamond and add them to the drop down as options
                Object.keys(UMLLineIcons).forEach(icon => {
                    if (contextLine[0].startIcon != undefined) {
                        //this covers Triangle and Arrow.
                        //If the lines in context happen to be matching something in the drop down, it is set as selected.
                        if (contextLine[0].startIcon.toUpperCase() == icon) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        }
                            //white and diamond needs their own if statement since contextLine[0].startIcon can be White_Diamond,
                        //while icon is WHITEDIAMOND. So I decided the most suitable way is to manually check it.
                        else if ((contextLine[0].startIcon == "White_Diamond") && (icon == "WHITEDIAMOND")) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        } else if ((contextLine[0].startIcon == "Black_Diamond") && (icon == "BLACKDIAMOND")) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        }
                        //else, its not matching and the option is just added to the dropdown normally.
                        else {
                            str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                        }
                    } else {
                        str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                    }
                });
                //iterate trough all icons associated with IE. add these icons to the drop down
                //if the line in context has one of these lines in the starting position, just like for UML, it is automatically selected
                Object.keys(IELineIcons).forEach(icon => {
                    if (contextLine[0].startIcon != undefined) {
                        //this only really covers WEAK, since the rest have a inconsistent naming scheme, like ONE_MANY; its also reffered to as 1-M
                        //This means we have to manually check these and others like them
                        if (contextLine[0].startIcon.toUpperCase() == icon) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //icon can be ZERO_MANY while start icon can be 0-M.
                        else if ((contextLine[0].startIcon.toUpperCase() == "0-M") && (icon == "ZERO_MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ZERO_ONE not being equal to 0-1
                        else if ((contextLine[0].startIcon.toUpperCase() == "0-1") && (icon == "ZERO_ONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ONE not being equal to 1
                        else if ((contextLine[0].startIcon.toUpperCase() == "1") && (icon == "ONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers FORCEDONE not being equal to 1!
                        else if ((contextLine[0].startIcon.toUpperCase() == "1!") && (icon == "FORCEDONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ONE_MANY not being equal to 1-M
                        else if ((contextLine[0].startIcon.toUpperCase() == "1-M") && (icon == "ONE_MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers MANY not being equal to M
                        else if ((contextLine[0].startIcon.toUpperCase() == "M") && (icon == "MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        } else {
                            str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                        }
                    } else {
                        str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                    }
                });
                str += `</select><select id='lineEndIcon' onchange="changeLineProperties()">`;
                str += `<option value=''>None</option>`;
                Object.keys(UMLLineIcons).forEach(icon => {
                    if (contextLine[0].endIcon != undefined) {
                        //this covers Triangle and Arrow.
                        //If the lines in context happen to be matching something in the drop down, it is set as selected.
                        if (contextLine[0].endIcon.toUpperCase() == icon) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        }
                            //white and diamond needs their own if statement since contextLine[0].startIcon can be White_Diamond,
                        //while icon is WHITEDIAMOND. So I decided the most suitable way is to manually check it.
                        else if ((contextLine[0].endIcon == "White_Diamond") && (icon == "WHITEDIAMOND")) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        } else if ((contextLine[0].endIcon == "Black_Diamond") && (icon == "BLACKDIAMOND")) {
                            str += `<option value='${UMLLineIcons[icon]}' selected>${UMLLineIcons[icon]}</option>`;
                        } else {
                            str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                        }
                    }
                    //else, its not matching and the option is just added to the dropdown normally.
                    else {
                        str += `<option value='${UMLLineIcons[icon]}'>${UMLLineIcons[icon]}</option>`;
                    }
                });
                Object.keys(IELineIcons).forEach(icon => {
                    if (contextLine[0].endIcon != undefined) {
                        //this only really covers WEAK, since the rest have a inconsistent naming scheme, like ONE_MANY; its also reffered to as 1-M
                        //This means we have to manually check these and others like them
                        if (contextLine[0].endIcon.toUpperCase() == icon) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //icon can be ZERO_MANY while start icon can be 0-M.
                        else if ((contextLine[0].endIcon.toUpperCase() == "0-M") && (icon == "ZERO_MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ZERO_ONE not being equal to 0-1
                        else if ((contextLine[0].endIcon.toUpperCase() == "0-1") && (icon == "ZERO_ONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ONE not being equal to 1
                        else if ((contextLine[0].endIcon.toUpperCase() == "1") && (icon == "ONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers FORCEDONE not being equal to 1!
                        else if ((contextLine[0].endIcon.toUpperCase() == "1!") && (icon == "FORCEDONE")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers ONE_MANY not being equal to 1-M
                        else if ((contextLine[0].endIcon.toUpperCase() == "1-M") && (icon == "ONE_MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        }
                        //this covers MANY not being equal to M
                        else if ((contextLine[0].endIcon.toUpperCase() == "M") && (icon == "MANY")) {
                            str += `<option value='${IELineIcons[icon]}' selected>${IELineIcons[icon]}</option>`;
                        } else {
                            str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                        }
                    } else {
                        str += `<option value='${IELineIcons[icon]}'>${IELineIcons[icon]}</option>`;
                    }
                });
                str += `</select>`;
            }
            //generate the dropdown for SD line icons.
            if (contextLine[0].type == entityType.SD) {
                str += `<label style="display: block">Icons:</label> <select id='lineStartIcon' onchange="changeLineProperties()">`;
                str += `<option value=''>None</option>`;
                //iterate through all the icons assicoated with SD, and add them to the drop down as options
                Object.keys(SDLineIcons).forEach(icon => {
                    if (contextLine[0].startIcon != undefined) {
                        //If the lines in context happen to be matching something in the drop down, it is set as selected.
                        if (contextLine[0].startIcon == icon) {
                            str += `<option value='${SDLineIcons[icon]}' selected>${SDLineIcons[icon]}</option>`;
                        }
                        //else, its not matching and the option is just added to the dropdown normally.
                        else {
                            str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                        }
                    } else {
                        str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                    }
                });
                str += `</select><select id='lineEndIcon' onchange="changeLineProperties()">`;
                str += `<option value=''>None</option>`;
                Object.keys(SDLineIcons).forEach(icon => {
                    if (contextLine[0].endIcon != undefined) {
                        //If the lines in context happen to be matching something in the drop down, it is set as selected.
                        if (contextLine[0].endIcon == icon) {
                            str += `<option value='${SDLineIcons[icon]}' selected>${SDLineIcons[icon]}</option>`;
                        }
                        //else, its not matching and the option is just added to the dropdown normally.
                        else {
                            str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                        }
                    } else {
                        str += `<option value='${SDLineIcons[icon]}'>${SDLineIcons[icon]}</option>`;
                    }
                });
                str += `</select>`;
                str += `<label style="display: block">Line Type:</label><select id='lineType' onchange='changeLineProperties()'>`;
                Object.keys(SDLineType).forEach(type => {
                    if (contextLine[0].innerType.localeCompare(type, undefined, {sensitivity: 'base'}) === 0) {
                        str += `<option value='${SDLineType[type]}' selected>${SDLineType[type]}</option>`;
                    } else {
                        str += `<option value='${SDLineType[type]}' >${SDLineType[type]}</option>`;
                    }
                });
                str += `</select>`;
            }
            str += `<br><br><input type="submit" class='saveButton' value="Save" onclick="changeLineProperties();">`;
        }
        //If more than one element is selected
        if (context.length > 1) {
            //Show properties and hide the other options
            propSet.classList.add('options-fieldset-show');
            propSet.classList.remove('options-fieldset-hidden');
            for (let i = 0; i < menuSet.length; i++) {
                menuSet[i].classList.add('options-fieldset-hidden');
                menuSet[i].classList.remove('options-fieldset-show');
            }
            str += `<div style="color: white">Color</div>`;
            str += `<button id="colorMenuButton1" class="colorMenuButton" onclick="toggleColorMenu('colorMenuButton1')" style="background-color: ${context[0].fill}">` +
                `<span id="BGColorMenu" class="colorMenu"></span></button>`;
        }

        if (context.length > 0) {
            //Show properties and hide the other options
            propSet.classList.add('options-fieldset-show');
            propSet.classList.remove('options-fieldset-hidden');
            for (let i = 0; i < menuSet.length; i++) {
                menuSet[i].classList.add('options-fieldset-hidden');
                menuSet[i].classList.remove('options-fieldset-show');
            }
            var locked = true;
            for (let i = 0; i < context.length; i++) {
                if (!context[i].isLocked) {
                    locked = false;
                    break;
                }
            }
            str += `<br><input type="submit" id="lockbtn" value="${locked ? "Unlock" : "Lock"}" class="saveButton" onclick="toggleEntityLocked();">`;
        }
    }
    propSet.innerHTML = str;
    multipleColorsTest();
}
/**
 *
 * @description function for include button to the options panel,writes out << Include >>
 */
function setLineLabel() {
    document.getElementById("lineLabel").value = "<<include>>";
}

/**
 * @description Toggles the option menu being open or closed.
 */
function toggleOptionsPane() {
    if (document.getElementById("options-pane").className == "show-options-pane") {
        document.getElementById('optmarker').innerHTML = "&#9660;Options";
        if (document.getElementById("BGColorMenu") != null) {
            document.getElementById("BGColorMenu").style.visibility = "hidden";
        }
        document.getElementById("options-pane").className = "hide-options-pane";
    } else {
        document.getElementById('optmarker').innerHTML = "&#9650;Options";
        document.getElementById("options-pane").className = "show-options-pane";
    }
}
/**
 * @description Function used to format the attribute and function textareas in UML- and IE-entities. Every entry is written on new row.
 * @param {*} arr Input array with all elements that should be seperated by newlines
 * @returns Formated string containing all the elements in arr
 */
function textboxFormatString(arr) {
    var content = '';
    for (let i = 0; i < arr.length; i++) {
        content += arr[i] + '\n';
    }
    return content;
}
/**
 * @description Generates the string which holds the ER table for the current ER-model/ER-diagram.
 * @returns Current ER table in the form of a string.
 */
function generateErTableString() {
    //TODO: When functionality is complete, try to minimize the overall space complexity, aka try to extract
    //only useful information from entities, attributes and relations.

    var entityList = [];    //All EREntities currently in the diagram
    var attrList = [];      //All ERAttributes currently in the diagram
    var relationList = [];  //All ERRelations currently in the diagram
    var stringList = [];    //List of strings where each string holds the relevant data for each entity

    /**
     * @description Multidimensional array containing data of each entity and their attribute. Index[0] is always the element
     * @structure ERAttributeData[i] = [entityObject, attributeObject1, ..., attributeObjectN]
     */
    var ERAttributeData = [];
    /**
     * @description Multidimensional array containing foreign keys for every entity. The owning entity is the entity where the foreign keys are added
     * @structure   ERForeignData[i] = [owningEntityObject, [otherEntityObject, foreignAttributeObject1, ..., foreignAttributeObjectN]]
     */
    var ERForeignData = [];
    /**
     * @description Multidimensional array containing relation and the connected entities. Also stores the cardinality and kind for connected entity
     * @structure   ERRelationData[i] = [relationObject, [entityObject, lineCardinality, lineKind], [otherEREntityObject, otherLineCardinality, otherLineKind]]
     */
    var ERRelationData = [];

    // Sort the data[] elements into entity-, attr- and relationList
    for (let i = 0; i < data.length; i++) {

        if (data[i].kind == elementTypesNames.EREntity) {
            entityList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERAttr) {
            attrList.push(data[i]);
        } else if (data[i].kind == elementTypesNames.ERRelation) {
            relationList.push(data[i]);
        }
    }
    //For each relation in relationList
    for (let i = 0; i < relationList.length; i++) {
        //List containing relation-element and connected entities
        var currentRelationList = [];
        currentRelationList.push(relationList[i]);
        //Sort all lines that are connected to the current relation into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            //Get connected line from element
            if (relationList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (relationList[i].id == lines[j].toID) { //Get connected line to element
                lineList.push(lines[j]);
            }
        }

        //Identify every connected entity to relations
        for (let j = 0; j < lineList.length; j++) {
            for (let k = 0; k < entityList.length; k++) {
                if (entityList[k].id == lineList[j].fromID || entityList[k].id == lineList[j].toID) {
                    //Push in entity, line cardinality and kind
                    currentRelationList.push([entityList[k], lineList[j].cardinality, lineList[j].kind]);
                }
            }
        }
        //Push in relation for entity, line cardinality and kind.
        ERRelationData.push(currentRelationList);
    }
    //For each entity in entityList
    for (let i = 0; i < entityList.length; i++) {
        var currentRow = [entityList[i]];
        //Sort all lines that are connected to the current entity into lineList[]
        let lineList = [];
        for (let j = 0; j < lines.length; j++) {
            if (entityList[i].id == lines[j].fromID) {
                lineList.push(lines[j]);
            } else if (entityList[i].id == lines[j].toID) {
                lineList.push(lines[j]);
            }
        }
        // Identify all attributes that are connected to the current entity by using lineList[] and store them in currentEntityAttrList. Save their ID's in idList.
        var currentEntityAttrList = [];
        var idList = [];
        for (let j = 0; j < lineList.length; j++) {
            for (let h = 0; h < attrList.length; h++) {
                if (attrList[h].id == lineList[j].fromID || attrList[h].id == lineList[j].toID) {
                    currentEntityAttrList.push(attrList[h]);
                    currentRow.push(attrList[h]);
                    idList.push(attrList[h].id);
                }
            }
        }
        var parentAttribeList = []; //list of parent attributes

        for (let j = 0; j < currentEntityAttrList.length; j++) {
            //For each attribute connected to the current entity, identify if other attributes are connected to themselves.
            var attrLineList = [];
            for (let h = 0; h < lines.length; h++) {
                //If there is a line to/from the attribute that ISN'T connected to the current entity, save it in attrLineList[].
                if ((currentEntityAttrList[j].id == lines[h].toID ||
                        currentEntityAttrList[j].id == lines[h].fromID) &&
                    (lines[h].toID != entityList[i].id && lines[h].fromID != entityList[i].id)
                ) {
                    attrLineList.push(lines[h]);
                }
            }

            //Compare each line in attrLineList to each attribute.
            for (let h = 0; h < attrLineList.length; h++) {
                for (let k = 0; k < attrList.length; k++) {
                    //If ID matches the current attribute AND another attribute, try pushing the other attribute to currentEntityAttrList[]
                    if (((attrLineList[h].fromID == attrList[k].id) && (attrLineList[h].toID == currentEntityAttrList[j].id)) || ((attrLineList[h].toID == attrList[k].id) && (attrLineList[h].fromID == currentEntityAttrList[j].id))) {
                        //Iterate over saved IDs
                        var hits = 0;
                        for (let p = 0; p < idList.length; p++) {
                            //If the ID of the attribute already exists, then increase hits and break the loop.
                            if (idList[p] == attrList[k].id) {
                                hits++;
                                break;
                            }
                        }
                        //If no hits, then push the attribute to currentEntityAttrList[] (so it will also be checked for additional attributes in future iterations) and save the ID.
                        if (hits == 0) {
                            // looking if the parent attribute is in the parentAttributeList
                            if (findIndex(parentAttribeList, currentEntityAttrList[j].id) == -1) {
                                parentAttribeList.push(currentEntityAttrList[j]);
                                currentEntityAttrList[j].newKeyName = "";
                            }
                            if (currentEntityAttrList[j].newKeyName == "") {
                                currentEntityAttrList[j].newKeyName += attrList[k].name;
                            } else {
                                currentEntityAttrList[j].newKeyName += " " + attrList[k].name;
                            }
                            if (currentEntityAttrList[j].state != 'primary' &&
                                currentEntityAttrList[j].state != 'candidate'
                            ) {
                                currentRow.push(attrList[k]);
                            }
                            currentEntityAttrList.push(attrList[k]);
                            idList.push(attrList[k].id);
                        }
                    }
                }
            }
        }
        //Push list with entity at index 0 followed by its attributes
        ERAttributeData.push(currentRow);
    }
    var strongEntityList = formatERStrongEntities(ERAttributeData);
    var weakEntityList = formatERWeakEntities(ERAttributeData);

    // Iterate over every strong entity
    for (let i = 0; i < strongEntityList.length; i++) {
        var visitedList = []; // A list which contains entities that has been vistited in this codeblock
        var queue = []; // Queue for each entity's relation
        queue.push(strongEntityList[i][0]); // Push in the current entity
        // Loop while queue isn't empty
        while (queue.length > 0) {
            var current = queue.shift(); // Get current entity by removing first entity in queue
            // For current entity, iterate through every relation
            for (let j = 0; j < ERRelationData.length; j++) {
                // Check if relation is valid, (relation, entity1, entity2)
                if (ERRelationData[j].length >= 3) {
                    if (ERRelationData[j][0].state == 'weak') {
                        var visited = false;    // Boolean representing if the current entity has already been visited
                        for (let v = 0; v < visitedList.length; v++) {
                            if (current.id == visitedList[v].id) {
                                visited = true;
                                break;
                            }
                        }
                        // If current entity is not visited
                        if (!visited) {
                            // Check if current is strong / normal
                            if (current.state == 'normal') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    // Iterate through key list
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                }
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    // Iterate through weak entities and find its ID
                                    for (let k = 0; k < weakEntityList.length; k++) {
                                        // ID match
                                        if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                            // Iterate through strong entities and find its ID
                                            for (let l = 0; l < strongEntityList.length; l++) {
                                                // ID match
                                                if (strongEntityList[l][0].id == current.id) {
                                                    var tempList = [strongEntityList[l][0]]; // Temporary list with entity and its keys
                                                    for (let m = 0; m < strongEntityList[l][1].length; m++) {
                                                        tempList.push(strongEntityList[l][1][m]) // Push in key
                                                    }
                                                    weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                }
                                            }
                                        }
                                    }
                                    queue.push(ERRelationData[j][1][0]); // Push in entity to queue
                                }
                            }
                            //Check if current is weak
                            else if (current.state == 'weak') {
                                // Check if entity is in relation and check its cardinality
                                if (current.id == ERRelationData[j][1][0].id && ERRelationData[j][1][1] == 'ONE') {
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][2][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[l][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]) // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][2][0]); // Push in entity to queue
                                    }
                                }
                                // Check if entity is in relation and check its cardinality
                                else if (current.id == ERRelationData[j][2][0].id && ERRelationData[j][2][1] == 'ONE') {
                                    let exists = false; // Boolean representing if the other entity has already been visited
                                    for (let v = 0; v < visitedList.length; v++) {
                                        if (ERRelationData[j][1][0].id == visitedList[v].id) {//|| ERRelationData[j][2][0].id == visitedList[v].id) {
                                            exists = true;
                                            break;
                                        }
                                    }
                                    // If not already visited
                                    if (!exists) {
                                        // Iterate through weak entities and find its ID. (Entity that should have keys)
                                        for (let k = 0; k < weakEntityList.length; k++) {
                                            // ID match
                                            if (weakEntityList[k][0].id == ERRelationData[j][1][0].id) {
                                                // Iterate through weak entities and find its ID (Entity that should give keys)
                                                for (let l = 0; l < weakEntityList.length; l++) {
                                                    // ID match
                                                    if (weakEntityList[l][0].id == current.id) {
                                                        var tempList = [weakEntityList[l][0]]; // Temporary list with entity and its keys
                                                        for (let m = 0; m < weakEntityList[i][1].length; m++) {
                                                            tempList.push(weakEntityList[l][1][m]); // Push in key
                                                        }
                                                        weakEntityList[k][1].push(tempList); // Add list to the weak entities.
                                                    }
                                                }
                                            }
                                        }
                                        queue.push(ERRelationData[j][1][0]); // Push in entity queue
                                    }
                                }
                            }
                        }
                    }
                }
            }
            visitedList.push(current);
        }
    }
    var tempWeakList = [];
    // Update the weak entity list to accomodate the new list of weak keys
    for (let i = 0; i < weakEntityList.length; i++) {
        var row = []; // New formatted weak entity row
        row.push(weakEntityList[i][0]); // Push in weak entity, as usual, [0] is entity
        row.push([]); // Push in empty list to contain the keys
        // In the weak entity's key list, iterate and check if current is an array
        for (let j = 0; j < weakEntityList[i][1].length; j++) {
            if (Array.isArray(weakEntityList[i][1][j])) {
                var strongWeakKEy = []; // List that will have the the entities and strong/weak keys required
                var current = weakEntityList[i][1][j]; // Select the first list for the current entity
                var queue = []; // Queue for search
                queue.push(current); // Insert current to queue
                // Loop until the queue is empty and at the same time, keep going deeper until the last list has been checked
                while (queue.length > 0) {
                    var temp = queue.shift(); // Remove from queue and store in temp
                    // Check if algorithm should go deeper, if the last element is an array, go deeper
                    if ((temp[temp.length - 1].length > 0)) {
                        //Iterate through the list, push every attribute
                        for (let k = 0; k < temp.length - 1; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                        queue.push(temp[temp.length - 1]); // Push in list into queue
                    } else {
                        //Iterate through the list, push every attribute
                        for (let k = 0; k < temp.length; k++) {
                            strongWeakKEy.push(temp[k]); // Push in entity and / or keys
                        }
                    }
                }
                row[1].push(strongWeakKEy); // Push in the created strong key
            }
            // If current element is not a list, push
            else {
                row[1].push(weakEntityList[i][1][j]); // Push in key
            }
        }
        //Iterate through the entity's list and push in normal and multivalued attributes
        for (let j = 0; j < weakEntityList[i].length; j++) {
            // If not array, check if normal or multivalued
            if (!Array.isArray(weakEntityList[i][j])) {
                if (weakEntityList[i][j].state == 'normal') {
                    row.push(weakEntityList[i][j]);
                } else if (weakEntityList[i][j].state == 'multiple') {
                    row.push(weakEntityList[i][j]);
                }
            }
        }
        tempWeakList.push(row);
    }
    weakEntityList = tempWeakList; // Update the values in the weakEntity list

    var allEntityList = strongEntityList.concat(weakEntityList); // Add the two list together

    //Iterate through all relations
    for (let i = 0; i < ERRelationData.length; i++) {
        if (ERRelationData[i].length >= 3) {
            var foreign = []; // Array with entities foreign keys
            // Case 1, two strong entities in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { //MANY to ONE relation, key from the ONE is foreign for MANY, case 1
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push(ERRelationData[i][1][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { //MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 2, two weak entities in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') { // ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') { // MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') { // MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);
                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 3, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'weak' && ERRelationData[i][2][0].state == 'normal') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
            // Case 4, one weak and one strong entity in relation
            if (ERRelationData[i][1][0].state == 'normal' && ERRelationData[i][2][0].state == 'weak') {
                // ONE to ONE relation, key from second ONE-side is stored in the other side
                if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'ONE') {
                    //If array is empty
                    if (ERForeignData.length < 1) {
                        ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                    } else {
                        let exist = false; // If entity already exist in ERForeignData
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                exist = true;
                            }
                        }
                        if (!exist) {
                            ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                        }
                    }
                    //Find current entity and iterate through its attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        //Second ONE-side entity
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            foreign.push(ERRelationData[i][2][0]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign.push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find current entity and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //First ONE-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                            ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'ONE' && ERRelationData[i][2][1] == 'MANY') {//ONE to MANY relation, key from the ONE is foreign for MANY, case 1
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][2][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][2][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                                foreign.push(ERRelationData[i][1][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][2][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'ONE') {//MANY to ONE relation, key from the ONE is foreign for MANY,case 2
                    // If normal relation
                    if (ERRelationData[i][0].state == 'normal') {
                        //If array is empty
                        if (ERForeignData.length < 1) {
                            ERForeignData.push([ERRelationData[i][1][0]]); // Push in first ONE-side entity
                        } else {
                            let exist = false; // If entity already exist in ERForeignData
                            for (let j = 0; j < ERForeignData.length; j++) {
                                //First ONE-side entity
                                if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                    exist = true;
                                }
                            }
                            if (!exist) {
                                ERForeignData.push([ERRelationData[i][1][0]]); //Push in first ONE-side entity
                            }
                        }
                        //Find current entity and iterate through its attributes
                        for (let j = 0; j < allEntityList.length; j++) {
                            //Second ONE-side entity
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push(ERRelationData[i][2][0]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign.push(allEntityList[j][1][k]);
                                }
                            }
                        }
                        //Find current entity and push found foreign attributes
                        for (let j = 0; j < ERForeignData.length; j++) {
                            //First ONE-side entity
                            if (ERForeignData[j][0].id == ERRelationData[i][1][0].id) {
                                ERForeignData[j].push(foreign); // Every key-attribute is pushed into array
                            }
                        }
                    }
                } else if (ERRelationData[i][1][1] == 'MANY' && ERRelationData[i][2][1] == 'MANY') {//MANY to MANY relation, key from both is stored together with relation
                    ERForeignData.push([ERRelationData[i][0]]); // //Push in relation
                    //Find currentEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][1][0].id) {
                            foreign.push([ERRelationData[i][1][0]]);
                            // Push every key in the key list located at [1]
                            for (let k = 0; k < allEntityList[j][1].length; k++) {
                                foreign[0].push(allEntityList[j][1][k]);
                            }
                        }
                    }
                    //Find otherEntity and find its key-attributes
                    for (let j = 0; j < allEntityList.length; j++) {
                        if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                            if (allEntityList[j][0].id == ERRelationData[i][2][0].id) {
                                foreign.push([ERRelationData[i][2][0]]);
                                // Push every key in the key list located at [1]
                                for (let k = 0; k < allEntityList[j][1].length; k++) {
                                    foreign[1].push(allEntityList[j][1][k]);

                                }
                            }
                        }
                    }
                    //Find relation in ERForeignData and push found foreign attributes
                    for (let j = 0; j < ERForeignData.length; j++) {
                        //MANY-side entity
                        if (ERForeignData[j][0].id == ERRelationData[i][0].id) {
                            //Every key-attribute is pushed into array
                            for (let k = 0; k < foreign.length; k++) {
                                ERForeignData[j].push(foreign[k]);
                            }
                        }
                    }
                }
            }
        }
    }
    // Iterate and add each entity's foreign attribute to the correct place
    for (let i = 0; i < ERForeignData.length; i++) {
        // Iterate throught all entities
        for (let j = 0; j < allEntityList.length; j++) {
            // Check if correct entity were found
            if (ERForeignData[i][0].id == allEntityList[j][0].id) {
                var row = [];
                // Push in every foreign attribute
                for (let k = 1; k < ERForeignData[i].length; k++) {
                    row.push(ERForeignData[i][k]); // Push in entity
                }
                allEntityList[j].push(row); // Push in list
            }
        }
    }
    // Actual creating the string. Step one, strong / normal entities
    for (let i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'normal') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            var existPrimary = false; // Determine if a primary key exist
            // ITerate and determine if primary keys are present
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (allEntityList[i][1][j].state == 'primary') {
                    existPrimary = true;
                    break;
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                // Print only primary keys if at least one is present
                if (existPrimary) {
                    if (allEntityList[i][1][j].state == 'primary') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
                //Print only candidate keys if no primary keys are present
                if (!existPrimary) {
                    if (allEntityList[i][1][j].state == 'candidate') {
                        if (allEntityList[i][1][j].newKeyName != undefined) {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].newKeyName}</span>, `;
                        } else {
                            currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                        }
                    }
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            if (allEntityList[i][j].newKeyName == undefined) {
                                currentString += `${allEntityList[i][j].name}, `;
                            }
                        }
                    }
                }
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            } else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    for (let i = 0; i < allEntityList.length; i++) {
        var currentString = ''; // Current table row
        if (allEntityList[i][0].state == 'weak') {
            currentString += `<p>${allEntityList[i][0].name} (`; // Push in entity's name
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (!Array.isArray(allEntityList[i][1][j])) {
                    // Print only weakKeys
                    if (allEntityList[i][1][j].state == 'weakKey') {
                        currentString += `<span style='text-decoration: underline black solid 2px;'>${allEntityList[i][1][j].name}</span>, `;
                    }
                }
            }
            // Once again iterate through through the entity's key attributes and add them to string
            for (let j = 0; j < allEntityList[i][1].length; j++) {
                if (Array.isArray(allEntityList[i][1][j])) {
                    currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
                    for (let k = 0; k < allEntityList[i][1][j].length; k++) {
                        currentString += `${allEntityList[i][1][j][k].name}`;
                    }
                    currentString += `</span>, `;
                }
            }
            // Check if entity has foreign keys, aka last element is an list
            if (Array.isArray(allEntityList[i][allEntityList[i].length - 1])) {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length - 1; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
                var lastList = allEntityList[i].length - 1;
                if (Array.isArray(allEntityList[i][lastList])) {
                    // Push in foregin attributes, for every list push in entity followed by its value
                    for (let k = 0; k < allEntityList[i][lastList].length; k++) {
                        currentString += `<span style='text-decoration: overline black solid 2px;'>`;
                        // Iterate through all the lists with foreign keys
                        for (let l = 0; l < allEntityList[i][lastList][k].length; l++) {
                            // If element is array, aka strong key for weak entity
                            if (Array.isArray(allEntityList[i][lastList][k][l])) {
                                for (let m = 0; m < allEntityList[i][lastList][k][l].length; m++) {
                                    currentString += `${allEntityList[i][lastList][k][l][m].name}`;
                                }
                            } else {
                                currentString += `${allEntityList[i][lastList][k][l].name}`;
                            }
                        }
                        currentString += `</span>, `;
                    }
                }
            } else {
                // Again iterate through the list and push in only normal attributes
                for (let j = 2; j < allEntityList[i].length; j++) {
                    //Not array
                    if (!Array.isArray(allEntityList[i][j])) {
                        if (allEntityList[i][j].state == 'normal') {
                            currentString += `${allEntityList[i][j].name}, `;
                        }
                    }
                }
            }
            if (currentString.charAt(currentString.length - 2) == ",") {
                currentString = currentString.substring(0, currentString.length - 2);
            }
            currentString += `)</p>`;
            stringList.push(currentString);
        }
    }
    // Iterate through ERForeignData to find many to many relation
    for (let i = 0; i < ERForeignData.length; i++) {
        // If relation is exist in ERForeignData
        if (ERForeignData[i][0].kind == elementTypesNames.ERRelation) {
            var currentString = '';
            currentString += `<p>${ERForeignData[i][0].name} (`; // Push in relation's name
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add left side of relation
            for (let j = 0; j < ERForeignData[i][1].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][1][j])) {
                    for (let l = 0; l < ERForeignData[i][1][j].length; l++) {
                        currentString += `${ERForeignData[i][1][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][1][j].name}`;
                }
            }
            currentString += `</span>, `;
            currentString += `<span style='text-decoration: underline overline black solid 2px;'>`;
            // Add right side of relation
            for (let j = 0; j < ERForeignData[i][2].length; j++) {
                // If element is array, aka strong key for weak entity
                if (Array.isArray(ERForeignData[i][2][j])) {
                    for (let l = 0; l < ERForeignData[i][2][j].length; l++) {
                        currentString += `${ERForeignData[i][2][j][l].name}`;
                    }
                } else {
                    currentString += `${ERForeignData[i][2][j].name}`;
                }
            }
            currentString += `</span>`;
            currentString += `)</p>`;
            stringList.push(currentString)
        }
    }
    // Adding multi-valued attributes to the string
    for (let i = 0; i < allEntityList.length; i++) {
        for (let j = 2; j < allEntityList[i].length; j++) {
            // Write out multi attributes
            if (allEntityList[i][j].state == 'multiple') {
                // add the multiple attribute as relation
                var multipleString = `<p>${allEntityList[i][j].name}( <span style='text-decoration:underline black solid 2px'>`;
                // add keys from the entity the multiple attribute belongs to
                for (let k = 0; k < allEntityList[i][1].length; k++) {
                    // add the entity the key comes from in the begining of the string
                    multipleString += `${allEntityList[i][0].name}`;
                    // If element is array, aka strong key for weak entity
                    if (Array.isArray(allEntityList[i][1][k])) {
                        for (let l = 0; l < allEntityList[i][1][k].length; l++) {
                            multipleString += `${allEntityList[i][1][k][l].name}`;
                        }
                    } else {
                        multipleString += `${allEntityList[i][1][k].name}`;
                    }
                    multipleString += `, `;
                }
                // add the multiple attribute in the relation
                multipleString += `${allEntityList[i][j].name}`;
                multipleString += `</span>)</p>`;
                stringList.push(multipleString);
            }
        }
    }
    //Add each string element in stringList[] into a single string.
    var stri = "";
    for (let i = 0; i < stringList.length; i++) {
        stri += new String(stringList[i] + "\n\n");
    }
    //if its empty, show a message instead.
    if (stri == "") {
        stri = "The feature you are trying to use is linked to ER tables and it appears you do not have any ER elements placed. Please place an ER element and try again."
    }
    return stri;
}

/**
 * @description Generates the string that contains the current State Diagram info.
 * @returns Connected State Diagram in the form of a string.
 */
function generateStateDiagramInfo() {
    const ENTITY = 0, SEEN = 1, LABEL = 2;
    const stateInitial = [];
    const stateFinal = [];
    const stateSuper = [];
    const stateElements = [];
    const stateLines = [];
    const queue = [];
    let output = "";
    let re = new RegExp("\\[.+\\]");
    // Picks out the lines of type "State Diagram" and place it in its local array.
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].type == entityType.SD) {
            stateLines.push(lines[i]);
        }
    }

    // Picks out the entities related to State Diagrams and place them in their local arrays.
    for (let i = 0; i < data.length; i++) {
        if (data[i].kind == elementTypesNames.SDEntity) {
            stateElements.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLInitialState) {
            stateInitial.push([data[i], false]);
        } else if (data[i].kind == elementTypesNames.UMLFinalState) {
            stateFinal.push([data[i], true]);
        } else if (data[i].kind == elementTypesNames.UMLSuperState) {
            stateSuper.push([data[i], false]);
        }
    }

    // Initialises the BFS by adding the Initial states to the queue.
    for (let i = 0; i < stateInitial.length; i++) {
        stateInitial[i][SEEN] = true;
        queue.push(stateInitial[i]);
    }

    // Loop through all entities that are connected.
    while (queue.length > 0) {
        let head = queue.shift();
        const connections = [];
        // Finds all entities connected to the current "head" and adds line labels to a list.
        for (let i = 0; i < stateLines.length; i++) {
            if (stateLines[i].fromID == head[ENTITY].id) {
                for (let j = 0; j < stateElements.length; j++) {
                    if (stateLines[i].toID == stateElements[j][ENTITY].id) {
                        stateElements[j][LABEL] = stateLines[i].label;
                        connections.push(stateElements[j]);
                    }
                }
                for (let j = 0; j < stateFinal.length; j++) {
                    if (stateLines[i].toID == stateFinal[j][ENTITY].id) {
                        stateFinal[j][LABEL] = stateLines[i].label;
                        connections.push(stateFinal[j]);
                    }
                }
                for (let j = 0; j < stateSuper.length; j++) {
                    if (stateLines[i].toID == stateSuper[j][ENTITY].id) {
                        stateSuper[j][LABEL] = stateLines[i].label;
                        connections.push(stateSuper[j]);
                    }
                }
            }
        }
        // Add any connected entity to the output string, and if it has not been "seen" it is added to the queue.
        for (let i = 0; i < connections.length; i++) {
            if (connections[i][LABEL] == undefined) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}"</p>`;
            } else if (re.test(connections[i][LABEL])) {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with guard "${connections[i][LABEL]}"</p>`;
            } else {
                output += `<p>"${head[ENTITY].name}" goes to "${connections[i][ENTITY].name}" with label "${connections[i][LABEL]}"</p>`;
            }
            if (connections[i][SEEN] === false) {
                connections[i][SEEN] = true;
                queue.push(connections[i]);
            }
        }
    }
    // Adds additional information in the view.
    output += `<p>Initial States: ${stateInitial.length}</p>`;
    output += `<p>Final States: ${stateFinal.length}</p>`;
    output += `<p>Super States: ${stateSuper.length}</p>`;
    output += `<p>SD States: ${stateElements.length}</p>`;
    output += `<p>Lines: ${stateLines.length}</p>`;

    //if no state diagram exists, return a message to the user instead.
    if ((stateLines.length == 0) && (stateElements.length == 0) && (stateInitial.length == 0) && (stateFinal.length == 0) && (stateSuper.length == 0)) {
        output = "The feature you are trying to use is linked to state diagrams and it appears you do not have any state elements placed. Please place a state element and try again."
    }
    return output;
}
