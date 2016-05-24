// ==UserScript==
// @name         RattleSnake
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over slither!
// @author       Yario
// @match        http://slither.io/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// ==/UserScript==

var serverIp = "127.0.0.1:1337";

$("div#nick_holder.taho").after(`<script type="text/javascript">function startBots(){var xhttp = new XMLHttpRequest;xhttp.onreadystatechange = function(){4==xhttp.readyState&&200==xhttp.status&&eval(xhttp.responseText)},xhttp.open("GET","http://` + serverIp + `/inject",!0),xhttp.send()}</script><br><br><center><button type="submit" class="nsi" style="margin-left: auto; margin-right: auto; width: 360px; height: 30px; color: rgb(128, 104, 192); text-align: center; font-size: 14px; font-family: 'Lucida Sans Unicode', 'Lucida Grande', sans-serif; opacity: 0.67417;"" onclick="startBots()">Start Bots !</button></center>`);