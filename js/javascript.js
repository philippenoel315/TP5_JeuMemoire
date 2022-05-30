/**
 *  Fichier principal javascript
 */


"use strict";


// VARIABLES GLOBALES FOURNIES
let cartesDepart = []; // Contient les cartes générées à partir de la fonction genererCartesDepart()
let nbPaires = 0; // Nombre de paires du jeu. Déterminé au départ et affecté par la fonction genererCartesDepart()
let musiqueDeFond = new Audio(""); // Variable pour la musique de fond. Voir la fonction jouerMusique(nomFichier)

// VOS VARIABLES GLOBALES À COMPLÉTER ICI 
let premiereCarte;
let deuxiemeCarte;
let tableauCartes =[];
let pairesTrouvee = 0;

let minuterieARepetitions = null;
let compteur1 = 0;
let compteurDivs = 0;

let minuterieDivs = null;

// Création d'un objet Audio
const son1 = new Audio('audio/64.mp3');

/**
 * Fonction qui retourne le nombre de paires (2x la même carte) visibles dans le jeu
 * @returns Le nombre de paires actuellement visibles (donc trouvées)
 * FOURNIE
 */
function nbPairesTournées() {
    // Créer un tableau vide
    let cartesTournées = [];
    // Cibler toutes les cartes du jeu
    let mesCartes = $("#cartes div");

    // Parcourir toutes les cartes
    for (const iterator of mesCartes) {

        // Vérifier si la carte est visible
        if (iterator.dataset.estvisible == "oui") {
            // Ajouter la carte dans le tableau
            cartesTournées.push(iterator);
        }
    }

    // Retourner le nombre de cartes trouvées divisé par 2 (donc pour représenter des paires plutôt que des unités)
    return (cartesTournées.length / 2);
}


/**
 * Fonction qui permet de gérer le clic sur une carte. Si la carte est déjà visible, elle ne fait rien. 
 * Sinon, la fonction vérifie si la paire est trouvée.
 * @param {*} e 
 * TODO
 */

function gererClickCarte(e) {


    let carteClique = $("#" + e.target.id);


    // 1. Vérifier si la carte est visible
    if (carteClique.data("estvisible") == "non") {
        //2. Si la carte n'est pas visible, afficher la carte
        carteClique.removeClass("bg-hidden");
        //Point d'arrêt        
        carteClique.attr("data-estvisible", "oui");

        
        tableauCartes.push(carteClique);
        //Valider la premiere carte
        console.log("Test du modulo de la longueur du tableau cartes: " + tableauCartes.length%2);
        if (tableauCartes.length%2==0)
         {       
             console.log("Début vérification numero cartes");                    
            //Vérification du numero des cartes
            if ($(tableauCartes[tableauCartes.length-2]).attr("data-numero") == $(tableauCartes[tableauCartes.length-1]).attr("data-numero")) {
                jouerMusique("good.mp3");
                cacherUneCarte(tableauCartes[tableauCartes.length-2]);
                cacherUneCarte(tableauCartes[tableauCartes.length-1]);
                $(tableauCartes[tableauCartes.length-2]).off();
                $(tableauCartes[tableauCartes.length-1]).off();
                
                pairesTrouvee++;
            }
            //Sinon retourner les cartes
            else {
                /**-----METTRE SON ECHEC ICI-------- */
                jouerMusique("wrong.wav");
                const carte1 = tableauCartes[tableauCartes.length-2];
                const carte2 = tableauCartes[tableauCartes.length-1];
                carte1.fadeOut(1000, function () {
                    $(carte1).addClass("bg-hidden").attr("data-estvisible", "non");
                    
                }).fadeIn(1000);
                carte2.fadeOut(1000, function () {
                    $(carte2).addClass("bg-hidden").attr("data-estvisible", "non");   
                }).fadeIn(1000);
                
            
            }
        }

        if (pairesTrouvee == $("#nbPaires").val()) {
            terminerPartie("victoire");
            
        }
        // On veut que la div occupe encore la même place dans le DOM, mais sans voir l'image (opacity)


    }


    // Il y a certainements d'autres éléments ou contextes qui peuvent être vérifiés ici (ex. la fin du jeu si tout est bon)
}





/**
 * Fonction qui permet de cacher TOUTES les cartes du jeu 
 * Voir l'énoncé pour savoir quels sont les critères à respecter pour bien cacher une carte.
 * TODO
 */
