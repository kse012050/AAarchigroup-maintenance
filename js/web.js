import * as api from './api.js'

// 기본
// api.people()
//     .then(function(data) {
//     })
//     .catch(function(error){
//     console.error(error)
//     })

$(document).ready(function(){
    $('.mainPage').length && mainPage();
    $('.peoplePage .basicPage').length && peoplePage(); 
    $('.peoplePage .detailPage').length && peopleDetailPage();
    ($('.worksPage').length && !$('.worksPage .detailPage').length) && worksPage();
    $('.worksPage .detailPage').length && worksDetailPage();
});

function locationFunc(){
    const queryString = window.location.search;
    let data = {}
    if (queryString) {
        // '?' 문자 제거 후 '&'로 분할하여 각 파라미터를 배열로 얻음
        const params = queryString.substring(1).split('&');
      
        // 각 파라미터에 대해 반복하여 값 가져오기
        for (let i = 0; i < params.length; i++) {
          const param = params[i].split('=');
          const paramName = decodeURIComponent(param[0]); // 파라미터 이름
          const paramValue = decodeURIComponent(param[1]); // 파라미터 값
      
          // 가져온 파라미터 값 사용
          data[paramName] = paramValue
        }
    } 
    return data;
}


function mainPage(){
    console.log('메인 페이지');
    api.mainNews()
      .then(function(data) {
        data.map((data)=>{
            $('.mainPage .newsArea ul').append(
                `<li>
                    <a href="${data.board_id}">
                        <div class="imgBox" style="background-image: url('${data.image_url}');"></div>
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
                        <div class="imgBox PCTablet" style="background-image: url(${people.profile_url});">${people.responsibilities}${people.name} 이미지</div>
                        <div class="imgBox mobile" style="background-image: url(${people.m_profile_url});">${people.responsibilities}${people.name} 이미지</div>
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
        console.log(data);
        let htmlContent = '';
        htmlContent += `
            <h2 class="titleBox-black">PEOPLE > ${data.data.department}</h2>
            <div class="imgBox PCTablet" style="background-image: url('${data.data.m_profile_detail_url}">${data.data.responsibilities} ${data.data.name} 이미지</div>
            <div class="imgBox mobile" style="background-image: url('${data.data.profile_detail_url}')">${data.data.responsibilities} ${data.data.name} 이미지</div>
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
        htmlContent += `</div><a href="people.html" class="link-list">목록으로</a>`
        $('.peoplePage .detailPage').html(htmlContent)
      })
      .catch(function(error){
        console.error(error)
      })
}

function worksPage(){
    const pageInfo = window.location.pathname;
    const pageInfoArray = pageInfo.replace('/','').replace('.html','').split('-')
    let locationData = locationFunc();
    if(!locationData.page){
        locationData.page = 1;
    } else {
        locationData.page = parseInt(locationData.page)
    }
    api.works(pageInfoArray , locationData)
        .then(function(data) {
            console.log(data);
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
    console.log(locationData.id);
    api.worksDetail(locationData.id)
        .then(function(data) {
            console.log(data);
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
        })
        .catch(function(error){
        console.error(error)
        })
}