/*
        VARIABLES Y CONSTANTES GLOBALES
*/

const fs = require('fs'); //File System
const filePathRegistro = "./src/ui/scripts/Data/Registro_Tabla.csv";
const filePathEmpresas = "./src/ui/scripts/Data/Empresas.csv"
const filePathConsultores = "./src/ui/scripts/Data/Consultores.txt"
const filePathData = "./src/ui/scripts/Data/";
const diasDeLaSemana = 7;
const primeraHora = 7;
const ultimaHora = 24;
const cabezeras = ['Horas', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

let inputEmpresas = document.querySelector('#inputEmpresas');
let listaEmpresas = document.querySelector('#listaEmpresas')
let diasMarcados = document.querySelectorAll('.check');
let horaInicio = document.querySelector('#horaInicio');
let horaFinal = document.querySelector('#horaFinal');
let selecConsultor = document.querySelector('#selecConsultor');
let tablaHtml = document.querySelector('table');

let empresasAgregadas = [];
let consultores = [];
let cantDiasSeleccionados = 0;

/*
        OBJETOS
*/

function Empresa(nombre, horas) {
    this.nombre = nombre;
    this.horas = horas;
}

function Consultor(nombre, horario) {
    this.nombre = nombre;
    this.horario = horario;
}

/*
        FUNCIONES
*/

function cargarContenidoTabla() {
    try {
        fs.readFile(filePathRegistro, "utf8", (err, data) => {
            try {
                let datosExtraidos = data;
                datosExtraidos = datosExtraidos.split(/\r?\n/);
                cargarTabla(tablaHtml, datosExtraidos);
            } catch (error) {
                actualizarTabla();
            }

        });
    } catch (error) {
        console.log('No hay registros previos');
    }
}

function crearTablaVacia(tabla) {
    for (i = primeraHora - 1; i < ultimaHora; i++) {
        let tr = document.createElement('tr');
        for (j = 0; j <= diasDeLaSemana; j++) {
            if (i == primeraHora - 1) {
                let th = document.createElement('th');
                let txt = document.createTextNode(cabezeras[j]);
                th.appendChild(txt);
                th.classList.add('vacio', 'noSeleccionado');
                tr.appendChild(th);
            } else if (j == 0 && i != primeraHora - 1) {
                let td = document.createElement('td');
                let txt = document.createTextNode(i + ":00 - " + (i + 1) + ":00");
                td.appendChild(txt);
                td.classList.add('vacio', 'noSeleccionado');
                tr.appendChild(td);
            } else {
                let td = document.createElement('td');
                let txt = document.createTextNode('');
                td.onclick = limpiarCelda;
                td.appendChild(txt);
                td.classList.add('vacio');
                tr.appendChild(td);
            }
        }
        tabla.appendChild(tr);
    }
}

function cargarTabla(tabla, tablaCreada) {
    for (i = 1; i < tablaCreada.length - 1; i++) {
        row = tablaCreada[i].split(',');
        for (j = 0; j < diasDeLaSemana; j++) {
            if (row[j] != '0') {
                tabla.rows[i].cells[j + 1].textContent = row[j];
                tabla.rows[i].cells[j + 1].classList.remove('vacio');
                tabla.rows[i].cells[j + 1].classList.add('ocupado');
            }
        }
    }
}

function cargarConsultores() {
    try {
        fs.readFileSync(filePathConsultores, "utf8", (err, data) => {
            try {
                let datosDelArchivo = data.split(/\r?\n/);
                for (i = 0; i < datosDelArchivo.length; i++) {

                }
            } catch (error) {
                console.log(err);
            }
        })
    } catch (error) {
        console.log(error)
    }

}

function actualizarTabla() {
    let contenido = "";
    for (i = 0; i < ultimaHora - primeraHora; i++) {
        for (j = 1; j <= diasDeLaSemana; j++) {
            if (j != diasDeLaSemana) {
                if (tabla.rows[i].cells[j].textContent != "") {
                    contenido += tabla.rows[i].cells[j].textContent + ",";
                } else {
                    contenido += "0,";
                }
            } else {
                if (tabla.rows[i].cells[j].textContent != "") {
                    contenido += tabla.rows[i].cells[j].textContent;
                } else {
                    contenido += "0";
                }
            }
        }
        contenido += "\n";
    }
    fs.writeFileSync(filePathRegistro, contenido);
}

function cargarEmpresas() {
    try {
        let empresas = fs.readFileSync(filePathEmpresas, 'utf-8');
        empresas = empresas.split(/\r?\n/);
        for (i = 1; i < empresas.length; i++) {
            let datoEmpresa = empresas[i].split(',');
            empresasAgregadas.push(new Empresa(datoEmpresa[0], parseInt(datoEmpresa[1])));
        }

    } catch (error) {
        console.log('Sin registro de Empresas');
    }

    for (i = 0; i < empresasAgregadas.length; i++) {
        let op = document.createElement('option');
        op.value = "Nombre: " + empresasAgregadas[i].nombre + "  |  Horas: " + empresasAgregadas[i].horas;
        listaEmpresas.appendChild(op);
    }
}

function diaSeleccionado() {
    cantDiasSeleccionados = 0;
    for (i = 0; i < diasMarcados.length; i++) {
        if (diasMarcados[i].checked) {
            tablaHtml.rows[0].cells[i + 1].classList.add("seleccionado");
            cantDiasSeleccionados += 1;
        } else {
            tablaHtml.rows[0].cells[i + 1].classList.remove("seleccionado");
            tablaHtml.rows[0].cells[i + 1].classList.add("noSeleccionado")
        }
    }

    if (horaInicio.selectedIndex != 0 && horaFinal.selectedIndex != 0) {
        revisarEspacio();
    }
}

function cargarHoras() {
    for (i = 0; i < ultimaHora - primeraHora; i++) {
        let op = document.createElement('option');
        let txt;
        if (i + 7 < 10) {
            txt = document.createTextNode("0" + (i + 7) + ":00");
        } else {
            txt = document.createTextNode((i + 7) + ":00")
        }
        op.appendChild(txt);
        horaInicio.appendChild(op);
    }
}

function tiempoDisponible() {

    for (j = 0; j < diasMarcados.length; j++) {
        for (i = 0; i < ultimaHora - primeraHora + 1; i++) {
            if (tablaHtml.rows[i].cells[j + 1].textContent == "" && tablaHtml.rows[i].cells[j + 1].classList.contains('seleccionado')) {
                tablaHtml.rows[i].cells[j + 1].classList.remove('seleccionado');
                tablaHtml.rows[i].cells[j + 1].classList.add('noSeleccionado');
            }
        }
    }

    let hijoNulo = horaFinal.children[0];
    horaFinal.innerHTML = "";
    horaFinal.appendChild(hijoNulo);
    for (i = horaInicio.selectedIndex; i < ultimaHora - primeraHora + 1; i++) {
        let op = document.createElement('option');
        let txt;
        if (i + 7 < 10) {
            txt = document.createTextNode("0" + (i + 7) + ":00");
        } else {
            txt = document.createTextNode((i + 7) + ":00")
        }
        op.appendChild(txt);
        horaFinal.appendChild(op);
    }

}

function revisarEspacio() {
    for (j = 0; j < diasMarcados.length; j++) {
        for (i = 0; i < ultimaHora - primeraHora + 1; i++) {
            if (tablaHtml.rows[i].cells[j + 1].textContent == "" && tablaHtml.rows[i].cells[j + 1].classList.contains('seleccionado')) {
                tablaHtml.rows[i].cells[j + 1].classList.remove('seleccionado');
                tablaHtml.rows[i].cells[j + 1].classList.add('noSeleccionado');
            }
        }
    }
    for (j = 0; j < diasMarcados.length; j++) {
        if (diasMarcados[j].checked) {
            for (i = horaInicio.selectedIndex; i < horaInicio.selectedIndex + horaFinal.selectedIndex; i++) {
                if (tablaHtml.rows[i].cells[j + 1].textContent == "") {
                    tablaHtml.rows[i].cells[j + 1].classList.remove('noSeleccionado');
                    tablaHtml.rows[i].cells[j + 1].classList.add('seleccionado');
                } else {
                    console.log("Los días chocan");
                }
            }
        }
    }

}

function borrarDatos() {
    for (j = 0; j < diasMarcados.length; j++) {
        for (i = 1; i < ultimaHora - primeraHora + 1; i++) {
            tablaHtml.rows[i].cells[j + 1].textContent = "";
            if (tablaHtml.rows[i].cells[j + 1].classList.contains('ocupado')) {
                tablaHtml.rows[i].cells[j + 1].classList.remove('ocupado');
                tablaHtml.rows[i].cells[j + 1].classList.add('vacio');
            }
        }
    }
    actualizarTabla();
}

function ventanaError() {

}

function agregarAlPlan() {
    if (inputEmpresas.value != "" && horaInicio.selectedIndex != 0 && horaFinal.selectedIndex != 0) {
        for (j = 0; j < diasMarcados.length; j++) {
            for (i = 0; i < ultimaHora - primeraHora + 1; i++) {
                if (i == 0 && tablaHtml.rows[i].cells[j + 1].classList.contains('seleccionado')) {
                    tablaHtml.rows[i].cells[j + 1].classList.remove('seleccionado');
                    tablaHtml.rows[i].cells[j + 1].classList.add('noSeleccionado');
                }
                else if (tablaHtml.rows[i].cells[j + 1].classList.contains('seleccionado')) {
                    tablaHtml.rows[i].cells[j + 1].classList.remove('seleccionado');
                    tablaHtml.rows[i].cells[j + 1].classList.add('ocupado');
                    tablaHtml.rows[i].cells[j + 1].textContent = inputEmpresas.value;
                }
            }
        }
    }


    inputEmpresas.value = "";
    for (i = 0; i < diasMarcados.length; i++) {
        diasMarcados[i].checked = false;
    }
    diaSeleccionado();
    horaInicio.selectedIndex = 0;
    horaFinal.selectedIndex = 0;

    actualizarTabla();
}

function limpiarCelda() {
    if (this.textContent != "") {
        this.classList.remove('ocupado');
        this.classList.add('vacio');
        this.textContent = "";
        borrarDeRegistro(this.parentElement.rowIndex, this.cellIndex - 1);
    }

}

function borrarDeRegistro(fila, columna) {
    try {
        let datosExtraidos = fs.readFileSync(filePathRegistro, 'utf-8');
        datosExtraidos = datosExtraidos.split(/\r?\n/);
        let col = datosExtraidos[fila].split(',');
        col[columna] = "0";
        col = col.join(',');
        datosExtraidos[fila] = col;
        datosExtraidos = datosExtraidos.join('\n');
        fs.writeFileSync(filePathRegistro, datosExtraidos);
    } catch (error) {
        console.log(error);
    }

}


function limpiarMenu() {

}

function cargarPrograma() {
    crearTablaVacia(tablaHtml);
    cargarContenidoTabla();
    cargarEmpresas();
    cargarConsultores();
    cargarHoras();
}

cargarPrograma();
