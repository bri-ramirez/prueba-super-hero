// token de acceso para la API
const accessToken = '4905856019427443';

// ocultar la sección de la información del heroe
$('.hide').hide();

// valida que el id del heroe sea un número entero positivo
const isIdHeroValid = idHero => {
  if (idHero === '') {
    return false;
  }

  if (isNaN(idHero)) {
    return false;
  }

  if (idHero < 0) {
    return false;
  }

  return true;
}

// muestra la información del heroe
const showInfoHero = data => {
  let result = `
    <div class="card mb-3">
      <div class="row g-0">
        <div class="col-md-4">
          <img src="${data.image.url}" class="img-fluid rounded-start" alt="...">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Nombre: ${data.name}</h5>
            <p class="card-text">Conexiones: ${data.connections['group-affiliation']}</p>


            <p class="card-text">
              <small class="text-body-secondary">Publicado por: ${data.biography.publisher}</small>
            </p>
            <hr>

            <p class="card-text">
              <small class="text-body-secondary">Ocupación: ${data.work.occupation}</small>
            </p>
            <hr>

            <p class="card-text">
              <small class="text-body-secondary">Primera aparición: ${data.biography['first-appearance']}</small>
            </p>
            <hr>

            <p class="card-text">
              <small class="text-body-secondary">Altura: ${data.appearance.height}</small>
            </p>
            <hr>

            <p class="card-text">
              <small class="text-body-secondary">Peso: ${data.appearance.weight}</small>
            </p>
            <hr>

            <p class="card-text">
              <small class="text-body-secondary">Alianzas: ${data.biography.aliases}</small>
            </p>
          </div>
        </div>
      </div>
    </div>
  `;

  $('#info-card-hero').html(result);
}

// muestra las estadisticas del heroe
const showStaticticsHero = data => {

  const arrayData = [];

  // recorrer las estadisticas del heroe
  // con el "for in" recorremos las propiedades de un objeto
  for (const key in data.powerstats) {

    // si el valor de la estadistica es 'null', no se muestra
    if (data.powerstats[key] !== 'null') {

      // se agrega la estadistica al array
      arrayData.push({
        y: parseInt(data.powerstats[key]),
        indexLabel: key,
      });
    }
  }

  const options = {
    title: {
      text: `Estadisticas de poder para ${data.name}`,
    },
    data: [
      {
        type: 'pie',
        showInLegend: true,
        legendText: '{indexLabel}',
        dataPoints: arrayData,
      },
    ],
  };

  // si no hay estadisticas, se muestra un mensaje
  if(arrayData.length === 0) {
    options.title.text = 'No hay estadisticas de poder para este heroe';
  }

  // se crea el grafico
  $('#chartContainer').CanvasJSChart(options);
}

// evento click del boton buscar
$('#btn-find').click(async function (event) {
  event.preventDefault();

  // limpiar errores
  $('.error').text('');

  // obtener el id del heroe
  let idHero = $('#inputIdhero').val();

  // validar que el id del heroe sea un número entero positivo
  if(!isIdHeroValid(idHero)) {
    $('.error').text('El id del heroe debe ser un número entero positivo');
    return;
  }

  // obtener los datos del heroe
  // como es una promesa, ocupamos async/await para esperar a que se resuelva
  const data = await getHero(idHero);

  // mostrar la sección de la información del heroe
  $('.hide').show();

  // limpiar el input
  $('#inputIdhero').val('');

  // mostrar la información del heroe
  showInfoHero(data);

  // mostrar las estadisticas del heroe
  showStaticticsHero(data);


  // hacemos scroll a la sección de la información del heroe
  $('html, body').animate({
    scrollTop: $('#hero-info').offset().top
  }, 500);
});

// obtiene los datos del heroe con una llamada ajax a la api
const getHero = idHero => {
  return $.ajax({
    type: 'GET',
    url: `https://superheroapi.com/api.php/${accessToken}/${idHero}`,
    dataType: 'json',
    success: function (data) {
      return data;
    },
    error: function (error) {
      alert('Error al obtener los datos');
    },
  });
}
