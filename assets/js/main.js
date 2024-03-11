var pieces = initHilite();
var hilite = initHilite();
var threat = initFalse();
var movecheck = initFalse();
var movemap = initFalse();

var game_state = "";
var stored_state = "";
var stored_piece = "";
var escaping_piece = "";
var escape_ok = false;
var game_turn = "";
var last_start = "o";
var game_winner = "";
var game_count = 0;
var count_out = -1;

var isel = -1;
var jsel = -1;
var iesc = -1;
var jesc = -1;

var game_move = 0;
var game_capt = 0;
var game_ante = 0;
var game_posn = 0;
var game_chief = 0;
var game_desc = "";

var got_escape = new Array();
var pass_count = new Array();
var piece_count = new Array();
var piece_value = new Array();
var piece_mods = new Array();
var piece_desc = new Array();
var piece_vals = new Array();
var force_desc = new Array();
var force_cost = new Array();

var di = new Array(-1,-1,0,1,1,1,0,-1);
var dj = new Array(0,1,1,1,0,-1,-1,-1);

var piece_names = new Array();
var color_names = new Array();
var color_swap = new Array();
var letter_map = "ABCDEFGHIJ";
var number_map = "0987654321";

var controls;
let imgLoc = "assets/images/";

// **************************************************************

function initPieces() {
    return new Array(new Array("ow","op","od",(piece_mods['o']['o']) ? "oo" : "of",(game_posn) ? "oc" : "oq",(game_posn) ? "oq" : "oc",(piece_mods['o']['o']) ? "oo" : "of","od","op","ow"),new Array("ot","on","on","on","on","on","on","on","on","ot"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("xx","xx","xx","xx","xx","xx","xx","xx","xx","xx"),new Array("bt","bn","bn","bn","bn","bn","bn","bn","bn","bt"),new Array("bw","bp","bd",(piece_mods['b']['o']) ? "bo" : "bf","bc","bq",(piece_mods['b']['o']) ? "bo" : "bf","bd","bp","bw"));
}

function initHilite() {
    return new Array(new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"),new Array("u","u","u","u","u","u","u","u","u","u"));
}

function initFalse() {
    return new Array(new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false),new Array(false,false,false,false,false,false,false,false,false,false));
}

function showBoard() {
    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            if (document.getElementById) {
                document.getElementById(i+""+j).src = imgLoc + pieces[i][j] + hilite[i][j] + ".gif";
            } else {
                document[i+""+j].src = imgLoc + pieces[i][j] + hilite[i][j] + ".gif";
            }
        }
    }
}

function hiliteMoves(i, j, mode) {
    var c = pieces[i][j].charAt(0);
    var p = pieces[i][j].charAt(1);

    if (mode == 1) {
        c = escaping_piece.charAt(0);
        p = escaping_piece.charAt(1).toUpperCase();
        escape_ok = false;
    }

    var mods = piece_mods[c][p];

    if (mods[5]) getThreat(c);

    if (mode == 0) hilite = initHilite();

    movemap = initFalse();
    movecheck = initFalse();

    if ((mods[1] > 5) && !mods[0] && (mods[3] != "x")) {
        if ((mods[5] == 2) || !mods[4]) {
            alert("This may take a while...");
            getStep(c, i, j, mods, 0, '', '', mode);
        } else {
            if (mods[3] == "e") {
                for (var a=0; a<10; a++) {
                    for (var b=0; b<10; b++) {
                        if ((pieces[a][b] == "xx") && !threat[a][b]) {
                            if ((Math.abs(a-i) <= mods[1]) && (Math.abs(b-j) <= mods[1])) {
                                hilite[a][b] = "p";
                                escape_ok = true;
                            }
                        }
                    }
                }
            } else {
                for (var a=0; a<10; a++) {
                    for (var b=0; b<10; b++) {
                        if ((pieces[a][b] == "xx") && !threat[a][b]) {
                            if (((Math.abs(a-i)+Math.abs(b-j) <= mods[1]) && (Math.abs(a-i)%2 == Math.abs(b-j)%2)) || ((Math.abs(a-i) <= mods[1]) && (Math.abs(b-j) <= mods[1]) && (Math.abs(a-i)%2 == 0) && (Math.abs(a-i)%2 == Math.abs(b-j)%2))) {
                                hilite[a][b] = "p";
                                escape_ok = true;
                            }
                        }
                    }
                }
            }
        }
    } else {
        getStep(c, i, j, mods, 0, '', '', mode);
    }
}

