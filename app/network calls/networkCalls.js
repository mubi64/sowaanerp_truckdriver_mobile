import { GetItem } from "../async-storage/async-storage";
export const httpGet = async url => {
  try {
    const BaseUrl = await GetItem('BASEURL');
  
    let response = await fetch(`${BaseUrl}${url}`,{
                method:"GET",
                headers: {
                  'Content-Type': 'application/json;charset=UTF-8',
      },
                credentials:'include',
    })
    // get_set_cookies(response.headers)
    console.log('API response GET before JSON', response)
   
    if (response.status === 200) {
        let data = await response.json();
        // setUsers(data);
      data.status = 200
      return data
    } else {
  
      if (response.status === 403) {
        console.log('403', response)
             throw "You don't have permission for this"
      }
      else {
        let error = await response.json()
        console.log('error.....',error)
        if(error.message!==undefined){
          throw error.message
          
        }
        else {
          
            const firstJSON = await eval(error._server_messages)
          
          const secondJSON = await JSON.parse(firstJSON)
        

            throw secondJSON.message
        }
      }
        
    }  
  } catch (error) {
      console.log('dwdwad',error)
       return {
          error:error
       }
  }
  // try {
  //   const baseUrl = await GetItem('BASEURL');
  //   const getData = await fetch(baseUrl + url, {
  //     method: 'GET',
  //     credentials: 'include',
  //   });
  //   const resApi = await getData.json();

  //   //console.log("Http post", resApi);
  //   resApi.status = 200
  //   return resApi;
  // } catch (error) {
  //   let errorBody = JSON.parse(JSON.stringify(error));

  //   let respObj = {};
  //   //console.log("Http Error ", JSON.stringify(errorBody, null, 2));

  //   if (errorBody.message == 'Network Error') {
  //     respObj = {
  //       status: errorBody.status,
  //       Data: null,
  //       Message: errorBody.message,
  //     };

  //     Toast.show({
  //       type: 'success',
  //       position: 'top',
  //       text1: errorBody.message,
  //     });
  //   } else {
  //     respObj = {
  //       status: errorBody.status,
  //       Data: null,
  //       data: null,
  //       Message: errorBody.message,
  //     };

  //     Toast.show({
  //       type: 'success',
  //       position: 'top',
  //       text1: 'Something went wrong',
  //     });
  //   }

  //   return respObj;
  // }

};
const get_set_cookies = function(headers) {
  const set_cookies = []
  for (const [name, value] of headers) {
      if (name === "set-cookie") {
          set_cookies.push(value)
      }
  }
  console.log('cookiessss',set_cookies)
  const cookies_to_send = set_cookies.map(cookie => {
    const parsed_cookie = SetCookieParser.parse(cookie)
    console.log('parse',parsed_cookie)
      return `${cookie.name}=${cookie.value}`
  }).join('; ')
  console.log('cookies',cookies_to_send)
}


export const httpPOST = async (url, data) => {
  // let netInfo = await NetInfo.fetch();
  try {
  const BaseUrl = await GetItem('BASEURL');
  console.log('ted',BaseUrl)
  let response = await fetch(`${BaseUrl}${url}`,{
              method:"POST",
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
    },
              credentials:'include',
              body:JSON.stringify(data)
  })
  // get_set_cookies(response.headers)
  console.log('API response POST before JSON', response)
 
  if (response.status === 200) {
      let data = await response.json();
      // setUsers(data);
    return{
            StatusCode: 200,
            Data: data.data,
            Message:data?.message,
            loginData:data
           }
  } else {
    console.log('wdwd', response)
    
      let error = await response.json()
      if(error.message!==undefined){
          throw error.message
      }
      else{
          const firstJSON = await eval(error._server_messages)
        
        const secondJSON = await JSON.parse(firstJSON)
        
          throw secondJSON.message
      }
  }  
} catch (error) {
     return {
       error: error,
     }
  }
};
export const httpPUT = async (url, data) => {
  // let netInfo = await NetInfo.fetch();
  try {
  const BaseUrl = await GetItem('BASEURL');

  let response = await fetch(`${BaseUrl}${url}`,{
              method:"PUT",
              headers: {
                'Content-Type': 'application/json;charset=UTF-8',
    },
              credentials:'include',
              body:JSON.stringify(data)
  })
  // get_set_cookies(response.headers)
  console.log('API response POST before JSON', response)
 
  if (response.status === 200) {
      let data = await response.json();
      // setUsers(data);
    return{
            StatusCode: 200,
            Data: data.data,
            Message: '',
            loginData:data
           }
  } else {
    console.log('wdwd', response)
    
    let error = await response.json()
 
      if(error.message!==undefined){
          throw error.message
      }
      else{
          const firstJSON = await eval(error._server_messages)
        
        const secondJSON = await JSON.parse(firstJSON)
          throw secondJSON.message
      }
  }  
} catch (error) {
     return {
       error: error,
     }
  }
};
  // if (netInfo.isConnected && netInfo.isWifiEnabled) {
  // try {
  //   const baseUrl = await GetItem('BASEURL');
  //   const getData = await fetch(baseUrl + url, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json;charset=UTF-8',
  //       'X-CSRFToken': '4f5ea5d1ee123726c8dd04ed2c6e805d5c3a73cfb1edeba7021d17fb',
  //      },
  //     body: JSON.stringify(data),
  //   });

  //  console.log('postapi =>',getData)
  //   const resApi = await getData.json();

  //   let respObj = {
  //     StatusCode: 200,
  //     Data: resApi.data,
  //     Message: '',
  //   };

  //   return respObj;
  // } catch (error) {
  //   let errorBody = JSON.parse(JSON.stringify(error));
  //   let respObj = {};

  //   if (error.message.toLowerCase() === 'network request failed') {
  //     respObj = {
  //       StatusCode: 501,
  //       Data: null,
  //       Message: errorBody.message,
  //     };
  //   } else {
  //     respObj = {
  //       StatusCode: 400,
  //       Data: null,
  //       Message: error,
  //     };
  //   }

  //   return respObj;
  // }
  //}
  // else{
  //   let respObj = {};
  //   respObj = {
  //     StatusCode: 501,
  //     Data: null,
  //     Message: "Network Error",
  //   };
  //   Toast.show({
  //     type: 'error',
  //     position: "top",
  //     text1: "No Internet",
  //   });

  //   return respObj;
  // }