const apiUrl = 'http://52.79.240.73/api'
const apiSetting = {
    dataType: 'json',
    method: 'GET',
    headers: {
      "Lang": "KO"
    },
}

export function mainNews() {
    return new Promise(function(resolve, reject) {
      $.ajax({
        url: `${apiUrl}/main`,
        ...apiSetting,
        success: function(data) {
          resolve(data.list);
        },
        error: function(request, status, error) {
          reject(new Error(status));
        }
      });
    });
}

export function people() {
    return new Promise(function(resolve, reject) {
        $.ajax({
          url: `${apiUrl}/people`,
          ...apiSetting,
          success: function(data) {
            resolve(data.list);
          },
          error: function(request, status, error) {
            reject(new Error(status));
          }
        });
    });
}

export function peopleDetail(id) {
    return new Promise(function(resolve, reject) {
        $.ajax({
          url: `${apiUrl}/people/${id}`,
          ...apiSetting,
          success: function(data) {
            resolve(data);
          },
          error: function(request, status, error) {
            reject(new Error(status));
          }
        });
    });
}

export function works(pageInfo , locationData){
  let pageParams = ''
  if (pageInfo[0] === 'architecture') {
    pageParams += '&category1=1'
    if (pageInfo[1]) {
      pageParams += `&category2=${pageInfo[1]}`
    }
  
    if (pageInfo[2]) {
      pageParams += `&category3=${pageInfo[2]}`
    }
  }

  if (pageInfo[0] === 'works') {
    pageInfo[1] === 'CMDM' && (pageParams += '&category1=2')
    pageInfo[1] === 'technical' && (pageParams += '&category1=3')
  }

  pageParams += `&page=${locationData.page}`
  return new Promise(function(resolve, reject) {
      $.ajax({
        // url: apiUrl + `/board?type=300&category1=1&page=1&category2=active&category3=hotel`,
        url: apiUrl + `/board?type=300${pageParams}`,
        ...apiSetting,
        success: function(data) {
          resolve(data);
        },
        error: function(request, status, error) {
          reject(new Error(status));
        }
      });
  });
}


export function detail(id){
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: `${apiUrl}/board/${id}`,
      ...apiSetting,
      success: function(data) {
        resolve(data);
      },
      error: function(request, status, error) {
        reject(new Error(status));
      }
    });
  });
}


export function news(){
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: `${apiUrl}/board/?type=100`,
      ...apiSetting,
      success: function(data) {
        resolve(data);
      },
      error: function(request, status, error) {
        reject(new Error(status));
      }
    });
  });
}


export function announcement(){
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: `${apiUrl}/board/?type=200`,
      ...apiSetting,
      success: function(data) {
        resolve(data);
      },
      error: function(request, status, error) {
        reject(new Error(status));
      }
    });
  });
}


export function ci(){
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: `${apiUrl}/ci`,
      ...apiSetting,
      success: function(data) {
        resolve(data.data);
      },
      error: function(request, status, error) {
        reject(new Error(status));
      }
    });
  });
}

export function search(type, word, page){
  console.log(`${apiUrl}/search/${type}/${word}?page=${page}`);
  return new Promise(function(resolve, reject) {
    $.ajax({
      url: `${apiUrl}/search/${type}/${word}?page=${page}`,
      ...apiSetting,
      success: function(data) {
        resolve(data);
      },
      error: function(request, status, error) {
        reject(new Error(status));
      }
    });
  });
}