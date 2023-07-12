let mobileResponsive = 1200;
let isMobile;

$(document).ready(function(){
    // 모바일 판별
    responsiveEvent();
    // 모바일 - 풀 사이즈
    mobileFull();
    $(window).resize(function(){
        responsiveEvent();
        mobileFull();
    })

    // 메뉴
    GNBEvent();
    
    // 해더
    if(!$('header').hasClass('active')){
        headerScroll();
        headerActive();
    }
    
    // 메인 페이지
    $('.mainPage').length && mainPage();

    // 전문적 지식 상세 페이지
    $('.worksPage .detailPage').length && worksDetail();
    
    // history 페이지
    $('.historyPage').length && historyPage();
    
    
    // people 페이지
    $('.peoplePage').length && peoplePage();
    
    // 페이저네이션 클릭 막기
    pagerBox();

    // 에디터 이미지 크기 조정
    $(':is(.newsPage , .announcementPage) .detailPage').length > 0 && editor();
})

// 메뉴
function GNBEvent(){
    // 언어 hover event
    $('header > div > div .languageArea').hover(function(){
        !isMobile && $(this).find('ul').stop().slideDown();
    },function(){
        !isMobile && $(this).find('ul').stop().slideUp();
    })

    $('.searchValue').on('keypress',function(e){
        if (e.key === 'Enter') {
            $('.searchBtn').click();
        }
    })

    // 검색 버튼 - PC
    $('.searchBtn').click(function(){
        if(isMobile)return;
        if($(this).next().hasClass('active')){
            const searchValue = $('.searchValue').val().trim();
            if(!searchValue){
                alert('검색어를 입력해주세요.');
                $('.searchValue').focus();
            }else{
                location.href = `search-All.html?word=${searchValue}`
            }
        }else{
            $(this).next().addClass('active');
        }
    })

    // 검색 버튼
    $('.searchClose').click(function(){
        if(isMobile)return;
        $(this).parent().removeClass('active');
        $('.searchValue').val('')
    })

    // 검색 버튼 - Mobile
    $('.searchBtn').click(function(){
        if(!isMobile)return;
        location.href = './search-All.html'
    })

    // 해더 설정
    let isHeaderActive;
    $('header > div nav > ul > li > a').click(function(e){
        if(!$(this).next().length || isMobile)return;
        e.preventDefault();
        if(!$(this).next().hasClass('active')){
            $('[class|="GNB"]').removeClass('active');
            $(this).next().addClass('active')
            isHeaderActive === undefined && (isHeaderActive = $('header').hasClass('active'));
            isHeaderActive && $('header').removeClass('active');
            $('body').css('overflow','hidden');
            $(this).next().fadeIn(function(){
                $(this).parent().siblings().find('[class|="GNB"]').hide();
            });
        }else{
            $('body').removeAttr('style')
            isHeaderActive && $('header').addClass('active');
            isHeaderActive = undefined;
            $('[class|="GNB"]').removeClass('active');
            $(this).next().fadeOut();
        }
    });

    // 모바일
    $('header > div nav > ul > li > a').click(function(e){
        if(!isMobile)return;
        e.preventDefault();
        if(!$(this).next().hasClass('active')){
            $('header > div nav > ul > li div[class|="GNB"]').removeClass('active');
            $(this).next().addClass('active');
        }else{
            $(this).next().removeClass('active');
        }
    })

    $('header > div > div > button').click(function(){
        mobileResponsive && $('header > div > nav').toggleClass('active');
        if($('header > div > nav').hasClass('active')){
            $('body').css('overflow','hidden');
        }else{
            $('body').removeAttr('style');
        }
    })
}

// 해더
function headerScroll(){
    $(window).scroll(function(){
        headerActive()
    })
}
function headerActive(){
    $(window).scrollTop() > 0 ? $('header').addClass('active') : $('header').removeClass('active');
}

// 메인 페이지
function mainPage(){
    // 슬라이더
    var mainSwiper = new Swiper(".mainSwiper", {
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        },
    });
}

// 전문적 지식 상세 페이지
function worksDetail(){
     // 슬라이더
    //  var worksDetail = new Swiper(".worksDetailSwiper", {
    //     pagination: {
    //         el: ".swiper-pagination",
    //         clickable: true,
    //     },
    //     navigation: {
    //         nextEl: ".swiper-button-next",
    //         prevEl: ".swiper-button-prev",
    //     },
    // });

    // 슬라이더 정보 클릭
    $('[data-click="infor"]').click(function(){
        $('.buttonArea').toggleClass('active');
        $('.textArea').toggleClass('active');
        $('.sliderPager').toggleClass('active');
    })
}

// 페이저네이션 클릭 막기
function pagerBox(){
    $('.pagerBox > a').click(function(e){
        if(!$(this).hasClass('active') || !$(this).attr('href')){
            e.preventDefault();
        }
    })
}

// history 페이지
function historyPage(){
    $('.historyPage aside a').click(function(e){
        e.preventDefault();
        $('.historyPage aside a').removeClass('active');
        $(this).addClass('active');
        $('.rightArea ul').removeClass('active');
        $('.rightArea ul').eq($(this).index()).addClass('active');
    })
}

// people 페이지
function peoplePage(){
    $('.tabBtn li').click(function(){
        $('.tabBtn li').removeClass('active');
        $(this).addClass('active');
        $('.tabContent > *').removeClass('active');
        $('.tabContent > *').eq($(this).index()).addClass('active');
    })
}


// 모바일 판별
function responsiveEvent(){
    $(document).width() <= mobileResponsive ? ( isMobile = true ) : ( isMobile = false);
}

// 모바일 - 풀 사이즈
function mobileFull(){
    $('.mobileFullSize').removeAttr('style');
    if(!isMobile){return}
    let gap = ($(document).width() - $('.mobileFullSize').width()) / 2;
    $('.mobileFullSize').css('transform','translateX('+(-gap)+'px)')
    $('.mobileFullSize').width($(window).width())
    $('.mobileFullSize').css('padding-left' , gap)
    $('.mobileFullSize').css('padding-right' , gap)
}

// 에디터 이미지 크기 조정
function editor(){
    $(':is(.newsPage , .announcementPage) .detailPage').length && $('.detailPage .contentArea img').each(function(){
        let imgWidth = $(this).width();
        $(this).css({
            width : imgWidth ,
            maxWidth : '100%',
            height : 'auto'
        })
    })
}