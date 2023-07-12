import * as api from './api.js'

$(document).ready(function(){
    $('.mainPage').length && mainPage();
    $('.peoplePage .basicPage').length && peoplePage(); 
    $('.peoplePage .detailPage').length && peopleDetailPage();
    ($('.worksPage').length && !$('.worksPage .detailPage').length) && worksPage();
    $('.worksPage .detailPage').length && worksDetailPage();
    $('.newsPage .basicPage').length && newsPage();
    $('.newsPage .detailPage').length && newsAnnouncementDetailPage();
    $('.announcementPage .basicPage').length && announcementPage();
    $('.announcementPage .detailPage').length && newsAnnouncementDetailPage();
    $('.CIPage').length && ciPage();
    $('.searchPage').length && searchPage();
});

function locationFunc(){
    const queryString = window.location.search;
    let data = {}
    if (queryString) {
        const params = queryString.substring(1).split('&');
      
        for (let i = 0; i < params.length; i++) {
          const param = params[i].split('=');
          const paramName = decodeURIComponent(param[0]);
          const paramValue = decodeURIComponent(param[1]);
          
          data[paramName] = paramValue
        }
    } 
    return data;
}

function mainPage(){
    api.mainNews()
      .then(function(data) {
        data.map((data)=>{
            $('.mainPage .newsArea ul').append(
                `<li>
                    <a href="${data.board_id}">
                        <div class="imgBox" ${data.image_url ? `style="background-image: url(${data.image_url});"` : ''}"></div>
                        <time>${data.reg_date}</time>
                        <p>${data.subject}</p>
                    </a>
                </li>`
            )
        })
      })
      .catch(function(error) {
        console.error(error); 
    });
}

