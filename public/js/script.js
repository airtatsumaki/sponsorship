//javascript controlls for html web forms
$('#inputCateringBySponsor').on('change', function() {
  // console.log($(this).val());
  parseInt($(this).val()) == 1 ? $(".cateringSection").show() : $(".cateringSection").hide();
});