class Pokedex {
  constructor(){
    this.pokemonArray = pokemonArray;
    this.base_url = 'https://pokeapi.co/api/v2/pokemon/';
    this.currentPokemon = null;
    this.favorites = [];
    this.pokemonListHTML();
    this.showDetails();
  }

  addToFavorites(){
    if ($('.active').data('name') !== this.currentPokemon.name) {
      this.showDetails(() => {
        let { pokename } = this.currentPokemon;
        // Make sure the name isn't already in there
        if (this.favorites.indexOf(pokename) === -1) {
          this.favorites.push(this.currentPokemon);
        }
        this.generateFavsList();
      });
    }
  }

  removeFromFavorites(){
    let { pokename } = this.currentPokemon;
    this.favorites = this.favorites.filter(pokemon => pokemon.name !== pokename);
    this.generateFavsList();
  }

  generateFavsList(){
    $('#favorites').html(this.favorites.map(pokemon => `<h6 data-name="${pokemon.name}">${pokemon.name}</h6>`));
    for (var i = 0; i < this.favorites.length; i++) {
      $($('.key')[i]).html(`<img src="${this.favorites[i].sprites.front_shiny}">`);
    }
  }

  pokemonListHTML(){
    $('#pokemon-list').html(
      this.pokemonArray.map((name, index) => {
        return `<div class="child-pokemon${(index === 0 ? ' active' : '')}" data-name="${name}">${name}</div>`;
      })
    );
  }

  showDetails(func){
    let pokemon = $('.active').data('name');
    // Add a spinning pokeball for loading image
    $('.loading-image').css({'display': 'flex'});
    // Add light pulsing effect and then remove
    $('#glass-button').addClass('light-pulse').delay(500).queue(function(){
      $(this).removeClass('light-pulse').dequeue();
    });

    cachedFetch(this.base_url + encodeURI(pokemon))
    .then(r => r.json())
    .then(results => { 
      this.currentPokemon = results;
      
      this.setData();

      this.setImages();

      this.setId();

      this.showData();

      if (func !== undefined) {
        func();
      }

      // remove spinning pokeball loading image
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

  showFavorites(){
    $('#pokedata').animate({
      left: '100%'
    }, 500);
    $('#favorites').animate({
      left: '0'
    }, 500);
  }

  showData(){
    $('#favorites').animate({
      left: '-100%'
    }, 500);
    $('#pokedata').animate({
      left: '0'
    }, 500);
  }

  setData(){
    // Set all data in screen
    let types = this.currentPokemon.types.map(type => {
      return type.type.name;
    });
    $('#name span').text(this.currentPokemon.name.capitalize());
    $('#type span').text(types.join(','));
    $('#weight span').text(this.currentPokemon.weight);
    $('#height span').text(this.currentPokemon.height);
    $('#id span').text(this.currentPokemon.id);
  }

  setImages(){
    // Add all the images in a carousel
    const { sprites } = this.currentPokemon;
    const image_names = Object.keys(sprites);
    $('#screen .pokemon-images').html(image_names.filter(image_name => sprites[image_name] !== null).map((image_name, index) => {
      return `<img class="${index === 0 ? `active` : ``}" src="${sprites[image_name]}" />`;
    }));
  }

  setId(){
    $('#nb').val(this.currentPokemon.id);
  }
}