function peoplePage(){
    api.people()
      .then(function(data) {
        let htmlContent = '';
        data.map((data)=>{
            htmlContent += `<h3>${data.part}</h3><ul>`;
            data.peopleList.map((people)=>{
                htmlContent +=
                `<li>
                    <a href="people-detail.html?id=${people.people_id}">
                        <div class="imgBox PCTablet" ${people.profile_url ? `style="background-image: url(${people.profile_url});` : ''}">${people.responsibilities}${people.name} 이미지</div>
                        <div class="imgBox mobile" ${people.m_profile_url ? `style="background-image: url(${people.m_profile_url});` : ''}">${people.responsibilities}${people.name} 이미지</div>
                        <small>${people.responsibilities}</small>
                        <strong>${people.name}</strong>
                    </a>
                </li>`
            })
            htmlContent += `</ul>`
        })
        $('.peoplePage .basicPage .peopleArea').append(htmlContent)
      })
      .catch(function(error) {
        console.error(error); 
    });
}

function peopleDetailPage(){
    const locationData = locationFunc();
    api.peopleDetail(locationData.id)
      .then(function(data) {
        let htmlContent = '';
        htmlContent += `
            <h2 class="titleBox-black">PEOPLE > <span>${data.data.department}</span></h2>
            <div class="imgBox PCTablet" ${data.data.profile_detail_url ? `style="background-image: url(${data.data.profile_detail_url});` : ''}">${data.data.responsibilities} ${data.data.name} 이미지</div>
            <div class="imgBox mobile" ${data.data.m_profile_detail_url ? `style="background-image: url(${data.data.m_profile_detail_url});` : ''}">${data.data.responsibilities} ${data.data.name} 이미지</div>
            <h3>${data.data.name} <small>${data.data.department}${data.data.department !== data.data.responsibilities ? ' / ' + data.data.responsibilities : ''}</small></h3>
            <div class="infoArea">
                <div>
                    <ul>
        `
        data.carrerList.map((carrer)=>{
            htmlContent += `<li>${carrer}</li>`
        })
        htmlContent += `</ul></div>`

        if(data.projectList) {
            htmlContent += `<div><strong>Project</strong><ul>`,
            data.projectList.map((project)=>{
                htmlContent += `<li>${project}</li>`
            })
            htmlContent += `</ul></div>`
        }
        htmlContent += `
        <div class="iconArea">
            <ul>
                <li class="phone">${data.data.contact}</li>
                <li class="mail">${data.data.email}</li>
            </ul>
        </div>`
        htmlContent += `</div><a href="people.html" class="link-list">目录</a>`
        $('.peoplePage .detailPage').html(htmlContent)
      })
      .catch(function(error){
        console.error(error)
      })
}

function worksPage(){
    const pageInfo = window.location.pathname.replace('/CN','');
    const pageInfoArray = pageInfo.replace('/','').replace('.html','').split('-')
    let locationData = locationFunc();
    if(!locationData.page){
        locationData.page = 1;
    } else {
        locationData.page = parseInt(locationData.page)
    }
    api.works(pageInfoArray , locationData)
        .then(function(data) {
            // 포트폴리오
            let htmlContent = ''
            data.list.reverse().map((data)=>{
                htmlContent += `
                    <li>
                        <a href="works-detail.html?id=${data.board_id}">
                            <div class="imgBox" style="background-image: url('${data.image_url}');"></div>
                            <small>${data.location_info}</small>
                            <p>${data.subject}</p>
                        </a>
                    </li>`
            })
            $('.worksPage .list-works').html(htmlContent);

            // 페이저
            if(data.data.totalPage > 1){
                htmlContent = '';
                htmlContent += `<div class="pagerBox"><a href=".${pageInfo}?page=${locationData.page - 1}" class="imgBox ${locationData.page !== 1 ? 'active' : ''}">이전</a><ol>`
                for(let a = 1; a <= data.data.totalPage; a++){
                    htmlContent += `<li ${a === locationData.page ? 'class="active"' : ''}><a href=".${pageInfo}?page=${a}">${a}</a></li>`
                }
                htmlContent += `</ol><a href=".${pageInfo}?page=${locationData.page + 1}" class="imgBox ${locationData.page !== data.data.totalPage ? 'active' : ''}">다음</a></div>`
                $('.worksPage .list-works').after(htmlContent);
            }
        })
        .catch(function(error){
            console.error(error)
        })
}

function worksDetailPage(){
    const locationData = locationFunc();
    api.detail(locationData.id)
        .then(function(data) {
            let htmlContent = '';
            // 슬라이더 이미지
            data.fileList.map((file)=>{
                htmlContent += `<div class="swiper-slide" style="background-image: url(${file.file_url});">
                                    ${data.data.subject} 이미지
                                </div>`
            })
            $('.worksDetailSwiper .swiper-wrapper').html(htmlContent)

            // 타이틀
            $('.textArea div h2').html(data.data.subject);

            // 포트폴리오 정보
            // 위치
            $('.textArea div div ul li').eq(0).append(data.data.location_info)
            // G.F.A
            $('.textArea div div ul li').eq(1).append(data.data.gfa_info)
            // Floor
            $('.textArea div div ul li').eq(2).append(data.data.floor_info)
            // 연도
            $('.textArea div div ul li').eq(3).append(data.data.year_info)

            // 프로젝트 개요
            if(data.data.content){
                htmlContent = ''
                htmlContent += `<div>
                                    <mark class="white">프로젝트 개요</mark>
                                    <p>${data.data.content}</p>
                                </div>`
                $('.textArea div div').after(htmlContent)
            }

            // RELATED PORTFOLIO
            htmlContent = ''
            data.list.map((list , idx) => {
                if (idx < 4) {
                    htmlContent += `<li>
                                        <a href="works-detail.html?id=${list.board_id}">
                                            <div class="imgBox" style="background-image: url(${list.image_url});"></div>
                                            <small>${list.location_info}</small>
                                            <p>${list.subject}</p>
                                        </a>
                                    </li>`
                }
            })
            $('.portfolioArea .list-detail').html(htmlContent)

            var worksDetail = new Swiper(".worksDetailSwiper", {
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
        })
        .catch(function(error){
        console.error(error)
        })
}

function newsPage(){
    api.news()
        .then(function(data) {
            let htmlContent = ''
            data.list.map((list)=>{
                htmlContent += `<li>
                                    <a href="news-detail.html?id=${list.board_id}">
                                        <div class="imgBox" ${list.image_url ? `style="background-image: url(${list.image_url});"` : ''}"></div>
                                        <time>${list.reg_date}</time>
                                        <p>${list.subject}</p>
                                    </a>
                                </li>`
            })
            $('.newsPage .basicPage .list-news').html(htmlContent)
        })
        .catch(function(error){
            console.error(error)
        })   
}

function newsAnnouncementDetailPage(){
    const locationData = locationFunc();
    api.detail(locationData.id)
        .then(function(data) {
            $(':is(.newsPage , .announcementPage) .detailPage .titleArea h3').html(data.data.subject)
            $(':is(.newsPage , .announcementPage) .detailPage .titleArea time').html(data.data.reg_date)
            $(':is(.newsPage , .announcementPage) .detailPage .editor').html(data.data.content)
            
        })
        .catch(function(error){
            console.error(error)
        })
}

function announcementPage(){
    const pageInfo = window.location.pathname.replace('/CN','');
    let locationData = locationFunc();
    if(!locationData.page){
        locationData.page = 1;
    } else {
        locationData.page = parseInt(locationData.page)
    }
    api.announcement()
        .then(function(data) {
            let htmlContent = ''
            data.list.map((list , idx)=>{
                htmlContent += `<li>
                                    <a href="announcement-detail.html?id=${list.board_id}">
                                        <span>${((locationData.page - 1) * 10) + (idx + 1)}</span>
                                        <p>${list.subject}</p>
                                        <time>${list.reg_date}</time>
                                    </a>
                                </li>`
            })
            $('.announcementPage .basicPage .boardArea').html(htmlContent)

            if(data.data.totalPage > 1){
                htmlContent = '';
                htmlContent += `<div class="pagerBox"><a href=".${pageInfo}?page=${locationData.page - 1}" class="imgBox ${locationData.page !== 1 ? 'active' : ''}">이전</a><ol>`
                for(let a = 1; a <= data.data.totalPage; a++){
                    htmlContent += `<li ${a === locationData.page ? 'class="active"' : ''}><a href=".${pageInfo}?page=${a}">${a}</a></li>`
                }
                htmlContent += `</ol><a href=".${pageInfo}?page=${locationData.page + 1}" class="imgBox ${locationData.page !== data.data.totalPage ? 'active' : ''}">다음</a></div>`
                $('.announcementPage .basicPage .boardArea').after(htmlContent);
            }
        })
        .catch(function(error){
            console.error(error)
        })   
}

function ciPage(){
    api.ci()
        .then(function(data) {
            $('.link-download').attr('href',data.file_url).attr('download',data.file_name)
        })
        .catch(function(error){
        console.error(error)
        })
}

function searchPage(){
    const pageInfo = window.location.pathname.replace('/CN','');
    const pageInfoArray = pageInfo.replace('/','').replace('.html','').split('-')
    let locationData = locationFunc();
    if(!locationData.page){
        locationData.page = 1;
    } else {
        locationData.page = parseInt(locationData.page)
    }
    if(!locationData.word){return}
    api.search(pageInfoArray[1].toUpperCase(),locationData.word, locationData.page)
        .then(function(data) {
            if (locationData.word){
                $('.linkArea a').each(function(){
                    $(this).attr('href',$(this).attr('href') + `?word=${locationData.word}`)
                })
            }

            $('.searchPage section > p').addClass('active')
            $('.searchPage section > p b').html(data.data.keyword)
            $('.searchPage section > p mark').html(data.data.totalCount)
            
            let htmlContent = ''
            data.list.map((list)=>{
                htmlContent += `<li>`
                list.type === '300' && ( htmlContent +=`<a href="works-detail.html` )
                list.type === '200' && ( htmlContent +=`<a href="announcement-detail.html` )
                list.type === '100' && ( htmlContent +=`<a href="news-detail.html` )
                htmlContent += `?id=${list.board_id}">`
                list.type === '300' && (htmlContent += `<small>Works</small>`)
                list.type === '200' && (htmlContent += `<small>News>Announcement</small>`)
                list.type === '100' && (htmlContent += `<small>News>News</small>`)
                htmlContent += `<p>${list.subject}</p></a></li>`
            })
            $('.searchPage section > ul').html(htmlContent)

            if(data.data.totalPage > 1){
                htmlContent = '';
                htmlContent += `<div class="pagerBox"><a href=".${pageInfo}?word=${locationData.word}&page=${locationData.page - 1}" class="imgBox ${locationData.page !== 1 ? 'active' : ''}">이전</a><ol>`
                for(let a = 1; a <= data.data.totalPage; a++){
                    htmlContent += `<li ${a === locationData.page ? 'class="active"' : ''}><a href=".${pageInfo}?word=${locationData.word}&page=${a}">${a}</a></li>`
                }
                htmlContent += `</ol><a href=".${pageInfo}?word=${locationData.word}&page=${locationData.page + 1}" class="imgBox ${locationData.page !== data.data.totalPage ? 'active' : ''}">다음</a></div>`
                $('.searchPage section > ul').after(htmlContent);
            }

        })
        .catch(function(error){
        console.error(error)
        })
}