function getStep(c, i, j, mods, depth, first, firstdir, mode) {
    var ni = 0;
    var nj = 0;
    var moves = "";

    switch ((depth) ? mods[3] : mods[2]) {
        case 'f':
            moves = (c == "b") ? "01267" : "23456";
            break;
        case 'b':
            moves = (c == "b") ? "0123567" : "1234567";
            break;
        case 'p':
            moves = "0246";
            break;
        case 'd':
            moves = "1357";
            break;
        case 'e':
            moves = "01234567";
            break;
        case 'o':
            moves = (first == "d") ? "0246" : "1357";
            break;
        case 's':
            moves = (first == "p") ? "0246" : "1357";
            break;
        case 'x':
            moves = firstdir;
            break;
    }

    if ((pieces[i][j].charAt(0) != game_turn)
        && (mods[0] || (depth == mods[1]))
        && (!mods[5] || ((pieces[i][j] == "xx") && !threat[i][j]))) {
        if (mode == 0) {
            hilite[i][j] = "h";
        } else if (mode == 1) {
            hilite[i][j] = "p";
            escape_ok = true;
        } else {
            threat[i][j] = true;
        }
    }

    movemap[i][j] = mods[1] - depth + 1;
    movecheck[i][j] = true;

    if (depth < mods[1]) {
        for (var l=0; l<moves.length; l++) {
            move = moves.substr(l, 1);

            ni = i + di[move];
            nj = j + dj[move];

            if (!depth) {
                first = (move%2 == 0) ? "p" : "d";
                firstdir = move;
            }

            if ((ni>=0) && (ni<10) && (nj>=0) && (nj<10)
                && !movecheck[ni][nj]
                && (!mods[0] || (movemap[ni][nj] < (mods[1]-depth)))
                && (!depth || mods[4] || (pieces[i][j] == "xx"))
                && ((mods[5] < 2) || !threat[ni][nj])) {
                getStep(c, ni, nj, mods, depth+1, first, firstdir, mode);
            }
        }
    }

    movecheck[i][j] = false;
}

function getThreat(c) {
    var en = color_swap[c];

    threat = initFalse();

    for (var i=0; i<10; i++) {
        for (var j=0; j<10; j++) {
            if ((pieces[i][j].charAt(0) == en) && !piece_mods[en][pieces[i][j].charAt(1)][5]) {
                hiliteMoves(i, j, 2);
            }
        }
    }
}

