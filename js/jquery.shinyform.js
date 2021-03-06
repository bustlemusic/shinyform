/*
* Shinyform 1.0 par Léo Fontin
* www.leofontin.fr 2013
* Réalisé pour leofontin.fr et à disposition selon les termes de la licence Creative Commons. http://creativecommons.org/licenses/by-sa/3.0/
*/

module.exports = function ($) {
  $.fn.shinyform = function (options) {
    /// --- SELECT --- ///
    function shiny_select (elem){

      if (elem.parents('.shinyform_select').length != 0) {
        return;
      }

      // wrap élément et cache élément
      elem.wrap('<div class="shinyform_select shinyform"></div>');
      elem.hide();

      // création du contener
      var contener = elem.parent('.shinyform_select');

      // récupération des class de l'élément pour l'ajouter au contener
      contener.addClass(elem.attr('class'));

      // création des premiers éléments visibles
      contener.append('<span class="shinyform_select_name"></span><span class="shinyform_select_button"></span><div class="shinyform_content"></div>');
      var content = $('.shinyform_content',contener);
      var name = $('.shinyform_select_name', contener);
      var button = $('.shinyform_select_button, .shinyform_select_name', contener);


      // index de l'item pré-selectionné par défaut
      var option_selected = 0;

      // nombre d'item
      var nb_item = elem.find('option').length;


      // création de la liste
      if (nb_item > 0) {

        // création de la liste
        content.append('<ul class="shinyform_select_list"></ul>');
        var liste = $('.shinyform_select_list',content);

        // boucle sur les option du select pour les ajouter à la liste
        for (var i = 0; i < nb_item; i++) {

          // création de l'item
          liste.append('<li><a href="'+elem.find('option').eq(i).val()+'">'+elem.find('option').eq(i).text()+'</a></li>');

          // on cache tous les éléments pour faire une liste uniquement de 4 items
          /*
          if(i > 10){
            liste.find('li').eq(i).hide();
          }
          */

          // si une option est dite checked, on change l'option de présection d'un item
          if (elem.find('option').eq(i).attr('selected')) {
            option_selected = i;
          }
        }


        // ajout du formulaire de recherche
        // content.prepend('<div class="shinyform_search"><input type="text"/></div>');
        search = $('.shinyform_search input',content);

        if (nb_item < 10) {
          search.parent().hide();
        }

        // message d'erreur si aucun item n'est trouvé
        content.append('<div class="shinyform_error">Aucun item dans la liste</div>');
        error = $('.shinyform_error', content);
        error.hide();

        // gestion des action pour la recherche d'item
        if (liste != undefined) {
          search.keyup(function () {

            // caratères tapés
            var value = $(this).val();

            // nombre de caratères tapés
            var nbchar = value.length;

            // la valeur n'est pas vide, on cherche les items
            if (value != '') {
              // cache tous les items
              liste.find('li').hide();

              // montre uniquement les items qui commencent par les caratères tapés
              liste.find('li').each(function () {
                // text de l'item
                var text = $(this).find('a').text();

                if (text.toLowerCase().substring(0,nbchar) == value.toLowerCase()) {
                  $(this).show()
                }
              });


              // si aucun élément trouvés > affichage message erreur
              if (liste.find('li:visible').length < 1) {
                liste.next('.shinyform_error').show();
              } else {
                liste.next('.shinyform_error').hide();
              }
            }
            // réaffiche les 5 premier items
            else {
              liste.find('li:nth-child(-n+5)').show();
              liste.next('.shinyform_error').hide();
            }
          });
        }
      }

      // on affiche le text de l'item prÃ©-selectionnÃ© dans le champ du select
      name.text(elem.find('option').eq(option_selected).text());

      // on cache le liste
      content.hide();

      if (elem.attr('disabled')) {
        contener.addClass('disabled');
        return;
      }

      // gestion de la liste
      var manageList = function () {
        if (contener.hasClass('open')) {
          $('.shinyform_select').removeClass('open');
          $('.shinyform_content').hide();
        } else {
          $('.shinyform_select').removeClass('open');
          $('.shinyform_content').hide();

          contener.find('.shinyform_search input').val('');
          contener.find('.shinyform_error').hide();
          contener.find('li:nth-child(-n+5)').show();

          contener.addClass('open');
          content.slideDown(100);
        }
      };


      contener.hover(function () {
        $(this).addClass('hover');
      }, function () {
        $(this).removeClass('hover');
      });

      // gestion du focus sur l'élément pour design
      button.mousedown(function () {
        contener.addClass('focus');
      });
      button.mouseup(function () {
        contener.removeClass('focus');
      });

      // click sur un bouton > afficher ou cacher la liste
      button.click(function () {
        manageList();
      });

      // click sur un item
      if (liste != undefined) {
        liste.find('a').click(function () {
          // récupère l'index pour l'item pré-selectionné
          option_selected = liste.find('a').index($(this));

          // ajoute l'attribu selected à l'option correspondante à l'item
          contener.find('select option').eq(option_selected).attr('selected','selected');

          // récupère le text de l'item sélectionné
          name.text(elem.find('option').eq(option_selected).text());

          elem.change();

          manageList();

          return false;
        });
      }

      // fermeture de la liste quand on clique partout
      $('body').click(function () {
        $('.shinyform_select').removeClass('open');
        $('.shinyform_content').hide();
      });

      button.click(function (event) { event.stopPropagation(); });
      content.click(function (event) { event.stopPropagation(); });
    }

    /// --- RADIO --- ///
    function shiny_radio (elem) {
      elem.wrap('<div class="shinyform_radio shinyform"></div>');

      var contener = elem.parent('.shinyform_radio');
      contener.addClass(elem.attr('class'));
      elem.css({
        height : $('.shinyform_radio').height(),
        width : $('.shinyform_radio').width(),
        opacity : 0
      });

      var manageCheck = function () {
        $('input:radio').each(function () {
          if ($(this).is(':checked')) {
            $(this).parent('.shinyform_radio').addClass('checked');
          } else {
            $(this).parent('.shinyform_radio').removeClass('checked');
          }

          $('input:radio').removeClass('disabled');
          if ($(this).attr('disabled')) {
            $(this).parent('.shinyform_radio').addClass('disabled');
          }
        });
      };

      manageCheck();

      elem.mousedown(function () {
        contener.addClass('focus');
      });
      elem.mouseup(function () {
        contener.removeClass('focus');
      });

      elem.click(function () {
        manageCheck();
      });
    }

    /// --- CHECKBOX --- ///
    function shiny_checkbox (elem) {
      elem.wrap('<div class="shinyform_checkbox shinyform"></div>');

      var contener = elem.parent('.shinyform_checkbox');
      contener.addClass(elem.attr('class'));
      elem.css({
        height : $('.shinyform_checkbox').height(),
        width : $('.shinyform_checkbox').width(),
        opacity : 0
      });

      var manageCheck = function () {
        $('input:checkbox').each(function () {
          if ($(this).is(':checked')) {
            $(this).parent('.shinyform_checkbox').addClass('checked');
          } else {
            $(this).parent('.shinyform_checkbox').removeClass('checked');
          }

          $('input:checkbox').removeClass('disabled');
          if ($(this).attr('disabled')) {
            $(this).parent('.shinyform_checkbox').addClass('disabled');
          }
        });
      };

      manageCheck();

      elem.mousedown(function () {
        contener.addClass('focus');
      });
      elem.mouseup(function () {
        contener.removeClass('focus');
      });

      elem.click(function () {
        manageCheck();
      });
    }

    /// --- FILE --- ///
    function shiny_file (elem) {
      elem.wrap('<div class="shinyform_file shinyform"></div>');

      var contener = elem.parent('.shinyform_file');
      contener.addClass(elem.attr('class'));
      contener.append('<span class="shinyform_file_name">'+settings.txtNameFile+'</span><span class="shinyform_file_button">'+settings.txtButtonFile+'</span>');
      var name = $('.shinyform_file_name', contener);
      var button = $('.shinyform_file_button', contener);

      elem.css({
        height : $('.shinyform_file').outerHeight(),
        width : $('.shinyform_file').outerWidth(),
        opacity : 0.0
      });

      if (elem.attr('disabled')) {
        contener.addClass('disabled');
      }

      elem.change(function () {
        name.text(elem.val());
      });

      contener.hover(function () {
        contener.addClass('hover');
      }, function () {
        contener.removeClass('hover');
      });

      elem.mousedown(function () {
        contener.addClass('focus');
      });
      elem.mouseup(function () {
        contener.removeClass('focus');
      });
    }

    /// --- INIT OPTIONS --- ///
    var settings = {
      txtNameFile : 'Aucun fichier',
      txtButtonFile : 'Parcourir ...'
    };


    settings = $.extend(settings,options);

    return this.each(function () {

      /*
      if($.browser.msie && $.browser.version < 7){
        return false;
      }
      */

      var my = $(this);

      if (my.is('select')) {
        shiny_select(my);
      }
      if (my.is('input:checkbox')) {
        shiny_checkbox(my);
      }
      if (my.is('input:radio')) {
        shiny_radio(my);
      }
      if (my.is('input:file')) {
        shiny_file(my);
      }
    });
  };
};
