$(document).ready(function(){
  alert("hello world");
if(window.location.href=="http://hetaodie.github.io/")
{
$("#sidebar").css({width:'100%'});
$("#btnblog").click(function(){
$("#sidebar").animate({width:'10.0%'},'slow');
});
}
});