function cacherLesCartes() {

    let lesCartes = $("#cartes div");

    for (const laCarte of lesCartes) {
        $(laCarte).addClass("bg-hidden");
    }
}


/**
 * Fonction qui mélange un tableau simple d'entiers
 * @param {*} array : le tableau à mélanger 
 * @returns Un tableau mélangé.
 * FOURNIE / utilitaire
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}


/**
 * Fonction qui permet de générer les cartes du jeu de façon aléatoire et de les ajouter dans la variable globale cartesDepart
 * Générer une carte, c'est créer la balise <div> ainsi que toute ses propriétés.
 * FOURNIE
 */
function genererCartesDepart() {

    console.log("******** DEBUT genererCartesDepart() ********");

    // MAJ le nombre de cartes total
    nbPaires = $("#nbPaires").val();
    console.log("nbPaires : " + nbPaires);

    for (let index = 0; index < nbPaires; index++) {

        // Générer une carte
        console.log("Créer une carte :");
        let carte = {
            nomFichier: (index + 1) + ".png",
            id: "carte-" + (index + 1),
            estvisible: "non",
            numero: (index + 1)
        }
        for (const key in carte) {
            console.log(key + " : " + carte[key]);
        }

        // Créer sa copie
        console.log("Créer sa COPIE :");
        let copie = {
            nomFichier: (index + 1) + ".png",
            // C pour "copie"
            id: "carte-" + (index + 1) + "c",
            estvisible: "non",
            numero: (index + 1)
        }
        for (const key in copie) {
            console.log(key + " : " + copie[key]);
        }

        console.log("Ajouter la carte dans le tableau cartesDepart");
        cartesDepart.push(carte);
        console.log("Ajouter sa COPIE dans le tableau cartesDepart");
        cartesDepart.push(copie);
    }

    // Mélanger le tableau
    cartesDepart = shuffleArray(cartesDepart);

    console.log("cartesDepart : ");
    for (const iterator of cartesDepart) {
        console.log(iterator);
    }

    console.log("******** FIN genererCartesDepart() ********");

    console.log("Les cartes ont été générées! Vous pouvez maintenant afficher le jeu");
}


/**
 * Cette fonction doit s'assurer que le jeu est bien terminé, déterminer si le joueur a gagné ou perdu et afficher le bon message.
 * Elle doit également remettre à zéro le jeu (ex. minuterie, affichage des cartes, nb de carte de départ, etc.)
 * TODO
 */
function terminerPartie(resultat) {

    //Vérification gagné ou pas
    
    console.log("-----DEBUT TERMINER PARTIE-----");
    let nombrePairesTrouvee = $("#cartes .cache");
    console.log("Longueur du vecteur class=cache " + nombrePairesTrouvee.length / 2);
    console.log("Nombre de paires entrées " + $("#nbPaires").val());

    //Retirer les cartes de l'interface
    $("#cartes").empty();

    //Vérifier si toutes les paires ont été trouvées
    if (resultat == "victoire") {
        //Le joueur a gagné la partie
        /*----Faire jouer la musique gagnant----*/
        jouerMusique("clear.wav");
        console.log("Joueur gagne partie");
        let imageGagnant = $("<img>").attr("src", "images/victory.jpg");
        $("#cartes").append("<h3>Partie Gagnée</h3>")
        $("#cartes").append(imageGagnant);
    } else {
        //Le joueur à perdu la partie
        /*----Faire jouer la musique perdant----*/
        jouerMusique("game-over.mp3");
        console.log("Joueur a perdu la partie");
        let imagePerdant = $("<img>").attr("src", "images/defeat.png");
        $("#cartes").append("<h3>Partie perdue</h3>");
        $("#cartes").append(imagePerdant);
    }

    //Arrêter la minuterie et la remettre à 0
    //Arrêter la musique
    clearInterval(minuterieARepetitions);
    compteur1 = 0;
    $("#timer").removeClass("hurry");
    $("#cartes").removeClass("flex-cartes");
    $("#timer").html("");
    cartesDepart = [];
    pairesTrouvee = 0;
    gererBtnMusiqueOff();

}




/**
 * Fonction qui permet d'afficher les cartes du jeu, une fois celles-ci générées par le bouton "Générer les cartes".
 * TODO
 */
