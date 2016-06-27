(function(window, $) {

    var pages = ['app/view/reservation.html'];
    var control = uPREP.createControl(uPREP.SERVICE.RESERVATION, pages);
    control.buttonToggle = true;

    control.WEBSOCKET_PORT = 9310;
    control.JSON_SPACE = 3;
    control.webSocket = null;

    control.reservationData = null;
    control.selectedReservationData = null;
    control.ReservationTable = null;

    control.bind = function() {

        control.getRefreshButton1().click(function(){
            control.requestReservationData();
        });

        control.initializedReservation();
    };

    control.event = function(event) {
        if(event.action=='beforeShow'){
            if(control.ReservationTable != null) {
                control.requestReservationData();
            }
        }
        if(event.action=='afterShow'){
            if(control.ReservationTable == null){
                // control.requestOverlayList();
            }
        }
    };

    control.initializedReservation = function() {
        control.getWebSocketInfo();
        control.requestReservationData();
    };

    /* control ���� */
    control.getReservationDataTable = function() {
        return $( "#reservatioDataTable" );
    };
    control.getReservationGrid = function() {
        return $( "#reservationGrid" );
    };
    control.getLastUpdateTime1 = function() {
        return $( "#lastUpdateTime1" );
    };
    control.getRefreshButton1 = function() {
        return $( "#refreshButton1" );
    };
    control.getRefreshMessage1 = function() {
        return $( "#refreshMessage1" );
    };


    /* WebSocket */
    control.initializeWebSocket = function(port, path){
        control.webSocket = uPREP.createWebSocket(port, path, function(result) {
            control.setRefreshMessageVisible(true);
        },function(result){
            control.requestReservationData();
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
            control.initializeWebSocket(port,"RESERVATION");
        },function(err){
            console.log(err);
        });
    };
    control.requestReservationData = function(typeFlag){
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/GetReservationList', 'POST', jsonData, function(result){
            control.createReservationDataTable(result, typeFlag, function(){

            });
        },function(err){
            console.log(err);
        });
    };
    control.requestRemoveReservation = function(virtualPeerId) {
        var jsonData = {};
        jsonData.UPREP = "uPREP";

        uPREP.sendAjax('/RemoveReservation/'+ virtualPeerId, 'POST', jsonData, function(result){
            control.requestReservationData();
        },function(err){
            if(err.status == 200){
                control.requestReservationData();
            }else{
                console.log(err);
            }
        });
    };

    /* Control Action */
    control.setRefreshMessageVisible = function(type){
        if(type != null && type == true){
            control.getRefreshMessage1().show();
        }
        else{
            control.getRefreshMessage1().hide();
        }
    };
    control.setCurrentTime = function(){
        var data = new Date();
        var current_time = data.toTimeString().split(" ")[0];
        control.getLastUpdateTime1().text(current_time);
    };
    control.loadReservationDataTable = function(callback){

        control.ReservationTable = $('#reservationDataTable').on('search.dt', control.OnChange).on('page.dt', control.OnChange).DataTable(
            {
                "lengthMenu": [[5, 10, 20, -1], [5, 10, 20, "All"]],
                "order": [[ 5, "desc" ]],
                "columnDefs": [ { "targets": 6, "orderable": false, "searchable": false} ]
            }
        );

        if(callback!=null){
            callback();
        }
    };
    control.createReservationDataTable = function(data, typeFlag, callback){
        control.reservationData = data;
        control.selectedReservationData = null;

        control.setCurrentTime();
        control.setRefreshMessageVisible(false);
        var html ="";

        if(control.ReservationTable != null){
            $('#reservationDataTable').DataTable().destroy();
            control.ReservationTable = null;
        }

        for(var index = 0; index < control.reservationData.length; index++){
            var trTag = "";

            var resource_id = control.reservationData[index].RESOURCE_ID != null ? control.reservationData[index].RESOURCE_ID: "";
            var overlay_network_id = control.reservationData[index].OVERLAY_NETWORK_ID != null ? control.reservationData[index].OVERLAY_NETWORK_ID: "";
            var requester_peer_id = control.reservationData[index].REQUESTER_PEER_ID != null ? control.reservationData[index].REQUESTER_PEER_ID: "";
            var virtual_peer_id = control.reservationData[index].VIRTUAL_PEER_ID != null ? control.reservationData[index].VIRTUAL_PEER_ID: "-";

            var network_ip = control.reservationData[index].NETWORK_IP != null ? control.reservationData[index].NETWORK_IP: "-";
            var network_port = control.reservationData[index].NETWORK_PORT != null ? control.reservationData[index].NETWORK_PORT: "-";

            var max_up_bw = control.reservationData[index].MAX_UP_BW != null ? control.reservationData[index].MAX_UP_BW: "";
            var max_dn_bw = control.reservationData[index].MAX_DN_BW != null ? control.reservationData[index].MAX_DN_BW: "";
            var max_num_connection = control.reservationData[index].MAX_NUM_CONNECTION != null ? control.reservationData[index].MAX_NUM_CONNECTION: "";
            var created_at = control.reservationData[index].CREATED_AT != null ? control.reservationData[index].CREATED_AT: "";

            trTag += "<tr>";
            /*trTag += "<td class='dataTableCell' style='none'>"+ resource_id +"</td>";*/
            trTag += "<td class='dataTableCell' style='none'>"+ overlay_network_id +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ requester_peer_id +"</td>";
            trTag += "<td class='dataTableCell' style='none' name='VIRTUAL_PEER_ID'>"+ virtual_peer_id +"</td>";

            trTag += "<td class='dataTableCell' style='none'>"+ network_ip +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ network_port +"</td>";

           /* trTag += "<td class='dataTableCell' style='none'>"+ max_up_bw +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_dn_bw +"</td>";
            trTag += "<td class='dataTableCell' style='none'>"+ max_num_connection +"</td>";*/
            trTag += "<td class='dataTableCell' style='none'>"+ created_at +"</td>";
            trTag += "<td class='dataTableCell' style='none'><button type='button'class='btn-danger' value='"+ virtual_peer_id +"'>Delete</button></td>";
            trTag += "</tr>";

            html += trTag;
            //html += trTag.replace(/none/gi, isSelectedRow ? "background-color:#BDF3F3" : "");
        }

        control.getReservationGrid().html(html);
        control.loadReservationDataTable();
        control.bindDataTableDeleteButtonEvent();
        //control.bindReservationDataTableSelectEvent();

        if(callback != null){
            callback();
        }
    };

    /* Event */
    control.OnChange = function(a,b,c){
        //control.setAutoRefreshStatus(control.overlayTable==null || control.overlayTable.page() == 0 && control.overlayTable.search() == "");
    };
    control.bindDataTableDeleteButtonEvent = function(){
        $("#reservationGrid").find(".btn-danger").click(function(event){
            var virtualPeerId  = event.target.value;
            control.requestRemoveReservation(virtualPeerId);
        });
    };
    control.bindReservationDataTableSelectEvent = function(){
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

})(window, jQuery);