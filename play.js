 //Lindsay Walker
 //Mastermind code guessing game

 if (typeof(Mastermind) == 'undefined') Mastermind = {};

 Mastermind.game = (function(window, document, $, undefined) {
    var code = [];

    //called on new game or page load - creates an empty board
    function createBoard(difficulty) {

        for (var r = 0; r < 12; r++) //for each row
        {

            var row = makeElement('div',['row']); //create a row 
            var resultsRow = makeElement('div',['rowresult']); //create the results for the row

            //for each spot in the row
            for (var spot = 0; spot < (parseInt(getCodeLength()) + 1); spot++) {
                var space = makeElement("div",['space']); 
                space.id = r + ""  + spot;
                var space_img = makeElement("img");

                if (spot == (parseInt(getCodeLength()))) {
                    space.setAttribute('data-color','nothing');
                    space.classList.add('ok');
                }

                else { //otherwise blank space
                    var blank = 'blankspace';
                    space.setAttribute('data-color',blank);
                    space.classList.add('peg');
                }

                space.appendChild(space_img);
                row.appendChild(space);
                
                if (spot < parseInt(getCodeLength())) {
                    var rspace = makeElement("div",['space','resultpeg']);
                    rspace.setAttribute('data-color','rblankspace');
                    rspace.id = "r" + r + ""  + spot;

                    var r_space_img = makeElement("img");
                    rspace.appendChild(r_space_img);
                    resultsRow.appendChild(rspace); 
                }
            }

            document.getElementById("boardId").appendChild(row);
            document.getElementById("resultId").appendChild(resultsRow);
        }

        drawBoard();
        setCode();
    }

    //redraw the board
    function drawBoard() {

        var codeLength = document.getElementById("codeId").getAttribute("data-code-length");

        var grp = $(".space");
        var img_path;
        for (var s = 0; s < grp.length; s++) {
            if ($(grp[s]).hasClass('peg')) {
                img_path = "assets/" + grp[s].getAttribute("data-color") + getLevel() + ".png";
            }

            else if ($(grp[s]).hasClass('choice')) {
                img_path = "assets/" + grp[s].children[0].id + "easy.png";
            }

            else {
                img_path = "assets/" + grp[s].getAttribute("data-color") + ".png";
            }
            grp[s].children[0].src = img_path;
        }
    }

    //canvas for the black and white circle in instructions
    function drawCanvas(name) {
        var c = document.getElementById("instruct_canvas");
        //clearCanvas(c);
        var ctx = c.getContext("2d");

        drawCircle(ctx,"#FFF",16,20,12);
        drawCircle(ctx,"#000",16,70,12);
        drawLine(ctx,"#8C8C8C",55,17,73,17,3);
        drawLine(ctx,"#8C8C8C",55,24,73,24,3);
        drawLine(ctx,"#8C8C8C",55,67,73,67,3);
        drawLine(ctx,"#8C8C8C",55,74,73,74,3);
    }

    function drawCircle(ctx,color,x,y,radius) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,radius,0,Math.PI*2,false);
        ctx.shadowColor = '#8C8C8C';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    }

    function drawLine(ctx,color,x,y,x2,y2,w) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.shadowBlur = 0;
        ctx.moveTo(x,y);
        ctx.lineTo(x2,y2);
        ctx.lineWidth = w;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();        
    }

    //sets a random color code
    function setCode() {
        var colorArray = ['pink','orange','yellow','green','blue','indigo','purple','grey']; //possible colors
        var codeLength = document.getElementById("codeId").getAttribute("data-code-length");
        for (var spot = 0; spot < codeLength; spot++)
        {
            var randnum = Math.floor((Math.random()*8)+1);
            code[spot] = colorArray[randnum-1];
        }
    }   

    //helper functions for setting row/spot/code/etc.
    function makeElement(elementType, classesToAdd) {
        var div = document.createElement(elementType);
        if (typeof classesToAdd === 'undefined') { classesToAdd = []; }

        for (i = 0; i < classesToAdd.length; i++) {
            div.classList.add(classesToAdd[i]);
        }
        return div;
    }

    function getCodeLength() {
        var cl = document.getElementById("codeId").getAttribute("data-code-length");
        return cl;
    }

    function setCodeLength(codelen) {
        document.getElementById("codeId").setAttribute("data-code-length",codelen);       
    }

    function getCurrentSpot() {
        var cs = document.getElementById("boardId").getAttribute("data-current-spot");
        return cs;
    }

    //true for up, false for down
    function moveCurrentSpot(up) {
        if (up) { document.getElementById("boardId").setAttribute("data-current-spot", parseInt(getCurrentSpot())+1); }
        else {document.getElementById("boardId").setAttribute("data-current-spot", parseInt(getCurrentSpot())-1); }
    }

    function resetCurrentSpot() {
        document.getElementById("boardId").setAttribute("data-current-spot",0);
    }

    function getCurrentRow() {
        var cs = document.getElementById("boardId").getAttribute("data-current-row");
        return cs;
    }

    function resetCurrentRow() {
        document.getElementById("boardId").setAttribute("data-current-row",11);
    }


    function incrementCurrentRow() {
        var cs = document.getElementById("boardId").setAttribute("data-current-row", parseInt(getCurrentRow())-1);
        return cs;
    }

    function getLevel() {
        var diff = document.getElementById("codeId").getAttribute("data-difficulty");
        return diff;       
    }

    function setLevel(lev) {
        var diff = document.getElementById("codeId").setAttribute("data-difficulty",lev);    
    }

    function getId() {
        var id = getCurrentRow() + "" + getCurrentSpot();
        return id;
    }

    //called after each click of a color/arrow/giveup
    function move(color) {
        if (document.getElementById("pegs").getAttribute("data-active") == "true")
        {
            if (color == 'backarrow') { goBack(); }

            else if (color == 'giveup') { endGame(false); }

            //placing a peg in the row
            else if (getCurrentSpot() <= getCodeLength()) { fillSpace(color); }

            //if the the row is filled
            if (rowFilled()) { showOK(); }

            //advance to the next spot
            if (getCurrentSpot() <= getCodeLength()) {
                moveCurrentSpot(true); 
            }
        }
    }

    //Ok has been clicked on
    function Ok(okstatus) {
        //make sure all spots are filled
        if (rowFilled()) {
            hideOK();
            $('.ok').off('click');
            var win = checkCode(); //see if the code submitted is correct
            drawBoard();
            moveToNextRow(win);
        }
    }

    //show the ok button
    function showOK(status) {
        var id = getCurrentRow() + "" + getCodeLength();    
        //$(id).addClass('on');
        document.getElementById(id).classList.add('on');

        fill(id,'ok',"assets/ok.png");
        $(".ok").on('click',function() {
            Ok();
        })
    }

    function hideOK() {
        document.getElementById(getId()).setAttribute("data-color",'nothing');  
        document.getElementById(getId()).classList.remove('on');
        fill(getId(),'nothing',"assets/nothing.png");
    }

    //Get rid of the most previous peg selection (before ok is clicked for a row)
    function goBack() {
        if (getCurrentSpot() != '0') {
             //if last spot in row is filled
            if (getCurrentSpot() == getCodeLength()) {
                hideOK();
            }

            moveCurrentSpot(false); 
            fill(getId(),'blankspace',"assets/blankspace" + getLevel() + ".png");
            //document.getElementById(getId()).setAttribute('data-color','blankspace');
        }
        moveCurrentSpot(false);
    }

    function fillSpace(color) {
        var id = getCurrentRow() + "" + getCurrentSpot();
        var img_path = "assets/" + color + getLevel() + ".png";
        fill(id,color,img_path);
    }

    function fill(id,color,path) {
        document.getElementById(id).setAttribute("data-color",color);
        var child = document.getElementById(id).children;
        child[0].src = path;
    }

    //if a row is full, return true, otherwise false
    function rowFilled() {
        var lastSpaceId  = getCurrentRow() + "" + (parseInt(getCodeLength())-1);
        if (document.getElementById(lastSpaceId).getAttribute("data-color") != 'blankspace') {
            return true;
        }
        return false;
    }

    //go to next row and update the row marker
    function moveToNextRow(win) {
        if (getCurrentRow() == 0 || win) {
            endGame(win);
        }

        else {
            resetCurrentSpot(); //if not move to the next row
            incrementCurrentRow(); //bottom row is 12 so move up one (ie 11)
            $("#arrow").animate({
                top: '-=50px'
            }, 750);
        }
    }

    //game ends either to a correct guess or running out of rows
    function endGame(win) {

        //show the code
        $("#codeId").empty();
        for (var i = 0; i < parseInt(getCodeLength()); i++) {
            var code_space = makeElement("div",['space','peg']);
            code_space.setAttribute("data-color",code[i]);
            var code_img = makeElement("img");
            code_img.src = "assets/" + code[i] + getLevel() + ".png";
            code_space.appendChild(code_img);
            document.getElementById("codeId").appendChild(code_space);
        }

        var code_div = makeElement("div",['space','peg']);
        var end_img = makeElement("img");
        if (win == true) { end_img.src = "assets/win.png";}
        else { end_img.src = "assets/fail.png"; }
        code_div.appendChild(end_img);
        document.getElementById("codeId").appendChild(code_div);
        document.getElementById('pegs').setAttribute("data-active",'false');
    }

    function checkCode() {
        var blackcount = 0;
        var whitecount = 0;
        var done = [];
        var tempboard = [];

        //set up an array with the users selected colors in the row
        for (var a = 0; a < getCodeLength(); a++) {
            tempboard[a] = document.getElementById(getCurrentRow() + "" + a).getAttribute("data-color");
        }

        //for the code spot (black pegs) correct are removed from temp array
        for (var x = 0; x < getCodeLength(); x++) {
            if (code[x] == tempboard[x]) {
                blackcount++;
                tempboard[x] = 'blankspace';
                done[x] = true;
            }
        }

        //for the code colors (white pegs) 
        for (var y = 0; y < getCodeLength(); y++) {
            for (var z = 0; z < getCodeLength(); z++) {
                if (code[y] == tempboard[z] && done[y] != true) {
                    whitecount++;
                    tempboard[z] = 'blankspace';
                    done[y] = true;
                }
            }
        }

        var b = 0;
        for (b = 0; b < blackcount; b++) {   
            document.getElementById('r' + getCurrentRow() + "" + b).setAttribute('data-color','blackpeg');
        }

        for (var w = blackcount; w < (whitecount + blackcount); w++) {
            document.getElementById('r' + getCurrentRow() + "" + w).setAttribute('data-color','whitepeg');
        }

        if (blackcount == getCodeLength()) { return true; }

        else { return false; }
    }

    //adjust the selected difficulty and change the code length
    function changeDifficulty(d) {
        
        var child_list = document.getElementById('level_select').children;
       
        for (var index = 0; index < child_list.length; index++) {
            var child = child_list[index];
            if (child.classList.contains('selected')) { child.classList.remove('selected'); }
        }

        document.getElementById(d).classList.add("selected");
        if (d == "easy") {
            setCodeLength(4);
            if ($("#resultId").hasClass("difficult")) {
                document.getElementById("resultId").classList.remove("difficult");
            }
        }

        else if (d == "medium") {
            setCodeLength(5);
            document.getElementById("resultId").classList.add("difficult");
        }

        else if (d == "hard") { 
            setCodeLength(6); 
            document.getElementById("resultId").classList.add("difficult");
        }

        setLevel(d);
        newGame(d); //start a new game if the difficulty is changed
    }

    //start fresh
    function newGame() {
        resetCurrentSpot();
        resetCurrentRow();
        $("#boardId").empty(); //clear the board
        $("#resultId").empty(); //clear the results
        $("#codeId").empty();
        $("#arrow").css("top",'0');
        document.getElementById('pegs').setAttribute("data-active",'true');
        Mastermind.game.play(getLevel());
    }

    return { 
        setup : function() {
            drawCanvas();
            $("#pegs").on('click','img',function() { 
                move(this.id);
            });

            $("#new_game").on('click',function() {
                newGame();
            });

            $(".levels").on('click','.difficulty',function() {
                changeDifficulty(this.id);
            })
        },

        play : function(difficulty) {
            var currRow = document.getElementById("boardId").getAttribute("data-current-row");
            var currSpot = document.getElementById("boardId").getAttribute("data-current-spot");
            if (currRow == 11 && currSpot == 0)
            {
                createBoard(difficulty);
            }

            else { drawBoard(); }
        }
    }
})(window, document, jQuery);