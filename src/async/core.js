const apiCore = (function(ajax) {

  const APIService = {
    version: '',
    api: '',
    component: '',
    token: '',
    host: '',
    customerID: 0,
    use: config,
    url: buildURL,
    list: getComponentList,
    create: createComponent,
    get: getComponent,
    edit: editComponent,
    delete: deleteComponent,
    patch: patchComponent,
    refresh: refreshHeader,
    export: exportUrl
  };

  return APIService;

  function config(api, component, version) {

      if(window.localStorage.config_setby && window.localStorage.config_setby !== 'bpro') {
          if ( window.localStorage.api_token !== 'undefined' ) {
              app.api_token = window.localStorage.api_token
          }
          if ( window.localStorage.api_expires !== 'undefined' ) {
              app.api_expires = window.localStorage.api_expires
          }
      } else {
          window.localStorage.api_token     = app.api_token
          window.localStorage.api_host      = app.api_host
          window.localStorage.api_user      = app.api_user
          window.localStorage.api_expires   = app.api_expires
      }



    APIService.api = api;
    APIService.component = component || '';
    APIService.token = app.api_token;
    APIService.host = app.api_host;
    APIService.headers = {
      Authorization: APIService.token,
      withCredentials: undefined
    };
    if (version) {
      APIService.version = version;
    } else {
      /*
       * Sample, so that people can see what it will look like if multiple versions are supported.
       *
      if (api == 'crm') {
          if (component == 'intel')
              APIService.version = 'v1';
          else
              APIService.version = 'v1';
      } else if (api == 'reports') {
          APIService.version = 'v1';
      } else {
          APIService.version = 'v1';
      }*/
      APIService.version = 'v1'; /* The most basic, default version.*/
    }
    return APIService; // returning self to allow for method chaining --Matt
  }

  function refreshHeader(expires) {
    var currentTime = Date.now();
    if (currentTime >= (app.api_expires - 60) * 1000) {
      return ajax.get('/api_refresh', {
        params: {
          reqTime: Date.now()
        }
      }).then(
        function success(response) {
          app.api_token = response.data.api_token;
          app.api_expires = response.data.api_expires;
          app.api_access_token = response.data.api_access_token;

            window.localStorage.api_token = app.api_token
            window.localStorage.api_host = app.api_host
            window.localStorage.api_user = app.api_user
            window.localStorage.api_expires = app.api_expires
            window.localStorage.config_setby = 'bpro'

          APIService.token = app.api_token;
          APIService.host = app.api_host;
          APIService.access_token = app.api_access_token;
          APIService.headers = {
            Authorization: APIService.token
          };
          return response;
        }
      );
    } else {
      APIService.token = app.api_token;
      APIService.host = app.api_host;
      APIService.access_token = app.api_access_token;
      APIService.headers = {
        Authorization: APIService.token
      };
      return Promise.resolve();
    }
  }

  function buildURL(parameter) {
    var url = APIService.host + '/' + APIService.version + '/' + APIService.api;
    if (APIService.component !== '') {
      url += '/' + APIService.component;
    }
    if (parameter) {
      url += '/' + parameter;
    }
    return url;
  }
  
  function exportUrl(parameter) {
	    var url = APIService.host + '/' + APIService.version + '/' + APIService.api;
	    if (APIService.component !== '') {
	      url += '/' + APIService.component;
	    }
	    if (parameter) {
	      url += '/' + parameter;
	    }
	    url += '/export?access_token='+APIService.access_token;
	    return url;
	  }

  function handleSuccess(response) {
    /*
     * Removing this code because it was causing failures under strange circumstances.
     * See JIRA 6507
     * - Jesse
     * 
    var deferred = $q.defer();
    if (response.data.code > 201)
        deferred.reject(response.data);
    else       
        deferred.resolve(response.data);
    return deferred.promise;*/
    return response.data;
  }

  function handleError(response) {
    return response.data;
  }

  function getComponentList(urldata) {
    var url = buildURL();
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.get(url, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      }
    );
  }

  function deleteComponent(parameter, urldata) {
    var url = buildURL(parameter);
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.delete(url, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            // The API inconsistently returns the customer info, so we'll build our own
            middlewareTrigger("delete", {
              data: {
                customerID: APIService.customerID
              }
            });
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      },
      function fail(response) {
        return response;
      }
    );
  }

  function getComponent(parameter, urldata) {
    var url = buildURL(parameter);
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.get(url, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      }
    );
  }

  function createComponent(data, urldata) {
    var url = buildURL();
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.post(url, data, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            if (response.data.code == 201) middlewareTrigger("create", response.data);
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      }
    );
  }

  function editComponent(parameter, data, urldata) {
    var url = buildURL(parameter);
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.put(url, data, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            if (response.data.code == 200) middlewareTrigger("update", response.data);
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      }
    );
  }

  function patchComponent(parameter, data, urldata) {
    var url = buildURL(parameter);
    urldata = urldata || {};
    urldata.reqTime = Date.now();
    urldata.userID = app.api_user;
    if (app.api_sandbox) urldata.sandboxMode = 1;
    return refreshHeader(app.api_expires).then(
      function success(response) {
        return ajax.patch(url, data, {
          headers: APIService.headers,
          params: urldata
        }).then(
          function successCallback(response) {
            if (response.data.code == 200) middlewareTrigger("update", response.data);
            return handleSuccess(response);
          },
          function errorCallback(response) {
            return handleError(response);
          }
        );
      }
    );
  }

  function middlewareTrigger(action, data) {
    // In the case that this is a sub-component, convert the slahes to dashes so that the route is still valid
    var component = APIService.component.replace(/\//g, '-');
    if(typeof component != 'undefined' && component != '') {
         var url = mkapiurl("/middleware/webhooks/ajax/api-trigger/" + APIService.api + '/' + component + '/' + action);
         ajax.post(url, data).then(function(response) {});
    }
  }
})