function finishMove(i, j, p1, p2) {
    var winner = 0;
    var loser = 0;
    var bounty = 0;

    var c1 = p1.charAt(0);
    var c2 = p2.charAt(0);
    var a1 = 0;
    var a2 = 10;
    var r1 = 0;
    var r2 = 0;

    p1 = p1.charAt(1);
    p2 = p2.charAt(1);

    if (game_move == 1) {
        controls[c2+"stake"].value = parseInt(controls[c2+"stake"].value) - 1;
        controls.pot.value = parseInt(controls.pot.value) + 1;
    } else if (game_move == 2) {
        controls[c2+"stake"].value = parseInt(controls[c2+"stake"].value) - piece_vals[c2][p2];
        controls.pot.value = parseInt(controls.pot.value) + piece_vals[c2][p2];
    }

    if (p1 != "x") {
        if (game_capt > 0) {
            a1 = piece_vals[c1][p1];
            a2 = piece_vals[c2][p2];

            if (a1 == 0) {
                winner = 2;
                loser = 1;
            } else {
                if (game_capt == 2) {
                    controls[c2+"stake"].value = parseInt(controls[c2+"stake"].value) - piece_vals[c2][p2];
                    bounty = piece_vals[c2][p2];
                }

                if ((game_capt == 2) && (parseInt(controls[c1+"stake"].value) < piece_vals[c1][p1])) {
                    controls.mess.value = controls.mess.value + "\n" + color_names[c1] + " can't ante enough to defend that piece.";
                    winner = 2;
                    loser = 1;
                } else {
                    if (game_capt == 2) {
                        controls[c1+"stake"].value = parseInt(controls[c1+"stake"].value) - piece_vals[c1][p1];
                        bounty += piece_vals[c1][p1];
                    }

                    r1 = Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
                    r2 = Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);

                    while (r1+a1 == r2+a2) {
                        r1 = Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
                        r2 = Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
                    }

                    winner = (r1+a1 > r2+a2) ? 1 : 2;
                    loser = (r1+a1 < r2+a2) ? 1 : 2;
                }

                controls.moves.value += "(" + eval("c"+winner+".toUpperCase()") + ")";
            }
        } else {
            winner = 2;
            loser = 1;
        }

        pieces[i][j] = eval("c"+winner+"+p"+winner);
        showBoard();

        if (game_capt == 2) {
            controls[eval("c"+winner)+"stake"].value = parseInt(controls[eval("c"+winner)+"stake"].value) + bounty;
        }

        if (game_ante == 3) {
            controls[eval("c"+winner)+"stake"].value = parseInt(controls[eval("c"+winner)+"stake"].value) + piece_vals[eval("c"+loser)][eval("p"+loser)];
            controls.pot.value = parseInt(controls.pot.value) - piece_vals[eval("c"+loser)][eval("p"+loser)];
        }

        if ((p1 == "q") || ((p1 == "c") && (p2 == "c"))) {
            controls.moves.value += (p1 == "q") ? " P" : " C";
            game_state = "won";
            game_winner = eval("c"+winner);
        } else if (!game_chief && (eval("p"+loser) == "c")) {
            game_state = "drawn";
            controls.moves.value += " d";
        } else {
            piece_count[eval("c"+loser)]--;
            piece_count[eval("c"+loser)] -= piece_vals[eval("c"+loser)][eval("p"+loser)];

            if ((piece_count['b'] == 3) && (piece_count['o'] == 3) && (piece_value['b'] == piece_value['o'])) {
                controls.mess.value = controls.mess.value + "\nWarning! Game will be drawn in 10 moves!";
                count_out = 11;
            }
        }
    }

    if (game_state == "turning") {
        turnOver(false);
    } else {
        gameOver();
    }
}

function turnOver(passed) {
    var old_turn = game_turn;

    game_turn = color_swap[game_turn];

    if (document.getElementById) {
        document.getElementById(old_turn+"pasb").src = imgLoc + game_turn+"esc.gif";
        document.getElementById(game_turn+"pasb").src = imgLoc + game_turn+"pas.gif";
    } else {
        document[old_turn+"pasb"].src = imgLoc + game_turn+"esc.gif";
        document[game_turn+"pasb"].src = imgLoc + game_turn+"pas.gif";
    }

    controls.mess.value = color_names[game_turn] + "'s turn.";
    controls.mess.setAttribute("class", game_turn);

    if (game_turn == "b") {
        game_count++;
        controls.moves.value += "\n" + game_count + ".	";
    } else {
        controls.moves.value += "	";
    }

    game_state = "selecting";

    if (count_out > -1) {
        count_out--;

        if (count_out == 0) {
            controls.moves.value += " d";
            game_state = "drawn";

            gameOver();
        } else {
            controls.mess.value = controls.mess.value + " " + Math.ceil(count_out/2) + " moves remaining.";
        }
    }

    if (passed) {
        pass_count[old_turn]++;

        if (pass_count[old_turn] > 1) {
            controls.moves.value += " X";
            game_state = "won";
            game_winner = game_turn;
            gameOver();
        }
    } else {
        pass_count[old_turn] = 0;
    }
}

function gameOver() {
    if (game_state == "drawn") {
        controls.mess.value = "The game is drawn.";
    } else {
        controls.mess.value = color_names[game_winner] + " wins!";
        controls[game_winner+"stake"].value = parseInt(controls[game_winner+"stake"].value) + parseInt(controls.pot.value);
        controls.pot.value = 0;
    }

    controls.mess.setAttribute("class", "");

    if (document.getElementById) {
        document.getElementById("bpasb").src = imgLoc + "oesc.gif";
        document.getElementById("opasb").src = imgLoc + "besc.gif";
        document.getElementById("bescb").src = imgLoc + "oesc.gif";
        document.getElementById("oescb").src = imgLoc + "besc.gif";
        document.getElementById("bredb").src = imgLoc + "bred.gif";
        document.getElementById("oredb").src = imgLoc + "ored.gif";
    } else {
        document["bpasb"].src = imgLoc + "oesc.gif";
        document["opasb"].src = imgLoc + "besc.gif";
        document["bescb"].src = imgLoc + "oesc.gif";
        document["oescb"].src = imgLoc + "besc.gif";
        document["bredb"].src = imgLoc + "bred.gif";
        document["oredb"].src = imgLoc + "ored.gif";
    }

    controls.mess.value = controls.mess.value + "\nPress 'Ready'.";

    game_state = "overing";
}

