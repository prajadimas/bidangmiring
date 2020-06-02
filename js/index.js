var numberOfSensor = 0;

$(document).ready(function () {

	if (Sensor.get("number")) {
		numberOfSensor = Number(Sensor.get("number"));
		for (var i = 0; i < numberOfSensor; i++) {
			$("#calibration-data tbody").append("<tr><td>" + (i + 1).toString() + "</td><td>" + Sensor.get((i + 1).toString()) + "</td><td id=\"" + (i + 1).toString() + "stat\" class=\"text-center\"><i class=\"tim-icons icon-alert-circle-exc\"></i></td><td id=\"" + (i + 1).toString() + "del\" class=\"text-center\" title=\"Remove sensor\"><i class=\"tim-icons icon-trash-simple\"></i></td></tr>");
			$("#sensor-num").val(numberOfSensor + 1);
			$("#" + (i + 1).toString() + "del").hover(function (evt) {
				$(this).css("cursor", "pointer");
			});
			$("#" + (i + 1).toString() + "del").click(function (evt) {
				// console.log("sensor " + this.id.replace("del", "") + " event", evt);
				if (Number(this.id.replace("del", "")) == numberOfSensor) {
					// console.log("can removed");
					Sensor.set("number", numberOfSensor - 1);
					Sensor.remove(this.id.replace("del", ""));
					location.reload();
				} else {
					$.notify({
			      icon: "tim-icons icon-bell-55",
			      message: "cannot be removed"
			    }, {
			      type: "danger",
			      timer: 8000,
			      placement: {
			        from: "top",
			        align: "right"
			      }
			    });
				}
			});
		}
	}
	// console.log("Sensor Length", numberOfSensor);

	deviceLists()
	.then((ports) => {
		console.log(ports);
	  $("#ports").html("Ports (" + ports.length + ")");
	  if (ports.length > 0) {
			for (var i = 0; i < ports.length; i++) {
	      if (ports[i].manufacturer) {
	        $("#ports-data tbody").append("<tr><td><div class=\"form-check\"><label class=\"form-check-label\"><input class=\"form-check-input radio\" type=\"checkbox\" name=\"port\" value=\"" + ports[i].comName + "\"><span class=\"form-check-sign\"><span class=\"check\"></span></span></label></div></td><td><p class=\"title\">" + ports[i].manufacturer + "</p><p class=\"text-muted\">" + ports[i].comName + "</p></td></tr>");
	      } else {
	        $("#ports-data tbody").append("<tr><td><div class=\"form-check\"><label class=\"form-check-label\"><input class=\"form-check-input radio\" type=\"checkbox\" name=\"port\" value=\"" + ports[i].comName + "\"><span class=\"form-check-sign\"><span class=\"check\"></span></span></label></div></td><td><p class=\"title\">-</p><p class=\"text-muted\">" + ports[i].comName + "</p></td></tr>");
	      }
	    }
	  }
	  $("input:checkbox").click(function () {
			console.log($(this).prop("checked"));
			if ($(this).prop("checked")) {
				$("input:checkbox").not(this).prop("checked", false);
		    var baudrate = $(".baudrate.active").map(function () {
		      return $(this).html();
		    }).get();
		    console.log("port: ", $(this).val());
		    console.log("baudrate: ", baudrate.join());
		    useDevice($(this).val(),Number(baudrate.join()))
		    .then((port) => {
		      console.log(port);
					$.notify({
			      icon: "tim-icons icon-bell-55",
			      message: port.msg
			    }, {
			      type: "success",
			      timer: 8000,
			      placement: {
			        from: "top",
			        align: "right"
			      }
			    });
		    })
		    .catch((err) => {
		      console.log('Error', err);
					$.notify({
			      icon: "tim-icons icon-bell-55",
			      message: "got some error"
			    }, {
			      type: "danger",
			      timer: 8000,
			      placement: {
			        from: "top",
			        align: "right"
			      }
			    });
		    });
			}
	  });
	})
	.catch((err) => {
		console.log('Error', err);
	})

	baudRateLists()
	.then((baudrate) => {
		console.log(baudrate);
		if (baudrate.length > 0) {
			for (var i = 0; i < baudrate.length; i++) {
	      if (i == 0) {
	        $("#baudrate-lists").append("<a class=\"dropdown-item baudrate active\" href=\"javascript:void(0)\">" + baudrate[i].val + "</a>");
	      } else {
	        $("#baudrate-lists").append("<a class=\"dropdown-item baudrate\" href=\"javascript:void(0)\">" + baudrate[i].val + "</a>");
	      }
			}
		}
	  $(".baudrate").click(function (evt) {
	    // console.log($(this).attr("class").split(/\s+/));
	    // console.log($(this).hasClass("active"));
	    // console.log($(this));
	    // console.log("checkbox checked: ", $("input:checked").length);
	    $(".baudrate.active").map(function () {
	      return $(this).removeClass("active");
	    });
	    if (!$(this).hasClass("active")) {
	      $(this).addClass("active");
	      if ($("input:checked").length > 0) {
	        console.log("baudrate: ", $(this).html());
	        console.log("port: ", $("input:checked").val());
	        useDevice($("input:checked").val(),Number($(this).html()))
	  			.then((port) => {
	  				console.log(port);
						$.notify({
				      icon: "tim-icons icon-bell-55",
				      message: port.msg
				    }, {
				      type: "success",
				      timer: 8000,
				      placement: {
				        from: "top",
				        align: "right"
				      }
				    });
	  			})
	  			.catch((err) => {
	  				console.log('Error', err);
						$.notify({
				      icon: "tim-icons icon-bell-55",
				      message: "got some error"
				    }, {
				      type: "danger",
				      timer: 8000,
				      placement: {
				        from: "top",
				        align: "right"
				      }
				    });
	  			});
	      }
	    }
	  })
	})
	.catch((err) => {
		console.log('Error', err);
	})

	$("#add-sensor").click(function (evt) {
		// console.log(evt);
		evt.preventDefault();
		// console.log($("#sensor-num").val());
		// console.log($("#dist-value").val());
		Sensor.set((numberOfSensor + 1).toString(), $("#dist-value").val());
		Sensor.set("number", numberOfSensor + 1);
		location.reload();
	});

});
