$(document).ready(function(){
	$(".deleteProject").on("click",deleteProject);
})

function deleteProject(){
	var deleteId = $(this).attr('id');
	var confirmation = confirm('Are you sure ?');
	if(confirmation){
		$.ajax({
			type:"DELETE",
			url:"/admin/delete/"+deleteId
		}).done(function(response){

		});
	    window.location='/admin';
	}else{
		return false;
	}
}