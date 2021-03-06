document.getElementById("v1").innerHTML = "v2.42";
var transformCanvas = document.getElementById('transformCanv');
transformContext = transformCanvas.getContext('2d');
tilesContext = document.getElementById("tileCanv").getContext('2d');
originalPhotoContext = document.getElementById("originalCanv").getContext('2d');
context_28x28 = document.getElementById("canvas_28x28").getContext('2d');

var linesCanvas = document.getElementById('linesCanv');
linesContext = linesCanvas.getContext('2d');
linesContext.fillStyle = "blue";
//tilesContext.fillStyle = "green";
//tilesContext.fillRect(0, 0, linesCanvas.width, linesCanvas.height);
linesContext.fillRect(0, 0, linesCanvas.width, linesCanvas.height);

base_image = new Image();
base_image.src = 'sudoku.png';
base_image.onload = on_load_image;

//---------------------------------------------------------------
function rgb_to_gray(rgb_array) 
{
    return 0.299 * (255 - rgb_array[0]) + 0.587 * (255 - rgb_array[1]) + 0.114 * (255 - rgb_array[2]);
}
//---------------------------------------------------------------
function on_load_image()
{
	transformContext.drawImage(base_image, 0, 0);
	originalPhotoContext.drawImage(base_image,0,0);
	var image = transformContext.getImageData(1, 1, 400, 400);
	var data = image.data;
	// for(var i = 0;i<data.length;i+=4){
	// 	var red = data[i];
	// 	var green = data[i+1];
	// 	var blue = data[i+2];

	// 	if(red>240&&green>240&&blue>240){
	// 		data[i] = 255;
	// 		data[i+1] = 255;
	// 		data[i+2] = 255;
	// 	} else {
	// 		data[i] = 0;
	// 		data[i+1] = 0;
	// 		data[i+2] = 0;
	// 	}
	// }
	// transformContext.putImageData(image,0,0);

	var imageData = CannyJS.canny(transformCanvas);
	imageData.drawOn(transformCanv);

	var diagonala = parseInt(Math.sqrt(transformCanvas.height * transformCanvas.height + transformCanvas.width * transformCanvas.width) + 1);

	var accumulator= new Array();

	for (var i=0; i < diagonala; i++){
		accumulator[i] = new Array(180);
	}

	for (var raza = 0; raza < diagonala; raza++){
		for (var theta = 0; theta < 180; theta++){
			accumulator[raza][theta] = 0;
		}
	}

	for (var y = 0; y < transformCanvas.height; y++){
		for (var x = 0; x < transformCanvas.width; x++){
			var culoare = transformContext.getImageData(x, y, 1, 1);
			var data = culoare.data;
			// console.log(data.length);
			if (data[0] > 250 && data[1] > 250 && data[2] > 250){
				for(var theta = 0; theta < 180; theta++){
					var raza = parseInt((x - transformCanvas.width / 2) * Math.cos(theta / 180 * 3.14) + (y - transformCanvas.height / 2) * Math.sin(theta / 180 * 3.14));
					accumulator[raza + diagonala / 2][theta]++;
					// console.log(r+diagonala/2);
				}
			}

		}
	}


	var maxacc = 0;
	for (var r = 0; r < diagonala; r++){
		for (var theta = 0; theta < 180; theta++){
			if (maxacc < accumulator[r][theta]){
				maxacc = accumulator[r][theta];
			}
		}
	}



	// scalez
	for (var r = 0; r < diagonala; r++){
		for (var theta = 0; theta < 180; theta++){
			accumulator[r][theta] = parseInt(accumulator[r][theta] / maxacc * 255);
		}
	}
	
	//teste verific ce valori am in accumulator.
	// var count = 0;
	// var arrayiu = new Array;
	// for(var i=0;i<diagonala;i++){
	// 	for(var j=0;j<180;j++){
	// 		// arrayiu.push(accumulator[i][j]);
	// 		// console.log(accumulator[i][j]);
	// 	}
	// }


	// niste verificari
	// var uniquearray = [];
	// $.each(arrayiu, function(i,el){
	// 	if($.inArray(el,uniquearray)===-1) uniquearray.push(el);
	// });
	// console.log(uniquearray.sort());


	var prag = 100;

	var xss=0;
	var yss=0;

	var actualX = new Array;
	var actualY = new Array;

	linesContext.beginPath();
	linesContext.strokeStyle="#FF0000";
	
	for (var raza = 0; raza < diagonala; raza++){
		for (var theta = 0; theta < 180; theta++){
			if (accumulator[raza][theta] > prag){

				var x1, y1, x2, y2, test2;
				
				if(theta != 0){
					x1 = 0;
					y1 = Math.floor((raza - diagonala / 2 - (x1 - linesCanvas.width / 2) * Math.cos(theta / 180.0 * 3.14)) / Math.sin(theta / 180.0 * 3.14) + linesCanvas.height / 2);
					if (yss == 0 || yss > 0 && y1 - actualY[yss - 1] > 7){ // overwrite previous if current one is too close
						actualY[yss] = y1;
						yss++;
					}
					else
						actualY[yss - 1] = y1;
				} 
				else {
					x1 = (raza - diagonala / 2) + linesCanvas.width / 2;
					if (xss == 0 || xss > 0 && x1 - actualX[xss - 1] > 7){// overwrite previous if current one is too close
						actualX[xss] = x1;
						xss++;
					}
					else
						actualX[xss - 1] = x1;
					y1 = 0;
				}


				if(theta != 0){
					x2 = linesCanvas.width -1;
					y2 = Math.floor((raza - diagonala/2 - (x2 - linesCanvas.width / 2) * Math.cos(theta / 180.0*3.14)) / Math.sin(theta / 180.0*3.14) + linesCanvas.height / 2);
				} 
				else {
					x2 = (raza - diagonala / 2) + linesCanvas.width / 2;
					y2 = linesCanvas.height -1;
				}
				
				linesContext.moveTo(x1, y1);
				linesContext.lineTo(x2, y2);
				
			}
		}
	}

	linesContext.stroke();

	console.log(actualY);
	console.log(actualX);
	
	var safety_margin = 6; // ignore pixels closer to margin than this value
	var estimate_cell_size = actualX[1] - actualX[0];

	// create matrix for ANN
	var digit_as_28x28_matrix = [];
	for (var i = 0; i < 28; i++)
		for (var j = 0; j < 28; j++) 
			digit_as_28x28_matrix[i * 28 + j] = 0; // fill it with 0
		
	var recognized_digits = [];
	for (var i = 0; i < 9; i++)
		recognized_digits[i] = new Array(9);
	
	// take each cell, 
	for (var cell_row = 0; cell_row < 9; cell_row++){
		for (var cell_col = 0; cell_col < 9; cell_col++){
			var imgData = originalPhotoContext.getImageData( actualX[cell_col] + safety_margin, actualY[cell_row] + safety_margin, estimate_cell_size - 2 * safety_margin, estimate_cell_size - 2 * safety_margin);
			// compute bounding box of digit
			var bbox = {min_row: estimate_cell_size - 2 * safety_margin, min_col: estimate_cell_size - 2 * safety_margin, max_row:0, max_col: 0};
			for (var row = 0; row < estimate_cell_size - 2 * safety_margin; row++)
				for (var col = 0; col < estimate_cell_size - 2 * safety_margin; col++){
					var pixel_color = originalPhotoContext.getImageData(actualX[cell_col] + safety_margin + col, actualY[cell_row] + safety_margin + row, 1, 1);
					if (pixel_color.data[0] < 100 && pixel_color.data[1] < 100 && pixel_color.data[2] < 100){ // black
						if (bbox.min_row > row)
							bbox.min_row = row;
						else
						if (bbox.max_row < row)
							bbox.max_row = row;

						if (bbox.min_col > col)
							bbox.min_col = col;
						else
						if (bbox.max_col < col)
							bbox.max_col = col;
					}
				}
				if (bbox.min_col < bbox.max_col && bbox.min_row < bbox.max_row){// I have a digit there
					// I have the bounding box; now I have to scale the box to 20x20 as in MNIST
					var imageData = new ImageData(28, 28); // scaled digit ; for DEBUG only
					
					var max_row_scaled = 20; // this is maximal size that the scaled cell can have
					var max_col_scaled = 20;
					
					if (bbox.max_col - bbox.min_col > bbox.max_row - bbox.min_row) // if bounding box is not square I must scale the box but aspect ratio must remain unchanged
						max_row_scaled = (bbox.max_row - bbox.min_row) /  (bbox.max_col - bbox.min_col + 1) * 20;
					else
						if (bbox.max_col - bbox.min_col < bbox.max_row - bbox.min_row)
							max_col_scaled = (bbox.max_col - bbox.min_col) /  (bbox.max_row - bbox.min_row + 1) * 20;
					// take each position from the 20x20 matrix
					for (var row = 0; row < max_row_scaled; row++)
						for (var col = 0; col < max_col_scaled; col++){
							// interpolation step
							// compute from which row and col from the original image I will take the color
							var original_row = row / (max_row_scaled - 1) * (bbox.max_row - bbox.min_row + 1);
							var original_col = col / (max_col_scaled - 1) * (bbox.max_col - bbox.min_col + 1);
							
							// start from: actualX[cell_col] + safety_margin + bbox.min_col
							var pixel_data = originalPhotoContext.getImageData(actualX[cell_col] + safety_margin + bbox.min_col + original_col, actualY[cell_row] + safety_margin + bbox.min_row + original_row, 1, 1); // I do not like this
							var index_in_28x28_matrix = Math.floor((row + 4 + (20 - max_row_scaled ) / 2) * 28 + col + 4 + (20 - max_col_scaled) / 2);
							digit_as_28x28_matrix[index_in_28x28_matrix] = rgb_to_gray(pixel_data.data) / 255.0;
							
							// I also put the color in imageData matrix for debug purposes only
							var index_in_image_data_matrix = Math.floor((row + 4 + (20 - max_row_scaled) / 2) * 28 * 4 + (col + 4 + (20 - max_col_scaled) / 2) * 4);
							imageData.data[index_in_image_data_matrix]     = digit_as_28x28_matrix[index_in_28x28_matrix] * 255;
							imageData.data[index_in_image_data_matrix + 1] = digit_as_28x28_matrix[index_in_28x28_matrix] * 255;
							imageData.data[index_in_image_data_matrix + 2] = digit_as_28x28_matrix[index_in_28x28_matrix] * 255;
							imageData.data[index_in_image_data_matrix + 3] = 255;
						}
					
					// send it to ANN
					var out_last_layer = [];
					var class_index = test_ann(digit_as_28x28_matrix, out_last_layer);
					recognized_digits[cell_row][cell_col] = class_index;
					// print digit on canvas
					tilesContext.font = '20px serif';
					tilesContext.strokeText(class_index.toString(), actualX[cell_col] + safety_margin, actualY[cell_row] + safety_margin);
					// display matrix on canvas
					context_28x28.putImageData(imageData, actualX[cell_col] + safety_margin, actualY[cell_row] + safety_margin);
				}
				else// no digit found there
				recognized_digits[cell_row][cell_col] = -1;
		}
	}
}
