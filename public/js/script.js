if($('#inputCateringBySponsor').val() == 0){
  $(".cateringSection").show();
}

$('#inputCateringBySponsor').on('change', function() {
  parseInt($(this).val()) == 0 ? $(".cateringSection").show() : $(".cateringSection").hide();
});

// if #inputCateringBySponsor val == 99, disable save button
$('#inputCateringBySponsor').on('change', function() {
  parseInt($(this).val()) == 99 ? $("#btnSave").prop('disabled', true): $("#btnSave").prop('disabled', false);
});

//disable click on readonly
$('input[readonly]').click(function(event) {
  event.stopPropagation();
  event.preventDefault();
});

//page init show/ hide based on dropdown