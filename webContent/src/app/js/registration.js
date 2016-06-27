(function(window, $) {

    var pages = ['app/view/registration.html'];
    var control = uPREP.createControl(uPREP.SERVICE.REGISTRATION, pages);
    control.buttonToggle = true;

    control.WEBSOCKET_PORT = 9310;
    control.JSON_SPACE = 3;
    control.webSocket = null;

    control.REQUEST_TYPE = {
        "REGISTER": 1,
        "UPDATE" : 2,
        "DELETE" : 3
    };

    //control.TAB = {
    //    "REGISTRATION": 1,
    //    "RESERVATION": 2
    //};

    control.TYPE = {
        "CREATE" : 0,
        "MODIFY" : 1,
        "DELETE" : 2
    };
    control.sendMessageType = null;

    control.registrationData = null;
    control.reservationData = null;

    control.selectedRegistrationData = null;
    control.selectedReservationData = null;

    control.RegistrationTable = null;

    control.bind = function() {
        //control.getOverlayMethodRadioGroup().change(function(event){
        //    control.currentOverlayMethod = event.target.value;
        //});

        //control.getOverlayRemoveAllButton().click(function(){
        //    swal({
        //            title : "Are you sure?",
        //            text : "Are you sure you want to delete All Overlay Network?",
        //            type : "warning",
        //            showCancelButton : true,
        //            confirmButtonColor : "#DD6B55",
        //            confirmButtonText : "Yes, delete it!",
        //            closeOnConfirm : true
        //        },
        //        function () {
        //            control.removeAllOverlay();
        //        });
        //});

        /*control.getRegistrationTab().click(function(){
            control.changeTab(control.TAB.REGISTRATION);
        });
        control.getReservationTab().click(function(){
            control.changeTab(control.TAB.RESERVATION);
        });*/
        /*control.getRegistrationRegisterButton().click(function(){
            control.sendRestfulMessage(control.REQUEST_TYPE.REGISTER);
        });
        control.getUpdateRegisterButton().click(function(){
            control.sendRestfulMessage(control.REQUEST_TYPE.UPDATE);
        });
        control.getDeleteRegisterButton().click(function(){
            control.sendRestfulMessage(control.REQUEST_TYPE.DELETE);
        });*/

        control.getRegistrationRegisterButton().popover({
            trigger: 'manual'
            ,template: '<div class="popover" style="max-width: 445px;width:445px;z-index:10" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            ,content : function(){
                return control.getResourceInfoContentFormHtml().html();
            }
        }).click(function(e){
            e.stopPropagation();
            control.getUpdateRegisterButton().popover('hide');

            $(this).popover('toggle');
            $('.content-type-m').hide();
            $('.content-type-c').show();

            control.setPopUpWindowOverlayInfo(control.TYPE.CREATE);
        });

        control.getUpdateRegisterButton().popover({
            trigger: 'manual'
            ,template: '<div class="popover" style="max-width: 445px;width:445px;z-index:10" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            ,content : function(){
                return control.getResourceInfoContentFormHtml().html();
            }
        }).click(function(e){
            e.stopPropagation();
            control.getRegistrationRegisterButton().popover('hide');

            $(this).popover('toggle');
            $('.content-type-m').show();
            $('.content-type-c').hide();

            control.setPopUpWindowOverlayInfo(control.TYPE.MODIFY);
        });

        control.getDeleteRegisterButton().click(function(){
            control.setRestDeleteMessage();
        });

        control.getApplyRegisterButton().click(function(){
            control.sendRestfulMessage();
        });

        control.getRefreshButton().click(function(){
            control.resetRegistrationTab();
            control.requestRegistrationData();
        });

        control.initializedResource();
    };

    control.event = function(event) {
        if(event.action=='beforeShow'){
            if(control.RegistrationTable != null) {
                control.resetRegistrationTab();
                control.requestRegistrationData();
            }
        }
        if(event.action=='afterShow'){
            if(control.RegistrationTable == null){
                // control.requestOverlayList();
            }
        }
    };

    control.initializedResource = function() {
        control.getServerInfo();
        control.getWebSocketInfo();
        control.requestRegistrationData();
        //control.changeTab(control.TAB.REGISTRATION);
    };

    /* control ���� */
    control.getCacheServerIpText = function() {
        return $( "#cacheServerIpText" );
    };
    control.getCacheServerPortText = function() {
        return $( "#cacheServerPortText" );
    };
    /*control.getRegistrationTab = function() {
        return $( "#registrationTab" );
    };
    control.getReservationTab = function() {
        return $( "#reservationTab" );
    };*/
    control.getRegistrationRequestTextArea = function() {
        return $( "#registrationRequestTextArea" );
    };
    control.getRegistrationResponseTextArea = function() {
        return $( "#registrationResponseTextArea" );
    };
    control.getOMSAddressText = function() {
        return $( "#omsAddressText" );
    };
    control.getRegistrationRegisterButton = function() {
        return $( "#registrationRegisterButton" );
    };
    control.getRegistrationDataTable = function() {
        return $( "#registrationDataTable" );
    };
    control.getRegistrationGrid = function() {
        return $( "#registrationGrid" );
    };
    control.getUpdateRegisterButton = function() {
        return $( "#updateRegisterButton" );
    };
    control.getDeleteRegisterButton = function() {
        return $( "#deleteRegisterButton" );
    };
    control.getCacheServerUrlText = function() {
        return $( "#cacheServerUrlText" );
    };
    control.getCacheServerStorageSizeText = function() {
        return $( "#cacheServerStorageSizeText" );
    };
    control.getCacheServerMaxUpBwText = function() {
        return $( "#cacheServerMaxUpBwText" );
    };
    control.getCacheServerMaxDnBwText = function() {
        return $( "#cacheServerMaxDnBwText" );
    };
    control.getCacheServerMaxNumConnectionText = function() {
        return $( "#cacheServerMaxNumConnectionText" );
    };
    control.getCacheServerMaxNumOverlayNetworkText = function() {
        return $( "#cacheServerMaxNumOverlayNetworkText" );
    };
    control.getResourceInfoContentFormHtml = function() {
        return $( "#resourceInfoContentFormHtml" );
    };
    control.getApplyRegisterButton = function() {
        return $( "#applyRegisterButton" );
    };
    control.getLastUpdateTime = function() {
        return $( "#lastUpdateTime" );
    };
    control.getRefreshButton = function() {
        return $( "#refreshButton" );
    };
    control.getRefreshMessage = function() {
        return $( "#refreshMessage" );
    };

    /* WebSocket */
    control.initializeWebSocket = function(port, path){
        control.webSocket = uPREP.createWebSocket(port, path, function(result) {
            control.setRefreshMessageVisible(true);
        },function(result){
            control.requestRegistrationData();
        });
    };

    /* Ajax Request */
    control.getWebSocketInfo = function(){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/WebSocketPort', 'POST', jsonData, function(result){
            var port = control.WEBSOCKET_PORT;
            if(result.WEBSOCKET != null) {
                port = result.WEBSOCKET;
            }
            control.initializeWebSocket(port,"REGISTRATION");
        },function(err){
            console.log(err);
        });
    };
    control.getServerInfo = function(callback){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/GetServerInfo', 'POST', jsonData, function(result){

            if(result.CS_URL != null){
                control.getCacheServerUrlText().val(result.CS_URL);
            }
            if(result.PROPERTIES != null){
                var properties = result.PROPERTIES;
                control.getCacheServerStorageSizeText().val(properties["storage-size"]);
                control.getCacheServerMaxUpBwText().val(properties["max-up-bw"]);
                control.getCacheServerMaxDnBwText().val(properties["max-dn-bw"]);
                control.getCacheServerMaxNumConnectionText().val(properties["max-num-connection"]);
                control.getCacheServerMaxNumOverlayNetworkText().val(properties["max-num-overlay-network"]);

                if(callback != null){
                    callback(result.PROPERTIES);
                }
            }

        },function(err){
            console.log(err);
        });
    };
    /*control.requestRequestJsonFormatter = function(type ){
        var jsonData = {
            "type" : type
        };

        uPREP.sendAjax('/JsonFormatter', 'POST', jsonData, function(result){
            var msg = result;

            try{
                msg = JSON.stringify(result, null, control.JSON_SPACE);
            }catch(err){
            }
            control.getRegistrationRequestTextArea().val(msg);
        },function(err){
            control.getRegistrationResponseTextArea().val("Request Error : " + err);
        });
    };*/
    control.sendRestfulMessage = function(){
        var json = {};
        var jsonStr = control.getRegistrationRequestTextArea().val().trim();
        var url = control.getOMSAddressText().val().trim();
        var ajaxUrl = null;
        var isDelete = false;
        if(control.sendMessageType == control.TYPE.CREATE){
            ajaxUrl = "/Registration";
        }
        else if(control.sendMessageType == control.TYPE.MODIFY){
            ajaxUrl = "/ResourceUpdate/" + control.selectedRegistrationData.RESOURCE_ID;
        }
        else if(control.sendMessageType == control.TYPE.DELETE){
            ajaxUrl = "/ResourceDelete/" + control.selectedRegistrationData.RESOURCE_ID;
            isDelete = true;
        }
        //var ajaxUrl = "/Registration";

        //if(type != control.REQUEST_TYPE.REGISTER && control.selectedRegistrationData == null){
        //    control.getRegistrationResponseTextArea().val("Failed to create JSON Object");
        //} else if(type == control.REQUEST_TYPE.UPDATE){
        //    ajaxUrl = "/ResourceUpdate/"+control.selectedRegistrationData.RESOURCE_ID;
        //}else if(type == control.REQUEST_TYPE.DELETE){
        //    ajaxUrl = "/ResourceDelete/"+control.selectedRegistrationData.RESOURCE_ID;
        //    parseJson = false;
        //}

        if(!isDelete){
            try{
                if(jsonStr.length > 0){
                    json = $.parseJSON(jsonStr);
                }
            }catch(err){
                control.getRegistrationResponseTextArea().val("Failed to create JSON Object");
                return;
            }
        }
        json.OMS_URL = url;

        uPREP.sendAjax(ajaxUrl, "POST" , json, function(result){
            var msg = result;

            try{
                msg = JSON.stringify(result, null, control.JSON_SPACE);
            }catch(err){
            }
            control.getRegistrationResponseTextArea().val(msg);
            //control.requestRegistrationData();
            if(isDelete){
                control.resetRegistrationTab(isDelete);
            }
        },function(err){
            if(err.status == 200){
                control.getRegistrationResponseTextArea().val("Response 200 OK");
                //control.requestRegistrationData();
                if(isDelete){
                    control.resetRegistrationTab(isDelete);
                }
            }else{
                var errMsg;
                try{
                    errMsg = JSON.stringify(err.responseJSON, null, control.JSON_SPACE);
                }catch(err){
                }
                control.getRegistrationResponseTextArea().val("Request Error :" + err.status + "\n" + errMsg);
            }
        });
    };
    control.requestRegistrationData = function(typeFlag){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/GetRegistrationList', 'POST', jsonData, function(result){
            control.createRegistrationDataTable(result, typeFlag, function(){

            });
        },function(err){
            console.log(err);
        });
    };
    control.getRegistrationData = function(callback){
        var jsonData = {};
        jsonData.UPREP = "uPREP";
        jsonData.RESOURCE_ID = control.selectedRegistrationData.RESOURCE_ID;

        uPREP.sendAjax('/GetRegistration', 'POST', jsonData, function(result){
            if(callback != null && result != null){
                callback(result);
            }
        },function(err){
            control.getRegistrationResponseTextArea().val("Request Error : " + err);
        });
    };

    /* Control Action */
    control.setRefreshMessageVisible = function(type){
        if(type != null && type == true){
            control.getRefreshMessage().show();
        }
        else{
            control.getRefreshMessage().hide();
        }
    };
    control.setCurrentTime = function(){
        var data = new Date();
        var current_time = data.toTimeString().split(" ")[0];
        control.getLastUpdateTime().text(current_time);
    };
    control.setPopUpWindowOverlayInfo =  function(type){
        control.sendMessageType = type;

        if(type == control.TYPE.CREATE){
            $("#resourceInfoOmsIp").val("");
            $("#resourceInfoOmsPort").val("");
            $("#resourceInfoIp").val("");
            $("#resourceInfoPort").val("");
            $("#resourceInfoExpires").val(0);
            $("#resourceInfoType").val("cs");

            control.getServerInfo(function(result){
                $("#resourceInfoStorageSize").val(result["storage-size"]);
                $("#resourceInfoMaxUpBw").val(result["max-up-bw"]);
                $("#resourceInfoMaxDnBw").val(result["max-dn-bw"]);
                $("#resourceInfoMaxNumConnection").val(result["max-num-connection"]);
                $("#resourceInfoMaxNumOverlayNetwork").val(result["max-num-overlay-network"]);
            });

        }else if(type == control.TYPE.MODIFY){
            control.getRegistrationData(function(result){
                $("#resourceInfoExpires").val(result.EXPIRES);
                $("#resourceInfoType").val(result.TYPE);
                $("#resourceInfoOmsUrl").val(result.OMS_URL + "/" + result.RESOURCE_ID);

                control.getServerInfo(function(result){
                    $("#resourceInfoStorageSize").val(result["storage-size"]);
                    $("#resourceInfoMaxUpBw").val(result["max-up-bw"]);
                    $("#resourceInfoMaxDnBw").val(result["max-dn-bw"]);
                    $("#resourceInfoMaxNumConnection").val(result["max-num-connection"]);
                    $("#resourceInfoMaxNumOverlayNetwork").val(result["max-num-overlay-network"]);
                });
            });
        }
    };
    control.closePopupWindow = function(){
        control.getRegistrationRegisterButton().popover('hide');
        control.getUpdateRegisterButton().popover('hide');
    };
    control.resetRegistrationTab = function(isDelete){
        //control.requestRequestJsonFormatter(control.ACTION_TYPE.REGISTER);
       // control.getOMSAddressText().val("http://[IP]:[PORT]/oms/resource-pool");
        control.getOMSAddressText().val("");
        control.getRegistrationRequestTextArea().val("");
        control.getRegistrationResponseTextArea().val("");
        control.sendMessageType = null;
    };
    control.loadRegistrationDataTable = function(callback){

        control.RegistrationTable = $('#registrationDataTable').on('search.dt', control.OnChange).on('page.dt', control.OnChange).DataTable(
            {
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
                "order": [[ 4, "desc" ]]
            }
        );

        if(callback!=null){
            callback();
        }
    };
    control.createRegistrationDataTable = function(data, typeFlag, callback){
        control.registrationData = data;
        control.selectedRegistrationData = null;
        var html ="";

        control.setCurrentTime();
        control.setRefreshMessageVisible(false);

        if(control.RegistrationTable != null){
            $('#registrationDataTable').DataTable().destroy();
            control.RegistrationTable = null;
        }

        for(var index = 0; index < control.registrationData.length; index++){
            var trTag = "";

            var oms_url = control.registrationData[index].OMS_URL != null ? control.registrationData[index].OMS_URL: "-";
            var resource_id = control.registrationData[index].RESOURCE_ID != null ? control.registrationData[index].RESOURCE_ID: "-";
            var expires = control.registrationData[index].EXPIRES != null ? control.registrationData[index].EXPIRES: "";
            var type = control.registrationData[index].TYPE != null ? control.registrationData[index].TYPE: "";
            var created_at = control.registrationData[index].CREATED_AT != null ? control.registrationData[index].CREATED_AT: "-";
            var updated_at = control.registrationData[index].UPDATED_AT != null ? control.registrationData[index].UPDATED_AT: "-";
           /* var max_connection = control.registrationData[index].MAX_NUM_CONNCTION != null ? control.registrationData[index].MAX_NUM_CONNCTION: "";
            var max_overlay = control.registrationData[index].MAX_NUM_OVERLAY_NETWORK != null ? control.registrationData[index].MAX_NUM_OVERLAY_NETWORK: "";
            var max_up = control.registrationData[index].MAX_UP_BW != null ? control.registrationData[index].MAX_UP_BW: "";
            var max_down = control.registrationData[index].MAX_DN_BW != null ? control.registrationData[index].MAX_DN_BW: "";
            var storage = control.registrationData[index].STORAGE_SIZE != null ? control.registrationData[index].STORAGE_SIZE: "";*/

            trTag += "<tr>";
            trTag += "<td class='dataTableCell' style='none' name='RESOURCE_ID'>"+ resource_id +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ oms_url +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ type +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ expires +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ created_at +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ updated_at +"</td>";
            /*trTag += "<td class='dataTableCell' style='none'>"+ storage +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_connection +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_overlay +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_up +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_down +"</td>";*/
            trTag += "</tr>";

            html += trTag;
            //html += trTag.replace(/none/gi, isSelectedRow ? "background-color:#BDF3F3" : "");
        }

        control.getRegistrationGrid().html(html);
        control.loadRegistrationDataTable();

        control.bindingRegistrationDataTableSelectEvent();

        control.getUpdateRegisterButton().prop("disabled",true);
        control.getDeleteRegisterButton().prop("disabled",true);
        control.getApplyRegisterButton().prop("disabled",true);

        if(callback != null){
            callback();
        }
    };

    /* Event */
   /* control.changeTab = function(type){
        if(type == control.TAB.REGISTRATION){
            control.resetRegistrationTab();
            control.requestRegistrationData();
        }else if(type == control.TAB.RESERVATION){
            control.requestReservationData();
        }
    };*/
    control.OnChange = function(a,b,c){
        //control.setAutoRefreshStatus(control.overlayTable==null || control.overlayTable.page() == 0 && control.overlayTable.search() == "");
    };
    control.bindingRegistrationDataTableSelectEvent = function(){
        control.getRegistrationGrid().undelegate("td","click");
        control.getRegistrationGrid().delegate("td","click",function(){
            var col = $(this)[0];
            var currentRow = $(this).closest('tr');

            if(col != null) {
                var row = col.parentNode;

                if(row != null) {
                    var rowData = $.grep(control.registrationData,function(e){return e.RESOURCE_ID == row.cells["RESOURCE_ID"].textContent});
                    var data = null;

                    if(rowData.length > 0 && rowData[0] != null){
                        data = rowData[0];
                    }

                    if(data != null) {
                        control.selectedRegistrationData = data;
                        control.getRegistrationGrid().find("td").css({"background-color":""});
                        currentRow.find("td").css({"background-color":"#BDF3F3"});

                        //control.getOMSAddressText().val(control.selectedRegistrationData.OMS_URL + "/" +control.selectedRegistrationData.RESOURCE_ID);
                        control.getUpdateRegisterButton().prop("disabled",false);
                        control.getDeleteRegisterButton().prop("disabled",false);
                        //control.getRegistrationData(control.selectedRegistrationData.RESOURCE_ID);
                    }
                }
            }
        });
    };
    control.setRestDeleteMessage =  function(){
        control.sendMessageType = control.TYPE.DELETE;
        control.getRegistrationRequestTextArea().val("[ Delete Registration ] RESOURCE_ID :" + control.selectedRegistrationData.RESOURCE_ID);
        control.getOMSAddressText().val(control.selectedRegistrationData.OMS_URL + "/" + control.selectedRegistrationData.RESOURCE_ID);

        control.getApplyRegisterButton().prop("disabled",false);
    };
    control.convertJsonString = function(){
        var jsonResult = {};

        var omsIp = $("#resourceInfoOmsIp").val().trim();
        var omsPort = $("#resourceInfoOmsPort").val().trim();

        var type = $("#resourceInfoType").val().trim();
        var csUrl = control.getCacheServerUrlText().val();
        var ip = $("#resourceInfoIp").val().trim();
        var portStr = $("#resourceInfoPort").val();
        var expiresStr = $("#resourceInfoExpires").val();
        var storageSize = $("#resourceInfoStorageSize").val().trim();
        var maxUpBw = $("#resourceInfoMaxUpBw").val().trim();
        var maxDnBw = $("#resourceInfoMaxDnBw").val().trim();
        var maxNumConnection = $("#resourceInfoMaxNumConnection").val().trim();
        var maxNumOverlayNetwork = $("#resourceInfoMaxNumOverlayNetwork").val().trim();

        var omsUrl;
        var expires;
        var port;

        try{
            port = Number(portStr);
            expires = Number(expiresStr);
            storageSize = Number(storageSize);
            maxUpBw = Number(maxUpBw);
            maxDnBw = Number(maxDnBw);
            maxNumConnection = Number(maxNumConnection);
            maxNumOverlayNetwork = Number(maxNumOverlayNetwork);
        }catch(err){
            swal("","Failed to create JSON Object","info");
            return;
        }

        if(control.sendMessageType == control.TYPE.CREATE){
            omsUrl = "http://" + omsIp + ":" + omsPort +"/oms/resource-pool";

            var capa = {
                "storage-size":storageSize,
                "max-up-bw":maxUpBw,
                "max-dn-bw":maxDnBw,
                "max-num-connection":maxNumConnection,
                "max-num-overlay-network":maxNumOverlayNetwork
            };

            jsonResult = {
                "type" : type
                ,"cs-url" : csUrl
                ,"ip-address" : ip
                ,"port" : port
                ,"expires" : expires
                ,"resource-capa" : capa
            };

            if(expiresStr.length < 1){
                delete jsonResult["expires"];
            }
            if(ip.length < 1){
                delete jsonResult["ip-address"];
            }
            if(portStr.length < 1){
                delete jsonResult["port"];
            }

        }else if(control.sendMessageType == control.TYPE.MODIFY){
            omsUrl = $("#resourceInfoOmsUrl").val().trim();

            var capa = {
                "storage-size":storageSize,
                "max-up-bw":maxUpBw,
                "max-dn-bw":maxDnBw,
                "max-num-connection":maxNumConnection,
                "max-num-overlay-network":maxNumOverlayNetwork
            };

            jsonResult = {
                "type" : type
                ,"expires" : expires
                ,"resource-capa" : capa
            };

            if(expiresStr.length < 1){
                delete jsonResult["expires"];
            }
        }

        var msg;
        try{
            msg = JSON.stringify(jsonResult, null, control.JSON_SPACE);
        }catch(err){
            swal("","Failed to create JSON Object","info");
            control.getApplyRegisterButton().prop("disabled", true);
            return;
        }

        control.getRegistrationRequestTextArea().val(msg);
        control.closePopupWindow();
        control.getOMSAddressText().val(omsUrl);
        control.getApplyRegisterButton().prop("disabled",false);
    };

})(window, jQuery);