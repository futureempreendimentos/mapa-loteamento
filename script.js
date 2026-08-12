// =========================
// CORES DO MAPA
// =========================

const CORES = {
    ruas: "#C7C2BC",
    calcadas: "#DDD8D0",
    quadras: "#9E968D",
    lotes: "#A1B87A",
    pracas: "#8D9F6E",
    contornoLotes: "#E8E2D7"
};

// =========================
// FUNÇÕES
// =========================

function carregarPoligono(arquivo, corPreenchimento, corContorno, espessura) {

    return fetch(`dados/${arquivo}`)
        .then(response => response.json())
        .then(data => {

            return L.geoJSON(data, {
                style: {
                    fillColor: corPreenchimento,
                    color: corContorno,
                    weight: espessura,
                    fillOpacity: 1
                }
            });

        });

}

// =========================
// MAPA
// =========================

const map = L.map('map');

let limitesLoteamento = null;

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
}).addTo(map);

// =========================
// CAMADA: RUAS
// =========================

fetch('dados/Ruas_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        const ruas = L.geoJSON(data, {
            style: {
                color: CORES.ruas,
                weight: 1.5,
                fillColor: CORES.ruas,
                fillOpacity: 1
            }
        });

       ruas.addTo(map);

limitesLoteamento = ruas.getBounds();

map.fitBounds(limitesLoteamento);

    })
    .catch(error => console.error(error));

    // =========================
// CAMADA: CALÇADAS
// =========================

fetch('dados/Calcada_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        const calcadas = L.geoJSON(data, {
            style: {
                color: CORES.calcadas,
                weight: 0.5,
                fillColor: CORES.calcadas,
                fillOpacity: 1
            }
        });

        calcadas.addTo(map);

    })
    .catch(error => console.error(error));

    // =========================
// CAMADA: QUADRAS AUXILIARES
// =========================

fetch('dados/Quadras_auxiliares_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        const quadras = L.geoJSON(data, {
            style: {
                color: CORES.quadras,
                weight: 0.8,
                fillColor: CORES.quadras,
                fillOpacity: 1
            }
        });

        quadras.addTo(map);

    })
    .catch(error => console.error(error));

    // =========================
// CAMADA: LOTES
// =========================

fetch('dados/lotes_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        const lotes = L.geoJSON(data, {
            style: {
                color: CORES.contornoLotes,
                weight: 0.6,
                fillColor: CORES.lotes,
                fillOpacity: 1
            }
        });

        lotes.addTo(map);

    })
    .catch(error => console.error(error));

    // =========================
// CAMADA: PRAÇAS
// =========================

fetch('dados/Pracas_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        const pracas = L.geoJSON(data, {
            style: {
                color: CORES.pracas,
                weight: 0.5,
                fillColor: CORES.pracas,
                fillOpacity: 1
            }
        });

        pracas.addTo(map);

    })
    .catch(error => console.error(error));


    // =========================
// CAMADA: NÚMERO DAS QUADRAS
// =========================

fetch('dados/n_quadras_web_4326.geojson')
.then(response => response.json())
.then(data => {

    L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            return L.marker(latlng, {
                icon: L.divIcon({
                    className: 'rotulo-quadra',
                    html: feature.properties.text,
                    iconSize: [0, 0]
                })
            });

        }

    }).addTo(map);

})
.catch(error => console.error(error));

 

    // =========================
// CAMADA: NÚMERO DOS LOTES
// =========================

fetch('dados/n_lotes_web_4326.geojson')
    .then(response => response.json())
    .then(data => {

        L.geoJSON(data, {

            pointToLayer: function(feature, latlng) {

                return L.marker(latlng, {
                    icon: L.divIcon({
                        className: 'rotulo-lote',
                        html: feature.properties.text,
                        iconSize: [0, 0]
                    })
                });

            }

        }).addTo(map);

    })
    .catch(error => console.error(error));

    // =========================
// CAMADA: NOME DAS RUAS
// =========================

fetch('dados/nome_ruas_web_4326.geojson')
.then(response => response.json())
.then(data => {

    L.geoJSON(data, {

        pointToLayer: function(feature, latlng) {

            const texto = feature.properties.text;

            // Ângulo original vindo do QGIS
            const anguloQGIS = feature.properties.angle || 0;

            // O eixo vertical da tela é invertido em relação ao QGIS
            const anguloTela = -anguloQGIS;

            // Reposicionamento dos nomes
let deslocamentoX = 0;
let deslocamentoY = 0;

// Grupo aproximadamente 33°
// Move para cima
if (anguloQGIS > 30 && anguloQGIS < 40) {
    deslocamentoY = -24;
}

// Grupo aproximadamente 303°
// Move para a esquerda
if (anguloQGIS > 300 && anguloQGIS < 310) {
    deslocamentoX = -10;
}

            return L.marker(latlng, {
                icon: L.divIcon({
                    className: 'rotulo-rua',
                    html: `
                        <span
                            class="texto-rua"
                            style="transform: translate(${deslocamentoX}px, ${deslocamentoY}px) rotate(${anguloTela}deg);"
                        >
                            ${texto}
                        </span>
                    `,
                    iconSize: [0, 0]
                })
            });

        }

    }).addTo(map);

})
.catch(error => console.error(error));

    // =========================
// ESCALA DOS RÓTULOS
// TESTE: NÚMEROS DAS QUADRAS
// =========================