function startGame() {
    count_out = -1;

    isel = -1;
    jsel = -1;

    game_state = "selecting";
    game_turn = color_swap[last_start];

    got_escape['b'] = true;
    got_escape['o'] = true;

    if (document.getElementById) {
        document.getElementById("oescb").src = imgLoc + "oesc.gif";
        document.getElementById("bescb").src = imgLoc + "besc.gif";
        document.getElementById(game_turn+"pasb").src = imgLoc + game_turn+"pas.gif";
        document.getElementById(last_start+"pasb").src = imgLoc + game_turn+"esc.gif";
        document.getElementById("oredb").src = imgLoc + "besc.gif";
        document.getElementById("bredb").src = imgLoc + "oesc.gif";
    } else {
        document["oescb"].src = imgLoc + "oesc.gif";
        document["bescb"].src = imgLoc + "besc.gif";
        document[game_turn+"pasb"].src = imgLoc + game_turn+"pas.gif";
        document[last_start+"pasb"].src = imgLoc + game_turn+"esc.gif";
        document["oredb"].src = imgLoc + "besc.gif";
        document["bredb"].src = imgLoc + "oesc.gif";
    }

    game_count = 1;

    controls.mess.value = color_names[game_turn] + "'s turn.";
    controls.mess.setAttribute("class", game_turn);

    controls.moves.value = new Date().toGMTString() + "\n\n" + game_desc + force_desc[game_turn] + force_desc[last_start] + "\n1.	" + ((game_turn == "o") ? "...	" : "");

    last_start = game_turn;
}

function initGame() {
    if (document.getElementById) {
        document.getElementById("bpasb").src = imgLoc + "oesc.gif";
        document.getElementById("opasb").src = imgLoc + "besc.gif";
        document.getElementById("bredb").src = imgLoc + "oesc.gif";
        document.getElementById("oredb").src = imgLoc + "besc.gif";
        document.getElementById("bescb").src = imgLoc + "oesc.gif";
        document.getElementById("oescb").src = imgLoc + "besc.gif";
    } else {
        document["bpasb"].src = imgLoc + "oesc.gif";
        document["opasb"].src = imgLoc + "besc.gif";
        document["bredb"].src = imgLoc + "oesc.gif";
        document["oredb"].src = imgLoc + "besc.gif";
        document["bescb"].src = imgLoc + "oesc.gif";
        document["oescb"].src = imgLoc + "besc.gif";
    }

    if (game_ante > 0) {
        if ((controls.ostake.value < ((game_ante==1) ? 51 : 12)) && (controls.bstake.value < ((game_ante==1) ? 51 : 12))) {
            controls.ostake.value = parseInt(controls.ostake.value) + Math.floor(controls.pot.value / 2);
            controls.bstake.value = parseInt(controls.bstake.value) + Math.floor(controls.pot.value / 2);
            controls.pot.value = 0;
            alert("Neither player can ante, splitting pot.");
        }

        if (controls.ostake.value < ((game_ante==1) ? 51 : 12)) {
            alert("Orange can't ante. Game over.");
            controls.bstake.value = parseInt(controls.bstake.value) + parseInt(controls.pot.value);
            controls.pot.value = 0;
            game_state = "";
            return;
        }

        if (controls.bstake.value < ((game_ante==1) ? 51 : 12)) {
            alert("Black can't ante. Game over.");
            controls.ostake.value = parseInt(controls.ostake.value) + parseInt(controls.pot.value);
            controls.pot.value = 0;
            game_state = "";
            return;
        }

        if (game_ante == 1) {
            controls.ostake.value = parseInt(controls.ostake.value) - 51;
            controls.bstake.value = parseInt(controls.bstake.value) - 51;
            controls.pot.value = parseInt(controls.pot.value) + 100;
        }
    }

    pieces = initPieces();
    hilite = initHilite();

    showBoard();

    piece_count['b'] = 20;
    piece_value['b'] = force_cost['b'];
    pass_count['b'] = 0;
    piece_count['o'] = 20;
    piece_value['o'] = force_cost['o'];
    pass_count['o'] = 0;

    if (game_ante > 1) {
        game_state = "prepping";
        game_turn = color_swap[last_start];

        count_out = 0;

        controls.mess.value = color_names[game_turn] + ": select any pieces you want to play without.\nCurrent ante is "+force_cost[game_turn]+".\nPress 'Ready' when finished.";
        controls.mess.setAttribute("class", game_turn);

        if (document.getElementById) {
            document.getElementById(game_turn+"redb").src = imgLoc + game_turn+"red.gif";
        } else {
            document[game_turn+"redb"].src = imgLoc + imgLoc + game_turn+"red.gif";
        }
    } else {
        startGame();
    }
}

