var current_page = 1

function load_suras() {
  p = $.ajax({
    url: 'json/suras.json',
    dataType: 'json'
  })

  p.done(function (data) {
    str = ''
    for (var i = 0; i < data.length; i++) {
      sura = data[i]
      str += '<tr id="sura_link_' + sura.id + '">'
      str += '<td>' + (i + 1) + '</td>'
      str += '<td> <a class="sura_link" href="" '
      str += 'data-page="' + sura.page + '" >'
      str += sura.name + '</a></td>'
      str += '<td>' + sura.page + '</td>'
      str += '<td>' + sura.ayas + '</td>'
      str += '</tr>'
    }
    $('#suras tbody').html(str)
  })
}

function sura_clicked(event) {
  event.preventDefault()
  event.stopPropagation()
  el = event.target
  page = $(el).data('page')
  // console.log('Sura Clicked!' + page);
  load_page(page)
}

function load_page(page) {
  if (page < 1) page = 1
  if (page > 604) page = 604
  current_page = page
  $('.control__page-num').html('صفحة : ' + current_page)

  $page = $('#page')
  $page.html('')
  $taf = $('#tafseer')
  $taf.html('')

  if (page < 10) {
    page_str = '00' + page
  } else if (page < 100) {
    page_str = '0' + page
  } else {
    page_str = '' + page
  }
  $page.css('background-image', 'url(img/' + page_str + '.jpg)')

  // aya segments
  p = $.ajax({
    url: 'json/page_' + page + '.json',
    dataType: 'json'
  })

  p.fail(function (data) {
    console.log('Failed to load page map!')
  })

  p.done(function (data) {
    // Clear selected
    $('#suras tr').removeClass('active')
    for (var i = 0; i < data.length; i++) {
      aya = data[i]
      // console.log('Sura:' + aya.sura_id+' Aya:'+aya.aya_id);
      // Activate Sura
      $('#sura_link_' + aya.sura_id).addClass('active')

      $a = $('<a>')
      $a.attr('href', '#' + aya.aya_id)
      $a.data('sura', aya.sura_id)
      $a.data('aya', aya.aya_id)
      $a.addClass('aya_link')
      for (var j = 0; j < aya.segs.length; j++) {
        seg = aya.segs[j]
        if (seg.w != 0 && seg.w < 15) continue
        if (seg.x < 15) {
          seg.w += seg.x
          seg.x = 0
        }
        $d = $('<div class="ayat">')
          .css('top', seg.y + 'px')
          .css('left', seg.x + 'px')
          .css('width', seg.w + 'px')
          .css('height', seg.h + 'px')

        $a.append($d)
        // console.log('Segment:'+aya.sura_id+' Aya '+aya.aya_id);
      }
      $page.append($a)
    }
  })
}

function aya_clicked(event) { 
  event.preventDefault()
  event.stopPropagation()
  

  pageX = event.pageX
  pageY = event.pageY
  
  $tooltips = $('#tooltips')
  .css('left', '40%')
  .css('top', (parseInt(pageY) + 20) + 'px')

  

  el = $(event.target).closest('a')
  sura = el.data('sura')
  aya = el.data('aya')
  $('a.aya_link').removeClass('active')
  el.addClass('active')
  // console.log('Aya Clicked!' + sura + ' ' + aya);
  load_aya(sura, aya)

}

function load_aya(sura, aya) {
  var tafseer_name = Array('مشكل', 'نصي', 'الجلالين', 'الميسر', 'ابن كثير')
  $taf = $('#tafseer')
  $taf.html('')

  p = $.ajax({
    url: 'json/aya_' + sura + '_' + aya + '.json',
    dataType: 'json'
  })

  p.fail(function (data) {
    console.log('Failed to load Tafseer!')
  })

  p.done(function (data) {
    str = ''
    for (var i = 0; i < data.length; i++) {
      taf = data[i]

      str = taf.text

    }

    $('#tooltips').text(str)
    $('#tooltips').toggle()

    
    
    $taf.html(str)

  })
}


function page_change(event) {
  event.preventDefault()
  event.stopPropagation()
  el = $(event.target)
  offset = el.data('offset')
  console.log('Offset:' + offset)
  page = parseInt(current_page) + offset
  load_page(page)
}

$(function () {
  console.log('JQuery Started!')
  load_suras();
  load_page(1);
  get_halaman();
  $(document).on('click', 'a.sura_link', sura_clicked)
  $(document).on('click', 'a.aya_link', aya_clicked)

  $('.control__button').click(page_change)

  // Hotkeys
  //$(document).bind('keydown', 'right', function() { p = parseInt(current_page) -1; document.location='#?page='+ p; }  );
  //$(document).bind('keydown', 'left', function() { p = parseInt(current_page) +1; document.location='#?page='+ p; }  );
  $(document).bind('keydown', 'right', function () {
    p = parseInt(current_page) - 1
    load_page(p)
  })
  $(document).bind('keydown', 'left', function () {
    p = parseInt(current_page) + 1
    load_page(p)
  })
})

function get_halaman() {
  let page = $("#mainbab").find("div");
  page.html("");
  console.log(page);
  if (page.length == 0) {
    return null;
  } else {
    var surah = page.attr("id").split("-");
    if (surah[2] < 10) {
      page_str = "00" + surah[2];
    } else if (page < 100) {
      page_str = "0" + surah[2];
    } else {
      page_str = "" + surah[2];
    }
    page.css("background-image", "url(img/" + page_str + ".jpg)");
    p = $.ajax({
      url: "json/page_" + surah[2] + ".json",
      dataType: "json",
    });
    p.fail(function (data) {
      console.log("Failed to load page map!");
    });
    p.done(function (data) {
      for (var i = 0; i < data.length; i++) {
        aya = data[i];

        $a = $("<a>");
        $a.attr("href", "#" + aya.aya_id);
        $a.data("sura", aya.sura_id);
        $a.data("aya", aya.aya_id);
        $a.addClass("aya_link");
        for (var j = 0; j < aya.segs.length; j++) {
          seg = aya.segs[j];
          if (seg.w != 0 && seg.w < 15) continue;
          if (seg.x < 15) {
            seg.w += seg.x;
            seg.x = 0;
          }
          $d = $('<div class="ayat">')
            .css("top", seg.y + "px")
            .css("left", seg.x + "px")
            .css("width", seg.w + "px")
            .css("height", seg.h + "px");

          $a.append($d);
          // console.log('Segment:'+aya.sura_id+' Aya '+aya.aya_id);
        }
        page.append($a);
      }
    });
  }
}