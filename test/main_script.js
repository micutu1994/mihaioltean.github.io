document.getElementById("id_button").addEventListener("click", start_worker);
//-------------------------------------------------
function draw_circle(ctx, position, step, w, h)
{
		ctx.clearRect(0, 0, w, h); 
		
		ctx.beginPath();
		ctx.strokeStyle = "#000000";
		ctx.arc(Math.cos(position.angle) * 50 + 200, Math.sin(position.angle) * 50 + 200, 50, 0, 2 * Math.PI);
		ctx.stroke();
		
		position.old_angle = position.angle;
		position.angle += step;
		if (position.angle > 2 * Math.PI)
			position.angle -= 2 * Math.PI;
}
//----------------------------------------------------
function start_worker()
{
	if (window.Worker) { // Check if Browser supports the Worker api.
	// Requires script name as input
		var myWorker = new Worker("worker.js");
		myWorker.onmessage = function(e) {
			document.getElementById("id_worker").innerHTML += e.data + " ";
		};	

		var canvas = document.getElementById("id_canvas");
		var ctx = canvas.getContext("2d");
		
		var position = {angle:0, old_angle:0};
		setInterval(draw_circle, 100, ctx, position, 0.1, canvas.width, canvas.height);
	}
}
//-------------------------------------------------

