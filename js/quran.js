let current_page = 176;

function load_suras() {
  $.ajax({
    url: 'json/suras.json',
    dataType: 'json'
  }).done(function (data) {
    let str = '';
    for (let i = 0; i < data.length; i++) {
      let sura = data[i];
      str += '<tr id="sura_link_' + sura.id + '">';
      str += '<td>' + (i + 1) + '</td>';
      str += '<td> <a class="sura_link" href="" ';
      str += 'data-page="' + sura.page + '" >';
      str += sura.name + '</a></td>';
      str += '<td>' + sura.page + '</td>';
      str += '<td>' + sura.ayas + '</td>';
      str += '</tr>';
    }
    $('#suras tbody').html(str);
  });
}

function sura_clicked(event) {
  event.preventDefault();
  event.stopPropagation();
  let el = event.target;
  let page = $(el).data('page');
  load_page(page);
}

function load_page(page) {
  if (page < 1) page = 1;
  if (page > 604) page = 604;
  current_page = page;
  $('.control__page-num').html('صفحة : ' + current_page);

  let $page = $('#page');
  $page.html('');
  let $taf = $('#tafseer');
  $taf.html('');

  let page_str = page.toString().padStart(3, '0');
  $page.css('background-image', 'url(img/' + page_str + '.jpg)');

  $.ajax({
    url: 'json/page_' + page + '.json',
    dataType: 'json'
  }).fail(function () {
    console.log('Failed to load page map!');
  }).done(function (data) {
    $('#suras tr').removeClass('active');
    data.forEach(aya => {
      $('#sura_link_' + aya.sura_id).addClass('active');

      let $a = $('<a>');
      $a.attr('href', '#' + aya.aya_id);
      $a.data('sura', aya.sura_id);
      $a.data('aya', aya.aya_id);
      $a.addClass('aya_link');
      aya.segs.forEach(seg => {
        if (seg.w != 0 && seg.w < 15) return;
        if (seg.x < 15) {
          seg.w += seg.x;
          seg.x = 0;
        }
        let $d = $('<div>')
          .css('top', seg.y + 'px')
          .css('left', seg.x + 'px')
          .css('width', seg.w + 'px')
          .css('height', seg.h + 'px');
        $a.append($d);
      });
      $page.append($a);
    });
  });
}

function aya_clicked(event) {
  event.preventDefault();
  event.stopPropagation();

  let el = $(event.target).closest('a');
  let sura = el.data('sura');
  let aya = el.data('aya');

  load_aya(sura, aya);

  $('a.aya_link').removeClass('active');
  el.addClass('active');
}

function load_aya(sura, aya) {
  let $taf = $('#tafseer');
  $taf.html('');

  $.ajax({
    url: 'json/aya_' + sura + '_' + aya + '.json',
    dataType: 'json'
  }).fail(function () {
    console.log('Failed to load Tafseer!');
  }).done(function (data) {
    let str = '<span class="close-modal">&times;</span>';
    data.forEach(taf => {
      str += '<div class="translation">';
      str += '<strong>' + "Terjemahan : " + '</strong><br>';
      str += taf.text + '<hr>';
      str += '</div>';
    });

    $('.modal-content').html(str);
    $('.modal-overlay').css('display', 'flex');
  });
}

$(document).on('click', '.close-modal', function() {
  $('.modal-overlay').css('display', 'none');
});

$(document).on('click', '.modal-overlay', function(event) {
  if ($(event.target).is('.modal-overlay')) {
    $(this).css('display', 'none');
  }
});

function page_change(event) {
  event.preventDefault();
  event.stopPropagation();
  let el = $(event.target);
  let offset = el.data('offset');
  let page = parseInt(current_page) + offset;
  load_page(page);
}

$(function () {
  console.log('JQuery Started!');
  load_suras();
  load_page(174); // Start on page 174
  $(document).on('click', 'a.sura_link', sura_clicked);
  $(document).on('click', 'a.aya_link', aya_clicked);

  $('.control__button').click(page_change);

  $(document).bind('keydown', 'right', function () {
    let p = parseInt(current_page) - 1;
    load_page(p);
  });
  $(document).bind('keydown', 'left', function () {
    let p = parseInt(current_page) + 1;
    load_page(p);
  });
});
