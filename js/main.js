$(document).ready(function () {
    var current = 1;
    var current_step;
    var next_step;
    var type_user;
    var myTimer;
    var clone_step;
    var sismicIntervention = {};

    var steps = $("fieldset").length - 2;
    $("input").attr("autocomplete", "off");

    $("#privacy").on("change", function () {
        if ($(this).is(":checked")) {
            let btn_next = $(this)
                .closest(".form-group")
                .siblings(".bottoni")
                .children(".next");
            btn_next.prop("disabled", false);
        } else if ($(this).not(":checked")) {
            let btn_next = $(this)
                .closest(".form-group")
                .siblings(".bottoni")
                .children(".next");
            btn_next.prop("disabled", true);
        }
    });

    $(".next").on("click", function (e) {
        current_step = $(this).closest("fieldset");
        console.log(current_step);
        let fieldset_count_page = $(this)
            .closest("fieldset")
            .attr("data-count-page");
        let control = controlInput(fieldset_count_page);
        if (control) {
            console.log("passo i controlli");

            if (fieldset_count_page == 10) {
                checkSismic(fieldset_count_page);
                let map = "mapSismic";
                //renderMap(placesAutocompleteSismic, map)

                setTimeout(function () {
                    $("#sismic-intervention-search")
                        .val(sismicIntervention.address + " ")
                        .keypress();
                }, 2000);
            } else if (fieldset_count_page == 5) {
                sismicIntervention["address"] = $("#dove").val();
            } /* else if(fieldset_count_page==13 ) {
          console.log('ciao');
          $('.clock').css('display' , 'none');
          clearInterval(myTimer);
        } */

            next_step = $(this).closest("fieldset").next();
            current_step.hide();
            next_step.show();
            setProgressBar(++current);
            $(".progress").css("display", "block");
            //setClock();
            $(".error").text("");
        }
    });

    $(".previous").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
    });

    $(".previous-reg").on("click", function () {
        current_step = $(this).closest("fieldset");
        next_step = $(this).closest("fieldset").prev();
        next_step.show();
        current_step.hide();
        setProgressBar(--current);
        console.log(next_step);
        clone_step.forEach((element) => {
            let el_page = element.getAttribute("data-count-page") - 1;
            $("fieldset[data-count-page='" + el_page + "']").after(element);
        });
        clone_step = "";
    });
    setProgressBar(current);

    // barra di progresso, cambio percentuale

    function setProgressBar(curStep) {
        var percentuale = parseFloat(100 / steps) * curStep;
        percentuale = percentuale.toFixed();
        $(".progress-bar").css("width", percentuale + "%");
        // .html(percentuale+"%");
    }

    // da richiamare quando metteremo il timer
    function setClock() {
        clearInterval(myTimer);
        $(".clock").css("display", "block");
        let timer = 30;
        let clock = $(".clock_second");
        clock.text(timer);

        myTimer = setInterval(function (event) {
            timer--;
            if (timer <= 9) {
                timer = "0" + timer;
            }
            clock.text(timer);

            if (timer == 0) {
                clearInterval(myTimer);
                location.reload();
            }
        }, 1000);
    }

    //! siamo nel fieldset 2 al momento di scegliere se l'utente è un'impresa o una persona fisica.
    //todo dare la classe type-user ai bottoni che devono essere cliccati dall'utente durante la scelta

    //todo in caso si volesse poi reinserire le pagine rimosse dalla funzione, alla pagina successiva, al bottone per tornare indietro sostituire la classe previous con previous-reg

    $(".type-user").on("click", function () {
        let type = $(this).attr("data-typeUser");
        let current_step = $(this).closest("fieldset");
        //? setta la variabile globale type-user in base alla scelta dell'utente
        type_user = type;

        //? se l'utente è una persona salvo in una variabile i fieldset per i dati dell'impresa e viceversa
        if (type_user === "person") {
            var remove_step = current_step.siblings(".business");
        } else if (type_user === "business") {
            var remove_step = current_step.siblings(".person");
        }
        //? prima li clona con tutti gli handler, trasformando il risultato in un array di elementi, poi li rimuovo dalla pagina
        //*nel caso l'utente torni indietro queste pagine verrano reinserite nel DOM, vedere l'handler legato al click sull'elemento con classe previous-reg
        clone_step = remove_step.clone(true).get();
        remove_step.remove();

        //? applica la stessa logica del next, andando alla pagina successiva, settando il timer, aumentando la barra di progresso
        current_step.hide();
        current_step.next().show();
        //setClock();
        setProgressBar(++current);
    });

    //! questa è una funzione provvisoria per nascondere o mostrare il fieldset 10 in base alla scelta dell'utente nella precedente checkbox
    //* se l'utente checca l'input con classe sismic- intervention-check, la pagina si deve vedere

    function checkSismic(currentStep) {
        if ($(".sismic-intervention-check").is(":checked")) {
            if (sismicIntervention["removed"]) {
                let clone_step = sismicIntervention["clone"];
                console.log(currentStep);

                $(`fieldset[data-count-page=${currentStep}]`).after(clone_step);
            }
        } else {
            sismicIntervention["removed"] = true;
            let remove_step = $(".sismic-intervention").clone(true).get();
            sismicIntervention["clone"] = remove_step[0];
            console.log(sismicIntervention.clone);
            $(".sismic-intervention").remove();
        }
    }

    //!validazione select
    $(".choose-category").on("change", function () {
        let selectedCategory = $(this).val();
        if (selectedCategory !== "none") {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".category-real-estate")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
        $(".sub-category").removeClass("active");
        $(".category-" + selectedCategory).addClass("active");
        $(".category-real-estate-btn").addClass("active");
    });

    //! validazioni checkbox*/
    $(".owner-title input").on("click", function () {
        $(".owner-title input").prop("checked", false);
        $(this).prop("checked", true);
        $(".owner-title")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".category-user input").on("click", function () {
        $(".category-user input").prop("checked", false);
        $(this).prop("checked", true);
        $(".category-user")
            .siblings(".bottoni")
            .find(".next")
            .prop("disabled", false);
    });

    $(".intervention-trainant input").on("click", function () {
        if ($(".none-check").is(":checked") && $(this).hasClass("none-check")) {
            $(".intervention-trainant input").prop("checked", false);
            $(".none-check").prop("checked", true);
        } else if (
            $(".none-check").is(":checked") &&
            !$(this).hasClass("none-check")
        ) {
            $(".none-check").prop("checked", false);
        }
        if ($(".intervention-trainant input:checked").length) {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", false);
        } else {
            $(".intervention-trainant")
                .siblings(".bottoni")
                .find(".next")
                .prop("disabled", true);
        }
    });

    //! funzione di controllo per validare gli input e le select in pagina
    //todo dare classe input-control agli input che devono essere controllati, e classe select-control alle select che devono essere controllate

    //todo controllare che gli input abbiano come fratello direttamente successivo uno elemento con classe error, per inserire il messaggio di errore, ed il label come fratello direttamente precedente per poter usare il contenuto, come variabile da inserire nel messaggio di errore

    //todo per dirgli che c'è un errore impostare la variabile emptyInput a true
    //!! la funzione ritorna falso, se c'è qualcosa che non va con gli input, e true se è tutto apposto
    function controlInput(countPage) {
        //? seleziono il fieldset padre tramite il countPage passato
        let inputs = $(
            `fieldset[data-count-page=${countPage}] .input-control`
        ).get();
        let select = $(
            `fieldset[data-count-page=${countPage}] .select-control`
        ).get();
        let emptyInput = false;
        //? controllo gli input all'interno del fieldset
        inputs.forEach((element) => {
            if (element.classList.contains("ap-input")) {
                var errorBox = element.parentNode.parentNode.parentNode.querySelector(
                    ".error"
                );
                console.log(errorBox);
                var label = element.parentNode.parentNode.parentNode.querySelector(
                    "label"
                ).innerHTML;
            } else {
                var errorBox = element.parentNode.parentNode.querySelector(
                    ".error"
                );
                console.log(errorBox);
                var label = element.parentNode.parentNode.querySelector("label")
                    .innerHTML;
            }
            //? una serie di filtri in cui deve passare l'input
            //* controlla se è vuoto
            console.log(element);
            if (element.value.length == 0) {
                emptyInput = true;
                errorBox.innerHTML = `${label} deve essere compilato `;
                //* controlla se è di tipo date
            } else if (element.getAttribute("type") == "date") {
                //* controlla che la data sia minore di quella attuale
                let date = new Date();
                let thisYear = date.getFullYear();
                let dateArr = $("#date").val().split("-");
                if (dateArr[0] < 1900 || dateArr[0] > thisYear) {
                    emptyInput = true;
                }
                //* controlla se è di tipo email
            } else if (element.getAttribute("type") == "email") {
                //* validazione della mail
                var regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                console.log(element.value);
                if (!regEmail.test(element.value)) {
                    emptyInput = true;
                    errorBox.innerHTML = "Formato email non valido";
                }
            } else {
                //* se gli input sono stati riempiti dai pop up, il messaggio di errore viene cancellato

                if (errorBox.innerHTML.length != 0) {
                    errorBox.innerHTML = "";
                }
            }
        });
        select.forEach((element) => {
            if (element.value == "none") {
                emptyInput = true;
                let errorBox = element.nextElementSibling;
                let label = element.previousElementSibling.innerHTML;
                errorBox.innerHTML = `${label} deve essere compilato `;
            }
        });
        if (emptyInput) {
            return false;
        }
        return true;
    }

    /* test */
    var stocaiz;
    //! funzione di controllo dei pop-up, che blocca il salvataggio dei dati negli input se non viene selezionato tutto
    //? dare classe popup-control agli input che devono essere controllati all'interno del popup

    function controlPopup(popupId) {
        let inputs = $(`#${popupId} .popup-control`).get();
        let emptyInput = false;
        inputs.forEach((element) => {
            if (element.value.length == 0) {
                if (element.classList.contains("input-popup-control")) {
                    var dataError = element.getAttribute("id");
                } else {
                    var dataError = element.getAttribute("data-error");
                }
                emptyInput = true;
                let errorBox = $(`#${dataError}`).siblings(".error");
                let label = $(`#${dataError}`).siblings("label").text();
                errorBox.text(`${label} deve essere compilato `);
            }
        });
        if (emptyInput) {
            return false;
        }
        return true;
    }

    //!funzione per inserire automaticamente i dati dei pop up negli input
    //? dare classe save-pop-up al bottone salva
    //? settare negli input in pagina il data-receive-from uguale all'id dell'input nel pop up di cui salvare i dati
    $(".save-pop-up").on("click", function (e) {
        let pop_up = $(this).closest(".modal").attr("id");
        let control = controlPopup(pop_up);
        console.log(control);
        if (!control) {
            e.preventDefault();
        } else {
            $(this).closest(".modal").find(".close").click();
            let fieldset_count_page = $(this)
                .closest("fieldset")
                .attr("data-count-page");
            let pop_up_input = $(this).closest(".modal").find("input").get();
            console.log(pop_up_input);

            for (let i = 0; i < pop_up_input.length; i++) {
                let id_pop_up_input = pop_up_input[i].getAttribute("id");
                console.log(id_pop_up_input);
                if (
                    $(
                        `fieldset[data-count-page=${fieldset_count_page}] input[data-receive-from=${id_pop_up_input}]`
                    ).length
                ) {
                    console.log(pop_up_input[i].value);
                    let inputText = pop_up_input[i].value;
                    console.log(inputText);
                    console.log(id_pop_up_input);
                    $(`input[data-receive-from=${id_pop_up_input}`).val(
                        inputText
                    );
                    $(`input[data-receive-from=${id_pop_up_input}`)
                        .closest(".row-input")
                        .siblings(".error")
                        .text("");
                }
            }
        }
    });

    //! funzione che scrive il valore della option selezionata all'interno dei pop-up, in input nascosti su cui poi fare i dovuti controlli
    //?dare classe send-val alla select
    //? dare lo stesso id delle select all'input, aggiungendo "-input"
    $(".send-val").on("change", function () {
        $(this).siblings(".error").text("");
        let valSelect = $(this).find("option:selected").text();
        let idSelect = $(this).attr("id");
        let hiddenInput = $(`#${idSelect}-input`).get();
        hiddenInput[0].value = valSelect;
        console.log(hiddenInput[0].value);
        //hiddenInput.val(valSelect)
    });

    //! funzione per inserire e pulire input del nome
    $(".send-val-name").on("keyup", function () {
        let valName = $("#name-popup").val();
        let valSurname = $("#surname-popup").val();
        //let valNameArr=valName.split(' ');
        //let valSurnameArr=valSurname.split(' ');
        let name = valName
            .split(" ")
            .filter((i) => i)
            .join(" ");
        console.log(name);
        let surname = valSurname
            .split(" ")
            .filter((i) => i)
            .join(" ");
        $("#complete-name").val(name + " " + surname);
        console.log($("#complete-name").val());
    });
    //! pulisco gli errorBox quando i campi vengono compilati
    //? quando la select cambia pulisco lo span di errore
    $(".select-control").on("change", function () {
        let errorBox = $(this).siblings(".error");
        if (errorBox.length != 0) {
            errorBox.text("");
        }
    });

    //? validazione dell'input di tipo date
    $("#date").on("change", function () {
        let date = new Date();
        let thisYear = date.getFullYear();
        let errorBox = $(this).siblings(".error");
        let dateArr = $("#date").val().split("-");
        if (dateArr[0] < 1900 || dateArr[0] > thisYear) {
            errorBox.text("Data di nascita non valida");
        } else {
            errorBox.text("");
        }
    });

    //? alchange delle input che non si riempiono tramite popup, vadoa cancellare il messaggio di errore
    $(".input-control")
        .not('[type="date"]')
        .on("change", function () {
            var errorBox = $(this).siblings(".error");
            if (errorBox.text().length != 0) {
                errorBox.text("");
            }
        });

    //! chiamata ad Algolia per la mappa della sede legale
    //? autocompletamento dell'input di ricerca
    var placesAutocomplete = places({
        appId: "pl7QEUHBIWGV",
        apiKey: "bc57f2fb92b40eb8a458abd86c2b3402",
        container: document.querySelector("#address-registered-office "),
    });

    var placesAutocompleteSismic = places({
        appId: "pl7QEUHBIWGV",
        apiKey: "bc57f2fb92b40eb8a458abd86c2b3402",
        container: document.querySelector("#dove"),
    });

    var placesAutocompleteSismic = places({
        appId: "pl7QEUHBIWGV",
        apiKey: "bc57f2fb92b40eb8a458abd86c2b3402",
        container: document.querySelector("#sismic-intervention-search"),
    });
    //? autocompleto input della citta e del CAP
    placesAutocomplete.on("change", function resultSelected(e) {
        document.querySelector("#city-registered-office").value =
            e.suggestion.city || "";
        document.querySelector("#postal-code-registered-office").value =
            e.suggestion.postcode || "";
    });

    //? all'apertura del pop up della sede legale renderizzo la mappa
    $("#sede").on("click", function () {
        let map = "map-registered-office";
        renderMap(placesAutocomplete, map);
    });

    function renderMap(autocomplete, mapToSet) {
        setTimeout(function () {
            //?renderizzo la mappa
            var map = L.map(mapToSet, {
                scrollWheelZoom: false,
                zoomControl: false,
            });

            var osmLayer = new L.TileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    minZoom: 1,
                    maxZoom: 13,
                    attribution:
                        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
                }
            );

            var markers = [];

            map.invalidateSize();
            map.setView(new L.LatLng(0, 0), 1);
            map.addLayer(osmLayer);

            autocomplete.on("suggestions", handleOnSuggestions);
            autocomplete.on("cursorchanged", handleOnCursorchanged);
            autocomplete.on("change", handleOnChange);
            autocomplete.on("clear", handleOnClear);

            function handleOnSuggestions(e) {
                markers.forEach(removeMarker);
                markers = [];

                if (e.suggestions.length === 0) {
                    map.setView(new L.LatLng(0, 0), 1);
                    return;
                }

                e.suggestions.forEach(addMarker);
                findBestZoom();
            }

            function handleOnChange(e) {
                markers.forEach(function (marker, markerIndex) {
                    if (markerIndex === e.suggestionIndex) {
                        markers = [marker];
                        marker.setOpacity(1);
                        findBestZoom();
                    } else {
                        removeMarker(marker);
                    }
                });
            }

            function handleOnClear() {
                map.setView(new L.LatLng(0, 0), 1);
                markers.forEach(removeMarker);
            }

            function handleOnCursorchanged(e) {
                markers.forEach(function (marker, markerIndex) {
                    if (markerIndex === e.suggestionIndex) {
                        marker.setOpacity(1);
                        marker.setZIndexOffset(1000);
                    } else {
                        marker.setZIndexOffset(0);
                        marker.setOpacity(0.5);
                    }
                });
            }

            function addMarker(suggestion) {
                var marker = L.marker(suggestion.latlng, { opacity: 0.4 });
                marker.addTo(map);
                markers.push(marker);
            }

            function removeMarker(marker) {
                map.removeLayer(marker);
            }

            function findBestZoom() {
                var featureGroup = L.featureGroup(markers);
                map.fitBounds(featureGroup.getBounds().pad(0.5), {
                    animate: false,
                });
            }
        }, 1000);
    }
});
