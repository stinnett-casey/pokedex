$(function(){
  let pokedex = new Pokedex();

  $('#blue-button-left').click(function(){
    pokedex.showDetails();
  });

  $('#top-cross').click(function(){
    pokedex.scrollUp();
  });

  $('#bot-cross').click(function(){
    pokedex.scrollDown();
  });

  $('#right-cross').click(function(){
    pokedex.nextImage();
  });

  $('#left-cross').click(function(){
    pokedex.prevImage();
  });

  $('#green-button-right').click(function(){
    pokedex.showFavorites();
  });

  $('#orange-button-right').click(function(){
    pokedex.showData();
  });

  $('#button-bottom').click(function(){
    pokedex.addToFavorites();
  });

  tippy('[title]');
});
