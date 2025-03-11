// ===================================================================
// -- SE ESTABLECE LA LOGICA DE LOS TEXTOS QUE SALEN HACIA ARRIBA ----
document.querySelectorAll("[data-make-text-show-up]").forEach(element => {
    const textToUse = element.textContent.split("");
    element.textContent = "";
    element.innerHTML   = "";

    const fragment = document.createDocumentFragment();

    textToUse.forEach( (letter, index) => {
        const span = document.createElement("span");
        span.textContent = letter;

        span.classList.add("span-up");
        span.style.setProperty("--index", index);

        fragment.appendChild(span);
    });

    element.appendChild(fragment);

    
    // Se comprueba si provee interfaz para comunicar su indice maximo a otros elementos
    if ("relatedIndexS" in element.dataset) {
        const key = element.dataset.relatedIndexS;

        document.querySelectorAll(`[data-related-index-r="${key}"]`).forEach(reciver => {

            reciver.style.setProperty(`--${key}-max-index`, textToUse.length - 1)
            
        });
    }
});


// ================================================================
// -- SE ESTABLECE LA LOGICA DE LOS INPUTS CON LABES QUE SALEN ----
document.querySelectorAll("[data-label-move]").forEach(input => {

    input.addEventListener("blur", ({target}) => {
        // Si el usuario introdujo algun valor, se quita la animacion
        target.classList.toggle("clicked", target.value );
    })

});


// ============================================================================
// -- SE ESTABLECE LA LOGICA DE LOS ELEMENTOS CUYO TEXTO INCLUYE PLANTILLA ----
const map_template_fn = {
    "{{YEAR}}": () => ( new Date() ).getFullYear()
}

document.querySelectorAll("[data-template-text]").forEach(template => {
    let text_template = template.textContent;

    for (const tem in map_template_fn) {
        if (text_template.includes(tem)) {
            text_template = text_template.replaceAll(tem, map_template_fn[tem]());
        }
    }

    template.textContent = text_template;
});


// ===========================================================
// -- SE ESTABLECE LA LOGICA PARA EL ENVIO DE LOS CORREOS ----
async function sendMessage(data) {
    return fetch("https://formsubmit.co/ajax/7c2d0b7a45c6a1bb34b3044e339464b9", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data)

    })
        .then(res => res.status === 200 ? ({ok: true}) : ({ok: false}) )
        .catch(_ => ({ok: false}));
}

const alerts_container = document.getElementById("alerts_container");
const suported_types = {
    SUCCESS: "success",
    ERROR: "error"
}
function showAlert(message, type) {

    const anothers_msg = alerts_container.querySelectorAll(`[data-alert-text="${message}"]`);
    if (anothers_msg.length > 0) return;

    const alert = document.createElement("div");
    alert.classList.add("alerts__alert", type);

    alert.innerHTML = `
    <p class="alerts__p">${message}</p>
    `;

    alerts_container.appendChild(alert);

    setTimeout(() => {
        alerts_container.removeChild(alert);
    }, 15_000);
}

const form = document.getElementById("send_message_form");
(form && // Se valida la existencia del form, ya que el script se importa en páginas sin el form
form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = Object.fromEntries( new FormData(form) );

    const result = await sendMessage(data);

    if (result.ok) {
        showAlert("!Gracias por ponerte en contacto¡", suported_types.SUCCESS);

    } else {
        showAlert("Upss! Verfique su conexión e intentelo nuevamente.", suported_types.ERROR);

    }

    form.reset();
    document.querySelectorAll("[data-label-move]").forEach(input => input.dispatchEvent(new Event("blur")));
})
);


// =================================================================
// -- SE ESTABLECE LA LOGICA PARA LA INSERCION DE LOS PROYECTOS ----
const proyectos = [
    {
        title: "MessagesReadWritters",
        url: "https://messagesredwriters.onrender.com/",
        img: "./imgs/messages_red_witers.png",
        status: 1,
        descripcion: "En este proyecto me propuse crear una aplicacion de mensajeria... y lo logre, lo unico que no logre fue dar con un buen nombre. Esta creada con nodejs, mongodb, y la mensajeria en tiempo real se logra a través de web sockets (usando Socket.io). Dado que uso servicios gratuitos para el hosting, puede que sea lento, o que incluso este caido, pero a la fecha 09/03/2025 esta funcionando",
        repo: "https://github.com/arnoldo-gonzalez/messages-app"
    },
    {
        title: "Blog de React Router",
        url: "https://blog-react-router.vercel.app/",
        img: "./imgs/blog.png",
        status: 1,
        descripcion: "Como el nombre lo indica, el proyecto esta creado con react y react router, y lo cree como práctica de estas dos tecnologias, todos los contenidos son falsos, y las imagenes (en su momento) eran aleatorias generadas por un api externa. Ahora bien, dicho api externa se cayo (placeimg, aun te extraño), por tanto, esa caracteristica no funciona bien.",
        repo: "https://github.com/arnoldo-gonzalez/blog-react-router"
    },
    {
        title: "React + Rick and Morty",
        url: "https://arnoldo-gonzalez.github.io/react-vite-rickandmorty/",
        img: "./imgs/rickt_morty.png",
        status: 1,
        descripcion: "Esta fue mi primera página en react, y la cree con la api de rick and morty. Es bastante sencilla, simplemente permite buscar personajes por su nombre",
        repo: "https://github.com/arnoldo-gonzalez/react-vite-rickandmorty"
    },
    /* {
        title: "",
        url: "",
        img: "./imgs/",
        status: 1,
        descripcion: "",
        repo: ""
    }, */
];

const proyectos_fragment = document.createDocumentFragment();
const proyects_place = document.getElementById("list_proyects");
(proyects_place && // Se valida la existencia del container, ya que el script se importa en páginas sin el container

(proyectos.forEach(proyecto => {
    const article = document.createElement("article");

    article.title = "Abrir - " + proyecto.title;
    article.classList.add("proyects__proyect");

    article.onclick = ({target}) => !target.href ? window.open(proyecto.url) : true;

    article.innerHTML = `
    <div title="El proyecto esta ${proyecto.status === 1 ? "activo" : "inactivo"}" class="proyects__status ${proyecto.status === 1 ? "active" : "inactive"} ">Estatus</div>
    <img src="${proyecto.img}" class="proyects__imgs">
    <p class="proyects__p">${proyecto.descripcion}</p>
    <a title="Ir al código fuente" href="${proyecto.repo}" target="_blank" class="proyects__a">Ir al código fuente</a>
    `;

    proyectos_fragment.appendChild(article)
}), true)

&& proyects_place.appendChild(proyectos_fragment)
);