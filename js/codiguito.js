var nodo, papel, pizza;
$(document).on("ready", inicio);
function inicio () 
{
	//delete localStorage.nombre;
	$("#formulario").on("submit", guardar);
	transicion();
}
function aleatorio(min, max)
{
	return Math.floor(Math.random() * (min - max + 1) + max);
}
function dibujar () {
	papel = Raphael("canvas", 200, 200);
	pizza = papel.set();
	pizza.push(
		papel.image("image/base.png", 0,0,200,200)
	);
	$("#ingredientes article").on("click", addIngrediente);
}
function addIngrediente (ev) 
{
	var ingred = ev.currentTarget.id;
	var rotacion = aleatorio(0,360);
	var tx = aleatorio(-30,90);
	var ty = aleatorio(-60, 90);
	var escala = aleatorio(2, 7);
	var trocito = papel.image(ingred +".png", tx, ty, 150, 150);
	trocito.rotate(rotacion);
	trocito.scale(escala * 0.1, escala * 0.1);
	pizza.push(trocito);
	$("#pizza ul").append("<li>" + ingred + "</li>");
}
function guardar(eventico)
{
	eventico.preventDefault();
	var n = $("#nombre").val();
	localStorage.nombre = n;
	transicion();
}
function transicion()
{
	if(localStorage.nombre)
	{
		$("#nombre").hide();
		$("#enviar").css("display", "none");
		$("#formulario label").text(
			"A tragar " + localStorage.nombre + "!!1!"
		);
		$("#historia").fadeOut();
		$("#pizzamaker").fadeIn();
		//conectar(localStorage.nombre);
		//geolocalizar();
		dibujar();
	}
}
function geolocalizar()
{
	navigator.geolocation.getCurrentPosition(
		mostrarOMapa, errorMapa
	);
}
function mostrarOMapa(datos)
{
	var lat = datos.coords.latitude;
	var lon = datos.coords.longitude;
	$("#status").text("AjÃ¡! EstÃ¡s en: " + lat + "," + lon);
	var map, layer;
	map = new OpenLayers.Map( 'mapa_canvas');
	$("#mapa_canvas").css("height","400px")
					 .css("width", "100%");
    layer = new OpenLayers.Layer.OSM( "Simple OSM Map");
    map.addLayer(layer);
    map.setCenter(
        new OpenLayers.LonLat(lon, lat).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 18
    );   
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);
 	var lonLat = new OpenLayers.LonLat( lon , lat );
    markers.addMarker(new OpenLayers.Marker(lonLat));
}
function mostrarMapa(datos)
{
	var lat = datos.coords.latitude;
	var lon = datos.coords.longitude;
	$("#status").text("AjÃ¡! Te encontrÃ© en: "
		+ lat + "," + lon);
	var coordenada = new google.maps.LatLng(lat,lon);
	var opciones = 
	{
		center: coordenada,
		zoom: 18,
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	var mapa = new google.maps.Map(
		$("#mapa_canvas")[0], opciones
	);
	$("#mapa_canvas").css("height","400px")
					 .css("width", "100%");
	var opChinche =
	{
		position: coordenada,
		map: mapa,
		title: "Coordenadas de bombardeo"
	};
	var chinche = new google.maps.Marker(opChinche);
}
function errorMapa(errorsh)
{
	$("#status").text("Tarde o temprano Â¬_Â¬");
}

function conectar(nom)
{
	nodo = io.connect("http://192.168.2.82:6969");
	nodo.emit("ingresoUsuario", nom);
	nodo.on("notificarNombre", saludo);
}
function saludo(serverNom)
{
	$("#formulario label").text(
			serverNom + " es una chimba parce!"
	).fadeOut().fadeIn();
}








