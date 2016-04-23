// ==UserScript==
// @name         SalzAdminImporter-FeWo
// @namespace    http://salztraeume-am-see.de
// @version      0.1
// @namespace    http://github.com/a2-team
// @description  Import Bookings from FeWo to Salzträum Admin Interface
// @author       Anton Wilhelm
// @include      https://www.fewo-direkt.de*
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/a2-team/userscripts/master/fewo-importer.user.js
// @downloadURL  https://raw.githubusercontent.com/a2-team/userscripts/master/fewo-importer.user.js
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
        var container = $("#message-overview");
        var code = container.find('#res-id').text().split(' ')[1];
        var guestName = container.find(".panel-title").text().trim();
        var guestProfile = container.find(".panel-title a").attr("href");
        var guestTotal = parseInt(container.find(".dl-inquiry-total-guests dt").text().trim());
        var dateRangeAndNights = container.find(".dl-inquiry").eq(0).find('dt').text().trim().split("(");
        var fromArray = dateRangeAndNights[0].split('-')[0].trim().split('.');
        var toArray = dateRangeAndNights[0].split('-')[1].trim().split('.');
        var from = '20' + fromArray[2] + '-' + fromArray[1] + '-' + fromArray[0];
        var to = '20' + toArray[2] + '-' + toArray[1] + '-' + toArray[0];
        var nights = parseInt(dateRangeAndNights[1]);
        var priceTotal = parseFloat($('[data-automation-id="ownerTotal"]').text().replace('.', '').replace(',','.'));

        var phone = '';
        var email = '';
        if (container.find(".traveler-phone").hasClass("hidden-phone") === false) {
            phone = container.find(".traveler-phone").text().trim();
        }
        if (container.find(".traveler-email").hasClass("hidden-email") === false) {
            email = container.find(".traveler-email").text().trim();
        }
        var flatLink = $('#globalnav-nav > nav > figure > a').attr("href");
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
        return [
            ['type', 'fewo'],
            ['_id', code],
            ['user_url', window.location.href],
            ['flat_name', flatName],
            ['flatLink', flatLink],
            ['from', from],
            ['to', to],
            ['nights', nights],
            ['guests', guestTotal],
            ['name', guestName],
            ['email', email],
            ['phone', phone],
            ['userProfile', guestProfile],
            ['price_total', priceTotal]
        ];
    };

    function initImportButton() {
        var template = '<div style="position: absolute;top: 10px;left: 25em;z-index: 9999999;">'+
            '<button class="__salz-imoprt" style="padding: 5px;background: #2a6ebb; color: #fff;">ADMIN IMPORT</button>'+
            '</div>';
        if ($("#message-overview").length > 0) {
            $(document.body).append(template);
            $(document.body).on('click', '.__salz-imoprt', function() {
                importToAdmin();
            });
        }
    }
    var iId = setInterval(function() {
        console.log('waiting', typeof jQuery, document.querySelector("#layout *"), document.querySelector(".ha-loading-overlay"));
        if (typeof jQuery != "undefined" && document.querySelector("#layout *") != null && document.querySelector(".ha-loading-overlay") == null) {
            clearInterval(iId);
            initImportButton();
        }
    }, 500);
})();