function afficherCartesDansJeu() {

    console.log("Début fonction afficherCartesDansJeu");

    if (cartesDepart.length == 0) {
        alert("Vous devez générer les cartes avant de les afficher!");
        return;
    }

    // S'assurer que la section est vide ET que les cartes soient cachées (appel de la fonction cacherLesCartes())
    // Démarrer la musique de fond de votre choix.
    // Démarrer la minuterie
    // Créer dans la section jeu les cartes du jeu de mémoire à partir des cartes générées précédemment (FOURNIES)
    // N'oublier pas d'associer des événements à chaque carte (click)
    // Créer les animations si le cas (voir vidéo d'une démo du TP)
    // ... Autres choses à faire?

    gererBtnMusiqueOn();
    gererMinuterie();

    $("#cartes").empty();
    $("#cartes").addClass("flex-cartes");

    for (const uneCarte of cartesDepart) {
        let carte = $("<div></div>").attr({

            id: uneCarte.id,
            "data-estvisible": uneCarte.estvisible,
            "data-numero": uneCarte.numero,
            "data-url": uneCarte.nomFichier,
            class: "carte bg-cover",
        });

        carte.css("background-image", "url(images/" + uneCarte.nomFichier + ")");

        $("#cartes").append(carte);
        cacherLesCartes();
        carte.on("click", gererClickCarte)

    }

}

/**
 * Fonction qui permet de cacher 1 carte du jeu
 * @param {*} carte : une carte du jeu préalablement récupérée par un sélecteur Jquery 
 * TODO
 */
function cacherUneCarte(carte) {

    // Cacher la carte passée en paramètre avec un effet visuel
    $(carte).fadeOut(1000, function () {
        $(carte).addClass("cache").attr("data-estvisible", "non")
    }).fadeIn(1000);
}

/**
 *  Fonction qui fait jouer une musique de fond en se servant de la variable globale musiqueDeFond
 * @param {*} nomFichier : nom du fichier à faire jouer. Il doit se trouver dans le dossier audio 
 * FOURNIE / utilitaire
 */
function jouerMusique(nomFichier) {
    musiqueDeFond.pause();
    musiqueDeFond.currentTime = 0;
    musiqueDeFond.src = "audio/" + nomFichier;
    musiqueDeFond.play();
}

/**
 * Fonction qui détermine si la musique de fond joue ou non, et pause en conséquence
 * TODO
 */
function gererBtnMusiqueOn() {

    // Faire jouer l'objet audio son1
    console.log('Jouer avec JS : play()');
    son1.play();

}

function gererBtnMusiqueOff() {

    // Faire jouer l'objet audio son1
    console.log('Jouer avec JS : pause()');
    son1.pause();
}

function gererBtnMusique() {
    if (son1.paused) {
        son1.play();
    } else {
        son1.pause()
    };
}
/**
 * Fonction qui s'occupe de gérer la minuterie affichée en haut. Au départ, le temps est égal au temps total et doit être diminué à chaque seconde jusqu'à 0
 * Elle devra être appelée toutes les secondes (interval de 1000ms)
 * TODO
 */
function gererMinuterie() {

    //initialisation du compteur
    compteur1 = $("#nbSecondes").val();
    $("#timer").html(compteur1);
    $("#timer").addClass("green");
    minuterieARepetitions = setInterval(fairePlusieursFois, 1000);

}

/**
 * Fonction qui s'occupe de gérer la minuterie affichée en haut. Au départ, le temps est égal au temps total et doit être diminué à chaque seconde jusqu'à 0
 * Elle devra être appelée toutes les secondes (interval de 1000ms)
 * TODO
 */

/**
 * Une fonction qui sera exécutée à intervales réguliers.
 */
function fairePlusieursFois() {


    if (compteur1 <= 5) {
        $("#timer").addClass("hurry");
        son1.pause();
        jouerMusique("hurry.wav");
    }

    
    
    $("#timer").html((compteur1 - 1));
    compteur1--;
    if (compteur1 == 0) {
        terminerPartie("defaite");
    }



}


/**
 * Lorsque le DOM est près
 * TODO
 */
$(document).ready(function () {

    // Créer l'événement click sur le bouton "Générer les cartes"
    $("#btnGenererCartesDepart").on("click", genererCartesDepart);
    $("#btnAfficherJeu").on("click", afficherCartesDansJeu);
    // TODO Créer les autres événements pertinents
    $("#btnTerminer").on("click", function () {
        terminerPartie("defaite")
    });
    $("#btnMusique").on("click", gererBtnMusique);


});