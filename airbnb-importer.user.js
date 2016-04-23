// ==UserScript==
// @name         SalzAdminImporter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @namespace    http://github.com/timaschew
// @description  Import Bookings from AirBnb to Salzträum Admin Interface
// @author       Anton Wilhelm
// @include      https://www.airbnb.de/*
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/a2-team/userscripts/master/airbnb-importer.user.js
// @downloadURL  https://raw.githubusercontent.com/a2-team/userscripts/master/airbnb-importer.user.js
// ==/UserScript==

(function() {
    'use strict';
    var BASE = 'http://thunderwave.de:9773/admin/import?';
    var openInNewTab = function (url) {
        window.open(url, '_blank');
    };
    var importToAdmin = function() {
        var data = parseData();
        var urlParams = data.map(function(item) {
            return item.join('=');
        });
        var url = BASE + urlParams.join('&');
        console.log(url);
        openInNewTab(url);
    };
    var parseData = function() {
        var container =  $(".qt-reservation-info");
        var flatName = container.find("div").eq(0).text();
        var code = container.find("div").eq(3).text();
        var flatLink = $(".qt-reservation-info").find("div a").eq(0).attr("href");
        var fromArray = container.find("div").eq(6).text().split('.');
        var toArray = container.find("div").eq(9).text().split('.');
        var from = fromArray[2] + '-' + fromArray[1] + '-' + fromArray[0];
        var to = toArray[2] + '-' + toArray[1] + '-' + toArray[0];
        var guests = container.find("div").eq(12).text();
        var nightsText = $(".qt-payment-info").find("div").eq(4).find("span span").eq(2).text();
        var nights = parseInt((nightsText.match(/(\d{1,})/) || [,'-'])[1]);
        var priceTotal = parseFloat($(".qt-payment-info").find("div").eq(17).text());
        var guestName = $(".mini-profile").find('.h4').text().trim();
        var guestProfile = $(".mini-profile").find('.h4 a').attr('href');
        return [
            ['type', 'airbnb'],
            ['_id', code],
            ['user_url', window.location.href],
            ['flat_name', flatName],
            ['flatLink', 'https://www.airbnb.de' + flatLink],
            ['from', from],
            ['to', to],
            ['nights', nights],
            ['guests', guests],
            ['name', guestName],
            ['userProfile', 'https://www.airbnb.de' + guestProfile],
            ['price_total', priceTotal]
        ];
    };

    if ($(".qt-reservation-info").length > 0) {
        var template = '<div style="position: absolute;top: 0;left: 0;width: 80px;z-index: 9999;">'+
            '<button class="__salz-imoprt" style="padding: 5px;background: #FF5D62;">ADMIN IMPORT</button>'+
            '</div>';
        $(document.body).append(template);
        $(document.body).on('click', '.__salz-imoprt', importToAdmin);
    }
    
})();
