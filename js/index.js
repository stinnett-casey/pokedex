String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Pokedex {
  constructor(){
    this.pokemonArray = pokemonArray;
    this.base_url = 'https://pokeapi.co/api/v2/pokemon/';
    this.currentPokemon = null;
  }

  pokemonHTML(){
    return this.pokemonArray.map((name, index) => {
      return `<div class="child-pokemon${(index === 0 ? ' active' : '')}" data-name="${name}">${name}</div>`;
    });
  }

  showDetails(pokemon){
    $('.loading-image').css({'display': 'flex'});
    cachedFetch(this.base_url + encodeURI(pokemon))
    .then(r => r.json())
    .then(results => { 
      this.currentPokemon = results;

      $('#name span').text(results.name.capitalize());
      console.log(results.types[0].type.name);
      let types = results.types.map(type => {
        return type.type.name;
      });
      $('#type span').text(types.join(','));
      $('#weight span').text(results.weight);
      $('#height span').text(results.height);
      $('#id span').text(results.id);
      // Add all the images in a carousel
      const { sprites } = results;
      const image_names = Object.keys(sprites);
      $('#screen .pokemon-images').html(image_names.filter(image_name => sprites[image_name] !== null).map((image_name, index) => {
        return `<img class="${index === 0 ? `active` : ``}" src="${sprites[image_name]}" />`;
      }));
      this.setId();
      setTimeout($('.loading-image').hide(), 1000);
    });
  }

  favoritePokemon(pokemon){
    cachedFetch(this.base_url + pokemon)
    .then(r => r.json())
    .then(results => { 
      console.log(results);
    })
  }

  scrollUp(){
    const $active = $('#pokemon-list .active');
    const $prev = $active.prev();
    const $parent = $active.parent();
    if ($active.index() > 0) {
      $active.removeClass('active')
      $prev.addClass('active');

      let top_of_prev = $prev.position().top;
      let top_of_screen = $parent.position().top;
      let diff = top_of_prev - top_of_screen;
      if (diff >= -16 && diff <= 0) {
        console.log('needs to be scrolled');
        $parent.scrollTop($parent.scrollTop() + (diff));
      }
    }
  }

  scrollDown(){
    const $active = $('#pokemon-list .active');
    const $next = $active.next();
    const $parent = $active.parent();
    if ($active.index() !== ($parent.children().length-1)) {
      $active.removeClass('active')
      $next.addClass('active');

      let top_of_next = $next.position().top;
      let bottom_of_screen = $parent.position().top + $parent.height();
      let diff = bottom_of_screen - top_of_next;
      if (diff === 0 || diff < 16) {
        console.log('needs to be scrolled');
        $parent.scrollTop($parent.scrollTop() + ($next.height() - diff));
      }
    }
  }

  nextImage(){
    const $active = $('#screen .pokemon-images img.active');
    const $next = $active.next();
    const $parent = $active.parent();
    if ($active.index() !== ($parent.children().length-1)) {
      $active.removeClass('active');
      $next.addClass('active');
    }
  }

  prevImage(){
    const $active = $('#screen .pokemon-images img.active');
    const $prev = $active.prev();
    const $parent = $active.parent();
    if ($active.index() > 0) {
      $active.removeClass('active');
      $prev.addClass('active');
    }
  }

  setId(){
    $('#nb').val(this.currentPokemon.id);
  }
}

$(function(){
  let pokedex = new Pokedex();
  $('#pokemon-list').html(pokedex.pokemonHTML());

  $('#blue-button-left').click(function(){
    pokedex.showDetails($('.active').data('name'));
    $('#glass-button').addClass('light-pulse').delay(500).queue(function(){
      $(this).removeClass('light-pulse').dequeue();
    });
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
});