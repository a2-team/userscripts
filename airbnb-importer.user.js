// ==UserScript==
// @name         SalzAdminImporter
// @namespace    http://tampermonkey.net/
// @version      0.1
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
        if (window.location.host === "www.fewo-direkt.de") {
            var name = $('.traveler-name')[0].textContent.trim();
            var userProfile = $('.traveler-name')[0].href;
            var ref = $('#res-id').text().split(' ')[1];
            var phone = $('.traveler-phone').text();
            var email = $('.traveler-email').text();
            var dateRange = $('#header-inquiry-details > div.header-inquiry.clearfix > dl:nth-child(1) > dt').text().trim();
            var flatName = $('#globalnav-nav > nav > figure > a > figcaption').text();
            switch(flatName) {
                case '2342905':
                    flatName = 'Schmetterling';
                    break;
                case '2339483':
                    flatName = 'Eichhörnchen';
                    break;
                case '2367143':
                    flatName = 'Fuchs komplett';
                    break;
                case '2387954':
                    flatName = 'Fuchs 1';
                    break;
            }
            var flatLink = $('#globalnav-nav > nav > figure > a').attr('href');
            var dateRangeArray = dateRange.split(' ');
            var from = dateRangeArray[0];
            var to = dateRangeArray[2];
            var details = $('.dl-inquiry-total-guests').text().trim();
            var REGEX = /(\d+) (?:Nächte|Gäste|Erwachsene|Kinder)/g;
            var matches = details.match(REGEX);
            var nights = parseInt(matches[0]);
            var guestTotal = parseInt(matches[1]);
            var adult = parseInt(matches[2]);
            var teens = parseInt(matches[3]);
            var customerTotal = $('#paymentsummary [data-automation-id="total"]').text();
            var paymentOwner = $('[data-automation-id="ownerTotal"]').text();
            var paymentDetails = $('#paymentschedule > div > div.child-view.collapse.in > ul > li:nth-child(1) > div.row.payment-request-item > div.col-sm-8.col-md-8.col-lg-8 > ul > li.text-muted.disbursement > small').text();
            return [
                ['type', 'fewo'],
                ['_id', ref],
                ['user_url', window.location.href],
                ['flat_name', flatName],
                ['flatLink', flatLink],
                ['from', from],
                ['to', to],
                ['nights', nights],
                ['guests', guestTotal],
                ['name', name],
                ['email', email],
                ['phone', phone],
                ['userProfile', userProfile],
                ['price_total', paymentOwner]
            ];
        } else if (window.location.host === "www.airbnb.de") {
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
        }
    };

    if (window.location.host === "www.airbnb.de") {
        var template = '<div style="position: absolute;top: 0;left: 0;width: 80px;z-index: 9999;">'+
            '<button class="__salz-imoprt" style="padding: 5px;background: #FF5D62;">ADMIN IMPORT</button>'+
            '</div>';
        $(document.body).append(template);
        $(document.body).on('click', '.__salz-imoprt', function() {
            importToAdmin();
        });
    }
})();