function getMods(c, bits) {
    var m = new Array();

    for (var i=0; i<bits.length; i++) {
        m[i] = parseInt(bits.charAt(i));
    }

    piece_mods[c] = new Array();
    piece_mods[c]['n'] = new Array(false,1,(m[0] != 0) ? 'b' : 'f','',false,0);
    piece_mods[c]['t'] = new Array(false,2,(m[1] != 0) ? 'e' : 'p',(m[1] != 0) ? 'o' : 'd',(m[1] == 2) ? true : false,0);
    piece_mods[c]['w'] = new Array((m[5] != 0) ? true : false,2,(m[6] != 0) ? 'e' : 'p',(m[6] == 2) ? 'e' : 's',false,0);
    piece_mods[c]['p'] = new Array((m[2] != 0) ? true : false,2,'d','d',false,0);
    piece_mods[c]['d'] = new Array((m[3] != 0) ? true : false,3,'p','p',false,0);
    piece_mods[c][(m[4] > 1) ? 'o' : 'f'] = new Array((m[4] % 2 != 0) ? true : false,3,'d','d',(m[4] > 1) ? false : true,0);
    piece_mods[c]['c'] = new Array((m[7] != 0) ? true : false,3,'e',(m[8] != 0) ? ((m[8] == 2) ? 'e' : 's') : 'x',false,0);
    piece_mods[c]['q'] = new Array((m[9] != 0) ? true : false,3,'e',(m[10] != 0) ? ((m[10] == 2) ? 'e' : 's') : 'x',true,1 + m[11]);
    piece_mods[c]['Q'] = new Array((m[12] != 0) ? true : false,10,'e',(m[13] != 0) ? ((m[13] == 2) ? 'e' : 's') : 'x',true,1 + m[14]);

    piece_vals[c] = new Array();
    piece_vals[c]['n'] = 1;
    piece_vals[c]['t'] = (m[1] == 0) ? 1 : 2;
    piece_vals[c]['w'] = (m[5] == 0) ? ((m[6] == 2) ? 3 : 1) : ((m[6] == 2) ? 4 : ((m[6] == 1) ? 3 : 2));
    piece_vals[c]['p'] = (m[2] == 0) ? 1 : 2;
    piece_vals[c]['d'] = (m[3] == 0) ? 2 : 3;
    piece_vals[c][(m[4] > 1) ? 'o' : 'f'] = (m[4] == 1) ? 5 : ((m[4] == 2) ? 2 : 3);
    piece_vals[c]['c'] = 10;
    piece_vals[c]['q'] = 0;

    piece_desc[c] = new Array();
    piece_desc[c]['n'] = ((m[0] != 0) ? "F" : "C") + "PN";
    piece_desc[c]['w'] = ((m[5] != 0) ? "F" : "C") + ((m[6] != 0) ? ((m[6] == 2) ? "W" : "C") : "") + "W";
    piece_desc[c]['p'] = ((m[2] != 0) ? "F" : "C") + "PW";
    piece_desc[c]['t'] = ((m[1] != 0) ? ((m[1] == 2) ? "W" : "F") : "C") + "T";
    piece_desc[c]['d'] = ((m[3] != 0) ? "F" : "C") + "D";
    piece_desc[c][(m[4] > 1) ? 'o' : 'f'] = ((m[4] % 2 != 0) ? "F" : "C") + ((m[4] > 1) ? 'O' : 'F');
    piece_desc[c]['c'] = ((m[7] != 0) ? "F" : "C") + ((m[8] != 0) ? ((m[8] == 2) ? "W" : "C") : "") + "C";
    piece_desc[c]['q'] = ((m[9] != 0) ? "F" : "C") + ((m[10] != 0) ? ((m[10] == 2) ? "W" : "C") : "") + ((m[11] != 0) ? "F" : "B") + "P (" + ((m[12] != 0) ? "F" : "C") + ((m[13] != 0) ? ((m[13] == 2) ? "W" : "C") : "") + ((m[14] != 0) ? "F" : "B") + "E)";

    m = new Array();

    for (var i in piece_desc[c]) {
        m[m.length] = piece_desc[c][i];
    }

    force_cost[c] = piece_vals[c]['c'] + 2*(piece_vals[c]['t'] + piece_vals[c]['w'] + piece_vals[c]['p'] + piece_vals[c]['d'] + piece_vals[c]['f']) + 8*piece_vals[c]['n'];
    force_desc[c] = color_names[c] + "'s force: " + m.join(", ") + "\n";
}

