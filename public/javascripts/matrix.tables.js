
$(document).ready(function(){
	
	var oTable = $('.data-table').dataTable({
        // "bServerSide": true,

        "sAjaxSource": "/claims/json",
        "sServerMethod": "POST",
		"bJQueryUI": true,
		"sPaginationType": "full_numbers",
		"sDom": '<""l>t<"F"fp>',
        // "sScrollXInner": "200%",
        "bAutoWidth" : false,
        "aoColumns": [{
            "mData":"id",
            "bVisible": false
        },{
            "mData": "viitenumber",
            "sWidth": "10%",
            "sTitle": "Muuda",
            "mRender": function ( url ) { return '<a rel="tooltip" title="Ava viitenumber: '+url+'" href="/claims/'+url+'"><i class="icon-edit"></i></a>'; }
        },{
            "mData": "viitenumber",
            "sWidth": "30%",
            "sTitle": "Viitenumber",
            "mRender": function ( url, type, full )  {
                return  '<a href="/claims/'+url+'">' + url + '</a>';
            }
        },{
            "mData": "tegeleja",
            "sWidth": "20%",
            "sTitle": "Tegeleja"
        },{
            "mData": "summa",
            "sWidth": "20%",
            "sTitle": "Summa (EUR)"
        },{
            "mData":"jaak",
            "sWidth": "20%",
            "sTitle": "Jääk (EUR)"
        }],
		"fnDrawCallback": function(settings, json) {
            $('[rel=tooltip]').tooltip();
        }
	});
	
	// $('input[type=checkbox],input[type=radio],input[type=file]').uniform();
	
	// $('select').select2();
	
	$("span.icon input:checkbox, th input:checkbox").click(function() {
		console.log("MIS SIIN???????????????????");
		var checkedStatus = this.checked;
		var checkbox = $(this).parents('.widget-box').find('tr td:first-child input:checkbox');		
		checkbox.each(function() {
			this.checked = checkedStatus;
			if (checkedStatus == this.checked) {
				$(this).closest('.checker > span').removeClass('checked');
			}
			if (this.checked) {
				$(this).closest('.checker > span').addClass('checked');
			}
		});
	});
});