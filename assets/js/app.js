$(document).ready(function(){
  alert("hello world");
if(window.location.href=="http://hetaodie.github.io/" || window.location.href=="http://www.tianchilab.com")
{
$("#sidebar").css({width:'10%'});
$("#btnblog").click(function(){
$("#sidebar").animate({width:'10.0%'},'slow');
});
}
});