// **************************************************************

function initProg() {
    controls = document.forms.f.elements;

    color_names['o'] = "Orange";
    color_names['b'] = "Black";

    color_swap['o'] = "b";
    color_swap['b'] = "o";

    controls.pot.value = 0;
    controls.mess.value = "";
    controls.desc.value = "";
    controls.moves.value = "";


    // var loc = document.URL.indexOf("?") || 49;
    var loc = 49;

    if (loc == -1) {
        alert("ERROR - no query string!");
        return false;
    }

    var bits = document.URL.substr(loc+1).split("&");

    var str = "v=000000001010100-000000001010100-00000-100-100";

    for (loc=0; loc<bits.length; loc++) {
        if (bits[loc].substr(0, 2) == "v=") {
            str = bits[loc].substr(2);
        }
    }

    if (str == "") {
        alert("ERROR - no game code passed!");
        return false;
    } else if (!str.match(/[0-3]{15}-[0-3]{15}-[0-3]{5}-[0-9]+-[0-9]+/)) {
        alert("ERROR - invalid game code passed!");
        return false;
    }

    bits = str.split("-");

    getMods('b', bits[0]);
    getMods('o', bits[1]);

    game_move = parseInt(bits[2].charAt(0));
    game_capt = parseInt(bits[2].charAt(1));
    game_ante = parseInt(bits[2].charAt(2));
    game_posn = parseInt(bits[2].charAt(3));
    game_chief = parseInt(bits[2].charAt(4));

    game_desc = ((game_move > 0) ? ((game_move == 2) ? "Ante piece value to move" : "Ante 1 to move") : "Move for free") + "\n";
    game_desc += ((game_capt > 0) ? ((game_capt == 2) ? "Pieces duel for ante" : "Pieces duel") : "Pieces capture") + "\n";
    game_desc += ((game_ante > 0) ? ((game_ante > 1) ? ((game_ante == 3) ? "Ante by force size, captured pieces pay ransom" : "Ante by force size, winner takes all") : "Fixed ante, winner takes all") : "No game ante") + "\n\n";

    controls.ostake.value = bits[3];
    controls.bstake.value = bits[4];

    piece_names['n'] = "Panthan";
    piece_names['t'] = "Thoat";
    piece_names['w'] = "Warrior";
    piece_names['p'] = "Padwar";
    piece_names['d'] = "Dwar";
    piece_names['f'] = "Flier";
    piece_names['o'] = "Odwar";
    piece_names['c'] = "Chief";
    piece_names['q'] = "Princess";

    initGame();
}

