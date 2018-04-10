/*
----- THIS FILE HAS THE FUNCTIONS FOR THE ARRAY -----
----- DIAGRAM AND HOW IT SHOULD BE USED BY THE SYSTEM -----
*/

//--------------------------------------------------------------------
// Symbol - stores a diagram symbol
//--------------------------------------------------------------------
function Symbol(kind) {
    this.kind = 2;                  // Diagram object kind is always 2 for symbols
    this.targeted = false;
    this.symbolkind = kind;         // Symbol kind (1 UML diagram symbol 2 ER Attribute)
    this.operations = [];           // Operations array
    this.attributes = [];           // Attributes array
    this.textsize = 14;             // 14 pixels text size is default
    this.symbolColor = '#fff';      // change background colors on entities
    this.strokeColor = '#000';      // change standard line color
    this.lineWidth = 2;
    var textscale = 10;
    this.name = "New Class";        // Default name is new class
    this.key_type = "none"          // Defult key tyoe for a class.
    this.sizeOftext = "none"        // Used to set size of text.
    this.topLeft;                   // Top Left Point
    this.bottomRight;               // Bottom Right Point
    this.middleDivider;             // Middle divider Point
    this.centerPoint;               // centerPoint
    this.shadowBlur = 10;           // Shadowblur for all objects
    this.shadowOffsetX = 3;         // The horizontal distance of the shadow for the object.
    this.shadowOffsetY = 6;         // The vertical distance of the shadow for the object.
    this.shadowColor = "rgba(0, 0, 0, 0.3)"; // The shadow color

    // Connector arrays - for connecting and sorting relationships between diagram objects
    this.connectorTop = [];
    this.connectorBottom = [];
    this.connectorLeft = [];
    this.connectorRight = [];

    //--------------------------------------------------------------------
    // Returns the quadrant for a x,y coordinate in relation to bounding box and box center
    // Quadrant Layout:
    //       0|1     Top = 0     Right = 1
    //      -----    Bottom = 2  Left = 3
    //       3|2
    //--------------------------------------------------------------------
    this.getquadrant = function (xk, yk) {
        // Read cardinal points
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;
        var vx = points[this.centerPoint].x;
        var vy = points[this.centerPoint].y;
        // Compute deltas and k
        var dx = x1 - vx;
        var dy = y1 - vy;
        var k = dy / dx;
        if (xk > vx) {
            if (yk > vy) {
                // Bottom right quadrant
                var byk = vy + (k * (xk - vx));
                if (yk > byk) {
                    return 2;
                }
                return 1;
            } else {
                // Top right quadrant
                var byk = vy - (k * (xk - vx));
                if (yk > byk) {
                    return 1;
                }
                return 0;
            }
        } else {
            if (yk > vy) {
                // Bottom left quadrant
                var byk = vy - (k * (xk - vx));
                if (yk > byk) {
                    return 2;
                }
                return 3;
            } else {
                // Top left quadrant
                var byk = (k * (xk - vx)) + vy;
                if (yk > byk) {
                    return 3;
                }
                return 0;
            }
        }
        return -1;
    }

    //--------------------------------------------------------------------
    // Iterates over all relation ends and checks if any need to change quadrants
    //--------------------------------------------------------------------
    this.quadrants = function () {
        // Fix right connector box (1)
        var i = 0;
        while (i < this.connectorRight.length) {
            var xk = points[this.connectorRight[i].to].x;
            var yk = points[this.connectorRight[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 3) {
                conn = this.connectorRight.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 0) {
                conn = this.connectorRight.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else if (bb == 2) {
                conn = this.connectorRight.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix left connector box (3)
        var i = 0;
        while (i < this.connectorLeft.length) {
            var xk = points[this.connectorLeft[i].to].x;
            var yk = points[this.connectorLeft[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                conn = this.connectorLeft.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 0) {
                conn = this.connectorLeft.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else if (bb == 2) {
                conn = this.connectorLeft.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix top connector box (0)
        var i = 0;
        while (i < this.connectorTop.length) {
            var xk = points[this.connectorTop[i].to].x;
            var yk = points[this.connectorTop[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                conn = this.connectorTop.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 3) {
                conn = this.connectorTop.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 2) {
                conn = this.connectorTop.splice(i, 1);
                this.connectorBottom.push(conn[0]);
            } else {
                i++;
            }
        }
        // Fix bottom connector box (2)
        var i = 0;
        while (i < this.connectorBottom.length) {
            var xk = points[this.connectorBottom[i].to].x;
            var yk = points[this.connectorBottom[i].to].y;
            var bb = this.getquadrant(xk, yk);
            if (bb == 1) {
                conn = this.connectorBottom.splice(i, 1);
                this.connectorRight.push(conn[0]);
            } else if (bb == 3) {
                conn = this.connectorBottom.splice(i, 1);
                this.connectorLeft.push(conn[0]);
            } else if (bb == 0) {
                conn = this.connectorBottom.splice(i, 1);
                this.connectorTop.push(conn[0]);
            } else {
                i++;
            }
        }
    }

    //--------------------------------------------------------------------
    // Moves midpoint or other fixed point to geometric center of object again
    // Restricts resizing for classes
    //--------------------------------------------------------------------
    this.adjust = function () {
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var hw = (points[this.bottomRight].x - x1) * 0.5;
        var hh = (points[this.bottomRight].y - y1) * 0.5;
        if (this.symbolkind == 2 || this.symbolkind == 3) {
            points[this.centerPoint].x = x1 + hw;
            points[this.centerPoint].y = y1 + hh;
        } else if (this.symbolkind == 1) {
            // Place middle divider point in middle between x1 and y1
            points[this.middleDivider].x = x1 + hw;
            // If middle divider is below y2 set y2 to middle divider
            if (points[this.middleDivider].y > points[this.bottomRight].y) {
                points[this.bottomRight].y = points[this.middleDivider].y;
            }
            // If bottom right is below 0 set bottom right to top left
            if (hw < 0) {
                points[this.bottomRight].x = points[this.topLeft].x + 150;
            }
            // If top left is below middle divider set top left to middle divider
            if (points[this.topLeft].y > points[this.middleDivider].y) {
                points[this.topLeft].y = points[this.middleDivider].y;
            }
        } else if (this.symbolkind == 5){
            // Static size of relation. Makes resizing of relation impossible.
            points[this.topLeft].x = points[this.middleDivider].x-relationTemplate.width/2;
            points[this.topLeft].y = points[this.middleDivider].y-relationTemplate.height/2;
            points[this.bottomRight].x = points[this.middleDivider].x+relationTemplate.width/2;
            points[this.bottomRight].y = points[this.middleDivider].y+relationTemplate.height/2;
        }
    }

    //--------------------------------------------------------------------
    // Sorts the connector
    //--------------------------------------------------------------------
    this.sortConnector = function (connector, direction, start, end, otherside) {
        var delta = (end - start) / (connector.length + 1);
        if (direction == 1) {
            // Vertical connector
            connector.sort(function(a, b) {
                var y1 = points[a.to].y;
                var y2 = points[b.to].y;
                return y1 - y2;
            });
            var ycc = start;
            for (var i = 0; i < connector.length; i++) {
                ycc += delta;
                points[connector[i].from].y = ycc;
                points[connector[i].from].x = otherside;
            }
        } else {
            connector.sort(function(a, b) {
                var x1 = points[a.to].x;
                var x2 = points[b.to].x;
                return x1 - x2;
            });
            var ycc = start;
            for (var i = 0; i < connector.length; i++) {
                ycc += delta;
                points[connector[i].from].y = otherside;
                points[connector[i].from].x = ycc;
            }
        }
    }

    //--------------------------------------------------------------------
    // Sorts all connectors
    //--------------------------------------------------------------------
    this.sortAllConnectors = function () {
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;
        this.sortConnector(this.connectorRight, 1, y1, y2, x2);
        this.sortConnector(this.connectorLeft, 1, y1, y2, x1);
        this.sortConnector(this.connectorTop, 2, x1, x2, y1);
        this.sortConnector(this.connectorBottom, 2, x1, x2, y2);
    }

    //--------------------------------------------------------------------
    // Returns true if xk,yk is inside the bounding box of the symbol
    //--------------------------------------------------------------------
    this.isClicked = function(xCoordinate, yCoordinate) {
        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;
        if (x1 < xCoordinate && xCoordinate < x2 && y1 < yCoordinate && yCoordinate < y2) {
            return true;
        } else {
            return false;
        }
    }

    //--------------------------------------------------------------------
    // Returns line distance to segment object e.g. line objects (currently only relationship markers)
    //--------------------------------------------------------------------
    this.checkForHover = function (xCoordinate, yCoordinate) {
        var topLeftX = points[this.topLeft].x;
        var topLeftY = points[this.topLeft].y;
        var bottomRightX = points[this.bottomRight].x;
        var bottomRightY = points[this.bottomRight].y;
        var width = bottomRightX - topLeftX;
        var height = bottomRightY - topLeftY;
        var boxHypotenuseElevatedBy2 = width * width + height * height;
        var result = ((xCoordinate - topLeftX) * width + (yCoordinate - topLeftY) * height) / boxHypotenuseElevatedBy2;
        if (result > 1) {
            result = 1;
        } else if (result < 0) {
            result = 0;
        }
        var x = topLeftX + result * width;
        var y = topLeftY + result * height;
        width = x - xCoordinate;
        height = y - yCoordinate;
        if ((width * width + height * height) < 15) {
            return true;
        } else {
            return false;
        }
    }

    //--------------------------------------------------------------------
    // Updates all points referenced by symbol
    //--------------------------------------------------------------------
    this.move = function (movex, movey) {
        points[this.topLeft].x += movex;
        points[this.topLeft].y += movey;
        points[this.bottomRight].x += movex;
        points[this.bottomRight].y += movey;
        if (this.symbolkind == 1 || this.symbolkind == 5) {
            points[this.middleDivider].x += movex;
            points[this.middleDivider].y += movey;
        } else if (this.symbolkind == 2) {
            points[this.centerPoint].x += movex;
            points[this.centerPoint].y += movey;
        } else if (this.symbolkind == 3) {
            for (var i = 0; i < this.arity.length; i++) {
                for (var j = 0; j < this.arity[i].length; j++) {
                    this.arity[i][j].x += movex;
                    this.arity[i][j].y += movey;
                }
            }
        }
    }

    //--------------------------------------------------------------------
    // erase/delete
    // attempts to erase object completely from canvas
    //--------------------------------------------------------------------
    this.erase = function () {
        this.movePoints();
        this.emptyConnectors();
    }

    //--------------------------------------------------------------------
    // Empties every connector of the object
    //--------------------------------------------------------------------
    this.emptyConnectors = function () {
        for (var i = 0; i < this.connectorTop.length; i++) {
            this.connectorTop.splice(i, 1);
            i--;
        }
        for(var i = 0; i < this.connectorRight.length; i++) {
            this.connectorRight.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorBottom.length; i++) {
            this.connectorBottom.splice(i, 1);
            i--;
        }
        for (var i = 0; i < this.connectorLeft.length; i++) {
            this.connectorLeft.splice(i, 1);
            i--;
        }
    }

    //--------------------------------------------------------------------
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.movePoints = function () {
        points[this.topLeft] = waldoPoint;
        points[this.bottomRight] = waldoPoint;
        points[this.centerPoint] = waldoPoint;
        points[this.middleDivider] = waldoPoint;
    }
    //--------------------------------------------------------------------
    // Moves all relevant points, within the object, off the canvas.
    // IMP!: Should not be moved back on canvas after this function is run.
    //--------------------------------------------------------------------
    this.removePointFromConnector = function(point) {
        var broken = false;
        for(var i = 0; i < this.connectorTop.length; i++){
            if(this.connectorTop[i].to == point || this.connectorTop[i].from == point){
                this.connectorTop.splice(i,1);
                broken = true;
                break;
            }
        }
        if(!broken){
            for(var i = 0; i < this.connectorBottom.length; i++){
                if(this.connectorBottom[i].to == point || this.connectorBottom[i].from == point){
                    this.connectorBottom.splice(i,1);
                    break;
                }
            }
            for(var i = 0; i < this.connectorRight.length; i++){
                if(this.connectorRight[i].to == point || this.connectorRight[i].from == point){
                    this.connectorRight.splice(i,1);
                    break;
                }
            }
            for(var i = 0; i < this.connectorLeft.length; i++){
                if(this.connectorLeft[i].to == point || this.connectorLeft[i].from == point){
                    this.connectorLeft.splice(i,1);
                    break;
                }
            }
        }
    }
    this.getPoints = function() {
        var privatePoints = [];
        if(this.symbolkind==3){
            for (var i = 0; i < this.connectorTop.length; i++) {
                if(this.getquadrant(this.connectorTop[i].to.x,this.connectorTop[i].to.y) != -1){
                    privatePoints.push(this.connectorTop[i].to);
                }
                if(this.getquadrant(this.connectorTop[i].from.x,this.connectorTop[i].from.y) != -1){
                    privatePoints.push(this.connectorTop[i].from);
                }
            }
            for (var i = 0; i < this.connectorRight.length; i++) {
                if(this.getquadrant(this.connectorRight[i].to.x,this.connectorRight[i].to.y) != -1){
                    privatePoints.push(this.connectorRight[i].to);
                }
                if(this.getquadrant(this.connectorRight[i].from.x,this.connectorRight[i].from.y) != -1){
                    privatePoints.push(this.connectorRight[i].from);
                }
            }
            for (var i = 0; i < this.connectorBottom.length; i++) {
                if(this.getquadrant(this.connectorBottom[i].to.x,this.connectorBottom[i].to.y) != -1){
                    privatePoints.push(this.connectorBottom[i].to);
                }
                if(this.getquadrant(this.connectorBottom[i].from.x,this.connectorBottom[i].from.y) != -1){
                    privatePoints.push(this.connectorBottom[i].from);
                }
            }
            for (var i = 0; i < this.connectorLeft.length; i++) {
                if(this.getquadrant(this.connectorLeft[i].to.x,this.connectorLeft[i].to.y) != -1){
                    privatePoints.push(this.connectorLeft[i].to);
                }
                if(this.getquadrant(this.connectorLeft[i].from.x,this.connectorLeft[i].from.y) != -1){
                    privatePoints.push(this.connectorLeft[i].from);
                }
            }
        }
        privatePoints.push(this.topLeft);
        privatePoints.push(this.bottomRight);
        privatePoints.push(this.middleDivider);
        privatePoints.push(this.centerPoint);
        return privatePoints;
    }

    //--------------------------------------------------------------------
    // Returns all the lines connected to the object
    //--------------------------------------------------------------------
    this.getLines = function() {
        var privatePoints = this.getPoints();

        var lines = diagram.getLineObjects();
        var objectLines = [];
        for (var i = 0; i < lines.length; i++) {
            //Connected to connectors top, right, bottom and left; topLeft, bottomRight, centerPoint or middleDivider.
            for (var j = 0; j < privatePoints.length; j++) {
                if (lines[i].topLeft == privatePoints[j] || lines[i].bottomRight == privatePoints[j]) {
                    if(objectLines.indexOf(lines[i])==-1){
                        objectLines.push(lines[i]);
                        break;
                    }
                }
            }
        }
        return objectLines;
    }

    //--------------------------------------------------------------------
    // Redraws graphics
    //--------------------------------------------------------------------
    //     beginpath - moveto - lineto
    //
    //     För att göra streckad linje rita med
    //     ctx.setLineDash(segments);
    //--------------------------------------------------------------------
    this.draw = function () {
        ctx.lineWidth = this.lineWidth * 2;
        if (this.sizeOftext == 'Small') {
            textsize = 20;
        } else if (this.sizeOftext == 'Medium') {
            textsize = 30;
        } else if (this.sizeOftext == 'Large') {
            textsize = 50;
        } else {
            textsize = 14; //<-- Tiny and everything else
        }

        ctx.strokeStyle = (this.targeted || this.isHovered) ? "#F82" : this.strokeColor;

        var x1 = points[this.topLeft].x;
        var y1 = points[this.topLeft].y;
        var x2 = points[this.bottomRight].x;
        var y2 = points[this.bottomRight].y;

        ctx.save();

        if(this.symbolkind == 1){
          drawUML();
        }
        else if(this.symbolkind == 2){
          drawERAttribute(x1, y1, x2, y2);
        }
        else if(this.symbolkind == 3){
          drawEntity();
        }
        else if(this.symbolkind == 4){
          drawLine();
        }
        else if(this.symbolkind == 5){
          drawRelation();
        }

        ctx.restore();
        ctx.setLineDash([]);
    }
    this.drawUML = function(x1, y1, x2, y2)
    {
        var midy = points[this.middleDivider].y;
        ctx.font = "bold " + parseInt(textsize) + "px Arial";
        // Clear Class Box
        ctx.fillStyle = "#fff";
        ctx.fillRect(x1, y1, x2 - x1, y2 - y1);

        // Write Class Name
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
        if (this.key_type == 'Primary key') {
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5), y1 + (0.85 * this.textsize));
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + linelength, y1 + (0.85 * this.textsize) + 10);
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        }
        // Change Alignment and Font
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        ctx.font = parseInt(this.textsize) + "px Arial";
        // Clipping of text and drawing of attributes
        ctx.beginPath();
        ctx.moveTo(x1, y1 + (this.textsize * 1.5));
        ctx.lineTo(x2, y1 + (this.textsize * 1.5));
        ctx.lineTo(x2, midy);
        ctx.lineTo(x1, midy);
        ctx.lineTo(x1, y1 + (this.textsize * 1.5));
        ctx.clip();
        for (var i = 0; i < this.attributes.length; i++) {
            ctx.fillText(this.attributes[i].visibility + " " + this.attributes[i].text, x1 + (this.textsize * 0.3), y1 + (this.textsize * 1.7) + (this.textsize * i));
        }
        // Clipping of text and drawing of methods
        ctx.beginPath();
        ctx.moveTo(x1, midy);
        ctx.lineTo(x2, midy);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, midy);
        ctx.clip();
        ctx.textAlign = "start";
        ctx.textBaseline = "top";
        for (var i = 0; i < this.operations.length; i++) {
            ctx.fillText(this.operations[i].visibility + " " + this.operations[i].text, x1 + (this.textsize * 0.3), midy + (this.textsize * 0.2) + (this.textsize * i));
        }
        // Box
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        // Top Divider
        ctx.moveTo(x1, y1 + (this.textsize * 1.5));
        ctx.lineTo(x2, y1 + (this.textsize * 1.5));
        // Middie Divider
        ctx.moveTo(x1, midy);
        ctx.lineTo(x2, midy);
        ctx.stroke();
    }
    this.drawERAttribute = function(x1, y1, x2, y2)
    {
        ctx.font = "bold " + parseInt(textsize) + "px " + this.font; //scale the text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.symbolColor;
        ctx.lineWidth = this.lineWidth;

        //drawing a multivalue attribute
        if (this.key_type == 'Multivalue') {
            drawOval(x1 - 10, y1 - 10, x2 + 10, y2 + 10);
            ctx.stroke();
        }
        //drawing an derived attribute
        else if (this.key_type == 'Drive') {
            ctx.setLineDash([5, 4]);
            drawOval(x1 - 10, y1 - 10);
        }
        else if (this.key_type == 'Primary key') {
            var linelength = ctx.measureText(this.name).width;
            ctx.beginPath(1);
            ctx.moveTo(x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) - (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.lineTo(x1 + ((x2 - x1) * 0.5) + (linelength * 0.5), (y1 + ((y2 - y1) * 0.5)) + 10);
            ctx.strokeStyle = this.strokeColor;

        }
        else {
            drawOval(x1, y1, x2, y2);
        }

        ctx.fill();
        makeShadow();

        ctx.fillStyle = this.fontColor;
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
    }
    this.drawEntity = function(x1, y1, x2, y2)
    {
        ctx.font = "bold " + parseInt(textsize) + "px " + this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.beginPath();
        if (this.key_type == "Weak") {
            ctx.moveTo(x1 - 5, y1 - 5);
            ctx.lineTo(x2 + 5, y1 - 5);
            ctx.lineTo(x2 + 5, y2 + 5);
            ctx.lineTo(x1 - 5, y2 + 5);
            ctx.lineTo(x1 - 5, y1 - 5);
        }
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x1, y1);
        ctx.closePath();
        ctx.fill();
        makeShadow();
        ctx.clip();
        ctx.fillStyle = this.symbolColor;
        ctx.fill();

        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
        ctx.font = parseInt(textsize) + "px " + this.font;
        ctx.fillStyle = "#fff";
        for (var i = 0; i < this.arity.length; i++) {
            for (var j = 0; j < this.arity[i].length; j++) {
                var arity = this.arity[i][j];
                ctx.textAlign = arity.align;
                ctx.textBaseline = arity.baseLine;
                ctx.fillText(arity.text, arity.x, arity.y);
            }
        }
    }
    this.drawLine = function(x1, y1, x2, y2)
    {
        // ER Attribute relationship is a single line
        if (this.key_type == "Forced") {
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = "#000";
        } else if (this.key_type == "Derived") {
            ctx.setLineDash([5, 4]);
        }
        else {
            ctx.lineWidth = this.lineWidth;
        }
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = this.strokeColor;
    }
    this.drawRelation = function(x1, y1, x2, y2)
    {
        ctx.font = "bold " + parseInt(textsize) + "px " + this.font;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var midx = points[this.middleDivider].x;
        var midy = points[this.middleDivider].y;
        ctx.beginPath();
        if (this.key_type == 'Weak') {
            ctx.moveTo(midx, y1 + 5);
            ctx.lineTo(x2 - 9, midy + 0);
            ctx.lineTo(midx + 0, y2 - 5);
            ctx.lineTo(x1 + 9, midy + 0);
            ctx.lineTo(midx + 0, y1 + 5);
        }
        ctx.moveTo(midx, y1);
        ctx.lineTo(x2, midy);
        ctx.lineTo(midx, y2);
        ctx.lineTo(x1, midy);
        ctx.lineTo(midx, y1);
        ctx.fillStyle = this.symbolColor;
        makeShadow();
        ctx.fill();
        ctx.closePath();
        ctx.clip();

        ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.fillStyle = this.fontColor;
        ctx.fillText(this.name, x1 + ((x2 - x1) * 0.5), (y1 + ((y2 - y1) * 0.5)));
    }

}

function makeShadow(){
    ctx.save();
    ctx.shadowBlur = this.shadowBlur;
    ctx.shadowOffsetX = this.shadowOffsetX;
    ctx.shadowOffsetY = this.shadowOffsetY;
    ctx.shadowColor = this.shadowColor;
    ctx.fill();
    ctx.restore();
}

this.drawOval = function (x1, y1, x2, y2) {
    var middleX = x1 + ((x2 - x1) * 0.5);
    var middleY = y1 + ((y2 - y1) * 0.5);
    ctx.beginPath();
    ctx.moveTo(x1, middleY);
    ctx.quadraticCurveTo(x1, y1, middleX, y1);
    ctx.quadraticCurveTo(x2, y1, x2, middleY);
    ctx.quadraticCurveTo(x2, y2, middleX, y2);
    ctx.quadraticCurveTo(x1, y2, x1, middleY);
}