function atualizarEscalaRotulos() {

    const zoom = map.getZoom();

    const zoomReferencia = 17;

    // Quadras
    const tamanhoQuadra = 9 * Math.pow(2, zoom - zoomReferencia);

    document.documentElement.style.setProperty(
        '--tamanho-rotulo-quadra',
        `${tamanhoQuadra}px`
    );

    // Lotes
    const tamanhoLote = 4 * Math.pow(2, zoom - zoomReferencia);

    document.documentElement.style.setProperty(
        '--tamanho-rotulo-lote',
        `${tamanhoLote}px`
    );


 // Ruas
    const tamanhoRua = 4 * Math.pow(2, zoom - zoomReferencia);

    document.documentElement.style.setProperty(
        '--tamanho-rotulo-rua',
        `${tamanhoRua}px`
    );
}

map.on('zoomend', atualizarEscalaRotulos);

atualizarEscalaRotulos();

// =========================
// LOCALIZAÇÃO EM TEMPO REAL
// =========================

let marcadorLocalizacao = null;
let circuloPrecisao = null;

function iniciarLocalizacao() {

    if (!navigator.geolocation) {
        alert('Este dispositivo não permite acessar a localização.');
        return;
    }

    navigator.geolocation.watchPosition(

        function(posicao) {

            const latitude = posicao.coords.latitude;
            const longitude = posicao.coords.longitude;
            const precisao = posicao.coords.accuracy;

            console.log(`Precisão da localização: ±${Math.round(precisao)} metros`);

            const coordenadas = [latitude, longitude];

            // Cria o marcador na primeira localização
            if (!marcadorLocalizacao) {

                marcadorLocalizacao = L.circleMarker(coordenadas, {
                    radius: 8,
                    color: '#FFFFFF',
                    weight: 3,
                    fillColor: '#4285F4',
                    fillOpacity: 1
                }).addTo(map);

                circuloPrecisao = L.circle(coordenadas, {
                    radius: precisao,
                    color: '#4285F4',
                    weight: 1,
                    fillColor: '#4285F4',
                    fillOpacity: 0.12
                }).addTo(map);

            } else {

                // Atualiza a posição conforme o cliente se movimenta
                marcadorLocalizacao.setLatLng(coordenadas);

                circuloPrecisao.setLatLng(coordenadas);
                circuloPrecisao.setRadius(precisao);
            }


        },

        function(erro) {

            console.error('Erro de localização:', erro);

            if (erro.code === 1) {
                alert('Permita o acesso à localização para visualizar sua posição no mapa.');
            }

        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
}

iniciarLocalizacao();

// =========================
// BOTÃO: MINHA LOCALIZAÇÃO
// =========================

const BotaoLocalizacao = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function() {

        const botao = L.DomUtil.create('button', 'botao-localizacao');

        botao.innerHTML = '◎';
        botao.title = 'Minha localização';

        L.DomEvent.disableClickPropagation(botao);

        L.DomEvent.on(botao, 'click', function() {

            if (marcadorLocalizacao) {

                map.setView(
                    marcadorLocalizacao.getLatLng(),
                    19,
                    {
                        animate: true
                    }
                );

            } else {

                alert('Aguardando sua localização...');

            }

        });

        return botao;
    }
});

map.addControl(new BotaoLocalizacao());

// =========================
// BOTÕES DE NAVEGAÇÃO
// =========================

const DESTINO = {
    latitude: -20.426571,
    longitude: -40.358989
};

const BotoesNavegacao = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function() {

        const container = L.DomUtil.create('div', 'botoes-navegacao');

        // Impede que o clique nos botões interfira no mapa
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableScrollPropagation(container);

        // WAZE
        const botaoWaze = L.DomUtil.create(
            'button',
            'botao-navegacao botao-waze',
            container
        );

        botaoWaze.innerHTML = 'W';
        botaoWaze.title = 'Abrir no Waze';

        L.DomEvent.on(botaoWaze, 'click', function() {

            const urlWaze =
                `https://www.waze.com/ul?ll=${DESTINO.latitude},${DESTINO.longitude}&navigate=yes`;

            window.open(urlWaze, '_blank');
        });


        // GOOGLE MAPS
        const botaoMaps = L.DomUtil.create(
            'button',
            'botao-navegacao botao-maps',
            container
        );

        botaoMaps.innerHTML = 'G';
        botaoMaps.title = 'Abrir no Google Maps';

        L.DomEvent.on(botaoMaps, 'click', function() {

            const urlMaps =
                `https://www.google.com/maps/dir/?api=1&destination=${DESTINO.latitude},${DESTINO.longitude}`;

            window.open(urlMaps, '_blank');
        });

        return container;
    }
});

map.addControl(new BotoesNavegacao());

// =========================
// BOTÃO: VER LOTEAMENTO
// =========================

const BotaoLoteamento = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function() {

        const botao = L.DomUtil.create('button', 'botao-loteamento');

        botao.innerHTML = '⌂';
        botao.title = 'Ver loteamento';

        L.DomEvent.disableClickPropagation(botao);

        L.DomEvent.on(botao, 'click', function() {

            if (limitesLoteamento) {
                map.fitBounds(limitesLoteamento);
            }

        });

        return botao;
    }
});

map.addControl(new BotaoLoteamento());