function doClick(i, j) {
    var p1 = pieces[i][j];

    if (game_state == "prepping") {
        if ((p1.charAt(0) == game_turn) && (p1.charAt(1) != "c") && (p1.charAt(1) != "q")) {
            if (hilite[i][j] == "u") {
                piece_count[game_turn]--;
                piece_value[game_turn] -= piece_vals[game_turn][p1.charAt(1)];
                hilite[i][j] = "h";
            } else {
                piece_count[game_turn]++;
                piece_value[game_turn] += piece_vals[game_turn][p1.charAt(1)];
                hilite[i][j] = "u";
            }

            controls.mess.value = "Current ante is " + piece_value[game_turn] + ".\nPress 'Ready' when finished.";

            if (document.getElementById) {
                document.getElementById(i+""+j).src = imgLoc + pieces[i][j] + hilite[i][j] + ".gif";
            } else {
                document[i+""+j].src = imgLoc + pieces[i][j] + hilite[i][j] + ".gif";
            }
        }
    } else if (game_state == "selecting") {
        if (p1.charAt(0) == game_turn) {
            var ok = true;

            if ((game_move == 1) && (parseInt(controls[game_turn+"stake"].value) < 1)) {
                ok = false;
            } else if ((game_move == 2) && (parseInt(controls[game_turn+"stake"].value) < piece_vals[p1.charAt(0)][p1.charAt(1)])) {
                ok = false;
            }

            if (ok) {
                game_state = "moving";
                isel = i;
                jsel = j;

                hiliteMoves(i, j, 0);
                showBoard();
            } else {
                controls.mess.value = controls.mess.value + "\nYou can't ante enough to move that piece.";
            }
        }
    } else if (game_state == "escaping") {
        if (hilite[i][j] == "p") {
            pieces[i][j] = escaping_piece;
            pieces[iesc][jesc] = stored_piece;

            var p2 = escaping_piece.charAt(0);

            got_escape[p2] = false;

            if (document.getElementById) {
                document.getElementById(p2+"escb").src = imgLoc + color_swap[p2]+"esc.gif";
            } else {
                document[p2+"escb"].src = imgLoc + color_swap[p2]+"esc.gif";
            }

            escaping_piece = "xx";

            controls.moves.value += ((stored_state == "turning") ? "e" + letter_map.charAt(j) + number_map.charAt(i) : "(" + letter_map.charAt(jesc) + number_map.charAt(iesc) + "e" + letter_map.charAt(j) + number_map.charAt(i) + ") ");
        }

        if ((hilite[i][j] == "p") || (stored_state != "turning")) {
            for (var a=0; a<10; a++) {
                for (var b=0; b<10; b++) {
                    if (hilite[a][b] == "p") {
                        hilite[a][b] = "u";
                    }
                }
            }

            showBoard();

            game_state = stored_state;

            if (game_state == "turning") {
                finishMove(iesc, jesc, escaping_piece, stored_piece);
            } else {
                doClick(i, j);
            }
        }
    } else if (game_state == "moving") {
        if (hilite[i][j] == "h") {
            var ok = true;

            if ((game_capt == 2) && (parseInt(controls[game_turn+"stake"].value) < piece_vals[p1.charAt(0)][p1.charAt(1)])) {
                ok = false;
            }

            if (ok) {
                var p2 = pieces[isel][jsel];

                pieces[i][j] = p2;
                pieces[isel][jsel] = "xx";

                hilite = initHilite();

                showBoard();

                controls.moves.value += letter_map.charAt(jsel) + number_map.charAt(isel);

                if ((p1.charAt(1) == "x") || (game_capt > 0)) {
                    controls.moves.value += "-";
                } else {
                    controls.moves.value += "x";
                }

                controls.moves.value += letter_map.charAt(j) + number_map.charAt(i);

                game_state = "turning";

                if ((p1.charAt(1) == "q") && got_escape[p1.charAt(0)]) {
                    stored_state = game_state;
                    game_state = "escaping";
                    escaping_piece = p1;
                    stored_piece = p2;

                    iesc = i;
                    jesc = j;

                    hiliteMoves(i, j, 1);

                    if (escape_ok) {
                        showBoard();
                        return;
                    } else {
                        game_state = stored_state;
                    }
                }

                finishMove(i, j, p1, p2);
            } else {
                controls.mess.value = controls.mess.value + "You can't ante enough to attack with that piece.";
            }
        } else {
            hilite = initHilite();
            showBoard();

            game_state = "selecting";

            doClick(i, j);
        }
    }
}

function doPas(player) {
    if (((game_state == "selecting") || (game_state == "moving")) && (game_turn == player)) {
        controls.moves.value += "---";
        hilite = initHilite();
        showBoard();
        turnOver(true);
    }
}

