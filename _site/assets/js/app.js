$(document).ready(function(){
  alert("hello world");
if(window.location.href=="http://http://hetaodie.github.io/")
{
$("#sidebar").css({width:'100%'});
$("#btnblog").click(function(){
$("#sidebar").animate({width:'33.3333%'},'slow');
});
}
});
