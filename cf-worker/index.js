/*
 * @link      https://github.com/reruin/workers/blob/e4e0876c572d3834d7e1c6bbc88aa3c279313d87/link/index.js 
 * @license   https://github.com/reruin/workers/blob/e4e0876c572d3834d7e1c6bbc88aa3c279313d87/LICENSE
*/
const googleDriveCtrl = async (ctx , view) => {
  const id = ctx.params.id
  const host = 'https://drive.google.com/'
  let result = { id }
  //if( ctx.query.output == 'json' ){
  let resp = await request.get(`${host}file/d/${id}/view`)
  result.name = (resp.body.match(/<meta\s+property="og:title"\s+content="([^"]+)"/) || ['',''])[1]
  result.ext = (result.name.match(/\.([0-9a-z]+)$/) || ['',''])[1]
  if(resp.body.indexOf('errorMessage') >=0 ) return result
  //}
  
  let downloadUrl = ''
  let code = (resp.body.match(/viewerData\s*=\s*(\{[\w\W]+?\});<\/script>/) || ['',''])[1]
  let preview_url = ''
  code = code.replace(/[\r\n]/g,'').replace(/'/g,'"')
    .replace('config','"config"')
    .replace('configJson','"configJson"')
    .replace('itemJson','"itemJson"')
    .replace(/,\}/g,'}')
    .replace(/\\x22/g,'"')
    .replace(/\\x27/g,"'")
    .replace(/\\x5b/g,'[')
    .replace(/\\x5d/g,']')
    .replace(/\\(r|n)/g,'')
    .replace(/\\\\u/g,'\\u').toString(16)

  if(code){
    try{
      code = JSON.parse(code)
      //获取码率
      // 37/1920x1080/9/0/115, 
      // "size|url,size|url"
      const rates = {} , urls = []
      code.itemJson[19][0][15][1].split(',').forEach(i => {
        let [c,_,r] = i.split(/[\/x]/)
        rates[c] = parseInt(r)
      })
      code.itemJson[19][0][18][1].split(',').forEach( i => {
        let [rate , url] = i.split('|')
        urls.push({size:rates[rate] , url:decodeURIComponent(url)})
      })
      result.urls = urls.sort((a,b)=>a.size<b.size?1:-1)
      result.size = parseInt(code.itemJson[25][2])
    }catch(e){
      console.log(e)
    }
  }
  if(ctx.query.output == 'media')
    result.cookie = resp.headers['set-cookie']
  let { body , headers , redirected , url }= await request.get(`${host}uc?id=${id}&export=download`,{headers: ctx.req.headers , redirect:'manual'})
  if(headers['location']){
    downloadUrl = headers['location']
  }
  //大文件下载提示
  else{
    if(body.indexOf('Too many users') == -1){
      let url = (body.match(/uc\?export=download[^"']+/i) || [''])[0]
      let cookie = headers['set-cookie']
      let resp = await request.get(host + url.replace(/&amp;/g,'&') , {headers:{cookie} , redirect:'manual'})
      if(resp.headers['location'] ){
        downloadUrl = resp.headers['location']
      }
    }else{
      result.message = 'Too many users have viewed or downloaded this file recently';
    }
  }
  result.url = downloadUrl.replace('?e=download','')
  return result
}

const lanzouCtrl = async (ctx) => {
  const id = ctx.params.id
  const host = 'https://www.lanzous.com'
  const newHeaders = {
    'user-agent':'Mozilla/5.0 (Linux; Android 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile Safari/537.36 MicroMessenger/6.3.25.861'
  }
  let result = { id }
  let { body }  = await request.get(`${host}/tp/${id}` , {headers:{...newHeaders , referrer:''}})
  let url = (body.match(/(?<=dpost\s*\+\s*["']\?)[^"']+/) || [false])[0]
  let base = (body.match(/(?<=urlp[^\=]*=\s*')[^']+/)|| [false])[0]
  result.name = (body.match(/(?<="md">)[^<]+/) || [''])[0].replace(/\s*$/,'')
  result.ext = (result.name.match(/\.([0-9a-z]+)$/) || ['',''])[1]
  if(url && base) result.url = base + '?' + url
  return result
}

const joyCtrl = async (ctx) => {
  const id = ctx.params.id
  const host = atob('aHR0cDovL3d3dy45MXBvcm4uY29t')
  const rnd = (min , max) => Math.floor(min+Math.random()*(max-min))
  const ip = rnd(50,250) + "." + rnd(50,250) + "." + rnd(50,250)+ "." + rnd(50,250)
  const newHeaders = {
    'PHPSESSID':'fff',
    'CLIENT-IP':ip,
    'HTTP_X_FORWARDED_FOR':ip,
    'user-agent':ctx.req.headers.get('user-agent')
  }

  const decodeUrl = async (body) => {
    // eval / new Function is not allowed for security reasons. 
    // let scrs = await request.get(`${host}/js/md5.js`)
    ;var encode_version = 'sojson.v5', lbbpm = '__0x33ad7',  __0x33ad7=['QMOTw6XDtVE=','w5XDgsORw5LCuQ==','wojDrWTChFU=','dkdJACw=','w6zDpXDDvsKVwqA=','ZifCsh85fsKaXsOOWg==','RcOvw47DghzDuA==','w7siYTLCnw=='];(function(_0x94dee0,_0x4a3b74){var _0x588ae7=function(_0x32b32e){while(--_0x32b32e){_0x94dee0['push'](_0x94dee0['shift']());}};_0x588ae7(++_0x4a3b74);}(__0x33ad7,0x8f));var _0x5b60=function(_0x4d4456,_0x5a24e3){_0x4d4456=_0x4d4456-0x0;var _0xa82079=__0x33ad7[_0x4d4456];if(_0x5b60['initialized']===undefined){(function(){var _0xef6e0=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x221728='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0xef6e0['atob']||(_0xef6e0['atob']=function(_0x4bb81e){var _0x1c1b59=String(_0x4bb81e)['replace'](/=+$/,'');for(var _0x5e3437=0x0,_0x2da204,_0x1f23f4,_0x3f19c1=0x0,_0x3fb8a7='';_0x1f23f4=_0x1c1b59['charAt'](_0x3f19c1++);~_0x1f23f4&&(_0x2da204=_0x5e3437%0x4?_0x2da204*0x40+_0x1f23f4:_0x1f23f4,_0x5e3437++%0x4)?_0x3fb8a7+=String['fromCharCode'](0xff&_0x2da204>>(-0x2*_0x5e3437&0x6)):0x0){_0x1f23f4=_0x221728['indexOf'](_0x1f23f4);}return _0x3fb8a7;});}());var _0x43712e=function(_0x2e9442,_0x305a3a){var _0x3702d8=[],_0x234ad1=0x0,_0xd45a92,_0x5a1bee='',_0x4a894e='';_0x2e9442=atob(_0x2e9442);for(var _0x67ab0e=0x0,_0x1753b1=_0x2e9442['length'];_0x67ab0e<_0x1753b1;_0x67ab0e++){_0x4a894e+='%'+('00'+_0x2e9442['charCodeAt'](_0x67ab0e)['toString'](0x10))['slice'](-0x2);}_0x2e9442=decodeURIComponent(_0x4a894e);for(var _0x246dd5=0x0;_0x246dd5<0x100;_0x246dd5++){_0x3702d8[_0x246dd5]=_0x246dd5;}for(_0x246dd5=0x0;_0x246dd5<0x100;_0x246dd5++){_0x234ad1=(_0x234ad1+_0x3702d8[_0x246dd5]+_0x305a3a['charCodeAt'](_0x246dd5%_0x305a3a['length']))%0x100;_0xd45a92=_0x3702d8[_0x246dd5];_0x3702d8[_0x246dd5]=_0x3702d8[_0x234ad1];_0x3702d8[_0x234ad1]=_0xd45a92;}_0x246dd5=0x0;_0x234ad1=0x0;for(var _0x39e824=0x0;_0x39e824<_0x2e9442['length'];_0x39e824++){_0x246dd5=(_0x246dd5+0x1)%0x100;_0x234ad1=(_0x234ad1+_0x3702d8[_0x246dd5])%0x100;_0xd45a92=_0x3702d8[_0x246dd5];_0x3702d8[_0x246dd5]=_0x3702d8[_0x234ad1];_0x3702d8[_0x234ad1]=_0xd45a92;_0x5a1bee+=String['fromCharCode'](_0x2e9442['charCodeAt'](_0x39e824)^_0x3702d8[(_0x3702d8[_0x246dd5]+_0x3702d8[_0x234ad1])%0x100]);}return _0x5a1bee;};_0x5b60['rc4']=_0x43712e;_0x5b60['data']={};_0x5b60['initialized']=!![];}var _0x4be5de=_0x5b60['data'][_0x4d4456];if(_0x4be5de===undefined){if(_0x5b60['once']===undefined){_0x5b60['once']=!![];}_0xa82079=_0x5b60['rc4'](_0xa82079,_0x5a24e3);_0x5b60['data'][_0x4d4456]=_0xa82079;}else{_0xa82079=_0x4be5de;}return _0xa82079;};if(typeof encode_version!=='undefined'&&encode_version==='sojson.v5'){function strencode(_0x50cb35,_0x1e821d){var _0x59f053={'MDWYS':'0|4|1|3|2','uyGXL':function _0x3726b1(_0x2b01e8,_0x53b357){return _0x2b01e8(_0x53b357);},'otDTt':function _0x4f6396(_0x33a2eb,_0x5aa7c9){return _0x33a2eb<_0x5aa7c9;},'tPPtN':function _0x3a63ea(_0x1546a9,_0x3fa992){return _0x1546a9%_0x3fa992;}};var _0xd6483c=_0x59f053[_0x5b60('0x0','cEiQ')][_0x5b60('0x1','&]Gi')]('|'),_0x1a3127=0x0;while(!![]){switch(_0xd6483c[_0x1a3127++]){case'0':_0x50cb35=_0x59f053[_0x5b60('0x2','ofbL')](atob,_0x50cb35);continue;case'1':code='';continue;case'2':return _0x59f053[_0x5b60('0x3','mLzQ')](atob,code);case'3':for(i=0x0;_0x59f053[_0x5b60('0x4','J2rX')](i,_0x50cb35[_0x5b60('0x5','Z(CX')]);i++){k=_0x59f053['tPPtN'](i,len);code+=String['fromCharCode'](_0x50cb35[_0x5b60('0x6','s4(u')](i)^_0x1e821d['charCodeAt'](k));}continue;case'4':len=_0x1e821d[_0x5b60('0x7','!Mys')];continue;}break;}}}else{alert('');};
    let args = (body.match(/(?<=strencode\()[^\)]+/) || [''])[0]
      .split(',')
      .map( i => i.replace(/(^"|"$)/g,''))

    let source = strencode.apply(null , args) , url = ''
    if(source){
      url = (source.match(/src\s*=\s*["']([^"']+)/) || ['',''])[1]
    }
    return url;
  }
  let { body } = await request.get(`${host}/view_video.php?viewkey=${id}`, {headers:newHeaders})
  let result = { id }
  result.name =(body.match(/viewvideo-title">([^<]+)/) || ['',''])[1].replace(/[\r\n]/g,'').replace(/(^[\s]*|[\s]*$)/g,'')
  result.ext = 'mp4'
  result.url = await decodeUrl(body)
  return result
}

/*
 * 辅助 fetch
 */
const request = {
  async get(url , options = {}){
    let mergeOptions = {
      ...options,
      method:'GET',
      headers:Object.assign( {} , options.headers || {} )
    }
    if( mergeOptions.headers['cookie'] ){
      mergeOptions.redentials = 'include'
    }
    if( mergeOptions.body ){
      mergeOptions.body = JSON.stringify(mergeOptions.body);
    }
    if( mergeOptions.json ){
      mergeOptions.headers['accept'] = 'application/json'
    }

    let response = await fetch(url , mergeOptions)
    if(mergeOptions.raw === true){
      return response
    }
    let resp = { ...response , headers:{} }
    if(response.headers){
      let headers = {}
      for(let i of response.headers.keys()){
        headers[i] = response.headers.get(i)
      }
      resp.headers = headers
    }
    if( mergeOptions.json === true ){
      resp.body = await response.json()
    }else{
      resp.body = await response.text()
    }
    return resp
  }
}

const utils = {
  isPlainObject(obj){
    if (typeof obj !== 'object' || obj === null) return false

    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto)
    }
    return Object.getPrototypeOf(obj) === proto
  },
  isType(v, type){
    return Object.prototype.toString.call( v ) === `[object ${type}]`
  },
  getRange(r , total){
    if(!r) return [0 , total-1]
    let [, start, end] = r.match(/(\d*)-(\d*)/) || [];
    start = start ? parseInt(start) : 0
    end = end ? parseInt(end) : total - 1
    return [start , end]
  },
  parserHeaders(headers){
    let ret = {}
    for(let pair of headers.entries()){
      ret[pair[0].toLowerCase()] = pair[1]
    }
    console.log(ret)
    return ret
  }
}

/*
 * 迷你框架 ctx
 */
class Context {
  constructor(event){
    let req = new URL(event.request.url)
    let query = {} , params = {} , headers = {}

    for(let pair of req.searchParams.entries()) {
      query[pair[0]] = pair[1]
    }

    for(let pair of event.request.headers.entries()){
      headers[pair[0].toLowerCase()] = pair[1]
    }

    this.event = event
    this.query = query
    this.params = params
    this.querystring = req.search
    this.pathname = req.pathname
    this.method = event.request.method
    this.host = req.host
    this.protocol = req.protocol
    this.headers = this.header = headers
    this._resHeaders = { }
    this._status = 200
    this._data = null
  }
  set(key , value){
    this._resHeaders[key] = value
  }
  get res(){
    return this.event.respondWith
  }
  get req(){
    return this.event.request
  }
  set status(code){
    this._status = code
  }
  get data(){
    return this._data
  }
  set body(data){
    if( utils.isType(data , 'Promise')){
      //get readableStream object and merge haders
      this._data = data.then(r => new Response(r.body , {
        status:this._status,
        headers:{...utils.parserHeaders(r.headers),...this._resHeaders}
      })).catch(e => {
        console.log(e);
      });
      //this._data = new Response(data , {status:this._status,headers:this._headers})
      return
    }
    if(utils.isPlainObject(data)){
      data = JSON.stringify(data)
      this.set('Content-Type',"application/json")
    }else{
      this.set('Content-Type',"text/html; charset=utf-8")
    }
    this._data = new Response(data , {status:this._status,headers:this._resHeaders})
  }
  redirect(url,code = 302){
    this._data = Response.redirect( url.replace(/^\//,`${this.protocol}//${this.host}/`) , code)
  }
}

/*
 * 迷你框架，内置路由中间件
 */
class App {
  constructor(){
    this.routes = []
    this.middlewares = []
  }
  use(module){
    this.middlewares.push( module )
  }
  listen(){
    addEventListener('fetch', event => {
      let ctx = new Context(event)
      event.respondWith(this.process(ctx))
    })
  }
  async process(ctx){
    await this.compose([].concat(this.middlewares , this._routerMiddleware.bind(this)))(ctx);
    console.log( '>>>',typeof ctx.data)
    return ctx.data
  }
  router(method , expr , handler){
    this.routes.push( { ...this._routeToReg(expr) , method:method.toUpperCase() , handler} )
  }
  async _routerMiddleware(ctx , next){
    let params = {} , handler
    let { pathname , method } = ctx
    for(let route of this.routes){
      if( route.method == method ){
        let hit = route.expr.exec( pathname )
        if( hit ){
          hit = hit.slice(1)
          route.key.forEach((i , idx) => {
            params[i] = hit[idx]
          })
          handler = route.handler
          break;
        }
      }
    }
    ctx.params = params
    if(handler) await handler(ctx)
    return next()
  }
  _routeToReg(route){
    let optionalParam = /\((.*?)\)/g ,
        namedParam    = /(\(\?)?:\w+/g,
        splatParam    = /\*\w+/g,
        escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;
    let route_new = route.replace(escapeRegExp, '\\$&')
        .replace(optionalParam, '(?:$1)?')
        .replace(namedParam, function(match, optional) {
            return optional ? match : '([^/?]+)';
        })
        .replace(splatParam, '([^?]*?)');
    let expr = new RegExp('^' + route_new + '(?:\\?([\\s\\S]*))?$');
    let res = expr.exec(route).slice(1)
    res.pop()
    return { expr , key: res.map( i => i.replace(/^\:/,''))};
  }
  compose(middlewares) {
    return (context) => middlewares.reduceRight( (a, b) => () => Promise.resolve(b(context,a)), () => {})(context)
  }
} 

/*
 * 视图中间件，仅用于此项目
 */
const View = (options) => {
  return (ctx , next) => {
    if( ctx.render ) return next()
    ctx.render = async (data) => {
      let type = ctx.query.output
      if( !data.url ){
        console.log(data)
        if( type == 'json'){
          ctx.body = {status : -1 , message : "error" , ...data}
        }else{
          ctx.body = data.message || '404'
        }
      }else{
        if(type == 'json'){
          ctx.body = {status : 0, result:data}
        }
        else if(type == 'redirect'){
          ctx.redirect( data.url )
        }
        else if(type == 'preview'){
          if( ['mp3','ogg','m4a','acc'].includes(data.ext)){
            ctx.body = `<audio src=${data.url} controls autoplay></autio>`
          }else if( ['mp4', 'mkv' , 'webm'].includes(data.ext) ){
            ctx.body = `<video src=${data.url} controls autoplay></video>`
          }else if( ['jpg','jpeg','png','gif','bmp'].includes(data.ext)){
            ctx.body = `<img src="${data.url}">`
          }else{
            ctx.body = '无法预览'
          }
        }
        else if(type == 'media'){
          if(data.urls){
            let rawHeaders = ctx.req.headers
            let headers = new Headers()
            headers.append('cookie' , data.cookie)
            ;['range'].forEach(i => {
              if( rawHeaders.has(i)){
                headers.append(i , rawHeaders.get(i))
              }
            })
            ctx.body = fetch(data.urls[0].url , {headers})
          }else{
            ctx.body = '404'
          }
        }
        else{
          // ref https://community.cloudflare.com/t/a-valid-host-header-must-be-supplied-to-reach-the-desired-website/48569/3
          // Workers’ implementation of fetch() does not currently support fetching directly from an IP address at all. 
          if( /\:\/\/[\.\d]+/.test(data.url)){
            ctx.redirect( data.url )
          }else{
            // if(data.size){
            //   ctx.set('accept-ranges','bytes')
            //   let headers = ctx.headers
            //   if(ctx.headers['range']){
            //     let [start , end] = utils.getRange(ctx.headers['range'] , data.size)
            //     ctx.set('content-range', `bytes ${start}-${end}/${data.size}`)
            //     ctx.set('content-length', end - start + 1)
            //     headers.range = `bytes=${start}-${end}`
            //     ctx.status = 206
            //   }else{
            //     ctx.set('content-range', `bytes 0-${data.size-1}/${data.size}`)
            //     headers.range = `bytes=0-`
            //   }
            // }
            // console.log(ctx.headers)
            let headers = ctx.headers
            if(data.size){
              ctx.status = 206
              ctx.set('accept-range','bytes')
               if(!headers['range']){
              // headers.Range = 'bytes=0-2180577102'
              ctx.set('content-length',data.size)
              }
            }

            ctx.set('accept-range','bytes')
            ctx.body = fetch(data.url , {headers})
          }
        }
      }
    }
    return next()
  }
}

const app = new App()
app.use( View() )

app.router('get','/gd/:id' , async (ctx) => {
  ctx.render( await googleDriveCtrl(ctx) )
})

app.router('get','/gda/:id' , async (ctx) => {
  ctx.render( await googleDriveCtrl(ctx) )
})

app.router('get' , '/lanzou/:id' , async (ctx) => {
  ctx.render( await lanzouCtrl(ctx) )
})

app.router('get' , '/19/:id' , async (ctx) => {
  ctx.render( await joyCtrl(ctx) )
})

app.router('get' , '/link/:id' , async (ctx) => {
  let id = ctx.params.id , count = id.length
  let vendors = {28:'gd', 20:'19', 33:'gd', 7:'lanzou'}
  ctx.redirect( vendors[count] ? `/${vendors[count]}/${id}${ctx.querystring}` : '/' )
})

app.router('get','/' , async (ctx) => {
  ctx.body = `<!DOCTYPE html><html><head><meta http-equiv="Content-Type"content="text/html; charset=utf-8"><title>LINK</title><style>body{font-family:-apple-system,BlinkMacSystemFont,Helvetica Neue,Helvetica,Roboto,Arial,PingFang SC,Hiragino Sans GB,Microsoft Yahei,Microsoft Jhenghei,sans-serif}</style><style>section{width:650px;background:0 0;position:absolute;top:35%;transform:translate(-50%,-50%);left:50%;color:rgba(0,0,0,.85);font-size:14px;text-align:center}input{box-sizing:border-box;height:48px;width:100%;padding:11px 16px;font-size:16px;color:#404040;background-color:#fff;border:2px solid#ddd;transition:border-color ease-in-out.15s,box-shadow ease-in-out.15s;margin-bottom:24px}button{position:relative;display:inline-block;font-weight:400;white-space:nowrap;text-align:center;box-shadow:0 2px 0 rgba(0,0,0,.015);cursor:pointer;transition:all.3s cubic-bezier(.645,.045,.355,1);user-select:none;border-radius:4px;line-height:1em;background-color:#f2f2f2;border:1px solid#f2f2f2;min-width:100px;color:#5F6368;font-size:14px;padding:12px;margin:0 6px;outline:none}button:hover{border:1px solid#c6c6c6;background-color:#f8f8f8}h4{font-size:24px;margin-bottom:48px;text-align:center;color:rgba(0,0,0,.7);font-weight:400}</style></head><body><section><h4>直链下载</h4><input value=""id="q"name="q"type="text"placeholder="文件ID"/><button onClick="handleDownload()">下载</button><button onClick="handleDownload('preview')">预览</button><button onClick="handleDownload('json')">JSON</button><button onClick="handleDownload('media')">转码播放(仅限Google)</button></section><script>function handleDownload(output){var id=document.querySelector('#q').value;if(id)window.open('/link/'+id+(output?'?output='+output:''))}</script></body></html>`
})
app.listen()