function doRed(player) {
    if (game_state == "overing") {
        initGame();
    } else if (game_state == "prepping") {
        if (game_turn = player) {
            if (piece_count[player] < 4) {
                controls.mess.value = "You must have at least two pieces besides your Chief and Princess.\nReselect some pieces.";
            } else if (piece_value[player] > controls[player+"stake"].value) {
                controls.mess.value = "You don't have enough stake for this force.\nDeselect some pieces.";
            } else {
                controls.pot.value = parseInt(controls.pot.value) + piece_value[player];
                controls[player+"stake"].value = parseInt(controls[player+"stake"].value) - piece_value[player];

                var missing = new Array();

                for (var i=0; i<10; i++) {
                    for (var j=0; j<10; j++) {
                        if (hilite[i][j] == "h") {
                            pieces[i][j] = "xx";
                            hilite[i][j] = "u";

                            missing[missing.length] = letter_map.charAt(j) + number_map.charAt(i);
                        }
                    }
                }

                if (missing.length) {
                    force_desc[player] += "(missing " + missing.join(", ") + ")\n\n";
                } else {
                    force_desc[player] += "(force complete)\n\n";
                }

                showBoard();

                count_out++;

                if (count_out < 2) {
                    var old_turn = game_turn;
                    game_turn = color_swap[game_turn];

                    controls.mess.value = color_names[game_turn] + ": select any pieces you want to play without.\nCurrent ante is "+force_cost[game_turn]+".\nPress 'Ready' when finished.";
                    controls.mess.setAttribute("class", game_turn);

                    if (document.getElementById) {
                        document.getElementById(old_turn+"redb").src = imgLoc + game_turn+"esc.gif";
                        document.getElementById(game_turn+"redb").src = imgLoc + game_turn+"red.gif";
                    } else {
                        document[old_turn+"redb"].src = imgLoc + game_turn+"esc.gif";
                        document[game_turn+"redb"].src = imgLoc + game_turn+"red.gif";
                    }
                } else {
                    startGame();
                }
            }
        }
    }
}

function doEsc(player) {
    if ((game_state == "selecting") || (game_state == "moving")) {
        if (got_escape[player]) {
            for (var i=0; i<10; i++) {
                for (var j=0; j<10; j++) {
                    if (pieces[i][j] == player+"q") {
                        if ((game_state == "moving") && (isel == i) && (jsel == j)) {
                            hilite = initHilite();
                            showBoard();

                            game_state = "selecting";
                        }

                        stored_state = game_state;
                        stored_piece = "xx";
                        escaping_piece = pieces[i][j];
                        game_state = "escaping";

                        iesc = i;
                        jesc = j;

                        hiliteMoves(i, j, 1);

                        if (escape_ok) {
                            showBoard();
                        } else {
                            game_state = stored_state;
                        }
                    }
                }
            }
        }
    }
}

function showDesc(i, j) {
    if (game_state) {
        var mess = "";
        var c = pieces[i][j].charAt(0);
        var p = pieces[i][j].charAt(1);

        if (pieces[i][j].charAt(0) == "x") {
            mess = "";
        } else {
            mess = color_names[c];
            mess += " " + piece_names[p] + " (" + piece_desc[c][p] + "; " + piece_vals[c][p] + " pt" + ((piece_vals[c][p] == 1) ? "" : "s") + "): ";

            if (piece_mods[c][p][0]) {
                mess += "up to ";
            }

            mess += piece_mods[c][p][1] + " square" + ((piece_mods[c][p][1] == 1) ? " " : "s ");

            switch (piece_mods[c][p][2]) {
                case 'f':
                    mess += "forwards, diagonally forwards, or sideways";
                    break;
                case 'b':
                    mess += "in any direction except straight backwards";
                    break;
                case 'p':
                    mess += "orthogonally";
                    break;
                case 'd':
                    mess += "diagonally";
                    break;
                case 'e':
                    mess += "orthogonally or diagonally";
                    break;
            }

            if ((piece_mods[c][p][2] == "e") || (piece_mods[c][p][2] != piece_mods[c][p][3])) {
                switch (piece_mods[c][p][3]) {
                    case 'p':
                        mess += " then orthogonally";
                        break;
                    case 'd':
                        mess += " then diagonally";
                        break;
                    case 'e':
                        mess += " (or both)";
                        break;
                    case 'o':
                        mess += ", first one then the other";
                        break;
                    case 's':
                        if ((piece_mods[c][p][2] != "p") && (piece_mods[c][p][2] != "d")) mess += " (but not both)";
                        break;
                    case 'x':
                        mess += " in a straight line";
                        break;
                }
            }

            if (piece_mods[c][p][4]) mess += "; jumps";

            if (piece_mods[c][p][5]) mess += "; can't take pieces; can't enter " + ((piece_mods[c][p][5] == 2) ? "or cross " : "") + "threatened squares";
        }

        controls.desc.value = mess;
    }
}

function hideDesc(i, j) {
    if (game_state || controls.desc.value) {
        controls.desc.value = "";
    }
}